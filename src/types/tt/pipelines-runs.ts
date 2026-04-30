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
  runStatus: number
  triggerInfo: TriggerInfo
  failType: number
  failReason: any
  allowRollback: boolean
  runRollback: any
  jobs: (WithoutJobDetail extends true ? never : Job2)[]
  assignmentIds: string[]
  artifactCount: number
  pipelineRunUrl: string
  createdAt: string
  createdBy: string
  startedAt: string
  updatedAt: string
  completedAt: string
  timeCostSec: string
}

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
  output?: Output
}
interface Output {
  GECKO_packageInfo?: string
  GECKO_region?: string
}
