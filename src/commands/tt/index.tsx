import type { HiCmd } from '@/types/cmd-module'
import bam from './bam'
import gecko from './gecko'
import i18n from './i18n'
import luban from './luban'
import rax from './rax'

export default [
  {
    command: 'tt',
    describe: 'TT/BD internal toolset',

    builder: yargs =>
      yargs
        .command([...bam, ...gecko, ...i18n, ...luban, ...rax] as HiCmd[])
        .demandCommand(1),
    handler() {},
  },
] satisfies HiCmd[]
