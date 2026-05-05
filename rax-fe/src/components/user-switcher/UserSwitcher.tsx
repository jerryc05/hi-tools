import { createMemo, For } from 'solid-js'
import { DropdownMenu } from '@kobalte/core/dropdown-menu'
import { UserTrigger } from './UserTrigger'
import { UserInfoCard } from './UserInfoCard'
import { UserMenuItem } from './UserMenuItem'
import { deviceInfoResponseSig } from '@/store'
import type { LoginAccount } from '@/types/device-info-response'
import { produce } from 'immer'

export function UserSwitcher() {
  // const [currentUser, setCurrentUser] = createSignal<LoginAccount>(users[0])

  const [deviceInfoResp, setDeviceInfoResp] = deviceInfoResponseSig

  const handleSelectUser = (selected: LoginAccount) => {
    setDeviceInfoResp(state =>
      produce(state, draft => {
        const { account } = draft.appInfo.appSettings
        const oldCurr = account.current
        account.current = selected
        account.loginAccountList?.push(oldCurr)
        account.loginAccountList = account.loginAccountList?.filter(
          x => x.userID != selected.userID,
        )
      }),
    )
  }

  const currAccount = createMemo(
    () => deviceInfoResp().appInfo.appSettings.account.current,
  )
  const otherAccounts = createMemo(
    () => deviceInfoResp().appInfo.appSettings.account.loginAccountList,
  )

  return (
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
              <For each={[currAccount(), ...(otherAccounts() ?? [])]}>
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
  )
}
