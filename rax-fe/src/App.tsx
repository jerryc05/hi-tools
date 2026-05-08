import { FloatingImagePanel } from '@/components/floating-image-panel/FloatingImagePanel'
import { UserSwitcher } from '@/components/user-switcher/UserSwitcher'

export default function App() {
  return (
    <div class='bg-slate-50 min-h-screen text-slate-900'>
      <header class='flex justify-end items-center px-4 h-16'>
        <UserSwitcher />
      </header>

      <main class='min-h-[calc(100vh-4rem)]'>{/* 其他区域暂时留白 */}</main>

      <FloatingImagePanel />
    </div>
  )
}
