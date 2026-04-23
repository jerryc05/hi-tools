import { networkInterfaces } from 'node:os'
import type { HiCommand } from '../types'

export default [
  {
    cmd: {
      name: 'ips',
      desc: "Show current machine's IP addrs",
    },
    options: [
      { name: '-4, --onlyIpv4', desc: 'IPv4 only' },
      { name: '-6, --onlyIpv6', desc: 'IPv6 only' },
    ],
    action: ({
      onlyIpv4,
      onlyIpv6,
    }: {
      onlyIpv4: boolean
      onlyIpv6: boolean
    }) => {
      const ifs = networkInterfaces()
      const result: Record<string, string[]> = {}
      for (let [k, vs] of Object.entries(ifs)) {
        vs = vs?.filter(it => {
          if (onlyIpv4) return it.family === 'IPv4'
          if (onlyIpv6) return it.family === 'IPv6'
          return true
        })
        if (vs?.length) result[k] = vs.map(v => v.address)
      }
      console.log(result)
    },
  },
] satisfies HiCommand[]
