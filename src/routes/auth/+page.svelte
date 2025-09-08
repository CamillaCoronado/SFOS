<!-- src/routes/auth/+page.svelte -->
<script lang="ts">
  import { login, register, type GovOrg } from '$lib/stores/auth/auth';
  import { goto } from '$app/navigation';
  import { page } from '$app/stores';
  import { onMount } from 'svelte';

  let isLogin = true;
  let email = '';
  let password = '';
  let loading = false;
  let error = '';

  // signup org selection
  type UserType = 'civic-hacker' | 'government' | 'resident-org';
  let userType: UserType = 'civic-hacker';

  // map UI selection -> GovOrg used by store
  const toOrg: Record<UserType, GovOrg> = {
    'civic-hacker': 'private',
    'government': 'government',
    'resident-org': 'nonprofit'
  };

  // default to register mode if ?mode=register
  $: if ($page.url.searchParams.get('mode') === 'register') {
    isLogin = false;
  }

  async function handleSubmit() {
    if (loading) return;
    loading = true;
    error = '';

    try {
      const result = isLogin
        ? await login(email, password)
        : await register(email, password, toOrg[userType]); // ← passes org to enable GOV badge

      if (result.success) {
        const redirect = $page.url.searchParams.get('redirect') || '/dashboard';
        goto(redirect);
      } else {
        error = result.error || 'Something went wrong';
      }
    } catch (e: any) {
      error = e?.message ?? 'Something went wrong';
    }

    loading = false;
  }

   onMount(() => {
    const qEmail = $page.url.searchParams.get('email');
    if (qEmail) email = qEmail;
  });

  function toggleMode() {
    isLogin = !isLogin;
    error = '';
    email = '';
    password = '';
    userType = 'civic-hacker';
  }
</script>

<svelte:head>
  <title>{isLogin ? 'Log In' : 'Sign Up'} - SFOS</title>
</svelte:head>

<div class="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
  <div class="sm:mx-auto sm:w-full sm:max-w-md">
    <div class="flex justify-center">
       <a href="/" class="flex items-center gap-2 cursor-pointer">
        <img src="/logo.png" alt="SFOS Logo" class="w-16 h-18 object-cover"/>
      </a>
    </div>
    <h2 class="mt-6 text-center text-3xl font-bold text-gray-900">
      {isLogin ? 'Sign in to your account' : 'Create your account'}
    </h2>
    <p class="cursor-pointer mt-2 text-center text-sm text-gray-600">
      {isLogin ? "Don't have an account?" : 'Already have an account?'}
      <button
        onclick={toggleMode}
        class="cursor-pointer font-medium text-orange-600 hover:text-orange-500"
      >
        {isLogin ? 'Sign up' : 'Sign in'}
      </button>
    </p>
  </div>

  <div class="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
    <div class="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
      <form onsubmit={handleSubmit} class="space-y-6">
        {#if !isLogin}
          <div>
            <span aria-label="choose label" class="block text-sm font-medium text-gray-700 mb-2">
              I am a...
            </span>
            <select bind:value={userType} class="w-full px-3 py-2 border border-gray-300 rounded-md">
              <option value="civic-hacker">Civic Hacker</option>
              <option value="government">Government Employee</option>
              <option value="resident-org">Resident/Civic Organization</option>
            </select>
            <p class="mt-1 text-xs text-gray-500">
              GOV badge auto-enables for verified government emails (you can hide it later).
            </p>
          </div>
        {/if}

        <div>
          <label for="email" class="block text-sm font-medium text-gray-700">
            Email address
          </label>
          <div class="mt-1">
            <input
              id="email"
              type="email"
              bind:value={email}
              required
              autocomplete="email"
              inputmode="email"
              class="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md placeholder-gray-400 focus:outline-none focus:ring-orange-500 focus:border-orange-500 sm:text-sm"
              placeholder="john@example.com"
            />
          </div>
        </div>

        <div>
          <label for="password" class="block text-sm font-medium text-gray-700">
            Password
          </label>
          <div class="mt-1">
            <input
              id="password"
              type="password"
              bind:value={password}
              required
              class="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md placeholder-gray-400 focus:outline-none focus:ring-orange-500 focus:border-orange-500 sm:text-sm"
              placeholder="Password"
            />
          </div>
        </div>

        {#if error}
          <div class="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
            {error}
          </div>
        {/if}

        <div>
          <button
            type="submit"
            disabled={loading}
            class="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-orange-600 hover:bg-orange-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {#if loading}
              <svg class="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              {isLogin ? 'Signing in...' : 'Creating account...'}
            {:else}
              {isLogin ? 'Sign in' : 'Create account'}
            {/if}
          </button>
        </div>
      </form>
    </div>
  </div>
</div>
