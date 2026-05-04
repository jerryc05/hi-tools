import type { HiCmd } from '@/types/cmd-module'

export default [
  {
    command: 'bam',
    describe: 'Update BAM code-gen',
    handler: async () => {
      const { execa } = await import('execa')
      await execa({
        stdio: 'inherit',
      })`pnpm dlx @byted-arch-fe/bam-code-generator update`
    },
  },
] satisfies HiCmd[]
