import { useQuery } from '@tanstack/solid-query'
import { toast } from 'solid-sonner'
import { API_PATH } from '@/types/api-paths'

async function fetchFn() {
  try {
    await new Promise(resolve => setTimeout(resolve, 2000))

    const mockImg = await import('./mock-scrshot.webp?url')
    const resp = await fetch(mockImg.default)

    // const resp = await fetch(API_PATH.RAX_SCRSHOT)
    const res = await resp.blob()
    return res
  } catch (err) {
    console.error(err)
    toast.error(JSON.stringify(err))
    throw err
  }
}

export const useScreenShot = () =>
  useQuery(() => ({
    queryKey: [API_PATH.RAX_SCRSHOT],
    queryFn: fetchFn,
  }))
