import type { AIPaaSAuth } from '@byted/aipaas-auth'
import { log, spinner } from '@clack/prompts'
import pc from 'picocolors'
import { formatDate } from './format-date'

export interface JwtUserInfo {
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
  work_country: {
    id: string
    key: string
    name: string
    enName: string
  }
  work_city: { id: string; name: string; en_name: string }
  avatar_url: string
  email: string
  employee_id: number
  new_employee_id: number
}

let auth: AIPaaSAuth | undefined

export async function getJwt() {
  const s = spinner()
  s.start('Logging in...')

  if (!auth) {
    const { AIPaaSAuth } = await import('@byted/aipaas-auth')
    auth = new AIPaaSAuth('cn')
  }

  const jwtStr = await auth.getJwt()
  const jwtObj = (await auth.getUserInfo()) as JwtUserInfo

  s.stop(
    `Hi ${pc.magenta(jwtObj.username)} from ${pc.blue(`${jwtObj.scope} ${jwtObj.work_country.key} ${jwtObj.work_city.en_name}`)}`,
  )
  // log.info(`Login will expire on ${formatDate(jwtObj.exp * 1000)}`)

  return { jwtStr, jwtObj }
}
