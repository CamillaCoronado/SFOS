<script lang="ts">
  import { onMount } from 'svelte';
  import { notifications, unreadCount, listenToNotifications, markAllRead, markRead, type Notification } from '$lib/stores/notifications';
  import { goto } from '$app/navigation';

  export let uid: string | null = null;

  let open = false;
  let stop: null | (() => void) = null;

  onMount(() => {
    if (uid) stop = listenToNotifications(uid, 50);
    return () => stop?.();
  });

  async function toggleOpen() {
    open = !open;
    if (open && uid) setTimeout(() => markAllRead(uid), 250);
  }

  function clickItem(n: Notification) {
    if (uid && !n.read) markRead(uid, n.id);
    if (n.projectId) goto(`/projects/${n.projectId}`);
    open = false;
  }
</script>

<button
  type="button"
  class="relative inline-flex items-center justify-center w-10 h-10 rounded-full hover:bg-white/10"
  onclick={(e) => { e.stopPropagation(); toggleOpen(); }}
  aria-label="Notifications"
>
  <!-- Bigger bell, perfectly centered clapper -->
  <svg
  class="w-7 h-7 block"
  viewBox="0 0 24 24"
  fill="none"
  stroke="currentColor"
  stroke-width="1.75"
  stroke-linecap="round"
  stroke-linejoin="round"
  aria-hidden="true"
>
<circle vector-effect="non-scaling-stroke" cx="12" cy="19" r="2.8" />
  <path vector-effect="non-scaling-stroke" d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9" fill="#fff" />
  <!-- was r=1.4 -->
  
</svg>

  {#if $unreadCount > 0}
    <span class="absolute -top-1 -right-1 min-w-4 h-4 px-1 rounded-full bg-red-500 text-white text-[10px] leading-4 text-center">
      {$unreadCount}
    </span>
  {/if}
</button>



{#if open}
  <div class="absolute right-0 mt-2 w-80 rounded-xl bg-white text-gray-900 shadow-xl ring-1 ring-black/5 z-50">
    <div class="p-2 max-h-[60vh] overflow-auto">
      {#if $notifications.length === 0}
        <div class="p-4 text-sm text-gray-500">No notifications yet.</div>
      {:else}
        {#each $notifications as n (n.id)}
          <button
            class="w-full text-left p-3 rounded-lg hover:bg-gray-100 flex gap-3 items-start"
            onclick={() => clickItem(n)}
          >
            <div class="shrink-0">
              {#if n.actor?.avatarUrl}
                <img src={n.actor.avatarUrl} alt="" class="w-8 h-8 rounded-full object-cover" />
              {:else}
                <div class="w-8 h-8 rounded-full bg-gray-200 grid place-items-center text-xs">★</div>
              {/if}
            </div>
            <div class="flex-1">
              <div class="text-sm">{n.message}</div>
              <div class="mt-0.5 text-xs text-gray-500">{n.type}</div>
            </div>
            {#if !n.read}
              <span aria-label="read indicator" class="mt-1 inline-block w-2 h-2 rounded-full bg-blue-500"></span>
            {/if}
          </button>
        {/each}
      {/if}
    </div>
  </div>
{/if}

<style>
  :global(body){ position:relative; }
</style>
