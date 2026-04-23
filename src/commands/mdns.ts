import { hostname } from 'node:os'
import type { HiCommand } from '../types.ts'

export default [
  {
    cmd: {
      name: 'mdns',
      desc: 'Show mdns hostname.local',
    },

    action: () => {
      const n = hostname()
      console.log(n.toLowerCase().endsWith('.local') ? n : `${n}.local`)
    },
  },
] satisfies HiCommand[]
