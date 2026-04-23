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
import { execa } from 'execa'

type NpmVersionPayload = {
  repos: number
  create_user: string
  desc: string
  has_version_stage: boolean
} & (
  | {
      pub_base: 'commit_base'
      base_commit_hash: string
    }
  | {
      pub_base: 'branch_base'
      branch_name: string
    }
)

async function publishNpmVersion(repoID: number) {
  const usernameKey = 'SCM_USERNAME'
  const passwordKey = 'SCM_PASSWORD'
  const username = process.env[usernameKey]
  const password = process.env[passwordKey]
  if (!username || !password) {
    throw new Error(
      `Missing ${!username ? usernameKey : passwordKey} in env var.\n` +
        'Go to https://luban.bytedance.net/npm/publish and get your personal SCM username + password.',
    )
  }

  try {
    const [{ stdout: commitHash }, { stdout: commitMsg }] = await Promise.all([
      execa`git rev-parse HEAD`,
      execa`git log -1 --pretty=%s`,
    ])

    const payload: NpmVersionPayload = {
      repos: repoID, //7825,
      create_user: username,
      pub_base: 'commit_base',
      base_commit_hash: commitHash.trim(),
      desc: commitMsg.trim(),
      has_version_stage: false,
    }

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
      console.log(`HTTP ${response.status} Error: ${errorText}`)
      process.exit(1)
    }

    const data = await response.json()
    console.log('🎉 Successfully published:', data)
  } catch (error) {
    console.error('Execution Failed:', error)
    process.exit(1)
  }
}

publishNpmVersion()
