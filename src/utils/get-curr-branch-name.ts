import { execa } from 'execa'

export const getCurrBranchName = async (cwd?: string) =>
  (await execa({ cwd })`git branch --show-current`).stdout || undefined
