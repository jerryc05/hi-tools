#!/usr/bin/env node

import { readFile, writeFile } from 'node:fs/promises'
import { tmpdir } from 'node:os'
import { join } from 'node:path'
import PKG_JSON_OBJ from '../package.json' with { type: 'json' }
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
import { cli } from './utils/cli'
import { info } from './utils/logger'

export { PKG_JSON_OBJ }

if (process.argv.includes('--quiet')) process.exit(0)

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
  ...upgrade,
  ...mm,
  ...tschk,
  ...wup,
  ...ips,
  ...mdns,
  ...bm,
  ...luban,
  ...tt,
]

for (const { cmd, options, examples, action } of allCommands) {
  let c = cli.command(cmd.name, cmd.desc)
  for (const o of options ?? []) c = c.option(o.name, o.desc, o.config)
  for (const e of examples ?? []) c = c.example(e)
  c.action(action)
}

cli.version(PKG_JSON_OBJ.version).help()
cli
  .command('', 'Print help message')
  .option('--quiet', 'Silently quit')
  .action(({ quiet }: { quiet: boolean }) => {
    if (quiet) return
    cli.outputHelp()
  })
cli.parse()
