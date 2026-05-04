import { log, note, spinner } from '@clack/prompts'
import type { Options } from 'yargs'
import { PKG } from '@/'
import type { HiCmd } from '@/types/cmd-module'

const sleep = (ms: number) => new Promise(resolve => setTimeout(resolve, ms))

async function main(argv: {
  target: string
  installCmdPrefix: string
  timeout: number
  verbose?: boolean | undefined
}) {
  const version = PKG.version
  const pkgName = `${PKG.name}@${version}`

  const SLEEP_INTERVAL = 10000 // 10s
  const installCmdArr = [...argv.installCmdPrefix.split(' '), pkgName]

  note(
    `🚀 Monitoring ${pkgName}...\n` +
      `📂 Target: ${argv.target}\n` +
      `🛠  Install cmd: ${installCmdArr.join(' ')}`,
  )

  const { execa } = await import('execa')

  try {
    let s = spinner()
    s.start('Pulling latest changes in target repo...')
    await execa({
      cwd: argv.target,
      stdio: 'inherit',
      env: { GIT_TRACE: '1' },
    })`git pull`
    s.stop('Latest commit pulled')

    s = spinner()
    const startTime = Date.now()
    for (let tryNo = 1; ; tryNo++) {
      // Wait
      s.start(`Waiting for ${pkgName}, attempt ${tryNo}`)
      const { exitCode } = await execa({
        reject: false,
        stdio: 'inherit',
      })`npm view ${pkgName} version`
      if (exitCode === 0) {
        s.stop(`${pkgName} is live! Found it ✅`)

        try {
          // Update
          s = spinner()
          s.start(`Installing ${pkgName} via ${installCmdArr}`)
          await execa({ cwd: argv.target, stdio: 'inherit' })`${installCmdArr}`
          s.stop(`${pkgName} installed! ✅`)
          break
        } catch {
          s.stop(`${pkgName} not installed`)
          log.error('Registry updated but failed to install')
        }
      }

      const elapsed = (Date.now() - startTime) / 1000
      if (elapsed >= argv.timeout) {
        s.stop(`Didn't find ${pkgName} in ${argv.timeout} sec(s)`)
        process.exit(1)
      }

      await sleep(SLEEP_INTERVAL)
    }

    // Push
    s = spinner()
    s.start('Committing changes...')
    await execa({ stdio: 'inherit' })`git commit -am 'chore: upd ${pkgName}`
    s.stop('Committed ✅')

    s = spinner()
    s.start('Pushing to remote...')
    await execa({ stdio: 'inherit' })`git push`
    s.stop('Pushed ✅')

    log.success('🎉 DONE!')
  } catch (error) {
    console.error('\n❌ Task failed:', error)
    process.exit(1)
  }
}

const builder = {
  target: {
    alias: 't',
    desc: 'Target repository path',
    demandOption: true,
  },
  'install-cmd-prefix': {
    alias: 'cmd',
    desc: 'Pkg install command prefix',
    default: 'pnpm add',
  },
  timeout: {
    alias: 't',
    desc: 'Timeout checking new pkg version in sec',
    default: 5 * 60,
    number: true,
  },
} satisfies Record<string, Options>

export default [
  {
    command: 'wup',
    describe: '[W]ait for pkg publish, [U]pdate target repo, and [P]ush',
    builder: yargs =>
      yargs
        .options(builder)
        .example('$0 wup -t "/tmp/..." -c "emo add"', 'Install w/ eden-mono')
        .example(
          '$0 wup -t "/tmp/..." -c "rush add --make-consistent -p"',
          'Install w/ @microsoft/rush',
        ) as never,
    handler(argv) {
      const { target, installCmdPrefix, verbose } = argv
      const timeout = Number(argv.timeout)
      main({ target, installCmdPrefix, timeout, verbose })
    },
  },
] satisfies HiCmd<unknown, Record<keyof typeof builder, string>>[]
