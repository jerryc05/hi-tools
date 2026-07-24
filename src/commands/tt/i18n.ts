import { access, constants } from 'node:fs/promises'
import type { HiCmd } from '@/types/cmd-module'

async function resolveReadableFile(basename: string) {
  const candidates = ['.js', '.cjs', '.mjs'].map(ext => `${basename}${ext}`)

  for (const filename of candidates) {
    try {
      await access(filename, constants.R_OK)
      return filename
    } catch {}
  }

  console.error(`tt i18n: Failed to read one of ${candidates.join(', ')}`)
  process.exit(1)
}

export default [
  {
    command: 'i18n',
    describe: 'I18n scan and sort',
    handler: async () => {
      const [fileStarlingCfg, fileCombineLang] = await Promise.all([
        resolveReadableFile('starling.config'),
        resolveReadableFile('combine-lang'),
      ])

      const { execa, execaNode } = await import('execa')

      await execa({
        stdio: 'inherit',
      })`bunx @ies/starling-cli@3.6.27 scan -c ${fileStarlingCfg} --fallback --disable-browser`
      await execaNode({ stdio: 'inherit' })`${fileCombineLang}`
      await execa({
        stdio: 'inherit',
      })`bunx --package=json-sort-cli sortjson ./src/lang`.catch(e =>
        console.error('tt i18n sortjson error:', e),
      )
    },
  },
] satisfies HiCmd[]
