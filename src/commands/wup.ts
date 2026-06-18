import { lstatSync } from 'node:fs'
import { log, note, spinner } from '@clack/prompts'
import strToArgv from 'string-argv'
import type { Options } from 'yargs'
import type { HiCmd } from '@/types/cmd-module'
import process from 'node:process'
import { getCwdPackageJson } from '@/utils/get-cwd-package'

const sleep = (ms: number) => new Promise(resolve => setTimeout(resolve, ms))
const SLEEP_INTERVAL = 10000 // 10s

async function main(argv: {
  target: string
  installCmdPrefix: string
  timeout: number
  skipCommit?: boolean
  verbose?: boolean
}) {
  const PKG = await getCwdPackageJson()
  if (!PKG) {
    log.error(`Failed to get package.json at ${process.cwd()}`)
    process.exit(1)
  }

  const version = PKG.version
  const pkgName = `${PKG.name}@${version}`

  const installCmdArr = [...strToArgv(argv.installCmdPrefix), pkgName]

  note(
    `🚀 Monitoring ${pkgName}...\n` +
      `📂 Target: ${argv.target}\n` +
      `🛠  Install cmd: ${installCmdArr.join(' ')}`,
  )

  const { execa } = await import('execa')

  try {
    log.info('Pulling latest changes in target repo...')
    await execa({
      cwd: argv.target,
      stdio: 'ignore',
      // env: { GIT_TRACE: '1' },
    })`git pull`
    log.success('Latest commit pulled')

    let s = spinner()
    s.start()
    const startTime = Date.now()
    for (let tryNo = 1; ; tryNo++) {
      // Wait
      s.message(`Waiting for ${pkgName}, attempt ${tryNo}`)
      const { exitCode } = await execa({
        reject: false,
        stdio: 'ignore',
      })`npm view ${pkgName} version`
      if (exitCode === 0) {
        s.stop(`#${tryNo}: ${pkgName} is live! Found it ✅`)

        try {
          // Update
          log.info(`Installing ${pkgName} via ${installCmdArr}`)
          await execa({ cwd: argv.target, stdio: 'inherit' })`${installCmdArr}`
          log.success(`${pkgName} installed! ✅`)
          break
        } catch (err) {
          log.error(
            `${pkgName} was found in registry, but install command failed. Err: ${err}`,
          )
          process.exit(1)
        }
      }

      const elapsed = (Date.now() - startTime) / 1000
      if (elapsed >= argv.timeout) {
        s.stop(`Didn't find ${pkgName} in ${argv.timeout} sec(s)`)
        process.exit(1)
      }

      await sleep(SLEEP_INTERVAL)
    }

    if (!argv.skipCommit) {
      // Check untracked files
      const { stdout: untrackedFiles } = await execa({
        cwd: argv.target,
      })`git ls-files --others --exclude-standard`
      if (untrackedFiles.trim()) {
        log.error(
          `Target repo has untracked files. Please commit or remove them manually before running wup:\n${untrackedFiles}`,
        )
        process.exit(1)
      }

      // Push
      log.info('Committing changes...')
      await execa({
        cwd: argv.target,
        stdio: 'inherit',
      })`git commit -am ${`chore: upd ${pkgName}`}`
      log.success('Committed ✅')

      log.info('Pushing to remote...')
      await execa({ cwd: argv.target, stdio: 'inherit' })`git push`
      log.success('Pushed ✅')
    } else {
      log.info('Git-commit skipped')
    }

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
    normalize: true,
  },
  'install-cmd-prefix': {
    alias: 'cmd',
    desc: 'Pkg install command prefix. Default: pnpm add',
    default: 'pnpm add',
  },
  timeout: {
    desc: 'Timeout checking new pkg version in sec',
    default: 5 * 60,
    type: 'number',
  },
  'skip-commit': {
    desc: 'Do not commit changes',
    default: false,
    type: 'boolean',
  },
} satisfies Record<string, Options>

export default [
  {
    command: 'wup',
    describe: '[W]ait for pkg publish, [U]pdate target repo, and [P]ush',
    builder: yargs =>
      yargs
        .options(builder)
        .example('$0 wup -t "/tmp/..." --cmd "emo add"', 'Install w/ eden-mono')
        .example(
          '$0 wup -t "/tmp/..." --cmd "rush add --make-consistent -p" --skip-commit',
          'Install w/ @microsoft/rush',
        ) as never,
    async handler(args) {
      const {
        target,
        installCmdPrefix = builder['install-cmd-prefix'].default,
        'skip-commit': skipCommit = builder['skip-commit'].default,
        verbose,
      } = args
      const timeout = Number(args.timeout)
      if (!Number.isFinite(timeout) || timeout <= 0) {
        log.error(
          `Timeout must be a positive number, received: ${args.timeout}`,
        )
        process.exit(1)
      }

      const errMsg = `Path ${target} is not a directory.`
      try {
        if (!target || !lstatSync(target).isDirectory()) throw new Error(errMsg)
      } catch (err) {
        log.error(`${errMsg}. Err: ${err}`)
        process.exit(1)
      }

      await main({
        target,
        installCmdPrefix,
        timeout,
        skipCommit: !!skipCommit,
        verbose,
      })
    },
  },
] satisfies HiCmd<unknown, Record<keyof typeof builder, string | undefined>>[]
