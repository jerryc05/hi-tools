import { useQuery } from '@tanstack/solid-query'
import { API_PATH } from '@/types/api-paths'
import type { DeviceInfoResponse } from '@/types/device-info-response'

async function fetchFn() {
  try {
    return (await import('./mock')).mockData[
      API_PATH.RAX_DEVICE_INFO
    ] as unknown as DeviceInfoResponse

    // const resp = await fetch(API_PATH.RAX_DEVICE_INFO)
    // const res: DeviceInfoResponse = await resp.json()
    // return res
  } catch (err) {
    console.error(err)
    throw err
  }
}

export const useDeviceInfo = <T = DeviceInfoResponse>(
  select?: (data: DeviceInfoResponse) => T,
) =>
  useQuery(() => ({
    queryKey: [API_PATH.RAX_DEVICE_INFO],
    queryFn: fetchFn,
    refetchInterval: 5000,
    select,
  }))

const selectAccountInfo = (data: DeviceInfoResponse) =>
  data.appInfo.appSettings.account

export const useAccountInfo = () => useDeviceInfo(selectAccountInfo)
