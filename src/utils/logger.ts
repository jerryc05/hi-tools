import pc from 'picocolors'

export const begin = (s: string) =>
  console.log(pc.underline(pc.blue(`⏳ ${s}`)))

export const done = () =>
  console.log(pc.bold(pc.underline(pc.green('🎉 DONE!'))))

export const fail = (s: string) =>
  console.log(pc.underline(`\n❌ ${pc.bold(pc.bgRed(s))}`))

export const success = (s: string) =>
  console.log(pc.bold(pc.underline(pc.green(`✅ ${s}`))))

export const info = (s: string) =>
  console.log(pc.underline(pc.yellow(`ℹ️ ${s}`)))

export const hello = (s: string) =>
  console.log(pc.bold(pc.underline(pc.green(`👋 ${s}`))))
