import base62 from 'base62'

export namespace API_PATH {
  let i = 0
  export const RAX_WEBPAGE = '/'
  export const RAX_DEVICE_INFO = `/${base62.encode(i++)}`
  export const RAX_SCRSHOT = `/${base62.encode(i++)}`
  export const RAX_OPEN_SCHEMA = `/${base62.encode(i++)}`
}
