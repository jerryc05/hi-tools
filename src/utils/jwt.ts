import { AIPaaSAuth } from '@byted/aipaas-auth'
import { jwtDecode } from 'jwt-decode'

export interface Jwt {
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

export async function getJwt() {
  const jwtStr = await new AIPaaSAuth('cn').login()
  let jwtObj: Jwt | undefined
  function getJwtObj() {
    if (!jwtObj) {
      jwtObj = jwtDecode<Jwt>(jwtStr)
    }
    return jwtObj
  }
  return { jwtStr, getJwtObj }
}
