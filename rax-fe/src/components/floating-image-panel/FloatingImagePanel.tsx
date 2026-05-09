import { RiSystemRefreshLine } from 'solid-icons/ri'
import { VsChevronDown } from 'solid-icons/vs'
import { Show } from 'solid-js'
import { toast } from 'solid-sonner'
import { useScreenShot } from '@/services/screen-shot'
import { FloatingImagePanelPreview } from './FloatingImagePanelPreview'
import { useFloatingImagePanel } from './useFloatingImagePanel'

export function FloatingImagePanel() {
  const panel = useFloatingImagePanel()
  const screenShot = useScreenShot()

  const handleRefresh = async () => {
    try {
      await screenShot.refetch()
    } catch (err) {
      console.error(err)
      toast.error(JSON.stringify(err))
    }
  }

  return (
    <div
      ref={panel.setPanelRef}
      class='z-40 fixed bg-white shadow-2xl shadow-slate-900/15 border border-slate-200 rounded-2xl overflow-hidden select-none'
      style={{
        left: `${panel.position().x}px`,
        top: `${panel.position().y}px`,
        width: `${panel.panelWidth()}px`,
      }}
    >
      <div
        class='left-0 z-10 absolute inset-y-0 w-2 cursor-ew-resize'
        onPointerDown={panel.handleResizePointerDown('left')}
      />
      <div
        class='right-0 z-10 absolute inset-y-0 w-2 cursor-ew-resize'
        onPointerDown={panel.handleResizePointerDown('right')}
      />

      <div
        class='flex justify-between items-center gap-3 px-4 pt-3 pb-2 rounded-2xl cursor-move'
        onPointerDown={panel.handleHeaderPointerDown}
      >
        <div class='flex items-center gap-x-2'>
          <p class='flex items-center font-semibold text-slate-900 text-sm'>
            Device Screenshot
          </p>
          <button
            type='button'
            class={`cursor-pointer ${screenShot.isFetching ? 'animate-spin' : ''}`}
            onClick={handleRefresh}
          >
            <RiSystemRefreshLine size={13} />
          </button>
        </div>

        <button
          type='button'
          class='size-6 cursor-pointer'
          onClick={panel.toggleExpanded}
        >
          <VsChevronDown />
        </button>
      </div>

      <Show when={panel.expanded()}>
        <FloatingImagePanelPreview
          imageAspectRatio={panel.imageAspectRatio()}
          onImageLoad={panel.handlePreviewImageLoad}
          blob={screenShot.data}
          refreshing={screenShot.isFetching}
        />
      </Show>
    </div>
  )
}
