import { createSignal, For, Show } from 'solid-js'

type User = {
  uid: string
  name: string
  remark: string
}

const users: User[] = [
  {
    uid: '100001',
    name: 'Alice Chen',
    remark: '产品负责人',
  },
  {
    uid: '100002',
    name: 'Bob Lee',
    remark: '前端开发',
  },
  {
    uid: '100003',
    name: 'Carol Wang',
    remark: '设计协作方',
  },
]

export default function App() {
  const [currentUser, setCurrentUser] = createSignal<User>(users[0])
  const [open, setOpen] = createSignal(false)

  const switchUser = (user: User) => {
    setCurrentUser(user)
    setOpen(false)
  }

  return (
    <div class='min-h-screen bg-slate-50 text-slate-900'>
      <header class='flex h-16 items-center justify-end px-8'>
        <div class='relative'>
          <button
            type='button'
            onClick={() => setOpen(!open())}
            class='flex h-11 min-w-[220px] items-center justify-between rounded-xl border border-slate-200 bg-white px-4 shadow-sm transition hover:border-slate-300 hover:shadow-md'
          >
            <div class='flex min-w-0 flex-col items-start'>
              <span class='max-w-[150px] truncate text-sm font-medium text-slate-800'>
                {currentUser().name}
              </span>
              <span class='text-xs text-slate-400'>
                UID: {currentUser().uid}
              </span>
            </div>

            <svg
              class={`h-4 w-4 text-slate-400 transition-transform ${
                open() ? 'rotate-180' : ''
              }`}
              viewBox='0 0 20 20'
              fill='currentColor'
            >
              <path
                fill-rule='evenodd'
                d='M5.23 7.21a.75.75 0 011.06.02L10 11.17l3.71-3.94a.75.75 0 111.08 1.04l-4.25 4.5a.75.75 0 01-1.08 0l-4.25-4.5a.75.75 0 01.02-1.06z'
                clip-rule='evenodd'
              />
            </svg>
          </button>

          <Show when={open()}>
            <div class='absolute right-0 z-20 mt-3 w-80 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-xl'>
              <div class='border-b border-slate-100 px-5 py-4'>
                <p class='text-xs font-medium uppercase tracking-wide text-slate-400'>
                  当前用户
                </p>

                <div class='mt-3 rounded-xl bg-slate-50 p-4'>
                  <div class='flex items-center gap-3'>
                    <div class='flex h-10 w-10 items-center justify-center rounded-full bg-slate-900 text-sm font-semibold text-white'>
                      {currentUser().name.slice(0, 1)}
                    </div>

                    <div class='min-w-0'>
                      <p class='truncate text-sm font-semibold text-slate-900'>
                        {currentUser().name}
                      </p>
                      <p class='text-xs text-slate-500'>
                        UID: {currentUser().uid}
                      </p>
                    </div>
                  </div>

                  <p class='mt-3 text-sm text-slate-500'>
                    备注：{currentUser().remark}
                  </p>
                </div>
              </div>

              <div class='px-5 py-4'>
                <p class='mb-3 text-xs font-medium uppercase tracking-wide text-slate-400'>
                  切换用户
                </p>

                <div class='space-y-2'>
                  <For each={users}>
                    {user => {
                      const active = () => user.uid === currentUser().uid

                      return (
                        <button
                          type='button'
                          onClick={() => switchUser(user)}
                          class={`flex w-full items-center justify-between rounded-xl px-3 py-3 text-left transition ${
                            active() ?
                              'bg-slate-900 text-white'
                            : 'bg-white text-slate-700 hover:bg-slate-50'
                          }`}
                        >
                          <div class='min-w-0'>
                            <p class='truncate text-sm font-medium'>
                              {user.name}
                            </p>
                            <p
                              class={`text-xs ${
                                active() ? 'text-slate-300' : 'text-slate-400'
                              }`}
                            >
                              UID: {user.uid} · {user.remark}
                            </p>
                          </div>

                          <Show when={active()}>
                            <span class='ml-3 rounded-full bg-white/15 px-2 py-0.5 text-xs'>
                              当前
                            </span>
                          </Show>
                        </button>
                      )
                    }}
                  </For>
                </div>
              </div>
            </div>
          </Show>
        </div>
      </header>

      <main class='min-h-[calc(100vh-4rem)]'>{/* 其他区域暂时留白 */}</main>
    </div>
  )
}
