import { spinner } from '@clack/prompts'
import type { Options } from 'yargs'
import type { HiCmd } from '@/types/cmd-module'
import { getCurrBranchName } from '@/utils/get-curr-branch-name'
import { getRemoteNameByBranch } from '@/utils/get-remote-name-by-branch'

async function mm({
  updBranch,
  branch,
  verbose,
}: {
  updBranch: boolean
  branch: string
  verbose?: boolean
}) {
  const s = spinner()

  s.start(`${updBranch ? 'Updating' : 'Fetching'} ${branch}...`)
  const { execa } = await import('execa')

  const CURR_BRANCH_NAME = await getCurrBranchName()
  const CURR_BRANCH_REMOTE_NAME = await getRemoteNameByBranch({
    branchName: CURR_BRANCH_NAME,
  })

  await execa({
    stdio: 'inherit',
    env: verbose ? { GIT_TRACE: '1' } : {},
  })`git fetch ${CURR_BRANCH_REMOTE_NAME} ${branch}${updBranch ? `:${branch}` : ''}`

  s.message('Merging ...')
  await execa({
    stdio: 'inherit',
    env: verbose ? { GIT_TRACE: '1' } : {},
  })`git merge ${CURR_BRANCH_REMOTE_NAME}/${branch} --no-verify --no-edit ${verbose ? '' : '-q'}`

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
      const { branch = builder.branch.default, verbose } = argv
      mm({ updBranch: true, branch, verbose })
    },
  },
  {
    command: 'mmm',
    describe:
      "[M]erge [M]aster (don't [M]odify local master): Merge remote's master into current branch, without updating local master",
    builder,
    async handler(argv) {
      const { branch = builder.branch.default, verbose } = argv
      await mm({ updBranch: false, branch, verbose })
    },
  },
] satisfies HiCmd<unknown, Record<keyof typeof builder, string | undefined>>[]
