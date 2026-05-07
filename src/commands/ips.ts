import { networkInterfaces } from 'node:os'
import type { Options } from 'yargs'
import type { HiCmd } from '@/types/cmd-module'

export function getIfaceIps(
  args?: Record<keyof typeof builder, boolean | undefined>,
) {
  const ifs = networkInterfaces()
  const result: Record<string, string[]> = {}
  for (let [k, vs] of Object.entries(ifs)) {
    vs = vs?.filter(it => {
      if (args?.['only-ipv4']) return it.family === 'IPv4'
      if (args?.['only-ipv6']) return it.family === 'IPv6'
      return true
    })
    if (vs?.length) result[k] = vs.map(v => v.address)
  }
  return result
}

const builder = {
  'only-ipv4': { alias: '4', desc: 'IPv4 only', boolean: true },
  'only-ipv6': { alias: '6', desc: 'IPv6 only', boolean: true },
} satisfies Record<string, Options>

export default [
  {
    command: 'ips',
    describe: "Show current machine's IP addrs",

    builder,
    handler(args) {
      console.log(getIfaceIps(args))
    },
  },
] satisfies HiCmd<unknown, Record<keyof typeof builder, boolean | undefined>>[]
