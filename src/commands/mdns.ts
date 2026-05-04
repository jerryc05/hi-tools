import { hostname } from 'node:os'
import type { HiCmd } from '@/types/cmd-module'

export default [
  {
    command: 'mdns',
    describe: 'Show mdns [hostname].local',

    handler() {
      const n = hostname()
      console.log(n.toLowerCase().endsWith('.local') ? n : `${n}.local`)
    },
  },
] satisfies HiCmd[]
