import { DropdownMenu } from '@kobalte/core/dropdown-menu'
import { createMemo, For, Show } from 'solid-js'
import { useAccountInfo } from '@/store'
import type { LoginAccount } from '@/types/device-info-response'
import { UserInfoCard } from './UserInfoCard'
import { UserMenuItem } from './UserMenuItem'
import { UserTrigger } from './UserTrigger'

export function UserSwitcher() {
  // const [currentUser, setCurrentUser] = createSignal<LoginAccount>(users[0])

  const query = useAccountInfo()

  const handleSelectUser = (_selected: LoginAccount) => {}

  const currAccount = createMemo(() => query.data?.current!)
  const otherAccounts = createMemo(() => query.data?.loginAccountList)

  return (
    <Show when={!!query.data} fallback='loading...'>
      <DropdownMenu placement='bottom-end'>
        <DropdownMenu.Trigger class='outline-none'>
          <UserTrigger user={currAccount()} />
        </DropdownMenu.Trigger>

        <DropdownMenu.Portal>
          <DropdownMenu.Content class='z-50 mt-3 w-80 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-xl outline-none'>
            <section class='border-b border-slate-100 px-5 py-4'>
              <p class='text-xs font-medium uppercase tracking-wide text-slate-400'>
                当前用户
              </p>

              <div class='mt-3'>
                <UserInfoCard user={currAccount()} />
              </div>
            </section>

            <section class='px-5 py-4'>
              <p class='mb-3 text-xs font-medium uppercase tracking-wide text-slate-400'>
                切换用户
              </p>

              <div class='space-y-2'>
                <For each={otherAccounts() ?? []}>
                  {user => (
                    <UserMenuItem
                      user={user}
                      active={user.userID === currAccount().userID}
                      onSelect={handleSelectUser}
                    />
                  )}
                </For>
              </div>
            </section>
          </DropdownMenu.Content>
        </DropdownMenu.Portal>
      </DropdownMenu>
    </Show>
  )
}
