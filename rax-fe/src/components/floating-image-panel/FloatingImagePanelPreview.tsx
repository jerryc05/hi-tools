const previewImageSrc = `data:image/svg+xml;utf8,${encodeURIComponent(`
  <svg xmlns="http://www.w3.org/2000/svg" width="640" height="360" viewBox="0 0 640 360" fill="none">
    <defs>
      <linearGradient id="bg" x1="0" y1="0" x2="640" y2="360" gradientUnits="userSpaceOnUse">
        <stop stop-color="#0F172A"/>
        <stop offset="1" stop-color="#1D4ED8"/>
      </linearGradient>
      <linearGradient id="card" x1="88" y1="72" x2="552" y2="288" gradientUnits="userSpaceOnUse">
        <stop stop-color="rgba(255,255,255,0.28)"/>
        <stop offset="1" stop-color="rgba(255,255,255,0.08)"/>
      </linearGradient>
    </defs>
    <rect width="640" height="360" rx="32" fill="url(#bg)"/>
    <rect x="88" y="72" width="464" height="216" rx="24" fill="url(#card)" stroke="rgba(255,255,255,0.3)"/>
    <circle cx="144" cy="126" r="18" fill="rgba(255,255,255,0.72)"/>
    <path d="M136 244L222 172L290 228L364 152L470 244H136Z" fill="rgba(255,255,255,0.78)"/>
    <text x="88" y="328" fill="rgba(255,255,255,0.9)" font-family="Arial, sans-serif" font-size="30" font-weight="700">
      Image Preview
    </text>
  </svg>
`)}`;

type FloatingImagePanelPreviewProps = {
  imageAspectRatio?: string
  onImageLoad: (event: Event) => void
  onRefresh: () => void
}

export function FloatingImagePanelPreview(
  props: FloatingImagePanelPreviewProps,
) {
  return (
    <div class='px-4 pb-4 pt-1'>
      <div
        class='relative overflow-hidden rounded-2xl border border-slate-200 bg-slate-950'
        style={
          props.imageAspectRatio
            ? { 'aspect-ratio': props.imageAspectRatio }
            : undefined
        }
      >
        <img
          src={previewImageSrc}
          alt='悬浮框预览图'
          class='block h-auto w-full object-contain'
          draggable={false}
          onLoad={props.onImageLoad}
        />

        <button
          type='button'
          class='absolute right-3 top-3 inline-flex size-9 items-center justify-center rounded-full bg-slate-950/70 text-white backdrop-blur transition hover:bg-slate-950/85'
          onClick={props.onRefresh}
          aria-label='刷新图片'
        >
          <span class='text-sm font-semibold leading-none' aria-hidden='true'>
            ↻
          </span>
        </button>
      </div>
    </div>
  )
}
