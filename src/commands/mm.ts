import { spinner } from '@clack/prompts'
import type { Options } from 'yargs'
import type { HiCmd } from '@/types/cmd-module'

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

async function mm({
  updBranch,
  branch,
  verbose,
}: {
  updBranch: boolean
  branch: string
  verbose?: boolean | undefined
}) {
  const s = spinner()

  s.start(`${updBranch ? 'Updating' : 'Fetching'} ${branch}...`)
  const { execa } = await import('execa')
  await execa({
    stdio: 'inherit',
    env: verbose ? { GIT_TRACE: '1' } : {},
  })`git fetch ${await getUpstreamRemote()} ${branch}${updBranch ? `:${branch}` : ''}`

  s.message('Merging ...')
  await execa({
    stdio: 'inherit',
    env: verbose ? { GIT_TRACE: '1' } : {},
  })`git merge ${await getUpstreamRemote()}/${branch} --no-verify --no-edit ${verbose ? '' : '-q'}`

  s.stop('Done')
}

const builder = {
  branch: {
    alias: 'b',
    default: 'master',
    desc: 'Default=master, or "main" if you wish',
  },
} satisfies Record<string, Options>

export default [
  {
    command: 'mm',
    describe:
      "[M]erge [M]aster: Update local master to remote's, then merge into current branch",
    builder,
    handler(argv) {
      const { branch, verbose } = argv
      mm({ updBranch: true, branch, verbose })
    },
  },
  {
    command: 'mmm',
    describe:
      "[M]erge [M]aster (don't [M]odify local master): Merge remote's master into current branch, without updating local master",
    builder,
    handler(argv) {
      const { branch, verbose } = argv
      mm({ updBranch: false, branch, verbose })
    },
  },
] satisfies HiCmd<unknown, Record<keyof typeof builder, string>>[]
