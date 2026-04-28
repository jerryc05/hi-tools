import { PKG_JSON_OBJ } from '../index'
import type { HiCommand } from '../types'
import { cli } from '../utils/cli'

const sleep = (ms: number) => new Promise(resolve => setTimeout(resolve, ms))

export default [
  {
    cmd: {
      name: 'wup',
      desc: '[W]ait for pkg publish, [U]pdate target repo, and [P]ush',
    },
    options: [
      { name: '-t, --target <path>', desc: 'Target repository path' },
      {
        name: '-c, --cmdPrefix <prefix>',
        desc: 'Pkg install command prefix',
        config: { default: 'pnpm add' },
      },
      {
        name: '--timeout <limit>',
        desc: 'Timeout limit in seconds',
        config: { default: 300 },
      },
    ],
    examples: [
      `${cli.name} wup -t "/tmp/otherRepoPath" -c "emo add"`,
      `${cli.name} wup -t "/tmp/otherRepoPath" -c "rush add --make-consistent -p"`,
    ],
    action: async ({
      target,
      cmdPrefix,
      timeout,
    }: {
      target: string
      cmdPrefix: string
      timeout: number
    }) => {
      if (!PKG_JSON_OBJ) {
        console.log('❌ Unable to parse package.json!')
        process.exit(1)
      }

      if (!target) {
        console.log('❌ Missing target repo path')
        process.exit(1)
      }

      const version = PKG_JSON_OBJ.version
      const pkgName = `${PKG_JSON_OBJ.name}@${version}`

      const SLEEP_INTERVAL = 10000 // 10s
      const installCmdArr = [...cmdPrefix.split(' '), pkgName]

      console.log(`🚀 Monitoring ${pkgName}...`)
      console.log(`📂 Target: ${target}`)
      console.log(`🛠  Install cmd: ${installCmdArr.join(' ')}`)

      const { execa } = await import('execa')

      try {
        console.log('📥 Pulling latest changes in target repo...')
        await execa({
          cwd: target,
          stdio: 'inherit',
          env: { GIT_TRACE: '1' },
        })`git pull`

        const startTime = Date.now()
        while (true) {
          // Wait
          const { exitCode } = await execa({
            reject: false,
            stdio: 'inherit',
          })`npm view ${pkgName} version`
          if (exitCode === 0) {
            console.log(`\n✅ v${version} is live! Installing...`)

            try {
              // Update
              await execa({ cwd: target, stdio: 'inherit' })`${installCmdArr}`
              console.log(`\n🎉 [SUCCESS] ${pkgName} installed!`)
              break
            } catch {
              console.log(
                '\n⚠️ Registry updated but installation failed, retrying...',
              )
            }
          } else {
            process.stdout.write('.')
          }

          const elapsed = (Date.now() - startTime) / 1000
          if (elapsed >= timeout) {
            console.error(`\n❌ [ERROR] Timed out after ${timeout}s.`)
            process.exit(1)
          }

          await sleep(SLEEP_INTERVAL)
        }

        // Push
        console.log('📝 Committing changes...')
        await execa({ stdio: 'inherit' })`git commit -am 'chore: upd ${pkgName}`

        console.log('📤 Pushing to remote...')
        await execa({ stdio: 'inherit' })`git push`

        console.log('🎉 DONE!')
      } catch (error) {
        console.error('\n❌ Task failed:', error)
        process.exit(1)
      }
    },
  },
] satisfies HiCommand[]
