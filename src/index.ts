#!/usr/bin/env node

import { spawn } from 'node:child_process'
import { readFileSync } from 'node:fs'
import { readFile, writeFile } from 'node:fs/promises'
import { tmpdir } from 'node:os'
import { join } from 'node:path'
import { cac } from 'cac'
import pkgJson from '../package.json' with { type: 'json' }
import bm from './commands/bm.ts'
import ips from './commands/ips.ts'
import luban from './commands/luban.ts'
import mdns from './commands/mdns.ts'
import mm from './commands/mm.ts'
import tschk from './commands/tschk.ts'
import tt from './commands/tt.ts'
import wup from './commands/wup.ts'
import type { HiCommand } from './types.ts'

const cli = cac('hi')

export const PKG_JSON_OBJ = (() => {
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

const allCommands: HiCommand[] = [
  ...mm,
  ...ips,
  ...mdns,
  ...luban,
  ...tt,
  ...tschk,
  ...wup,
  ...bm,
]

for (const { cmd, options, examples, action } of allCommands) {
  let c = cli.command(cmd.name, cmd.desc)
  for (const o of options ?? []) c = c.option(o.name, o.desc, o.config)
  for (const e of examples ?? []) c = c.example(e)
  c.action(action)
}

cli.version(pkgJson.version).help()
cli.command('', 'Readme').action(cli.outputHelp)
cli.parse()

//
//
//
//
//

async function backgroundUpgrade() {
  if (process.env.NO_UPDATE === '1') return

  const CACHE_FILE = join(tmpdir(), '.hi-tools', 'last-upd-check.txt')
  const CHECK_INTERVAL = 1 * 60 * 60 * 1000 // 1 小时

  const promises: Promise<unknown>[] = []

  const now = Date.now()
  try {
    const lastCheck = parseInt((await readFile(CACHE_FILE, 'utf-8')) || '0', 10)
    if (now - lastCheck < CHECK_INTERVAL) return
  } catch (_err) {}

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
