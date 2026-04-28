import type { Command } from 'cac'

export type HiCommand = {
  cmd: {
    name: string
    desc: string
  }
  options?: {
    name: string
    desc: string
    config?: Parameters<Command['option']>[2]
  }[]
  examples?: string[]
  action: Parameters<Command['action']>[0]
}
