import { AIPaaSAuth } from '@byted/aipaas-auth'
import { begin, hello, info } from '../utils'
import { formatDate } from './format-date'

export interface JwtUserInfo {
  iss: string
  exp: number
  iat: number
  username: string
  type: string
  region: string
  trusted: boolean
  uuid: string
  site: string
  bytecloud_tenant_id: string
  bytecloud_tenant_id_org: string
  scope: string
  sequence: string
  organization: string
  work_country: string
  avatar_url: string
  email: string
  employee_id: number
  new_employee_id: number
}

const auth = new AIPaaSAuth('cn')

export async function getJwt() {
  begin('Logging in...')

  const jwtStr = await auth.getJwt()
  const jwtObj = (await auth.getUserInfo()) as JwtUserInfo

  hello(`Hi ${jwtObj.username} from ${jwtObj.scope} ${jwtObj.work_country}`)
  info(`  Login will expire on ${formatDate(new Date(jwtObj.exp * 1000))}`)

  return { jwtStr, jwtObj }
}
