// #!/usr/bin/env -S node --experimental-strip-types --no-warnings

import { spawn } from 'node:child_process'
import { readFileSync } from 'node:fs'
import { readFile, writeFile } from 'node:fs/promises'
import { hostname, networkInterfaces, tmpdir } from 'node:os'
import { join } from 'node:path'
import { cac } from 'cac'
import { execa, execaNode } from 'execa'

const cli = cac('hi')

const PKG_JSON_OBJ = (() => {
  try {
    const pkgPath = join(process.cwd(), 'package.json')
    // biome-ignore lint/suspicious/noExplicitAny: ignore
    return JSON.parse(readFileSync(pkgPath, 'utf-8')) as Record<string, any>
  } catch {}
})()

//
//
//
//
//

async function getUpstreamRemote() {
  try {
    // 获取当前分支追踪的远程分支名，例如 "origin/master"
    const { stdout } =
      await execa`git rev-parse --abbrev-ref --symbolic-full-name @{u}`

    return stdout.split('/')[0] || 'origin'
  } catch {
    return 'origin'
  }
}

/** TODO: 未来支持 master 和 main 自动判断 */
async function mm(updMaster: boolean) {
  console.log('🚀 Syncing master...')
  await execa({
    stdio: 'inherit',
    env: { GIT_TRACE: '1' },
  })`git fetch ${updMaster ? `${await getUpstreamRemote()} master:master` : ''}`
  await execa({
    stdio: 'inherit',
  })`git merge ${await getUpstreamRemote()}/master --no-verify --no-edit`
  console.log('🎉 DONE!')
}

cli
  .command(
    'mm',
    "[M]erge [M]aster: Update master branch to remote's, then merge into current branch",
  )
  .action(() => mm(true))

cli
  .command(
    'mmm',
    "[M]erge [M]aster [M]odified: Merge remote's master into current branch, without updating local master branch",
  )
  .action(() => mm(false))

//
//
//
//
//

const hasPackage = (name: string) =>
  !!(
    PKG_JSON_OBJ?.dependencies?.[name] || PKG_JSON_OBJ?.devDependencies?.[name]
  )

cli.command('tt i18n', 'I18n scan and sort').action(async () => {
  await execa({ stdio: 'inherit' })`${
    hasPackage('@ies/starling-cli') ? 'starling' : 'pnpm dlx @ies/starling-cli'
  } scan -c ./starling.config.js --fallback --disable-browser`
  await execaNode({ stdio: 'inherit' })`./combine-lang.js`
  await execa({
    stdio: 'inherit',
  })`pnpm --package=json-sort-cli dlx sortjson ./src/lang`.catch()
})

cli
  .command('tt bam', 'Update BAM code-gen')
  .action(
    () =>
      execa({ stdio: 'inherit' })`${
        hasPackage('@byted-arch-fe/bam-code-generator') ? 'bam' : (
          'pnpm dlx @byted-arch-fe/bam-code-generator'
        )
      } update`,
  )

//
//
//
//
//

cli.command('tschk', 'My ts-check rules').action(async () => {
  console.log('🔍 Running custom tsc type-check...')

  // 需要忽略的错误码列表
  const ignoredCodes = [
    '2322', // Type 'X' is not assignable to type 'Y'
    '2339', // Property 'X' does not exist on type 'Y'
    '2551', // Property 'X' does not exist on type 'Y'. Did you mean 'Z'?
    '6133', // 'X' is declared but its value is never read (Unused var)
    '6192', // All imports in 'X' are unused
    '18048', // 'X' is possibly 'null' or 'undefined'
  ]

  try {
    const { stdout } = await execa({
      reject: false, // 报错时不直接抛出异常
      stderr: 'ignore',
    })`npx tsc --noEmit --emitDeclarationOnly false`

    const filteredLines = stdout.split('\n').filter(line => {
      if (!/error TS\d+?/.test(line)) return false
      // if (line.includes('node_modules')) return false
      if (ignoredCodes.some(code => line.includes(`TS${code}`))) return false
      return true
    })

    if (filteredLines.length > 0) {
      filteredLines.map(console.log)
      console.log('\n❌ Type-check failed!')
      process.exit(1)
    } else {
      console.log('✅ Type-check passed!')
    }
  } catch (err) {
    console.error('\n❌ Unexpected err when type-checking:', err)
    process.exit(1)
  }
})

//
//
//
//
//

const sleep = (ms: number) => new Promise(resolve => setTimeout(resolve, ms))

