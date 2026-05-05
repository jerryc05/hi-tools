import { Show } from 'solid-js'
import { DropdownMenu } from '@kobalte/core/dropdown-menu'
import type { LoginAccount } from '@/types/device-info-response'

type UserMenuItemProps = {
  user: LoginAccount
  active: boolean
  onSelect: (user: LoginAccount) => void
}

export function UserMenuItem(props: UserMenuItemProps) {
  return (
    <DropdownMenu.Item
      class={`flex cursor-pointer items-center justify-between rounded-xl px-3 py-3 outline-none transition ${
        props.active ?
          'bg-slate-900 text-white'
        : 'bg-white text-slate-700 hover:bg-slate-50 focus:bg-slate-50'
      }`}
      onSelect={() => props.onSelect(props.user)}
    >
      <div class='min-w-0'>
        <p class='truncate text-sm font-medium'>{props.user.nickname}</p>

        <p
          class={`text-xs ${
            props.active ? 'text-slate-300' : 'text-slate-400'
          }`}
        >
          UID: {props.user.userID} · {`>${props.user.userID}<`}
        </p>
      </div>

      <Show when={props.active}>
        <span class='ml-3 shrink-0 rounded-full bg-white/15 px-2 py-0.5 text-xs'>
          当前
        </span>
      </Show>
    </DropdownMenu.Item>
  )
}
