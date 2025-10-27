<script lang="ts">
  import { goto } from '$app/navigation';
  import NotificationsBell from '$lib/components/NotificationsBell.svelte';
  import { currentUser } from '$lib/stores/auth/auth';
  import { logout } from '$lib/stores/auth/auth';
  import { onMount } from 'svelte';
  import { doc, getDoc } from 'firebase/firestore';
  import { db } from '$lib/firebase';

  export let logoSrc: string = '/logo.png';
  export let logoHref: string = '/';
  export let showAuth: boolean = true;
  export let sticky: boolean = true;
  export let transparent: boolean = false;
  export let className: string = '';

  let showProfileMenu = false;
  let displayName = '';
  let avatarUrl = '';

  function openSettings() { goto('/dashboard/settings'); }

  const headerBase =
    'w-full top-0 z-50 ' +
    (transparent ? 'bg-transparent' : 'bg-white shadow-sm') +
    (sticky ? ' fixed' : ' static');

  // load profile data
  $: if ($currentUser) {
    loadProfile();
  }

  async function loadProfile() {
    if (!$currentUser) return;
    
    try {
      const userDoc = await getDoc(doc(db, 'users', $currentUser.id));
      if (userDoc.exists()) {
        const data = userDoc.data();
        displayName = data.displayName || '';
        avatarUrl = data.avatarUrl || '';
      }
    } catch (err) {
      console.error('Failed to load profile:', err);
    }
  }
</script>

<header class={`${headerBase} ${className}`}>
  <div class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
    <div class="flex h-16 items-center justify-between">
      <!-- Logo / Brand -->
      <button onclick={() => goto(logoHref)} class="flex items-center">
        <img alt="logo" src={logoSrc} class="h-12 w-11 object-cover" />
      </button>

      <!-- Navigation -->
      <div class="flex items-center space-x-6">
        {#if $currentUser}
          <!-- Notifications -->
          <div class="relative">
            <NotificationsBell uid={$currentUser.id} />
          </div>

          <!-- User Menu -->
          <div class="relative">
            <button
              onclick={() => (showProfileMenu = !showProfileMenu)}
              class="flex items-center space-x-2 text-gray-700 hover:text-gray-900 text-sm"
            >
              <img
                src={avatarUrl || $currentUser?.avatar || '/avatar.png'}
                alt="profile"
                class="w-6 h-6 rounded-full bg-gray-300 object-cover"
              />
              <span>{displayName || $currentUser?.username || 'Profile'}</span>
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"/>
              </svg>
            </button>

            {#if showProfileMenu}
              <div class="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-2 z-10">
                <button onclick={() => (window.location.href = '/dashboard')} 
                  class="block w-full text-left px-4 py-2 text-gray-700 hover:bg-gray-50 text-sm">
                  Dashboard
                </button>                
                <button onclick={openSettings} class="block w-full text-left px-4 py-2 text-gray-700 hover:bg-gray-50 text-sm">
                  Settings
                </button>
                <hr class="my-1 border-gray-200" />
                <button onclick={logout} class="block w-full text-left px-4 py-2 text-gray-700 hover:bg-gray-50 text-sm">
                  Logout
                </button>
              </div>
            {/if}
          </div>
        {:else if showAuth}
          <!-- Auth actions -->
          <button
            onclick={() => goto('/auth?mode=login')}
            class="cursor-pointer text-sm text-gray-700 hover:text-gray-900"
          >
            Log in
          </button>
          <button
            onclick={() => goto('/auth?mode=register')}
            class="cursor-pointer rounded-full bg-orange-500 px-4 py-2 text-sm text-white hover:bg-orange-600"
          >
            Sign up
          </button>
        {/if}
      </div>
    </div>
  </div>
</header>