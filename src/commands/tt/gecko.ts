import { cancel, isCancel, log, note, select } from '@clack/prompts'
import pc from 'picocolors'
import type { Options } from 'yargs'
import { getRunDetailByRunID, getRunInfoByPipelineID } from '@/services/tt/bits'
import type { HiCmd } from '@/types/cmd-module'
import type { GeckoPackageInfo } from '@/types/tt/gecko-package'
import { type PipelineRun, RunStatus } from '@/types/tt/pipelines-runs'
import { formatDate } from '@/utils/format-date'
import { getJwt, type JwtUserInfo } from '@/utils/jwt'

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
}

/*

todo ,,,




tt-gecko -p <pipelineId> --latest-success

# 多 region
tt-gecko -r us,sg,va



# 当用户输入 region 没有命中时，给出可选值：
No Gecko info matched region: jp
Available regions:
- us
- sg
- va


# JSON 输出，方便脚本消费
tt-gecko -p <pipelineId> --output json


# Watch 模式：等待流水线产出 Gecko 包
用户刚触发流水线，不想一直刷新页面。
tt-gecko watch -p <pipelineId> -r us


### 发送二维码到 IM 或通知系统
包构建成功后自动通知测试群。
tt-gecko -p <pipelineId> -r us --send lark

*/

