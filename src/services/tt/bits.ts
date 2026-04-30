import type {
  PipelineRun,
  PipelinesRunsResponse,
} from '@/types/tt/pipelines-runs'

const API_BASE_URL = 'https://bits.bytedance.net'

/** Faster if WITH_JOB_DETAIL=true */
export async function getRunInfoByPipelineID<WithoutJobDetail extends boolean>(
  queryParams: {
    pipelineId: string | number
    pageSize: number
    pageNum?: number
    withoutJob: WithoutJobDetail
  },
  jwtToken: string,
  jwtObj: { username: string },
  signal?: RequestInit['signal'],
) {
  const queryObj: Record<string, string | number | boolean> = {
    ...queryParams,
    pageNum: queryParams.pageNum ?? 1,
  }
  const url = `${API_BASE_URL}/api/v1/pipelines/runs?${new URLSearchParams(queryObj as never).toString()}`

  const response = await fetch(url, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      'X-jwt-token': jwtToken,
      Username: jwtObj.username,
    },
    signal: signal ?? null,
  })

  return {
    response,
    getJson: async () =>
      (await response.json()) as PipelinesRunsResponse<WithoutJobDetail>,
  }
}

export async function getRunDetailByRunID(
  runID: string | number,
  jwtToken: string,
  jwtObj: { username: string },
) {
  const url = `${API_BASE_URL}/api/v1/pipelines/runs/${runID}`
  const response = await fetch(url, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      'X-jwt-token': jwtToken,
      Username: jwtObj.username,
    },
  })
  return {
    response,
    getJson: async () =>
      (await response.json()) as { pipelineRun: PipelineRun<false> },
  }
}
