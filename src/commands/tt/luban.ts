import { log, note, spinner } from '@clack/prompts'
import type { Options } from 'yargs'
import type { HiCmd } from '@/types/cmd-module'
import { getCwdPackageJson } from '@/utils/get-cwd-package'

type NpmVersionPayload = {
  repos: number
  create_user: string
  desc: string
  has_version_stage: false
  version?: string
} & (
  | { pub_base: 'commit_base'; base_commit_hash: string }
  | { pub_base: 'branch_base'; branch_name: string }
)

async function publish({
  repoId,
  hash,
  branch,
}: {
  repoId: number
  hash?: string
  branch?: string
}) {
  const PKG = await getCwdPackageJson()
  if (!PKG) {
    log.error(`Failed to get package.json at ${process.cwd()}`)
    process.exit(1)
  }

  const usernameKey = 'SCM_USERNAME'
  const passwordKey = 'SCM_PASSWORD'
  const username = process.env[usernameKey]
  const password = process.env[passwordKey]
  if (!username || !password) {
    log.error(
      `Missing ${!username ? usernameKey : passwordKey} in env var.\n` +
        'Go to https://luban.bytedance.net/npm/publish and get your personal SCM username & password.',
    )
    process.exit(1)
  }

  const { execa } = await import('execa')

  try {
    const pkgName = `${PKG.name}@${PKG.version}`

    let s = spinner()
    s.start(`Checking if ${pkgName} is already published`)

    const { exitCode } = await execa({
      reject: false,
      stdio: 'ignore',
    })`pnpm view ${pkgName} version`
    if (exitCode === 0) {
      s.stop(`${pkgName} found in registry!`)
      log.error(
        `${pkgName} is already published! Did you update your package version?`,
      )
      process.exit(1)
    } else {
      s.stop(`${pkgName} is not published. Proceeding...`)
    }

    const commitMsgP = execa`git log -1 --pretty=%s`

    let commitHash: string | undefined, commitBranch: string | undefined
    if (branch == null) {
      if (!hash) commitHash = (await execa`git rev-parse HEAD`).stdout.trim()
      else commitHash = hash
    } else {
      if (!branch)
        commitBranch = (await execa`git branch --show-current`).stdout.trim()
      else commitBranch = branch
    }

    const payload: NpmVersionPayload = {
      repos: repoId,
      create_user: username,
      desc: `v${PKG?.version}: ${(await commitMsgP).stdout.trim()}`,
      has_version_stage: false,
      version: PKG?.version,
      ...(commitHash ?
        { pub_base: 'commit_base', base_commit_hash: commitHash }
      : { pub_base: 'branch_base', branch_name: commitBranch! }),
    }

    note(
      `${payload.create_user} is publishing ${pkgName} to repoId=${payload.repos}` +
        `\n${commitHash ? `hash: ${commitHash}` : `brch: ${commitBranch}`}`,
    )

    const response = await fetch('https://scm.byted.org/api/v2/npm_versions/', {
      method: 'POST',
      headers: {
        Authorization: `Basic ${Buffer.from(`${username}:${password}`).toString('base64')}`,
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    })

    if (!response.ok) {
      const errorText = await response.text()
      log.error(`HTTP ${response.status} Error: ${errorText}`)
      process.exit(1)
    }

    const data = await response.text()
    log.success(`🎉 Successfully published: ${data}`)
  } catch (err) {
    log.error('Execution Failed:')
    console.error(err)
    process.exit(1)
  }
}

const builder = {
  'by-hash': {
    alias: 'h',
    desc: 'Publish pkg by hash (default)',
    string: true,
    conflicts: ['by-branch'],
  },
  'by-branch': {
    alias: 'b',
    desc: 'Publish pkg by branch',
    string: true,
    conflicts: ['by-hash'],
  },
} satisfies Record<string, Options>

export default [
  {
    command: 'luban <repoId>',
    describe: 'Publish current repo pkg to Luban',
    builder: yargs =>
      yargs
        .options(builder)
        .example('$0 tt luban 1234', 'Example of hash mode (current commit)')
        .example(
          '$0 tt luban 1234 --by-hash 123321',
          'Example of hash mode (commit hash: 123321)',
        )
        .example(
          '$0 tt luban 1234 --by-branch master',
          'Example of branch mode (master branch)',
        ),
    async handler(args) {
      const { byHash, byBranch } = args
      const repoId = Number(args.repoId)
      await publish({ repoId, hash: byHash, branch: byBranch })
    },
  },
] satisfies HiCmd<unknown, Record<keyof typeof builder, string | undefined>>[]
