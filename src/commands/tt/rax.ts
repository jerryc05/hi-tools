import { log, note } from '@clack/prompts'
import pc from 'picocolors'
import type { Options } from 'yargs'
import { API_PATH } from '@/types/api-paths'
import type { HiCmd } from '@/types/cmd-module'
import { getIfacesInfo } from '../ips'

const RAX_CLI_CMD = [
  'pnpm',
  'dlx',
  '--silent',
  '--allow-build=better-sqlite3,sharp',
  '@tiktok-fe/rax-cli',
]

async function handler(args: { port?: number }) {
  // todo ,,,  检测输入的 IP 是否可达 / 是否和本机同属一个 LAN

  const { execa } = await import('execa')
  const { default: express } = await import('express')

  const app = express()

  app.get(API_PATH.RAX_DEVICE_INFO, async (_req, res) => {
    const { stdout } = await execa`${RAX_CLI_CMD} device info`
    if (stdout.trim().startsWith('Error:')) {
      res.status(400).send(stdout)
      return
    }
    res.type('json').send(stdout)
  })

  const server = app.listen(args.port ?? 0, () => {
    const addr = server.address()
    const port = typeof addr !== 'string' ? addr?.port : undefined
    if (!port) {
      log.error(`Failed to get port from addr [${addr}]`)
      process.exit(1)
    }

    note(
      `Server running at\n${Object.values(
        getIfacesInfo() ?? { '': ['localhost'] },
      )
        .flat()
        .sort((a, b) => {
          if (a.internal && !b.internal) return -1
          if (!a.internal && b.internal) return 1
          if (a.family === 'IPv4' && b.family === 'IPv6') return -1
          if (a.family === 'IPv6' && b.family === 'IPv4') return 1
          return a.address.localeCompare(b.address)
        })
        .map(
          ip =>
            `  ${ip.internal ? pc.green('[internal]') : pc.yellow('[external]')}  http://${ip.family === 'IPv6' ? `[${ip.address}]` : ip.address}:${port}\n`,
        )
        .join('')}`,
    )
  })
}

const builder = {
  port: { alias: 'p', desc: 'Port for helper', number: true },
} satisfies Record<string, Options>

export default [
  {
    command: 'rax',
    describe: 'Start rax helper (web)',
    builder,
    handler,
  },
] satisfies HiCmd<unknown, Record<keyof typeof builder, number | undefined>>[]
