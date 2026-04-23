import pc from 'picocolors'

export const begin = (s: string) => console.log(pc.blue(`⏳ ${s}`))

export const done = () =>
  console.log(pc.bold(pc.underline(pc.green('🎉 DONE!'))))

export const fail = (s: string) =>
  console.log(pc.bold(pc.underline(pc.bgRed(`\n❌ ${s}`))))

export const success = (s: string) =>
  console.log(pc.bold(pc.underline(pc.green(`✅ ${s}`))))
