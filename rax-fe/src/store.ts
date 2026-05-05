import { createSignal } from 'solid-js'
import type { DeviceInfoResponse } from './types/device-info-response'

export const deviceInfoResponseSig = createSignal<DeviceInfoResponse>({
  appInfo: {
    appSettings: {
      account: {
        current: {
          customID: '',
          nickname: 'nick1',
          userID: 'userID_1',
        },
        loginAccountList: [
          {
            customID: '',
            nickname: 'nick2',
            userID: 'userID_2',
          },
          {
            customID: '',
            nickname: 'nick3',
            userID: 'userID_3',
          },
          {
            customID: '',
            nickname: 'nick4',
            userID: 'userID_4',
          },
        ],
      },
    },
  },
})
