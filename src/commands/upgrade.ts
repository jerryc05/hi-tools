import { execa } from 'execa'
import type { HiCommand } from '../types'

export async function upgrade({
  npm,
  global,
}: {
  npm: boolean
  global: boolean
}) {
  await execa({
    stdio: 'inherit',
  })`${npm ? 'npm' : 'pnpm'} add ${global ? '-g' : ''} https://github.com/jerryc05/hi-tools.git`
}

export default [
  {
    cmd: {
      name: 'upgrade',
      desc: 'Upgrade to latest version (default using pnpm)',
    },
    options: [
      { name: '--npm', desc: 'Use npm instead of default' },
      { name: '-g,--global', desc: 'Pass -g flag to pkg mgr' },
    ],
    action: upgrade,
  },
] satisfies HiCommand[]
