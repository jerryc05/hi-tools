import { log, spinner } from '@clack/prompts'
import type { HiCmd } from '@/types/cmd-module'

export default [
  {
    command: 'tschk',
    describe: 'My ts-check rules',
    handler: async () => {
      const { execa } = await import('execa')

      {
        const { stdout } = await execa({
          reject: false, // 报错时不直接抛出异常
          stderr: 'ignore',
        })`npx tsc --build --noEmit --emitDeclarationOnly false`

        // todo ,,, support tsgo

        const s = spinner()
        s.start('Running custom tsc type-check...')

        // 需要忽略的错误码列表
        const ignoredCodes = [
          '2322', // Type 'X' is not assignable to type 'Y'
          '2551', // Property 'X' does not exist on type 'Y'. Did you mean 'Z'?
          '6133', // 'X' is declared but its value is never read (Unused var)
          '6192', // All imports in 'X' are unused
          '18048', // 'X' is possibly 'null' or 'undefined'
        ]

        const lines = stdout.split('\n').filter(line => {
          if (line.includes('/node_modules/')) return false

          const matchInfo = line.match(/error TS(\d+):/)
          if (!matchInfo?.[1]) return false

          if (ignoredCodes.includes(matchInfo[1])) return false
          return true
        })

        if (lines.length > 0) {
          lines.map(l => log.error(l))
          s.stop('Type-check failed')
          process.exit(1)
        } else {
          s.stop('Type-check passed')
        }
      }

      {
        const s = spinner()
        s.start('Running knip deps check...')

        const { stdout, exitCode } = await execa({
          reject: false, // 报错时不直接抛出异常
          stderr: 'ignore',
        })`pnpm dlx knip --strict --dependencies`

        if (exitCode !== 0) {
          log.error(stdout)
          s.stop('Dep check failed')
          process.exit(1)
        }
        s.stop('Dep check passed')
      }
    },
  },
] satisfies HiCmd[]
