import { VsChevronDown } from 'solid-icons/vs'
import type { AccountInfo } from '@/types/device-info-response'

type Props = { account: AccountInfo }

export function UserMiniBar(props: Props) {
  return (
    <div class='flex justify-between items-center shadow-sm hover:shadow-md pl-3 border border-slate-200 hover:border-slate-300 rounded-xl min-w-48 h-12 transition'>
      <div class='flex flex-col items-start'>
        <span class='font-medium text-slate-800 text-sm'>
          {props.account.nickname}
        </span>
        <span class='text-slate-400 text-xs'>{props.account.userID}</span>
      </div>

      <div class='px-3 shrink-0'>
        <VsChevronDown />
      </div>
    </div>
  )
}
