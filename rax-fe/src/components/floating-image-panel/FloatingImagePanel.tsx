import { Show } from 'solid-js'
import { FloatingImagePanelPreview } from './FloatingImagePanelPreview'
import { useFloatingImagePanel } from './useFloatingImagePanel'

export function FloatingImagePanel() {
  const panel = useFloatingImagePanel()

  return (
    <div
      ref={panel.setPanelRef}
      class='fixed z-40 select-none rounded-2xl border border-slate-200 bg-white shadow-2xl shadow-slate-900/15'
      style={{
        left: `${panel.position().x}px`,
        top: `${panel.position().y}px`,
        width: `${panel.panelWidth()}px`,
      }}
    >
      <div
        class='absolute inset-y-0 left-0 z-10 w-2 cursor-ew-resize'
        onPointerDown={panel.handleResizePointerDown('left')}
      />
      <div
        class='absolute inset-y-0 right-0 z-10 w-2 cursor-ew-resize'
        onPointerDown={panel.handleResizePointerDown('right')}
      />
      <div
        class='flex cursor-move items-center justify-between gap-3 rounded-2xl px-4 py-3'
        onPointerDown={panel.handleHeaderPointerDown}
      >
        <div class='min-w-0'>
          <p class='truncate text-sm font-semibold text-slate-900'>悬浮预览</p>
          <p class='truncate text-xs text-slate-500'>
            {panel.expanded() ? '拖拽移动，点击右上角折叠' : '点击右上角展开'}
          </p>
        </div>
        <button
          type='button'
          class='inline-flex size-9 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-600 transition hover:border-slate-300 hover:bg-slate-50 hover:text-slate-900'
          onClick={panel.toggleExpanded}
          aria-label={panel.expanded() ? '折叠悬浮框' : '展开悬浮框'}
        >
          <span
            class={panel.expanded() ? 'text-lg leading-none' : 'rotate-180 text-lg leading-none'}
            aria-hidden='true'
          >
            {panel.expanded() ? '▴' : '▾'}
          </span>
        </button>
      </div>
      <Show when={panel.expanded()}>
        <FloatingImagePanelPreview
          imageAspectRatio={panel.imageAspectRatio()}
          onImageLoad={panel.handlePreviewImageLoad}
          onRefresh={panel.handleRefresh}
        />
      </Show>
    </div>
  )
}
