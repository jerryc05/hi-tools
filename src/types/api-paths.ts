/** biome-ignore-all lint/suspicious/noConstEnum: <> */

import base62 from 'base62'

const enum API_PATH_ENUM {
  RAX_WEBPAGE,
  RAX_DEVICE_INFO,
  RAX_SCRSHOT,
  RAX_OPEN_SCHEMA,
  __MAX__ = 4,
}

export const API_PATH = Object.fromEntries(
  Array.from({ length: API_PATH_ENUM.__MAX__ }).map((_, i) => [
    i,
    `/${base62.encode(i)}`,
  ]),
) as Record<keyof Omit<typeof API_PATH_ENUM, '__MAX__'>, string>
