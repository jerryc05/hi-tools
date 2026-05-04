import { log, note } from '@clack/prompts'
import type { Options } from 'yargs'
import { PKG } from '@/'
import type { HiCmd } from '@/types/cmd-module'

type NpmVersionPayload = {
  repos: number
  create_user: string
  desc: string
  has_version_stage: boolean
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
  hash?: string | undefined
  branch?: string | undefined
}) {
  const usernameKey = 'SCM_USERNAME'
  const passwordKey = 'SCM_PASSWORD'
  const username = process.env[usernameKey]
  const password = process.env[passwordKey]
  if (!username || !password) {
    log.error(
      `Missing ${!username ? usernameKey : passwordKey} in env var.\n` +
        'Go to https://luban.bytedance.net/npm/publish and get your personal SCM username+password.',
    )
    process.exit(1)
  }

  const { execa } = await import('execa')

  try {
    const commitMsgP = execa`git log -1 --pretty=%s`

    let commitHash: string | undefined, commitBranch: string | undefined
    if (hash || (!hash && !branch)) {
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
      pub_base: commitHash ? 'commit_base' : 'branch_base',
      base_commit_hash: commitHash ?? '',
      branch_name: commitBranch ?? '',
      desc: `[${PKG?.version}] ${(await commitMsgP).stdout.trim()}`,
      has_version_stage: false,
    }

    note(
      `ℹ️ ${payload.create_user} is publishing ${PKG?.name}@${PKG?.version} to repoId=${payload.repos}\n` +
        `\t ${commitHash ? `hash=${commitHash}` : `brch=${commitBranch}`}\n` +
        `\t desc=${payload.desc}`,
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

    const data = await response.json()
    log.success('🎉 Successfully published:', data)
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
    builder,
    handler(args) {
      const { byHash, byBranch } = args
      const repoId = Number(args.repoId)
      publish({ repoId, hash: byHash, branch: byBranch })
    },
  },
] satisfies HiCmd<unknown, Record<keyof typeof builder, string | undefined>>[]
