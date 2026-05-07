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

/*


import { createResource, createSignal, onCleanup, onMount } from "solid-js";

function PollingComponent() {
  // 1. 定义一个自增的触发器
  const [track, setTrack] = createSignal(0);

  // 2. 将触发器作为 Source 传入。只要 track() 变了，fetcher 就会执行
  const [data] = createResource(track, async () => {
    console.log("正在请求最新 DID...");
    const res = await fetch("/api/info");
    return res.json();
  });

  let timer;

  const startPolling = () => {
    if (timer) return;
    timer = setInterval(() => {
      // 只有在页面可见时才触发
      if (document.visibilityState === "visible") {
        setTrack(t => t + 1);
      }
    }, 3000);
  };

  const stopPolling = () => {
    clearInterval(timer);
    timer = null;
  };

  const handleVisibilityChange = () => {
    if (document.visibilityState === "visible") {
      // 用户切回来了：立即刷新一次，并确保轮询开启
      setTrack(t => t + 1);
      startPolling();
    } else {
      // 用户切走了：停止计时器，节省性能
      stopPolling();
    }
  };

  onMount(() => {
    startPolling();
    document.addEventListener("visibilitychange", handleVisibilityChange);
  });

  onCleanup(() => {
    stopPolling();
    document.removeEventListener("visibilitychange", handleVisibilityChange);
  });

  return (
    <div>
      <Show when={!data.loading} fallback={<p>加载中...</p>}>
        <p>当前设备: {data()?.did}</p>
      </Show>
    </div>
  );
}





















function createPollingResource(fetcher, options = { interval: 3000 }) {
  const [track, setTrack] = createSignal(0);
  const [data, actions] = createResource(track, fetcher);

  onMount(() => {
    const i = setInterval(() => {
      if (document.visibilityState === "visible") setTrack(t => t + 1);
    }, options.interval);

    const viewHandler = () => {
      if (document.visibilityState === "visible") setTrack(t => t + 1);
    };

    document.addEventListener("visibilitychange", viewHandler);
    onCleanup(() => {
      clearInterval(i);
      document.removeEventListener("visibilitychange", viewHandler);
    });
  });

  return [data, actions];
}

*/
