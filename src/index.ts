#!/usr/bin/env node

import { readFile } from 'node:fs/promises'
import { join } from 'node:path'
import { intro } from '@clack/prompts'
import yargs from 'yargs'
import { hideBin } from 'yargs/helpers'
// import bm from '@/commands/bm'
import ips from '@/commands/ips'
import mdns from '@/commands/mdns'
import mm from '@/commands/mm'
import tschk from '@/commands/tschk'
import tt from '@/commands/tt'
import wup from '@/commands/wup'
import type { HiCmd } from '@/types/cmd-module'
import type PkgJsonObj from '../package.json'

export const PKG: typeof PkgJsonObj = JSON.parse(
  await readFile(join(import.meta.dirname, '../package.json'), 'utf8'),
)

intro(`👋 ${PKG.name} v${PKG.version}`)

const allCommands = [
  ...mm,
  ...tschk,
  ...wup,
  ...ips,
  ...mdns,
  // ...bm,

  ...tt,
] as unknown as HiCmd[]

yargs()
  .scriptName('hi')
  .version(PKG.version)
  .option('verbose', {
    type: 'boolean',
    description: 'Run with verbose logging',
    global: true,
  })
  .strict()
  .recommendCommands()
  .command(allCommands)
  .help()
  .parse(hideBin(process.argv))
