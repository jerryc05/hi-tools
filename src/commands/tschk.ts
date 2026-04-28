import type { HiCommand } from '../types'
import { begin, fail, success } from '../utils/logger'

export default [
  {
    cmd: { name: 'tschk', desc: 'My ts-check rules' },
    action: async () => {
      begin('Running custom tsc type-check...')

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
        })`npx tsc --noEmit --emitDeclarationOnly false`

        const lines = stdout.split('\n').filter(line => {
          if (line.includes('/node_modules/')) return false

          const matchInfo = line.match(/error TS(\d+):/)
          if (!matchInfo?.[1]) return false

          if (ignoredCodes.includes(matchInfo[1])) return false
          return true
        })

        if (lines.length > 0) {
          lines.map(l => console.log(l))
          fail('Type-check failed!')
          process.exit(1)
        } else {
          success('Type-check passed!')
        }
      } catch (err) {
        fail('Type-check: Unexpected err:')
        console.error(err)
        process.exit(1)
      }
    },
  },
] satisfies HiCommand[]