async function main({
  pipelineId,
  url,
  region,
  verbose,
}: {
  pipelineId: string | number | undefined
  url: string | undefined
  region: string | undefined
  verbose?: boolean
}) {
  const { jwtStr, jwtObj } = await getJwt()

  const pplID = (() => {
    if (pipelineId == null && !url)
      throw new Error('pipelineId or url is required')
    if (pipelineId != null) return pipelineId
    return getPipelineIDFromURL(url ?? '')
    // todo ,,, 加上数字校验
    // 加上 Warning: both --pipelineId and --url are provided. \n Using --pipelineId=1139212901634 and ignoring pipelineId=9999999999999 from URL.
  })()

  const items = await getGeckoInfo(pplID, jwtStr, jwtObj, region)

  if (items.length <= 0) {
    log.error(
      `No Gecko info found${region ? ` matching region [${region}]` : ''} in latest run`,
    )
    return
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

const builder = {
  url: {
    alias: 'u',
    desc: 'Bits URL',
    string: true,
    conflicts: ['pipeline-id'],
  },
  'pipeline-id': {
    alias: 'p',
    desc: 'Pipeline ID (Overrides URL)',
    string: true,
    conflicts: ['url'],
  },
  region: {
    alias: 'r',
    desc: 'String-match based region filter',
    string: true,
  },
} satisfies Record<string, Options>

export default [
  {
    command: 'gecko',
    describe: 'Show gecko info by bits URL',
    builder: yargs =>
      yargs
        .options(builder)
        .example(
          "$0 tt-gecko -r us -u 'https://b??.net/devops/??/develop/detail/??/flow?devops_space_type=server_fe&pipelineId=1139212901634&stage=dev_gatekeeper_stage'",
          'Example of URL mode, filtering us region',
        ),
    handler(args) {
      const { url, pipelineId, region, verbose } = args
      main({ url, pipelineId, region, verbose })
    },
  },
] satisfies HiCmd<unknown, Record<keyof typeof builder, string | undefined>>[]

async function getGeckoInfo(
  pipelineId: string | number,
  jwtToken: string,
  jwtObj: JwtUserInfo,
  region: string | undefined,
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
    log.error(
      `[getRunInfoByPipelineID] failed: ${response.status} ${response.statusText}\n${await response.text()}`,
    )
    process.exit(1)
  }

  const data = await getJson()

  if (data.pipelineRuns[0]?.runStatus !== RunStatus.SUCCESS) {
    log.warn(
      `Latest run (runId=${data.pipelineRuns[0]?.runId}) status=${formatStatusText(
        data.pipelineRuns[0]?.runStatus,
      )}. Gecko info may be unavailable.`,
    )
  }

  const items = extractGeckoInfoFromRuns(data.pipelineRuns, region)
  if (items.length) return items

  const newPipelineID = await tryMaybeURLs(pipelineId, data.pipelineRuns)
  if (newPipelineID) {
    return getGeckoInfo(newPipelineID, jwtToken, jwtObj, region)
  }

  const selectedRunId = await selectRunIdFromRecentRuns(
    pipelineId,
    jwtToken,
    jwtObj,
  )

  return await getGeckoInfoByRunId(selectedRunId, jwtToken, jwtObj)
}

function extractGeckoInfoFromRuns(
  pipelineRuns: PipelineRun<false>[],
  regionFilter?: string,
) {
  return pipelineRuns
    .flatMap(run =>
      run.jobs
        .map(job => {
          try {
            const output = job.jobAtom.output
            if (!output) return null
            const packageInfoStr = output.GECKO_packageInfo
            if (!packageInfoStr) return null

            const region = output.GECKO_region
            if (regionFilter && !region?.includes(regionFilter)) return null

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
              region,
              scmVersion,
              channel,
              updatedDate,
              creator,
              envs,
              runId: run.runId,
              runSeq: run.runSeq,
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

async function tryMaybeURLs(
  currentPplID: string | number,
  pipelineRuns: PipelineRun<boolean>[],
) {
  const maybeUrlInfoList = pipelineRuns.flatMap(run =>
    run.jobs
      .map(job => job.jobAtom.inputs?.trigger_params)
      .filter(x => !!x)
      .filter(x => x.detail_url.length),
  )
  if (!maybeUrlInfoList.length) {
    return
  }

  note(
    `Found ${maybeUrlInfoList.length} possible alternative pipeline(s) you may want to try instead.`,
    'Mistyped the pipeline ID?',
  )

  const options: { value: string; label?: string; hint?: string }[] = [
    { value: '', label: `(Keep current pipeline id=${currentPplID})` },
  ].concat(
    maybeUrlInfoList.map(x => ({
      value: getPipelineIDFromURL(x.detail_url),
      label: `${pc.underline(x.development_task_name)} by ${x.developer.join(',')}`,
      hint: x.detail_url,
    })),
  )

  const selectedPipelineID = await select({
    message:
      'Select a pipeline to change, or cancel [ESC] to use the current pipeline.',
    options,
  })

  if (isCancel(selectedPipelineID) || !selectedPipelineID) {
    cancel('Keep using current pipeline')
    return
  }

  log.success(`Using new pipeline id=${selectedPipelineID}`)
  return selectedPipelineID
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
    log.error(
      `[getRunInfoByPipelineID] failed: ${response.status} ${response.statusText}\n${await response.text()}`,
    )
    process.exit(1)
  }

  const data = await getJson()
  if (data.pipelineRuns.length <= 0) {
    log.error(
      `No pipeline runs found in the most recent ${N} runs\n${JSON.stringify(data, null, 1)}`,
    )
    process.exit(1)
  }

  note(
    'The latest pipeline run may be ongoing/failed. Try a previous run to inspect.',
    'Select a previous run',
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
    log.error(
      `[getRunDetailByRunID] failed: ${response.status} ${response.statusText}\n${await response.text()}`,
    )
    process.exit(1)
  }

  const data = await getJson()
  const items = extractGeckoInfoFromRuns([data.pipelineRun])
  return items
}

function getPipelineIDFromURL(url: string) {
  const regex = /\bpipelineId=(\d+)\b/
  const match = url.match(regex)
  const pplID = match?.[1]?.trim()
  if (pplID) {
    if (!/^\d+$/.test(pplID)) {
      throw new Error(
        `Invalid pipelineId query from URL. Expecting a pipelineId query value with all numbers`,
      )
    }
    return pplID
  }
  throw new Error(
    `Invalid URL. Expecting a url containing ${pc.bold(pc.yellow('pipelineId'))} query param. E.g. ` +
      pc.underline(
        pc.gray(
          `https://b??.net/devops/??/develop/detail/??/flow?devops_space_type=server_fe&${pc.bold(pc.magenta('pipelineId=1139212901634'))}&stage=dev_gatekeeper_stage`,
        ),
      ),
  )
}

function formatStatusText(status: number | undefined) {
  switch (status) {
    case RunStatus.RUNNING:
      return pc.blue('RUNNING')
    case RunStatus.CANCELLED:
      return pc.gray('CANCELLED')
    case RunStatus.SUCCESS:
      return pc.green('SUCCESS')
    case RunStatus.FAIL:
      return pc.red('FAIL')
  }
  return `status=${status}`
}

function formatRunTime(run: PipelineRun<boolean>) {
  // if (run.completedAt) return `completed @ ${formatDate(run.completedAt)}`
  if (run.startedAt) return `started @ ${formatDate(run.startedAt)}`
  if (run.createdAt) return `created @ ${formatDate(run.createdAt)}`
  return 'time=?'
}
