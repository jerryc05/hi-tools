import type { AIPaaSAuth } from '@byted/aipaas-auth'
import pc from 'picocolors'
import { begin, hello, info } from '../utils/logger'
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

let auth: AIPaaSAuth | undefined

export async function getJwt() {
  begin('Logging in...')

  if (!auth) {
    const { AIPaaSAuth } = await import('@byted/aipaas-auth')
    auth = new AIPaaSAuth('cn')
  }

  const jwtStr = await auth.getJwt()
  const jwtObj = (await auth.getUserInfo()) as JwtUserInfo

  hello(
    `Hi ${pc.magenta(jwtObj.username)} from ${pc.blue(`${jwtObj.scope} ${jwtObj.work_country}`)}`,
  )
  info(`  Login will expire on ${formatDate(new Date(jwtObj.exp * 1000))}`)

  return { jwtStr, jwtObj }
}
