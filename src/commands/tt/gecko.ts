import pc from 'picocolors'
import { getRunInfoByPipelineID } from '@/services/tt/bits'
import type { GeckoPackageInfo } from '@/types/tt/gecko-package'
import type { HiCommand } from '../../types'
import { cli } from '../../utils/cli'
import { formatDate } from '../../utils/format-date'
import { getJwt, type JwtUserInfo } from '../../utils/jwt'

function getPipelineIDFromURL(url: string) {
  const regex = /\bpipelineId=(\d+)\b/
  const match = url.match(regex)
  if (match?.[1]) return match[1]
  throw new Error(
    `Invalid URL. Expecting a url containing ${pc.bold(pc.yellow('pipelineId'))} query param. E.g. ` +
      pc.underline(
        pc.gray(
          `https://bits.bytedance.net/devops/201134696450/develop/detail/2276839/flow?devops_space_type=server_fe&${pc.bold(pc.magenta('pipelineId=1139212901634'))}&stage=dev_gatekeeper_stage`,
        ),
      ),
  )
}

async function getGeckoInfo(
  pipelineId: string | number,
  jwtToken: string,
  jwtObj: JwtUserInfo,
) {
  const { response, getJson } = await getRunInfoByPipelineID(
    {
      pipelineId,
      pageSize: 1,
      withoutJob: false,
    },
    jwtToken,
    jwtObj,
  )

  if (!response.ok) {
    throw new Error(
      `获取运行列表失败: ${response.status} ${response.statusText}\n${await response.text()}`,
    )
  }

  const data = await getJson()
  if (data.count <= 0) {
    throw new Error(
      `接口返回异常: count <= 0\n${JSON.stringify(data, null, 1)}`,
    )
  }

  const items = data.pipelineRuns
    .flatMap(r =>
      r.jobs
        .map(j => {
          try {
            const info: GeckoPackageInfo = JSON.parse(
              j.jobAtom.output?.GECKO_packageInfo ?? '',
            )
            const {
              qrCodeScheme,
              region,
              candidatePackage,
              channel,
              updatedAt,
              creator,
              distributeRule,
            } = info.package
            const { scmVersion } = candidatePackage
            const updatedDate = formatDate(
              new Date(Number.parseInt(updatedAt, 10) * 1000),
            )
            const envs = distributeRule.envLaneList.flatMap(l => l.values)
            return {
              qrCodeScheme,
              region,
              scmVersion,
              channel,
              updatedDate,
              creator,
              envs,
            }
          } catch (_) {
            return null
          }
        })
        .filter(x => !!x),
    )
    .filter(x => !!x)

  return items
}

async function main({
  pipelineId,
  url,
  region,
}: {
  pipelineId: number | undefined
  url: string | undefined
  region: string | undefined
}) {
  const { jwtStr, jwtObj } = await getJwt()

  const pplID = (() => {
    if (!pipelineId && !url) throw new Error('pipelineId or url is required')
    if (pipelineId) return pipelineId
    return getPipelineIDFromURL(url ?? '')
  })()

  const items = (await getGeckoInfo(pplID, jwtStr, jwtObj)).filter(x =>
    x?.region.includes(region ?? ''),
  )

  const { default: QRCode } = await import('qrcode')
  for (let i = 0; i < items.length; i++) {
    const x = items[i]
    try {
      const code = await QRCode.toString(x?.qrCodeScheme ?? '', {
        type: 'terminal',
        small: true,
        errorCorrectionLevel: 'L',
      })

      console.log(`\n\n${code}`)
      console.dir(x)
      if (i < items.length - 1) console.log('\n\n-----------------\n\n')
    } catch (err) {
      console.error('Failed to generate QR:', err)
    }
  }
}

export default [
  {
    cmd: {
      name: 'tt-gecko',
      desc: 'Show gecko info by bits URL',
    },
    options: [
      {
        name: '-p,--pipelineId <pipelineId>',
        desc: 'Pipeline ID (Overrides URL)',
      },
      { name: '-u,--url <url>', desc: 'Bits URL' },
      { name: '-r,--region <region>', desc: 'Region kw filter' },
    ],
    examples: [
      `${cli.name} tt-gecko -r us -u 'https://bits.bytedance.net/devops/201134696450/develop/detail/2276839/flow?devops_space_type=server_fe&pipelineId=1139212901634&stage=dev_gatekeeper_stage'`,
    ],
    action: main,
  },
] satisfies HiCommand[]
