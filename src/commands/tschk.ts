import { log, spinner } from '@clack/prompts'
import type { HiCmd } from '@/types/cmd-module'

export default [
  {
    command: 'tschk',
    describe: 'My ts-check rules',
    async handler() {
      let successful = true
      const { execa } = await import('execa')

      {
        const s = spinner()
        s.start('Running custom ts type-check...')

        let stdout = ''
        try {
          ;({ stdout } = await execa({
            reject: false, // 报错时不直接抛出异常
            stderr: 'ignore',
          })`pnpm --quiet exec tsgo --build --noEmit`)
        } catch (error) {
          if ((error as any).code !== 'ENOENT') throw error
          ;({ stdout } = await execa({
            reject: false, // 报错时不直接抛出异常
            stderr: 'ignore',
          })`pnpm --quiet exec tsc --noEmit`)
        }

        // 需要忽略的错误码列表
        const ignoredCodes = [
          '2322', // Type 'X' is not assignable to type 'Y'
          '2551', // Property 'X' does not exist on type 'Y'. Did you mean 'Z'?
          '6133', // 'X' is declared but its value is never read (Unused var)
          '6192', // All imports in 'X' are unused
          '18048', // 'X' is possibly 'null' or 'undefined'
        ]
        const ignoredCodeRegex = /5\d\d\d/

        const lines = stdout.split('\n').filter(line => {
          if (line.includes('/node_modules/')) return false

          const matchInfo = line.match(/error TS(\d+):/)
          if (!matchInfo?.[1]) return false

          if (
            ignoredCodes.includes(matchInfo[1]) ||
            ignoredCodeRegex.test(matchInfo[1])
          )
            return false
          return true
        })

        if (lines.length > 0) {
          lines.map(l => log.error(l))
          s.stop('Type-check failed')
          successful = false
        } else {
          s.stop('Type-check passed')
        }
      }

      process.exit(successful ? 0 : 1)
    },
  },
] satisfies HiCmd[]
