import assert from 'node:assert'
import { createReadStream } from 'node:fs'
import { link, lstat } from 'node:fs/promises'
import * as os from 'node:os'
import * as path from 'node:path'
import {
  isMainThread,
  parentPort,
  Worker,
  workerData,
} from 'node:worker_threads'
import cliProgress from 'cli-progress'
import glob from 'fast-glob'
import pMap from 'p-map'
import trash from 'trash'
import xxhash from 'xxhash-wasm'

interface FileMeta {
  path: string
  ctime: number
  size: number
}

if (!isMainThread) {
  async function calculateHash(filePath: string): Promise<bigint> {
    const { create64 } = await xxhash()
    const hasher = create64()
    return new Promise((ok, rej) => {
      const stream = createReadStream(filePath)
      stream.on('data', (chunk: Buffer) => {
        hasher.update(chunk)
      })
      stream.on('end', () => {
        ok(hasher.digest())
      })
      stream.on('error', err => {
        rej(err)
      })
    })
  }

  calculateHash(workerData.path)
    .then(hash => parentPort?.postMessage({ hash }))
    .catch(err => parentPort?.postMessage({ error: err.message }))
}
//
//
//
//
//
else {
  const runWorker = (filePath: string): Promise<bigint> =>
    new Promise((ok, rej) => {
      const worker = new Worker(import.meta.filename, {
        workerData: { path: filePath },
      })
      worker.on('message', msg => {
        if (msg.error) rej(new Error(msg.error))
        else ok(msg.hash)
      })
      worker.on('error', rej)
    })

  async function isUnderReparsePoint(filePath: string): Promise<boolean> {
    const parts = filePath.split(path.sep)
    let currentPath = ''
    for (const part of parts) {
      if (!part && currentPath === '') {
        currentPath = parts[0] + path.sep
        continue
      }
      currentPath = path.join(currentPath, part)
      try {
        const s = await lstat(currentPath)
        if (s.isSymbolicLink()) return true
      } catch {
        return false
      }
    }
    return false
  }

  async function deduplicate(folders: string[]) {
    const bar = new cliProgress.MultiBar(
      {
        clearOnComplete: false,
        hideCursor: true,
        format:
          ' {bar} | {percentage}% | ETA: {eta_formatted} | {value}/{total} | {msg}',
      },
      cliProgress.Presets.shades_classic,
    )

    console.log('🔍 正在扫描文件夹结构...')
    const sizeMap = new Map<number, FileMeta[]>()

    for (const folder of folders) {
      const entries = await glob('**/*', {
        cwd: folder,
        absolute: true,
        onlyFiles: true,
        stats: true,
        followSymbolicLinks: false,
      })

      for (const entry of entries) {
        if (await isUnderReparsePoint(entry.path)) continue

        const meta: FileMeta = {
          path: entry.path,
          ctime: entry.stats?.birthtimeMs ?? 0,
          size: entry.stats?.size ?? 0,
        }

        const list = sizeMap.get(meta.size) || []
        list.push(meta)
        sizeMap.set(meta.size, list)
      }
    }

    const potentialDupes = Array.from(sizeMap.values()).filter(
      list => list.length > 1,
    )
    const allFilesToHash = potentialDupes.flat()

    if (allFilesToHash.length === 0) {
      bar.stop()
      console.log('✅ 未发现大小重复的文件，无需后续处理。')
      return
    }

    // --- 阶段 1: 计算 Hash ---
    const hashBar = bar.create(allFilesToHash.length, 0, {
      msg: 'Hashing',
    })
    const fileGroups = new Map<bigint, FileMeta[]>()

    await pMap(
      allFilesToHash,
      async file => {
        try {
          const hash = await runWorker(file.path)
          const list = fileGroups.get(hash) || []
          list.push(file)
          fileGroups.set(hash, list)
        } catch (e) {
          console.error('runWorker error:', e)
        } finally {
          hashBar.increment()
        }
      },
      { concurrency: os.cpus().length },
    )

    // --- 阶段 2: 执行去重 ---
    const duplicateGroups = Array.from(fileGroups.values())
      .filter(f => f.length > 1)
      .sort((a, b) => (b[0]?.size ?? 0) - (a[0]?.size ?? 0))
    const totalDupsToProcess = duplicateGroups.reduce(
      (acc, curr) => acc + (curr.length - 1),
      0,
    )

    if (totalDupsToProcess === 0) {
      bar.stop()
      console.log('✅ 经过内容比对，未发现重复文件。')
      return
    }

    const dedupBar = bar.create(totalDupsToProcess, 0, {
      msg: '正在移动并创建硬链接',
    })

    for (const files of duplicateGroups) {
      files.sort((a, b) => a.ctime - b.ctime)
      const [original, ...duplicates] = files
      assert(original)

      console.log(
        `\n💎 保留: ${original.path} [${((original.size ?? 0) / 1024 / 1024).toFixed(2)} MB]${duplicates
          .map(it => it.path)
          .join('\n\t')}`,
      )

      for (const dup of duplicates) {
        try {
          // 判断是否在同一个分区，硬链接不可跨分区
          if (path.parse(original.path).root !== path.parse(dup.path).root) {
            console.warn(`⚠️ 跨分区无法创建硬链接，跳过: ${dup.path}`)
            dedupBar.increment(1, { msg: '跳过跨分区文件' })
            continue
          }

          if (process.env.PROD === '1') {
            await trash(dup.path)
            await link(original.path, dup.path)
          } else {
            console.log('[DEBUG]: Will perform trash and link when PROD=1')
          }
          dedupBar.increment(1, { msg: `处理中: ${path.basename(dup.path)}` })
        } catch (err) {
          console.error(`   ❌ 处理失败: ${dup.path}`, err)
          dedupBar.increment(1, { msg: `失败: ${path.basename(dup.path)}` })
        }
      }
    }

    bar.stop()
    console.log('\n✨ 所有操作已完成！')
  }

  // --- 启动 ---
  const targetFolders = [
    'D:/SteamLibrary/steamapps/common/Delta Force',
    'D:/apps/Delta Force',
  ]

  deduplicate(targetFolders).catch(console.error)
}
