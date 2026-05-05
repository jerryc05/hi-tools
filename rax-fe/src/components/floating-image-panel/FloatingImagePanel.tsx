import { createEffect, createSignal, onCleanup, onMount, Show } from 'solid-js'

const PANEL_WIDTH = 320
const COLLAPSED_WIDTH = 220
const PANEL_HEIGHT = 240
const VIEWPORT_GAP = 16

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

type Position = {
  x: number
  y: number
}

type DragState = {
  pointerId: number
  offsetX: number
  offsetY: number
}

const getPanelSize = (expanded: boolean) => ({
  width: expanded ? PANEL_WIDTH : COLLAPSED_WIDTH,
  height: expanded ? PANEL_HEIGHT : 72,
})

const clampPosition = (position: Position, expanded: boolean): Position => {
  const { width, height } = getPanelSize(expanded)
  const maxX = Math.max(VIEWPORT_GAP, window.innerWidth - width - VIEWPORT_GAP)
  const maxY = Math.max(VIEWPORT_GAP, window.innerHeight - height - VIEWPORT_GAP)

  return {
    x: Math.min(Math.max(position.x, VIEWPORT_GAP), maxX),
    y: Math.min(Math.max(position.y, VIEWPORT_GAP), maxY),
  }
}

export function FloatingImagePanel() {
  const [expanded, setExpanded] = createSignal(true)
  const [position, setPosition] = createSignal<Position>({ x: VIEWPORT_GAP, y: 96 })
  const [dragState, setDragState] = createSignal<DragState | null>(null)

  const updatePosition = (nextPosition: Position) => {
    setPosition(clampPosition(nextPosition, expanded()))
  }

  const handleRefresh = () => {
    console.log('refresh callback placeholder')
  }

  const handlePointerMove = (event: PointerEvent) => {
    const currentDragState = dragState()

    if (!currentDragState || currentDragState.pointerId !== event.pointerId) {
      return
    }

    updatePosition({
      x: event.clientX - currentDragState.offsetX,
      y: event.clientY - currentDragState.offsetY,
    })
  }

  const stopDragging = (pointerId: number) => {
    const currentDragState = dragState()

    if (!currentDragState || currentDragState.pointerId !== pointerId) {
      return
    }

    setDragState(null)
  }

  const handlePointerUp = (event: PointerEvent) => {
    stopDragging(event.pointerId)
  }

  const handleResize = () => {
    updatePosition(position())
  }

  const handleHeaderPointerDown = (event: PointerEvent) => {
    if (event.button !== 0) {
      return
    }

    const target = event.target
    if (target instanceof HTMLElement && target.closest('button')) {
      return
    }

    const currentPosition = position()

    setDragState({
      pointerId: event.pointerId,
      offsetX: event.clientX - currentPosition.x,
      offsetY: event.clientY - currentPosition.y,
    })
  }

  const toggleExpanded = () => {
    setExpanded(value => !value)
  }

  onMount(() => {
    const initialPosition = clampPosition(
      {
        x: window.innerWidth - PANEL_WIDTH - 24,
        y: 96,
      },
      expanded(),
    )

    setPosition(initialPosition)

    window.addEventListener('pointermove', handlePointerMove)
    window.addEventListener('pointerup', handlePointerUp)
    window.addEventListener('pointercancel', handlePointerUp)
    window.addEventListener('resize', handleResize)
  })

  onCleanup(() => {
    window.removeEventListener('pointermove', handlePointerMove)
    window.removeEventListener('pointerup', handlePointerUp)
    window.removeEventListener('pointercancel', handlePointerUp)
    window.removeEventListener('resize', handleResize)
  })

  createEffect(() => {
    const isExpanded = expanded()
    setPosition(currentPosition => clampPosition(currentPosition, isExpanded))
  })

  return (
    <div
      class='fixed z-40 select-none rounded-2xl border border-slate-200 bg-white shadow-2xl shadow-slate-900/15'
      style={{
        left: `${position().x}px`,
        top: `${position().y}px`,
        width: `${expanded() ? PANEL_WIDTH : COLLAPSED_WIDTH}px`,
      }}
    >
      <div
        class='flex cursor-move items-center justify-between gap-3 rounded-2xl px-4 py-3'
        onPointerDown={handleHeaderPointerDown}
      >
        <div class='min-w-0'>
          <p class='truncate text-sm font-semibold text-slate-900'>悬浮预览</p>
          <p class='truncate text-xs text-slate-500'>
            {expanded() ? '拖拽移动，点击右上角折叠' : '点击右上角展开'}
          </p>
        </div>

        <button
          type='button'
          class='inline-flex size-9 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-600 transition hover:border-slate-300 hover:bg-slate-50 hover:text-slate-900'
          onClick={toggleExpanded}
          aria-label={expanded() ? '折叠悬浮框' : '展开悬浮框'}
        >
          <span
            class={expanded() ? 'text-lg leading-none' : 'rotate-180 text-lg leading-none'}
            aria-hidden='true'
          >
            {expanded() ? '▴' : '▾'}
          </span>
        </button>
      </div>

      <Show when={expanded()}>
        <div class='px-4 pb-4 pt-1'>
          <div class='relative overflow-hidden rounded-2xl border border-slate-200 bg-slate-950'>
            <img
              src={previewImageSrc}
              alt='悬浮框预览图'
              class='block h-40 w-full object-cover'
              draggable={false}
            />

            <button
              type='button'
              class='absolute right-3 top-3 inline-flex size-9 items-center justify-center rounded-full bg-slate-950/70 text-white backdrop-blur transition hover:bg-slate-950/85'
              onClick={handleRefresh}
              aria-label='刷新图片'
            >
              <span class='text-sm font-semibold leading-none' aria-hidden='true'>
                ↻
              </span>
            </button>
          </div>
        </div>
      </Show>
    </div>
  )
}
