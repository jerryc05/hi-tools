#!/usr/bin/env -S node --experimental-strip-types --no-warnings

import { cac } from 'cac'
import { execa } from 'execa'
import { readFileSync, existsSync } from 'node:fs'

const cli = cac('hi')

const $ = (cmd: string, env = {}) =>
  execa(cmd, { shell: true, stdio: 'inherit', env: { ...process.env, ...env } })

cli.command('ver', 'Print current npm pkg version').action(() => {
  const pkg = JSON.parse(readFileSync('./package.json', 'utf-8'))
  console.log(pkg.version)
})

//
//
//
//
//
//

async function getUpstreamRemote(): Promise<string> {
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
//
//
//

cli.command('i18n', 'I18n scan and sort').action(async () => {
  await $(
    'pnpm dlx @ies/starling-cli@latest scan -c ./starling.config.js --fallback --disable-browser',
  )
  if (existsSync('./combine-lang.js')) await $('node ./combine-lang.js')
  // 使用 catch 忽略排序错误 (模拟 || :)
  await $('pnpm --package=json-sort-cli@latest dlx sortjson ./src/lang').catch(
    () => {},
  )
})

// hi bam
cli
  .command('bam', 'Update BAM code')
  .action(() => $('pnpm dlx @byted-arch-fe/bam-code-generator update'))

// 错误处理与解析
cli.help()
cli.parse()
