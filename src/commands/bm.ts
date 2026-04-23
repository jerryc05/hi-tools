import type { HiCommand } from '../types.ts'

export default [
  {
    cmd: {
      name: 'bm <target>',
      desc: '[B]ranch [M]erge: merge current HEAD into target branch without switching',
    },
    action: async (target: string) => {
      console.log(`🚀 Starting silent merge: HEAD -> ${target}`)
      throw new Error('Not implemeted!')
      try {
        /*
        // 1. Fetch the latest target branch
        console.log(`📡 Fetching origin ${targetBranch}...`)
        await execa('git', ['fetch', 'origin', targetBranch], {
          env: { GIT_TRACE: '1' },
          stdio: 'inherit',
        })

        // 2. Sync local target branch with origin if needed (Cherry-pick range)
        const range = `${targetBranch}..origin/${targetBranch}`
        const { stdout: revList } = await execa('git', ['rev-list', range])

        if (revList.trim()) {
          console.log(
            ` cherry-picking missing commits from origin/${targetBranch}...`,
          )
          await execa('git', ['cherry-pick', '-x', range], { stdio: 'inherit' })
        }

        // 3. Perform in-memory merge-tree
        console.log(`计算 merging trees...`)
        const { stdout: treeHash } = await execa('git', [
          'merge-tree',
          targetBranch,
          'HEAD',
        ])
        // Note: merge-tree in newer git versions might output more than just the hash.
        // If it fails, we might need --write-tree flag for Git 2.38+
        const cleanTreeHash = treeHash.split('\n')[0].trim()

        // 4. Create a merge commit object
        // -p targetBranch -p HEAD (Multiple parents)
        console.log(`🔨 Creating merge commit object...`)
        const { stdout: newCommitHash } = await execa('git', [
          'commit-tree',
          cleanTreeHash,
          '-p',
          targetBranch,
          '-p',
          'HEAD',
          '-m',
          `feat: Merge from ${process.env.USER || 'hi-tools'} at ${new Date().toISOString()}`,
        ])

        const finalCommit = newCommitHash.trim()

        // 5. Update the reference for targetBranch
        console.log(`📍 Updating refs/heads/${targetBranch} to ${finalCommit}...`)
        await execa('git', [
          'update-ref',
          `refs/heads/${targetBranch}`,
          finalCommit,
        ])

        // 6. Push to origin
        console.log(`📤 Pushing ${targetBranch} to origin...`)
        await execa('git', ['push', 'origin', targetBranch], { stdio: 'inherit' })

        console.log(`🎉 Successfully updated and pushed ${targetBranch}!`)
      */
      } catch (error) {
        console.error('\n❌ Silent merge failed:', error)
        process.exit(1)
      }
    },
  },
] satisfies HiCommand[]
