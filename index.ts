#!/usr/bin/env -S node --experimental-strip-types --no-warnings

import { cac } from 'cac'
import { execa } from 'execa'
import { readFileSync, existsSync } from 'node:fs'
import { join } from 'node:path'

const cli = cac('hi')

const $ = (cmd: string, env = {}) =>
  execa(cmd, { shell: true, stdio: 'inherit', env: { ...process.env, ...env } })

const PKG_JSON_OBJ = (() => {
  try {
    const pkgPath = join(process.cwd(), 'package.json')
    return JSON.parse(readFileSync(pkgPath, 'utf-8')) as Record<string, any>
  } catch {}
})()

//
//
//

cli.command('ver', 'Print current npm pkg version').action(() => {
  console.log(PKG_JSON_OBJ?.version ?? '')
})

//
//
//

async function getUpstreamRemote() {
  try {
    // 获取当前分支追踪的远程分支名，例如 "origin/master"
    const { stdout } = await execa('git', [
      'rev-parse',
      '--abbrev-ref',
      '--symbolic-full-name',
      '@{u}',
    ])
    // 截取斜杠前的部分
    return stdout.split('/')[0] || 'origin'
  } catch {
    return 'origin'
  }
}

/** TODO: 未来支持 master 和 main 自动判断 */
async function mm(updMaster: boolean) {
  console.log('🚀 Syncing master...')
  await $(
    `git fetch ${updMaster ? (await getUpstreamRemote()) + ' master:master' : ''}`,
    {
      GIT_TRACE: '1',
    },
  )
  await $(`git merge ${await getUpstreamRemote()}/master --no-verify --no-edit`)
  console.log('✅ DONE!')
}

cli
  .command(
    'mm',
    'Update master branch to latest, then merge master into current branch',
  )
  .action(() => mm(true))

cli
  .command('mmm', 'Fetch origin, then merge master into current branch')
  .action(() => mm(false))

//
//
//

const hasPackage = (name: string) =>
  !!(
    PKG_JSON_OBJ?.dependencies?.[name] || PKG_JSON_OBJ?.devDependencies?.[name]
  )
cli.command('i18n', 'I18n scan and sort').action(async () => {
  await $(
    `${
      hasPackage('@ies/starling-cli') ? 'starling' : (
        'pnpm dlx @ies/starling-cli'
      )
    } scan -c ./starling.config.js --fallback --disable-browser`,
  )
  await $('node ./combine-lang.js')
  await $('pnpm --package=json-sort-cli dlx sortjson ./src/lang').catch()
})

cli
  .command('bam', 'Update BAM code-gen')
  .action(() =>
    $(
      `${
        hasPackage('@byted-arch-fe/bam-code-generator') ? 'bam' : (
          'pnpm dlx @byted-arch-fe/bam-code-generator'
        )
      } update`,
    ),
  )

//
//
//

cli.help()
cli.parse()
