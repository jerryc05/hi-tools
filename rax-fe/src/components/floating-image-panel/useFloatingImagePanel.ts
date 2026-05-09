import { createEffect, createSignal, onCleanup, onMount } from 'solid-js'

const PANEL_WIDTH = 320
const PANEL_HEADER_HEIGHT = 72
const VIEWPORT_GAP = 8
const MIN_PANEL_WIDTH = 210
const MAX_PANEL_WIDTH = 560

type Position = { x: number; y: number }
type DragState = { pointerId: number; offsetX: number; offsetY: number }
type ResizeState = {
  pointerId: number
  edge: 'left' | 'right'
  startX: number
  startLeft: number
  startWidth: number
}

const clampWidth = (width: number) =>
  Math.min(Math.max(width, MIN_PANEL_WIDTH), MAX_PANEL_WIDTH)

const clampPosition = (
  position: Position,
  width: number,
  panelHeight: number,
) => {
  const maxX = Math.max(VIEWPORT_GAP, window.innerWidth - width - VIEWPORT_GAP)
  const maxY = Math.max(
    VIEWPORT_GAP,
    window.innerHeight - Math.max(64, window.innerHeight * 0.05),
  )
  return {
    x: Math.min(Math.max(position.x, VIEWPORT_GAP), maxX),
    y: Math.min(Math.max(position.y, VIEWPORT_GAP), maxY),
  }
}

export function useFloatingImagePanel() {
  const [panelRef, setPanelRef] = createSignal<HTMLDivElement>()
  const [expanded, setExpanded] = createSignal(true)
  const [imageAspectRatio, setImageAspectRatio] = createSignal<string>()
  const [position, setPosition] = createSignal<Position>({
    x: VIEWPORT_GAP,
    y: 96,
  })
  const [panelWidth, setPanelWidth] = createSignal(PANEL_WIDTH)
  const [dragState, setDragState] = createSignal<DragState | null>(null)
  const [resizeState, setResizeState] = createSignal<ResizeState | null>(null)
  const handleWindowResize = () => updatePanelWidth(panelWidth())

  const getPanelHeight = () => panelRef()?.offsetHeight ?? PANEL_HEADER_HEIGHT
  const updatePosition = (next: Position) =>
    setPosition(clampPosition(next, panelWidth(), getPanelHeight()))

  const updatePanelWidth = (nextWidth: number) => {
    const maxWidth = Math.max(
      MIN_PANEL_WIDTH,
      window.innerWidth - position().x - VIEWPORT_GAP,
    )
    const width = Math.min(clampWidth(nextWidth), maxWidth)
    setPanelWidth(width)
    requestAnimationFrame(() =>
      setPosition(current => clampPosition(current, width, getPanelHeight())),
    )
  }

  const handlePreviewImageLoad = (event: Event) => {
    const image = event.currentTarget as HTMLImageElement
    if (image.naturalWidth > 0 && image.naturalHeight > 0) {
      setImageAspectRatio(`${image.naturalWidth} / ${image.naturalHeight}`)
    }
  }

  const handlePointerMove = (event: PointerEvent) => {
    const resize = resizeState()
    if (resize && resize.pointerId === event.pointerId) {
      if (resize.edge === 'right')
        return updatePanelWidth(
          resize.startWidth + event.clientX - resize.startX,
        )
      const rightEdge = resize.startLeft + resize.startWidth
      const nextLeft = Math.max(
        VIEWPORT_GAP,
        Math.min(event.clientX, rightEdge - MIN_PANEL_WIDTH),
      )
      const nextWidth = clampWidth(rightEdge - nextLeft)
      const finalWidth = Math.min(
        nextWidth,
        Math.min(MAX_PANEL_WIDTH, rightEdge - VIEWPORT_GAP),
      )
      const finalLeft = rightEdge - finalWidth
      setPanelWidth(finalWidth)
      requestAnimationFrame(() =>
        setPosition(current =>
          clampPosition(
            { x: finalLeft, y: current.y },
            finalWidth,
            getPanelHeight(),
          ),
        ),
      )
      return
    }
    const drag = dragState()
    if (!drag || drag.pointerId !== event.pointerId) return
    updatePosition({
      x: event.clientX - drag.offsetX,
      y: event.clientY - drag.offsetY,
    })
  }

  const handlePointerUp = (event: PointerEvent) => {
    if (dragState()?.pointerId === event.pointerId) setDragState(null)
    if (resizeState()?.pointerId === event.pointerId) setResizeState(null)
  }

  const handleHeaderPointerDown = (event: PointerEvent) => {
    if (event.button !== 0) return
    const target = event.target
    if (target instanceof HTMLElement && target.closest('button')) return
    setDragState({
      pointerId: event.pointerId,
      offsetX: event.clientX - position().x,
      offsetY: event.clientY - position().y,
    })
  }

  const handleResizePointerDown =
    (edge: 'left' | 'right') => (event: PointerEvent) => {
      if (event.button !== 0) return
      event.stopPropagation()
      setDragState(null)
      setResizeState({
        pointerId: event.pointerId,
        edge,
        startX: event.clientX,
        startLeft: position().x,
        startWidth: panelWidth(),
      })
    }

  onMount(() => {
    setPosition(
      clampPosition(
        { x: window.innerWidth - PANEL_WIDTH - 24, y: 96 },
        PANEL_WIDTH,
        PANEL_HEADER_HEIGHT,
      ),
    )
    window.addEventListener('pointermove', handlePointerMove)
    window.addEventListener('pointerup', handlePointerUp)
    window.addEventListener('pointercancel', handlePointerUp)
    window.addEventListener('resize', handleWindowResize)
  })

  onCleanup(() => {
    window.removeEventListener('pointermove', handlePointerMove)
    window.removeEventListener('pointerup', handlePointerUp)
    window.removeEventListener('pointercancel', handlePointerUp)
    window.removeEventListener('resize', handleWindowResize)
  })

  createEffect(() => {
    expanded()
    panelWidth()
    imageAspectRatio()
    requestAnimationFrame(() =>
      setPosition(current =>
        clampPosition(current, panelWidth(), getPanelHeight()),
      ),
    )
  })

  return {
    expanded,
    imageAspectRatio,
    panelWidth,
    position,
    setPanelRef,
    handleHeaderPointerDown,
    handlePreviewImageLoad,
    // handleRefresh: () => console.log('refresh callback placeholder'),
    handleResizePointerDown,
    toggleExpanded: () => setExpanded(value => !value),
  }
}
