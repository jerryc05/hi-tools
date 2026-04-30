import { cancel, isCancel, note, select } from '@clack/prompts'
import pc from 'picocolors'
import { getRunDetailByRunID, getRunInfoByPipelineID } from '@/services/tt/bits'
import type { HiCommand } from '@/types'
import type { GeckoPackageInfo } from '@/types/tt/gecko-package'
import type { PipelineRun } from '@/types/tt/pipelines-runs'
import { cli } from '@/utils/cli'
import { formatDate } from '@/utils/format-date'
import { getJwt, type JwtUserInfo } from '@/utils/jwt'
import { fail, info } from '@/utils/logger'

type GeckoInfoItem = {
  qrCodeScheme: string | undefined
  region: string | undefined
  scmVersion: string
  channel: string
  updatedDate: string
  creator: string
  envs: string[]
  runId: string
  runSeq: string
  pipelineRunUrl: string
}

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

function extractGeckoInfoFromRuns(pipelineRuns: PipelineRun<false>[]) {
  return pipelineRuns
    .flatMap(run =>
      run.jobs
        .map(job => {
          try {
            const output = job.jobAtom.output
            if (!output) return null
            const packageInfoStr = output.GECKO_packageInfo
            if (!packageInfoStr) return null

            const info: GeckoPackageInfo = JSON.parse(packageInfoStr)

            const {
              qrCodeScheme,
              candidatePackage,
              channel,
              updatedAt,
              creator,
              distributeRule,
            } = info.package

            const { scmVersion } = candidatePackage

            const updatedDate = formatDate(
              Number.parseInt(updatedAt, 10) * 1000,
            )

            const envs = distributeRule.envLaneList.flatMap(l => l.values)

            const geckoInfoItem: GeckoInfoItem = {
              qrCodeScheme,
              region: output.GECKO_region,
              scmVersion,
              channel,
              updatedDate,
              creator,
              envs,
              runId: run.runId,
              runSeq: run.runSeq,
              pipelineRunUrl: run.pipelineRunUrl,
            }
            return geckoInfoItem
          } catch (err) {
            console.error(err)
            return null
          }
        })
        .filter(x => x != null),
    )
    .filter(x => !!x)
}

async function getGeckoInfo(
  pipelineId: string | number,
  jwtToken: string,
  jwtObj: JwtUserInfo,
): Promise<GeckoInfoItem[]> {
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
    fail(
      `[getRunInfoByPipelineID] failed: ${response.status} ${response.statusText}\n${await response.text()}`,
    )
    process.exit(1)
  }

  const data = await getJson()

  {
    const { count, blockingCount, runningCount } = data
    if (blockingCount > 0)
      info(
        `Found ${blockingCount}/${count} blocking task(s)! Build may have failed?`,
      )

    if (runningCount > 0)
      info(`Found ${runningCount}/${count} running task(s)! Still building?`)
  }

  const items = extractGeckoInfoFromRuns(data.pipelineRuns)
  if (items.length) return items

  const selectedRunId = await selectRunIdFromRecentRuns(
    pipelineId,
    jwtToken,
    jwtObj,
  )

  return await getGeckoInfoByRunId(selectedRunId, jwtToken, jwtObj)
}

async function selectRunIdFromRecentRuns(
  pipelineId: string | number,
  jwtToken: string,
  jwtObj: JwtUserInfo,
): Promise<string> {
  const N = 10
  const { response, getJson } = await getRunInfoByPipelineID(
    {
      pipelineId,
      pageSize: N,
      withoutJob: true,
    },
    jwtToken,
    jwtObj,
  )

  if (!response.ok) {
    fail(
      `[getRunInfoByPipelineID] failed: ${response.status} ${response.statusText}\n${await response.text()}`,
    )
    process.exit(1)
  }

  const data = await getJson()
  if (data.pipelineRuns.length <= 0) {
    fail(`最近 ${N} 次 run 查询为空\n${JSON.stringify(data, null, 1)}`)
    process.exit(1)
  }

  note(
    '最新一次 pipeline run 可能未结束、失败，或没有找到 Gecko 信息。请选择一个历史 run 查看。',
    '需要选择历史 run',
  )

  const options = data.pipelineRuns.map(run => {
    const status = `status=${run.runStatus}`
    const time = formatRunTime(run)
    const by = run.triggerInfo?.triggeredBy || run.createdBy || '?'
    return {
      value: run.runId,
      label: `#${run.runSeq}  runId=${run.runId}`,
      hint: `${status}  ${time}  by=${by}`,
    }
  })

  const selectedRunId = await select({
    message: '请选择要查看的 pipeline run',
    options,
  })

  if (isCancel(selectedRunId)) {
    cancel('已取消选择 run')
    process.exit(0)
  }

  return selectedRunId
}

async function getGeckoInfoByRunId(
  runID: string | number,
  jwtToken: string,
  jwtObj: JwtUserInfo,
): Promise<GeckoInfoItem[]> {
  const { response, getJson } = await getRunDetailByRunID(
    runID,
    jwtToken,
    jwtObj,
  )

  if (!response.ok) {
    fail(
      `[getRunDetailByRunID] failed: ${response.status} ${response.statusText}\n${await response.text()}`,
    )
    process.exit(1)
  }

  const data = await getJson()
  const items = extractGeckoInfoFromRuns([data.pipelineRun])
  return items
}

function formatRunTime(run: PipelineRun<boolean>) {
  if (run.completedAt) return `completedAt=${formatDate(run.completedAt)}`
  if (run.startedAt) return `startedAt=${formatDate(run.startedAt)}`
  if (run.createdAt) return `createdAt=${formatDate(run.createdAt)}`
  return 'time=?'
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
    if (pipelineId == null && !url)
      throw new Error('pipelineId or url is required')
    if (pipelineId != null) return pipelineId
    return getPipelineIDFromURL(url ?? '')
  })()

  const items = (await getGeckoInfo(pplID, jwtStr, jwtObj)).filter(x =>
    x.region?.includes(region ?? ''),
  )

  if (items.length <= 0) {
    fail(
      `No Gecko info found${region ? ` matching region [${region}]` : ''} in latest run`,
    )
  }

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
