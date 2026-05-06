import { encode } from 'base62'

let i = 0

export const API_PATH = {
  RAX_DEVICE_INFO: encode(i++),
  RAX_SCRSHOT: encode(i++),
  RAX_OPEN_SCHEMA: encode(i++),
}
console.log(API_PATH)

export type API_PATH = Record<keyof typeof API_PATH, string>
