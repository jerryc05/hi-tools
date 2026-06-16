import { lstat, readFile } from 'node:fs/promises'
import type PkgJsonObj from '@/../package.json'
import { join } from 'node:path'

export async function getCwdPackageJson() {
  const pkgPath = join(process.cwd(), './package.json')
  if ((await lstat(pkgPath)).isFile())
    return JSON.parse(await readFile(pkgPath, 'utf8')) as typeof PkgJsonObj
  return null
}
