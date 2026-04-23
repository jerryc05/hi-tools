import { execa } from 'execa'
import signale from 'signale'
import type { HiCommand } from '../types.ts'

async function getUpstreamRemote() {
  try {
    // 获取当前分支追踪的远程分支名，例如 "origin/master"
    const { stdout } =
      await execa`git rev-parse --abbrev-ref --symbolic-full-name @{u}`
    return stdout.split('/')[0] || 'origin'
  } catch {
    return 'origin'
  }
}

/** TODO: 未来支持 master 和 main 自动判断 */
async function mm(updBranch: boolean) {
  signale.start(`${updBranch ? 'Updating' : 'Fetching'} master...`)
  await execa({
    stdio: 'inherit',
    env: { GIT_TRACE: '1' },
  })`git fetch ${await getUpstreamRemote()} master${updBranch ? ':master' : ''}`

  signale.start('Merging ...')
  await execa({
    stdio: 'inherit',
  })`git merge ${await getUpstreamRemote()}/master --no-verify --no-edit`

  signale.success('🎉 DONE!')
}

export default [
  {
    cmd: {
      name: 'mm',
      desc: "[M]erge [M]aster: Update local master to remote's, then merge into current branch",
    },
    action: () => mm(true),
  },
  {
    cmd: {
      name: 'mmm',
      desc: "[M]erge [M]aster (don't [M]odify local master): Merge remote's master into current branch, without updating local master",
    },
    action: () => mm(false),
  },
] satisfies HiCommand[]
