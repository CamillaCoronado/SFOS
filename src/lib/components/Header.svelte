<script lang="ts">
  import { goto } from '$app/navigation';

  export let logoSrc: string = '/logo.png';
  export let brand: string = 'SFOS';
  export let logoHref: string = '/';
  export let showAuth: boolean = true;
  export let sticky: boolean = true;
  export let transparent: boolean = false;
  export let className: string = '';

  const headerBase =
    'w-full top-0 z-50 ' +
    (transparent ? 'bg-transparent' : 'bg-white shadow-sm') +
    (sticky ? ' fixed' : ' static');
</script>

<header class={`${headerBase} ${className}`}>
  <div class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
    <div class="flex h-16 items-center justify-between">
      <!-- Logo / Brand -->
      <button onclick={() => goto(logoHref)} class="flex items-center">
        <img alt="logo" src={logoSrc} class="h-8 w-8 object-cover" />
        <span class="ml-2 text-xl font-semibold text-orange-500">{brand}</span>
      </button>

      <!-- Right actions (default auth; can be overridden via slot) -->
      <div class="flex items-center space-x-4">
        <slot name="right">
          {#if showAuth}
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
        </slot>
      </div>
    </div>
  </div>
</header>
