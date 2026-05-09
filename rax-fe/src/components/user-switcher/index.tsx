import { DropdownMenu } from '@kobalte/core/dropdown-menu'
import { FaSolidCircleNotch } from 'solid-icons/fa'
import { createMemo, createSignal, For, Show } from 'solid-js'
import { toast } from 'solid-sonner'
import { useChangeAccount } from '@/services/change-account'
import { useAccountInfo } from '@/services/device-info'
import type { AccountInfo } from '@/types/device-info-response'
import { UserMenuItem } from './UserMenuItem'
import { UserMiniBar } from './UserMiniBar'

export function UserSwitcher() {
  const accountInfo = useAccountInfo()
  const changeAccount = useChangeAccount()

  const handleSelectUser = async (selected: AccountInfo) => {
    try {
      const data = await changeAccount.mutateAsync(selected)
      toast.success(JSON.stringify(data))
    } catch (err) {
      console.error(err)
      toast.error(JSON.stringify(err))
    } finally {
      setDropDownOpen(false)
    }
  }

  const currAccount = createMemo(() => accountInfo.data?.current!)
  const otherAccounts = createMemo(() => accountInfo.data?.loginAccountList)

  const [dropDownOpen, setDropDownOpen] = createSignal(false)

  return (
    <Show when={!!accountInfo.data} fallback='loading...'>
      <DropdownMenu
        placement='bottom-end'
        open={dropDownOpen()}
        onOpenChange={setDropDownOpen}
      >
        <DropdownMenu.Trigger class='cursor-pointer'>
          <UserMiniBar account={currAccount()} />
        </DropdownMenu.Trigger>

        <DropdownMenu.Portal>
          <DropdownMenu.Content class='z-50 bg-white shadow-xl mt-2 border border-slate-200 rounded-2xl'>
            <section class='px-5 py-4'>
              <p class='mb-3 font-medium text-slate-400 text-xs uppercase tracking-wide'>
                All accounts
              </p>

              <div class='relative flex justify-center items-center'>
                <Show when={changeAccount.isPending}>
                  <FaSolidCircleNotch class='absolute size-12 animate-spin' />
                </Show>
                <div
                  class={`space-y-2 ${changeAccount.isPending ? 'invisible' : ''}`}
                >
                  <For each={otherAccounts() ?? []}>
                    {account => (
                      <DropdownMenu.Item
                        closeOnSelect={false}
                        onSelect={() => handleSelectUser(account)}
                      >
                        <UserMenuItem
                          account={account}
                          isActive={account.userID === currAccount().userID}
                        />
                      </DropdownMenu.Item>
                    )}
                  </For>
                </div>
              </div>
            </section>
          </DropdownMenu.Content>
        </DropdownMenu.Portal>
      </DropdownMenu>
    </Show>
  )
}
