import { useMutation } from '@tanstack/solid-query'
import { API_PATH } from '@/types/api-paths'
import type { AccountInfo } from '@/types/device-info-response'

async function fetchFn(account: AccountInfo) {
  try {
    void account
    return (await import('./mock')).mockData[API_PATH.RAX_CHANGE_ACCOUNT]

    // const resp = await fetch(API_PATH.RAX_CHANGE_ACCOUNT, {
    //   method: 'POST',
    //   headers: { 'Content-Type': 'application/json' },
    //   body: JSON.stringify(account),
    // })
    // const res: { account: string; msg: string } = await resp.json()
    // return res
  } catch (err) {
    console.error(err)
    throw err
  }
}

export const useChangeAccount = () =>
  useMutation(() => ({ mutationFn: fetchFn }))
