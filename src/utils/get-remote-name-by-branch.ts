import { execa } from 'execa'

export const getRemoteNameByBranch = async (params: {
  cwd?: string
  branchName: string
}) =>
  execa({
    cwd: params.cwd,
  })`git config ${[`branch.${params.branchName}.remote`]}`
