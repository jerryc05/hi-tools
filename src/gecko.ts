/**
 * 获取 Bits 流水线最新 Gecko 资源的脚本
 *
 * 运行方式:
 * npx ts-node get_gecko_resource.ts
 *
 * https://skills.bytedance.net/skill/skills:skills.byted.org/default/public/bits-pipeline?section=readme
 */

import { AIPaaSAuth } from '@byted/aipaas-auth'

const API_BASE_URL = 'https://bits.bytedance.net'

// 定义接口类型
interface RunRecord {
  run_id: string
  status: string
  [key: string]: any
}

interface ListRunsResponse {
  code: number
  data: {
    runs: RunRecord[]
  }
  message?: string
}

interface RunDetailResponse {
  code: number
  data: {
    run_id: string
    jobs?: any[]
    // 具体的产物字段根据实际返回结构调整
    [key: string]: any
  }
  message?: string
}

/**
 * 从网页链接中提取 pipeline_id
 * @param url 流水线网页链接
 */
function extractPipelineId(url: string): string {
  // 匹配类似: https://bits.bytedance.net/devops/201134696450/develop/detail/2276839/flow
  const match = url.match(/\/detail\/(\d+)\//)
  if (!match || !match[1]) {
    throw new Error('无法从链接中解析 pipeline_id，请检查链接格式')
  }
  return match[1]
}

/**
 * 获取流水线运行列表，提取最新一次的 run_id
 */
async function getLatestRunId(
  pipelineId: string,
  token: string,
): Promise<string> {
  // 注意：实际 API 路径可能根据内部 OpenAPI 规范有所不同，此处以常规 RESTful 路径为例
  const url = `${API_BASE_URL}/api/v1/pipelines/open/${pipelineId}/runs?limit=1`

  const response = await fetch(url, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      // Authorization: `Bearer ${token}`, // 根据实际鉴权方式调整，如 x-tt-env, jwt-token 等
      'X-jwt-token': token,
      Username: 'jerry.chen1',
    },
  })

  if (!response.ok) {
    throw new Error(
      `获取运行列表失败: ${response.status} ${response.statusText}`,
    )
  }

  const resData = (await response.json()) as ListRunsResponse

  if (resData.code !== 0 || !resData.data?.runs?.length) {
    throw new Error('未找到运行记录或接口返回异常')
  }

  // 假设按时间倒序，取第一个
  return resData.data.runs[0].run_id
}

/**
 * 获取单次运行详情并解析 Gecko 资源
 */
async function getGeckoResource(runId: string, token: string): Promise<any> {
  // 对应提示中提到的 API: /api/v1/pipelines/open/runs/XXX
  const url = `${API_BASE_URL}/api/v1/pipelines/open/runs/${runId}`

  const response = await fetch(url, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
  })

  if (!response.ok) {
    throw new Error(
      `获取运行详情失败: ${response.status} ${response.statusText}`,
    )
  }

  const resData = (await response.json()) as RunDetailResponse

  if (resData.code !== 0) {
    throw new Error(`获取运行详情异常: ${resData.message}`)
  }

  // 遍历 jobs 或 atoms 查找 Gecko 产物
  // 此处的具体取值路径需根据实际 JSON 结构进行修改
  let geckoInfo = null
  const jobs = resData.data?.jobs || []

  for (const job of jobs) {
    // 伪代码：假设产物信息在 job.outputs.gecko 中
    if (job.outputs && job.outputs.gecko) {
      geckoInfo = job.outputs.gecko
      break
    }
  }

  return geckoInfo || '未在执行详情中找到 Gecko 资源信息'
}

/**
 * 主流程
 */
async function main() {
  const userToken = await new AIPaaSAuth('cn').login()
  console.log(',,,userToken', userToken)

  const targetUrl =
    'https://bits.bytedance.net/devops/201134696450/develop/detail/2276839/flow'
  // const userToken = process.env.BITS_OPENAPI_TOKEN

  try {
    console.log('1. 开始解析链接...')
    const pipelineId = extractPipelineId(targetUrl)
    console.log(`=> 成功提取 Pipeline ID: ${pipelineId}`)

    console.log('\n2. 查询最新运行记录...')
    const latestRunId = await getLatestRunId(pipelineId, userToken)
    console.log(`=> 成功获取最新 Run ID: ${latestRunId}`)

    console.log('\n3. 获取运行详情并提取 Gecko 资源...')
    const geckoResource = await getGeckoResource(latestRunId, userToken)

    console.log('\n================ 结果 ================')
    console.log(JSON.stringify(geckoResource, null, 2))
  } catch (error) {
    console.error('执行出错:', error instanceof Error ? error.message : error)
  }
}

// 执行脚本
main()



/* 


{
  "iss": "paas.passport.auth",
  "exp": 1777083583,
  "iat": 1777079923,
  "username": "jerry.chen1",
  "type": "person_account",
  "region": "cn",
  "trusted": true,
  "uuid": "9ea4ea41-f2af-4738-bd6d-5ccc7d9cadb5",
  "site": "online",
  "bytecloud_tenant_id": "bytedance",
  "bytecloud_tenant_id_org": "bytedance",
  "scope": "bytedance",
  "sequence": "RD",
  "organization": "产品研发和工程架构-Global E-Commerce-业务平台-用户增长-营销增长",
  "work_country": "USA",
  "avatar_url": "https://pan16.larksuitecdn.com/static-resource/v1/v3_00vs_ec00d49a-b544-4050-8665-772d6e5e64ah~?image_size=noop&cut_type=&quality=&format=png&sticker_format=.webp",
  "email": "jerry.chen1@bytedance.com",
  "employee_id": 5850022,
  "new_employee_id": 5850022
}



*/