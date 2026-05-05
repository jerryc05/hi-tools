import type { LoginAccount } from '@/types/device-info-response'

type UserInfoCardProps = {
  user: LoginAccount
}

export function UserInfoCard(props: UserInfoCardProps) {
  return (
    <div class='rounded-xl bg-slate-50 p-4'>
      <div class='flex items-center gap-3'>
        <div class='flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-slate-900 text-sm font-semibold text-white'>
          {props.user.nickname.slice(0, 1)}
        </div>

        <div class='min-w-0'>
          <p class='truncate text-sm font-semibold text-slate-900'>
            {props.user.nickname}
          </p>

          <p class='text-xs text-slate-500'>UID: {props.user.userID}</p>
        </div>
      </div>

      <p class='mt-3 text-sm text-slate-500'>
        备注：{`>${props.user.userID}<`}
      </p>
    </div>
  )
}
