import type { LoginAccount } from '@/types/device-info-response'

type UserTriggerProps = {
  user: LoginAccount
}

export function UserTrigger(props: UserTriggerProps) {
  return (
    <div class='flex h-11 min-w-[220px] items-center justify-between rounded-xl border border-slate-200 bg-white px-4 shadow-sm transition hover:border-slate-300 hover:shadow-md'>
      <div class='flex min-w-0 flex-col items-start'>
        <span class='max-w-[150px] truncate text-sm font-medium text-slate-800'>
          {props.user.nickname}
        </span>

        <span class='text-xs text-slate-400'>UID: {props.user.userID}</span>
      </div>

      <svg
        class='h-4 w-4 text-slate-400'
        viewBox='0 0 20 20'
        fill='currentColor'
        aria-hidden='true'
      >
        <path
          fill-rule='evenodd'
          d='M5.23 7.21a.75.75 0 011.06.02L10 11.17l3.71-3.94a.75.75 0 111.08 1.04l-4.25 4.5a.75.75 0 01-1.08 0l-4.25-4.5a.75.75 0 01.02-1.06z'
          clip-rule='evenodd'
        />
      </svg>
    </div>
  )
}
