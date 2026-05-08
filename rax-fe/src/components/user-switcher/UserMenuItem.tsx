import { DropdownMenu } from '@kobalte/core/dropdown-menu'
import { Show } from 'solid-js'
import type { AccountInfo } from '@/types/device-info-response'

type UserMenuItemProps = {
  user: AccountInfo
  active: boolean
  onSelect: (user: AccountInfo) => void
}

export function UserMenuItem(props: UserMenuItemProps) {
  return (
    <DropdownMenu.Item
      closeOnSelect={false}
      class={`flex cursor-pointer items-center justify-between rounded-xl px-3 py-3 outline-none transition ${
        props.active ?
          'bg-slate-900 text-white'
        : 'bg-white text-slate-700 hover:bg-slate-50 focus:bg-slate-50'
      }`}
      onSelect={() => props.onSelect(props.user)}
    >
      <div  >
        <p class='font-medium text-sm truncate'>{props.user.nickname}</p>
        <p
          class={`mt-1 text-xs ${
            props.active ? 'text-slate-300' : 'text-slate-400'
          }`}
        >
          <span class='select-none'>UID:</span> {props.user.userID}
        </p>
      </div>

      <Show when={props.active}>
        <span class='bg-white/15 ml-3 px-2 py-0.5 rounded-full text-xs shrink-0'>
          Current
        </span>
      </Show>
    </DropdownMenu.Item>
  )
}
