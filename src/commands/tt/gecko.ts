import { cancel, isCancel, note, select } from '@clack/prompts'
import pc from 'picocolors'
import { getRunDetailByRunID, getRunInfoByPipelineID } from '@/services/tt/bits'
import type { HiCommand } from '@/types'
import type { GeckoPackageInfo } from '@/types/tt/gecko-package'
import { type PipelineRun, RunStatus } from '@/types/tt/pipelines-runs'
import { cli } from '@/utils/cli'
import { formatDate } from '@/utils/format-date'
import { getJwt, type JwtUserInfo } from '@/utils/jwt'
import { begin, fail } from '@/utils/logger'

type GeckoInfoItem = {
  qrCodeScheme: string
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

  if (data.pipelineRuns[0]?.runStatus !== RunStatus.SUCCESS) {
    begin(
      `Latest run (runId=${data.pipelineRuns[0]?.runId} ${formatStatusText(
        data.pipelineRuns[0]?.runStatus,
      )}) is still running or not successful. Gecko info may be unavailable.`,
    )
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

function getPipelineIDFromURL(url: string) {
  const regex = /\bpipelineId=(\d+)\b/
  const match = url.match(regex)
  if (match?.[1]) return match[1]
  throw new Error(
    `Invalid URL. Expecting a url containing ${pc.bold(pc.yellow('pipelineId'))} query param. E.g. ` +
      pc.underline(
        pc.gray(
          `https://b??.net/devops/??/develop/detail/??/flow?devops_space_type=server_fe&${pc.bold(pc.magenta('pipelineId=1139212901634'))}&stage=dev_gatekeeper_stage`,
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
    fail(
      `No pipeline runs found in the most recent ${N} runs\n${JSON.stringify(data, null, 1)}`,
    )
    process.exit(1)
  }

  note(
    'The latest pipeline run may still be running/failed. Please select a historical run to inspect.',
    'Historical run selection required',
  )

  const options = data.pipelineRuns.map(run => {
    const status = formatStatusText(run.runStatus)
    const time = formatRunTime(run)
    const by = run.triggerInfo?.triggeredBy || run.createdBy || '?'
    return {
      value: run.runId,
      label: `#${run.runSeq} runId=${run.runId} ${status}`,
      hint: `${time} by ${by}`,
    }
  })

  const selectedRunId = await select({
    message: 'Select the run ID to inspect',
    options,
  })

  if (isCancel(selectedRunId)) {
    cancel('Run selection cancelled')
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

function formatStatusText(status: number | undefined) {
  switch (status) {
    case RunStatus.RUNNING:
      return pc.blue('RUNNING')
    case RunStatus.CANCELLED:
      return pc.gray('CANCELLED')
    case RunStatus.SUCCESS:
      return pc.green('SUCCESS')
  }
  return `status=${status}`
}

function formatRunTime(run: PipelineRun<boolean>) {
  if (run.completedAt) return `completed @ ${formatDate(run.completedAt)}`
  if (run.startedAt) return `started @ ${formatDate(run.startedAt)}`
  if (run.createdAt) return `created @ ${formatDate(run.createdAt)}`
  return 'time=?'
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
      `${cli.name} tt-gecko -r us -u 'https://b??.net/devops/??/develop/detail/??/flow?devops_space_type=server_fe&pipelineId=1139212901634&stage=dev_gatekeeper_stage'`,
    ],
    action: main,
  },
] satisfies HiCommand[]
