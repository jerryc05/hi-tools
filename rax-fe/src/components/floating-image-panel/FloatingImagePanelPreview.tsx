type FloatingImagePanelPreviewProps = {
  imageAspectRatio?: string
  onImageLoad: (event: Event) => void
  blob?: Blob
  refreshing: boolean
}

export function FloatingImagePanelPreview(
  props: FloatingImagePanelPreviewProps,
) {
  // todo ,,, show loading
  return (
    <div
      class='bg-slate-950 pt-1 border border-slate-200 rounded-2xl overflow-hidden'
      style={
        props.imageAspectRatio ?
          { 'aspect-ratio': props.imageAspectRatio }
        : undefined
      }
    >
      <img
        class='block w-full h-auto object-contain'
        src={props.blob ? URL.createObjectURL(props.blob) : undefined}
        alt='Screenshot'
        onLoad={props.onImageLoad}
      />
    </div>
  )
}