cli
  .command('wup', '[W]ait for pkg publish, [U]pdate target repo, and [P]ush')
  .option('-t, --target <path>', 'Target repository path')
  .option('-c, --cmdPrefix <prefix>', 'Pkg install command prefix', {
    default: 'pnpm add',
  })
  .option('--timeout <limit>', 'Timeout limit in seconds', { default: 300 })
  .example(`${cli.name} wup -t "/tmp/otherRepoPath" -c "emo add"`)
  .example(`${cli.name} wup -t "/tmp/otherRepoPath" -c "rush add -p"`)
  .action(
    async ({
      target,
      cmdPrefix,
      timeout,
    }: {
      target: string
      cmdPrefix: string
      timeout: number
    }) => {
      if (!PKG_JSON_OBJ) {
        console.log('❌ Unable to parse package.json!')
        process.exit(1)
      }

      const version = PKG_JSON_OBJ.version
      const pkgName = `${PKG_JSON_OBJ.name}@${version}`

      const SLEEP_INTERVAL = 10000 // 10s
      const installCmd = `${cmdPrefix} "${pkgName}"`

      console.log(`🚀 Monitoring ${pkgName}...`)
      console.log(`📂 Target: ${target}`)
      console.log(`🛠  Install cmd: ${installCmd}`)

      try {
        console.log('📥 Pulling latest changes in target repo...')
        await execa({
          cwd: target,
          stdio: 'inherit',
          env: { GIT_TRACE: '1' },
        })`git pull`

        const startTime = Date.now()
        while (true) {
          // Wait
          const { exitCode } = await execa({
            reject: false,
            stdio: 'inherit',
          })`npm view ${pkgName} version`
          if (exitCode === 0) {
            console.log(`\n✅ v${version} is live! Installing...`)

            try {
              // Update
              await execa({ cwd: target, stdio: 'inherit' })`${installCmd}`
              console.log(`\n🎉 [SUCCESS] ${pkgName} installed!`)
              break
            } catch {
              console.log(
                '\n⚠️ Registry updated but installation failed, retrying...',
              )
            }
          } else {
            process.stdout.write('.')
          }

          const elapsed = (Date.now() - startTime) / 1000
          if (elapsed >= timeout) {
            console.error(`\n❌ [ERROR] Timed out after ${timeout}s.`)
            process.exit(1)
          }

          await sleep(SLEEP_INTERVAL)
        }

        // Push
        console.log('📝 Committing changes...')
        await execa({ stdio: 'inherit' })`git commit -am 'chore: upd ${pkgName}`

        console.log('📤 Pushing to remote...')
        await execa({ stdio: 'inherit' })`git push`

        console.log('🎉 DONE!')
      } catch (error) {
        console.error('\n❌ Task failed:', error)
        process.exit(1)
      }
    },
  )

//
//
//
//
//

cli
  .command(
    'bm <targetBranch>',
    '[B]ranch [M]erge: merge current HEAD into target branch without switching',
  )
  .action(async (targetBranch: string) => {
    /* try {
      console.log(`🚀 Starting silent merge: HEAD -> ${targetBranch}`)

      // 1. Fetch the latest target branch
      console.log(`📡 Fetching origin ${targetBranch}...`)
      await execa('git', ['fetch', 'origin', targetBranch], {
        env: { GIT_TRACE: '1' },
        stdio: 'inherit',
      })

      // 2. Sync local target branch with origin if needed (Cherry-pick range)
      const range = `${targetBranch}..origin/${targetBranch}`
      const { stdout: revList } = await execa('git', ['rev-list', range])

      if (revList.trim()) {
        console.log(
          ` cherry-picking missing commits from origin/${targetBranch}...`,
        )
        await execa('git', ['cherry-pick', '-x', range], { stdio: 'inherit' })
      }

      // 3. Perform in-memory merge-tree
      console.log(`计算 merging trees...`)
      const { stdout: treeHash } = await execa('git', [
        'merge-tree',
        targetBranch,
        'HEAD',
      ])
      // Note: merge-tree in newer git versions might output more than just the hash.
      // If it fails, we might need --write-tree flag for Git 2.38+
      const cleanTreeHash = treeHash.split('\n')[0].trim()

      // 4. Create a merge commit object
      // -p targetBranch -p HEAD (Multiple parents)
      console.log(`🔨 Creating merge commit object...`)
      const { stdout: newCommitHash } = await execa('git', [
        'commit-tree',
        cleanTreeHash,
        '-p',
        targetBranch,
        '-p',
        'HEAD',
        '-m',
        `feat: Merge from ${process.env.USER || 'hi-tools'} at ${new Date().toISOString()}`,
      ])

      const finalCommit = newCommitHash.trim()

      // 5. Update the reference for targetBranch
      console.log(`📍 Updating refs/heads/${targetBranch} to ${finalCommit}...`)
      await execa('git', [
        'update-ref',
        `refs/heads/${targetBranch}`,
        finalCommit,
      ])

      // 6. Push to origin
      console.log(`📤 Pushing ${targetBranch} to origin...`)
      await execa('git', ['push', 'origin', targetBranch], { stdio: 'inherit' })

      console.log(`🎉 Successfully updated and pushed ${targetBranch}!`)
    } catch (error) {
      console.error('\n❌ Silent merge failed:', error)
      process.exit(1)
    } */
  })

//
//
//
//
//

cli.command('ips', 'Show network interface IP addrs').action(() => {
  const ifs = networkInterfaces()
  const obj = Object.entries(ifs).map(([k, vs]) => ({
    [k]: vs?.map(v => v.address),
  }))
  console.log(obj)
})

cli.command('mdns', 'Show mdns hostname').action(() => {
  const n = hostname()
  console.log(n.toLowerCase().endsWith('.local') ? n : `${n}.local`)
})

//
//
//
//
//

cli.help()
cli.parse()

//
//
//
//
//

async function backgroundUpgrade() {
  const CACHE_FILE = join(tmpdir(), '.hi-tools', 'last-upd-check.txt')
  const CHECK_INTERVAL = 24 * 60 * 60 * 1000 // 24 小时

  const promises: Promise<unknown>[] = []

  const now = Date.now()
  try {
    const lastCheck = parseInt((await readFile(CACHE_FILE, 'utf-8')) || '0', 10)
    if (now - lastCheck < CHECK_INTERVAL) return
  } catch (err) {}

  // 更新时间戳
  promises.push(writeFile(CACHE_FILE, now.toString()))

  const child = spawn(
    'pnpm',
    ['add', '-g', 'https://github.com/jerryc05/hi-tools.git'],
    {
      detached: true,
      stdio: 'ignore',
      windowsHide: true, // 在 Windows 上隐藏控制台窗口
    },
  )
  child.unref() // 让主进程不需要等待子进程结束

  await Promise.allSettled(promises)
}

await backgroundUpgrade()
