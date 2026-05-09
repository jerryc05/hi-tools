import { RiSystemRefreshLine } from 'solid-icons/ri'
import { createEffect, createSignal, onCleanup, Show } from 'solid-js'

type FloatingImagePanelPreviewProps = {
  imageAspectRatio?: string
  onImageLoad: (event: Event) => void
  blob?: Blob
  refreshing: boolean
}

export function FloatingImagePanelPreview(
  props: FloatingImagePanelPreviewProps,
) {
  const [imageUrl, setImageUrl] = createSignal<string>()

  createEffect(() => {
    const blob = props.blob
    if (!blob) {
      setImageUrl(undefined)
      return
    }

    const nextUrl = URL.createObjectURL(blob)
    setImageUrl(nextUrl)
    onCleanup(() => URL.revokeObjectURL(nextUrl))
  })

  return (
    <div class='relative pt-1'>
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
      <Show when={props.refreshing}>
        <div class='absolute inset-0 flex justify-center items-center bg-slate-900/60 p-[40%]'>
          <RiSystemRefreshLine class='w-full h-full text-white animate-spin' />
        </div>
      </Show>
    </div>
  )
}
