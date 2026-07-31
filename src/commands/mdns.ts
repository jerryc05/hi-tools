import os from 'node:os'
import type { HiCmd } from '@/types/cmd-module'

export default [
  {
    command: 'mdns',
    describe: 'Show mdns [hostname].local',

    async handler() {
      let mdnsHostName = ''

      if (os.platform() === 'darwin') {
        try {
          const { execa } = await import('execa')
          mdnsHostName = (await execa`scutil --get LocalHostName`).stdout.trim()
        } catch (e) {
          console.error(e)
        }
      }

      if (!mdnsHostName) mdnsHostName = os.hostname()

      console.log(
        mdnsHostName.toLowerCase().endsWith('.local') ?
          mdnsHostName
        : `${mdnsHostName}.local`,
      )
    },
  },
] satisfies HiCmd[]
