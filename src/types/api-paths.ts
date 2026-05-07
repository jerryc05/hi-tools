import base62 from 'base62'

let i = 0

export const API_PATH = {
  RAX_WEBPAGE: '/',
  RAX_DEVICE_INFO: `/${base62.encode(i++)}`,
  RAX_SCRSHOT: `/${base62.encode(i++)}`,
  RAX_OPEN_SCHEMA: `/${base62.encode(i++)}`,
}

export type API_PATH = Record<keyof typeof API_PATH, string>
