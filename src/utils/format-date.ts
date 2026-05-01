export function formatDate(date: ConstructorParameters<typeof Date>[0]) {
  const d = new Date(date)
  const abbr = new Intl.DateTimeFormat('en-US', { timeZoneName: 'longOffset' })
    .formatToParts(d)
    .find(p => p.type === 'timeZoneName')
    ?.value.replace('GMT', '')
  return `${d.toLocaleDateString('zh-CN')} ${d.toTimeString().split(' ')[0]} ${abbr ?? ''}`
}
