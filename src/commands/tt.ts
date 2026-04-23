import { access, constants } from 'node:fs/promises'
import { execa, execaNode } from 'execa'
// import { PKG_JSON_OBJ } from '../index'
import type { HiCommand } from '../types'

// const hasPackage = (name: string) =>
//   !!(
//     PKG_JSON_OBJ?.dependencies?.[name] || PKG_JSON_OBJ?.devDependencies?.[name]
//   )

export default [
  {
    cmd: { name: 'tt-i18n', desc: 'I18n scan and sort' },
    action: async () => {
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

      // await execa({ stdio: 'inherit' })`${
      //   hasPackage('@ies/starling-cli') ? 'starling' :
      //    (
      //     ['pnpm', 'dlx', '@ies/starling-cli']
      //   )
      // } scan -c ${fileStarlingCfg} --fallback --disable-browser`

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
  {
    cmd: { name: 'tt-bam', desc: 'Update BAM code-gen' },
    action: () =>
      // execa({ stdio: 'inherit' })`${
      //   hasPackage('@byted-arch-fe/bam-code-generator') ? 'bam' : (
      //     ['pnpm', 'dlx', '@byted-arch-fe/bam-code-generator']
      //   )
      // } update`,
      execa({
        stdio: 'inherit',
      })`pnpm dlx @byted-arch-fe/bam-code-generator update`,
  },
] satisfies HiCommand[]
