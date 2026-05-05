import { UserSwitcher } from '@/components/user-switcher/UserSwitcher'

export default function App() {
  return (
    <div class='min-h-screen bg-slate-50 text-slate-900'>
      <header class='flex h-16 items-center justify-end px-8'>
        <UserSwitcher />
      </header>

      <main class='min-h-[calc(100vh-4rem)]'>{/* 其他区域暂时留白 */}</main>
    </div>
  )
}
