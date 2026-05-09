import { useScreenShot } from '@/services/screen-shot'
import { RiSystemRefreshLine } from 'solid-icons/ri'
import { createEffect, createSignal, onCleanup, Show } from 'solid-js'

type FloatingImagePanelPreviewProps = {
  class?: string
  imageAspectRatio?: string
  onImageLoad: (event: Event) => void
}

export function FloatingImagePanelPreview(
  props: FloatingImagePanelPreviewProps,
) {
  const [imageUrl, setImageUrl] = createSignal<string>()

  const screenShot = useScreenShot()

  createEffect(() => {
    const blob = screenShot.data
    if (!blob) {
      setImageUrl(undefined)
      return
    }

    const url = URL.createObjectURL(blob)
    setImageUrl(url)
    onCleanup(() => URL.revokeObjectURL(url))
  })

  return (
    <Show when={!screenShot.isLoading}>
      <div class={`relative ${props.class ?? ''}`}>
        <img
          class='block w-full h-auto object-contain'
          src={imageUrl()}
          style={
            props.imageAspectRatio ?
              { 'aspect-ratio': props.imageAspectRatio }
            : undefined
          }
          alt='Screenshot'
          onLoad={props.onImageLoad}
        />
        <Show when={screenShot.isFetching}>
          <div class='absolute inset-0 flex justify-center items-center bg-slate-900/60 p-[40%]'>
            <RiSystemRefreshLine class='w-full h-full text-white animate-spin' />
          </div>
        </Show>
      </div>
    </Show>
  )
}
