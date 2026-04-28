import { execa } from 'execa'
// import { PKG_JSON_OBJ } from '../index'
import type { HiCommand } from '../../types'

// const hasPackage = (name: string) =>
//   !!(
//     PKG_JSON_OBJ?.dependencies?.[name] || PKG_JSON_OBJ?.devDependencies?.[name]
//   )

export default [
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
