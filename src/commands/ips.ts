import { type NetworkInterfaceInfo, networkInterfaces } from 'node:os'
import { string } from 'fast-glob/out/utils'
import type { Options } from 'yargs'
import type { HiCmd } from '@/types/cmd-module'

export function getIfacesInfo(
  args?: Record<keyof typeof builder, boolean | undefined>,
) {
  const ifs = networkInterfaces()
  const result: Record<string, NetworkInterfaceInfo[]> = {}
  for (let [k, vs] of Object.entries(ifs)) {
    vs = vs?.filter(it => {
      if (args?.['only-ipv4']) return it.family === 'IPv4'
      if (args?.['only-ipv6']) return it.family === 'IPv6'
      if (it.family === 'IPv6' && isIPv6LinkLocal(it.address)) return false
      return true
    })
    if (vs?.length) result[k] = vs
  }
  return result
}

function isIPv6LinkLocal(address: string) {
  const ip = address.toLowerCase().split('%')[0]
  // fe80::/10 范围：fe80:: 到 febf::
  // 匹配 fe80, fe81, ..., febf
  return /^fe[89ab][0-9a-f](?::|$)/i.test(ip ?? '')
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
      const ifacesInfo = getIfacesInfo(args)
      const ifacesIps: Record<string, string[]> | typeof ifacesInfo = {}

      for (const [k, vs] of Object.entries(ifacesInfo)) {
        if (vs) ifacesIps[k] = args.verbose ? vs : vs.map(v => v.address)
      }
      console.log(ifacesInfo)
    },
  },
] satisfies HiCmd<unknown, Record<keyof typeof builder, boolean | undefined>>[]
