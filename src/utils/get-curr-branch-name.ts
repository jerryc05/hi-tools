import { execa } from 'execa'

export const getCurrBranchName = async (cwd?: string) =>
  (await execa({ cwd })`git symbolic-ref --short HEAD`).stdout
