import { execa } from 'execa'
import { PKG_JSON_OBJ } from '../index'
import type { HiCommand } from '../types'

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
  repoID,
  hash,
  branch,
}: {
  repoID: number
  hash?: string | true
  branch?: string | true
}) {
  const usernameKey = 'SCM_USERNAME'
  const passwordKey = 'SCM_PASSWORD'
  const username = process.env[usernameKey]
  const password = process.env[passwordKey]
  if (!username || !password) {
    console.log(
      `Missing ${!username ? usernameKey : passwordKey} in env var.\n` +
        'Go to https://luban.bytedance.net/npm/publish and get your personal SCM username + password.',
    )
    process.exit(1)
  }

  try {
    const commitMsgP = execa`git log -1 --pretty=%s`

    let commitHash: string | undefined, commitBranch: string | undefined
    if (branch) {
      if (branch === true)
        commitBranch = (await execa`git branch --show-current`).stdout.trim()
      else commitBranch = branch
    } else if (hash) {
      if (hash === true)
        commitHash = (await execa`git rev-parse HEAD`).stdout.trim()
      else commitHash = hash
    }

    const payload: NpmVersionPayload = {
      repos: repoID,
      create_user: username,
      pub_base: commitHash ? 'commit_base' : 'branch_base',
      base_commit_hash: commitHash ?? '',
      branch_name: commitBranch ?? '',
      desc: `[${PKG_JSON_OBJ?.version}] ${(await commitMsgP).stdout.trim()}`,
      has_version_stage: false,
    }

    console.log(
      `ℹ️ ${payload.create_user} is publishing ${PKG_JSON_OBJ?.name}@${PKG_JSON_OBJ?.version} to repoID=${payload.repos}\n` +
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
      console.log(`❌ HTTP ${response.status} Error: ${errorText}`)
      process.exit(1)
    }

    const data = await response.json()
    console.log('🎉 Successfully published:', data)
  } catch (error) {
    console.error('❌ Execution Failed:', error)
    process.exit(1)
  }
}

export default [
  {
    cmd: {
      name: 'tt-npm-pub <repoID>',
      desc: '[PUB]lish current hash of current repo to Luban',
    },
    options: [
      { name: '--hash [hash]', desc: 'Publish pkg by hash (default)' },
      {
        name: '-b, --branch [branch]',
        desc: 'Publish pkg by branch',
      },
    ],
    action: publish,
  },
] satisfies HiCommand[]

/*
COMMIT_HASH=$(git rev-parse HEAD)
COMMIT_MSG=$(git log -1 --pretty=%s)

JSON_DATA=$(jq -n \
  --arg repo 7825 \
  --arg user "$SCM_USERNAME" \
  --arg hash "$COMMIT_HASH" \
  --arg desc "$COMMIT_MSG" \
  '{
    repos: ($repo|tonumber),
    create_user: $user,
    pub_base: "commit_base",
    base_commit_hash: $hash,
    desc: $desc,
    has_version_stage: false
  }')




curl -X POST https://scm.byted.org/api/v2/npm_versions/ \
  -u "${SCM_USERNAME}:${SCM_PASSWORD}" \
  -H "Accept: application/json" \
  -H "Content-Type: application/json" \
  -d "$JSON_DATA"
*/
