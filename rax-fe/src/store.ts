import { useQuery } from '@tanstack/solid-query'
import { API_PATH } from './types/api-paths'
import type { DeviceInfoResponse } from './types/device-info-response'

async function queryFn() {
  try {
    const resp = await fetch(API_PATH.RAX_DEVICE_INFO)
    const res: DeviceInfoResponse = await resp.json()
    return res
  } catch (err) {
    alert((err as Error).stack || JSON.stringify(err))
    throw err
  }
}

export const useDeviceInfo = <T = DeviceInfoResponse>(
  select?: ((data: DeviceInfoResponse) => T),
) =>
  useQuery(() => ({
    queryKey: [API_PATH.RAX_DEVICE_INFO],
    queryFn,
    refetchInterval: 5000,
    select,
  }))

const selectAccountInfo = (data: DeviceInfoResponse) =>
  data.appInfo.appSettings.account

export const useAccountInfo = () => useDeviceInfo(selectAccountInfo)
