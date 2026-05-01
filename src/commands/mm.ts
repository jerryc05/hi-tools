import { spinner } from '@clack/prompts'
import type { HiCommand } from '../types'

async function getUpstreamRemote() {
  const { execa } = await import('execa')
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
  const s = spinner()

  s.start(`${updBranch ? 'Updating' : 'Fetching'} master...`)
  const { execa } = await import('execa')
  await execa({
    stdio: 'inherit',
    // env: { GIT_TRACE: '1' },
  })`git fetch ${await getUpstreamRemote()} master${updBranch ? ':master' : ''}`

  s.start('Merging ...')
  await execa({
    stdio: 'inherit',
    // env: { GIT_TRACE: '1' },
  })`git merge ${await getUpstreamRemote()}/master --no-verify --no-edit`

  s.stop('Done')
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
