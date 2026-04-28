import type { HiCommand } from '../../types'

export default [
  {
    cmd: { name: 'tt-bam', desc: 'Update BAM code-gen' },
    action: async () => {
      const { execa } = await import('execa')
      await execa({
        stdio: 'inherit',
      })`pnpm dlx @byted-arch-fe/bam-code-generator update`
    },
  },
] satisfies HiCommand[]
