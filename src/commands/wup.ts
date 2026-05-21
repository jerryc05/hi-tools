import { lstatSync } from 'node:fs'
import { log, note, spinner } from '@clack/prompts'
import type { Options } from 'yargs'
import type { HiCmd } from '@/types/cmd-module'
import type PkgJsonObj from '../../package.json'
import { readFile } from 'node:fs/promises'
import { join } from 'node:path'
import process from 'node:process'

const sleep = (ms: number) => new Promise(resolve => setTimeout(resolve, ms))

async function main(argv: {
  target: string
  installCmdPrefix: string
  timeout: number
  verbose?: boolean
}) {
  const PKG: typeof PkgJsonObj = JSON.parse(
    await readFile(join(process.cwd(), './package.json'), 'utf8'),
  )

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
      // env: { GIT_TRACE: '1' },
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
          log.info(`Installing ${pkgName} via ${String(installCmdArr)}`)
          await execa({ cwd: argv.target, stdio: 'inherit' })`${installCmdArr}`
          log.success(`${pkgName} installed! ✅`)
          break
        } catch {
          log.error(`${pkgName} not installed but found in registry`)
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
    await execa({
      cwd: argv.target,
      stdio: 'inherit',
    })`git commit -am ${`chore: upd ${pkgName}`}`
    s.stop('Committed ✅')

    s = spinner()
    s.start('Pushing to remote...')
    await execa({ cwd: argv.target, stdio: 'inherit' })`git push`
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
    normalize: true,
  },
  'install-cmd-prefix': {
    alias: 'cmd',
    desc: 'Pkg install command prefix',
    default: 'pnpm add',
  },
  timeout: {
    desc: 'Timeout checking new pkg version in sec',
    default: 5 * 60,
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
    handler(args) {
      const {
        target,
        installCmdPrefix = builder['install-cmd-prefix'].default,
        verbose,
      } = args
      const timeout = Number(args.timeout)

      const errMsg = `Path ${target} is not a directory.`
      try {
        if (!target || !lstatSync(target).isDirectory()) throw new Error(errMsg)
        main({ target, installCmdPrefix, timeout, verbose })
      } catch (e) {
        throw new Error(errMsg, { cause: e })
      }
    },
  },
] satisfies HiCmd<unknown, Record<keyof typeof builder, string | undefined>>[]
