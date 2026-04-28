#!/usr/bin/env node

import { spawn } from 'node:child_process'
import { readFileSync } from 'node:fs'
import { readFile, writeFile } from 'node:fs/promises'
import { tmpdir } from 'node:os'
import { join } from 'node:path'
import pkgJson from '../package.json' with { type: 'json' }
import bm from './commands/bm'
import ips from './commands/ips'
import luban from './commands/luban'
import mdns from './commands/mdns'
import mm from './commands/mm'
import tschk from './commands/tschk'
import tt from './commands/tt'
import upgrade from './commands/upgrade'
import wup from './commands/wup'
import type { HiCommand } from './types'
import { info } from './utils'
import { cli } from './utils/cli'

if (process.argv.includes('--quiet')) process.exit(0)

export const PKG_JSON_OBJ = (() => {
  try {
    const pkgPath = join(process.cwd(), 'package.json')
    // biome-ignore lint/suspicious/noExplicitAny: ignore
    return JSON.parse(readFileSync(pkgPath, 'utf-8')) as Record<string, any>
  } catch {}
})()

if (PKG_JSON_OBJ) {
  console.log()
  info(`${PKG_JSON_OBJ.name} v${PKG_JSON_OBJ.version}\n\n`)
}

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
  ...upgrade,
]

for (const { cmd, options, examples, action } of allCommands) {
  let c = cli.command(cmd.name, cmd.desc)
  for (const o of options ?? []) c = c.option(o.name, o.desc, o.config)
  for (const e of examples ?? []) c = c.example(e)
  c.action(action)
}

cli.version(pkgJson.version).help()
cli
  .command('', 'Print help message')
  .option('--quiet', 'Silently quit')
  .action(({ quiet }: { quiet: boolean }) => {
    if (quiet) return
    cli.outputHelp()
  })
cli.parse()

//
//
//
//
//

async function backgroundUpgrade() {
  if (process.env.DISABLE_AUTO_UPDATE === '1') return

  const CACHE_FILE = join(tmpdir(), '.hi-tools___last-upd-check.txt')
  const CHECK_INTERVAL = 30 * 60 * 1000 // 30min

  const promises: Promise<unknown>[] = []

  const now = Date.now()
  try {
    const lastCheck = parseInt((await readFile(CACHE_FILE, 'utf-8')) || '0', 10)
    if (now - lastCheck < CHECK_INTERVAL) return
  } catch (_err) {}

  // 更新时间戳
  promises.push(writeFile(CACHE_FILE, now.toString()))

  try {
    const child = spawn(
      process.argv0,
      [process.argv[1] ?? '-v', '-g', 'upgrade'],
      {
        stdio: 'ignore',
        windowsHide: true, // 在 Windows 上隐藏控制台窗口
      },
    )
    child.unref() // 让主进程不需要等待子进程结束
  } catch (_) {}

  await Promise.all(promises)
}

await backgroundUpgrade()
