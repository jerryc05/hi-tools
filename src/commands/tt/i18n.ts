import { access, constants } from 'node:fs/promises'
import type { HiCmd } from '@/types/cmd-module'

export default [
  {
    command: 'i18n',
    describe: 'I18n scan and sort',
    handler: async () => {
      const fileStarlingCfg = 'starling.config.js'
      const fileCombineLang = 'combine-lang.js'

      for (const filename of [fileStarlingCfg, fileCombineLang]) {
        try {
          await access(filename, constants.R_OK)
        } catch (e) {
          console.error(`tt i18n: Failed to read ${filename}\n`, e)
          process.exit(1)
        }
      }

      const { execa, execaNode } = await import('execa')

      await execa({
        stdio: 'inherit',
      })`pnpm dlx @ies/starling-cli scan -c ${fileStarlingCfg} --fallback --disable-browser`
      await execaNode({ stdio: 'inherit' })`${fileStarlingCfg}`
      await execa({
        stdio: 'inherit',
      })`pnpm --package=json-sort-cli dlx sortjson ./src/lang`.catch(e =>
        console.error('tt i18n sortjson error:', e),
      )
    },
  },
] satisfies HiCmd[]
