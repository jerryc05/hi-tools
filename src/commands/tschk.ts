import { log, spinner } from '@clack/prompts'
import type { HiCmd } from '@/types/cmd-module'

export default [
  {
    command: 'tschk',
    describe: 'My ts-check rules',
    handler: async () => {
      // todo ,,, support tsgo

      const s = spinner()
      s.start('Running custom tsc type-check...')

      // 需要忽略的错误码列表
      const ignoredCodes = [
        '2322', // Type 'X' is not assignable to type 'Y'
        '2339', // Property 'X' does not exist on type 'Y'
        '2551', // Property 'X' does not exist on type 'Y'. Did you mean 'Z'?
        '6133', // 'X' is declared but its value is never read (Unused var)
        '6192', // All imports in 'X' are unused
        '18048', // 'X' is possibly 'null' or 'undefined'
      ]

      const { execa } = await import('execa')

      try {
        const { stdout } = await execa({
          reject: false, // 报错时不直接抛出异常
          stderr: 'ignore',
        })`npx tsc --build --noEmit --emitDeclarationOnly false`

        const lines = stdout.split('\n').filter(line => {
          if (line.includes('/node_modules/')) return false

          const matchInfo = line.match(/error TS(\d+):/)
          if (!matchInfo?.[1]) return false

          if (ignoredCodes.includes(matchInfo[1])) return false
          return true
        })

        if (lines.length > 0) {
          s.stop('Type-check failed')
          lines.map(l => console.log(l))
          log.error('Type-check failed')
          process.exit(1)
        } else {
          s.stop('Type-check passed')
        }
      } catch (err) {
        s.stop('Type-check failed')
        console.error(err)
        log.error('Type-check failed')
        process.exit(1)
      }
    },
  },
] satisfies HiCmd[]
