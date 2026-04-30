/** biome-ignore-all lint/suspicious/noEmptyInterface: <> */
/** biome-ignore-all lint/suspicious/noExplicitAny: <> */
export interface PipelinesRunsResponse<WithoutJobDetail extends boolean> {
  count: number
  pipelineRuns: PipelineRun<WithoutJobDetail>[]
  blockingCount: number
  runningCount: number
}

export interface PipelineRun<WithoutJobDetail extends boolean> {
  pipelineId: string
  orcaId: string
  runId: string
  // runName: string
  runSeq: string
  runStatus: RunStatus
  triggerInfo: TriggerInfo
  failType: number
  failReason: any
  allowRollback: boolean
  runRollback: any
  jobs: (WithoutJobDetail extends true ? never : Job2)[]
  assignmentIds: string[]
  artifactCount: number
  createdAt: string
  createdBy: string
  startedAt: string
  updatedAt: string
  completedAt: string
  timeCostSec: string
}

export const RunStatus = {
  RUNNING: 2,
  CANCELLED: 7,
  SUCCESS: 8,
  FAIL: 9,
}
export type RunStatus = (typeof RunStatus)[keyof typeof RunStatus]

interface TriggerInfo {
  triggeredBy: string
  triggeredAt: string
  triggerType: number
}

interface Job2 {
  jobRunId: string
  jobAtom: JobAtom
  jobType: number
  jobStatus: number
  jobRunSeq: number
  startedAt: string
  completedAt: string
  createdAt: string
  updatedAt: string
  timeCostSec: string
  failType: number
  failReason: any
}

interface JobAtom {
  uniqueId: string
  inputs?: Inputs
  output?: Output | null
}

interface Inputs {
  trigger_params?: TriggerParams
}

interface TriggerParams {
  detail_url: string
  developer: string[]
  development_task_name: string
}

interface Output {
  GECKO_packageInfo?: string
  GECKO_region?: string
}
