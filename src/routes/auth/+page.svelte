<!-- src/routes/auth/+page.svelte -->
<script lang="ts">
  import { login, register } from '$lib/stores/auth/auth';
  import { goto } from '$app/navigation';
  import { page } from '$app/stores';
  
  let isLogin = true;
  let email = '';
  let password = '';
  let username = '';
  let loading = false;
  let error = '';
  
  // Check if we should default to register mode
  $: if ($page.url.searchParams.get('mode') === 'register') {
    isLogin = false;
  }
  
  async function handleSubmit() {
    if (loading) return;
    
    loading = true;
    error = '';
    
    try {
      let result;
      
      if (isLogin) {
        result = await login(email, password);
      } else {
        if (!username.trim()) {
          error = 'Username is required';
          loading = false;
          return;
        }
        result = await register(username, email, password);
      }

      
      
      if (result.success) {
        // Redirect to dashboard or previous page
        const redirect = $page.url.searchParams.get('redirect') || '/dashboard';
        goto(redirect);
      } else {
        error = result.error || 'Something went wrong';
      }
    } catch (e) {
      error = 'Something went wrong';
    }
    
    loading = false;
  }
  
  function toggleMode() {
    isLogin = !isLogin;
    error = '';
    // Clear form
    email = '';
    password = '';
    username = '';
  }
</script>

<svelte:head>
  <title>{isLogin ? 'Log In' : 'Sign Up'} - SFOS</title>
</svelte:head>

<div class="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
  <!-- Header -->
  <div class="sm:mx-auto sm:w-full sm:max-w-md">
    <div class="flex justify-center">
      <div class="w-12 h-12 bg-orange-500 rounded-full"></div>
    </div>
    <h2 class="mt-6 text-center text-3xl font-bold text-gray-900">
      {isLogin ? 'Sign in to your account' : 'Create your account'}
    </h2>
    <p class="mt-2 text-center text-sm text-gray-600">
      {isLogin ? "Don't have an account?" : 'Already have an account?'}
      <button 
        on:click={toggleMode} 
        class="font-medium text-orange-600 hover:text-orange-500"
      >
        {isLogin ? 'Sign up' : 'Sign in'}
      </button>
    </p>
  </div>

  <!-- Form -->
  <div class="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
    <div class="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
      <form on:submit|preventDefault={handleSubmit} class="space-y-6">
        {#if !isLogin}
          <div>
            <label for="username" class="block text-sm font-medium text-gray-700">
              Username
            </label>
            <div class="mt-1">
              <input
                id="username"
                type="text"
                bind:value={username}
                required={!isLogin}
                class="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md placeholder-gray-400 focus:outline-none focus:ring-orange-500 focus:border-orange-500 sm:text-sm"
                placeholder="johndoe"
              />
            </div>
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

      {#if isLogin}
        <div class="mt-6">
          <div class="bg-blue-50 border border-blue-200 rounded-md p-4">
            <h3 class="text-sm font-medium text-blue-800 mb-2">Demo Accounts</h3>
            <div class="text-xs text-blue-700 space-y-1">
              <p><strong>john@example.com</strong> - password</p>
              <p><strong>sarah@example.com</strong> - password</p>
              <p><strong>alex@example.com</strong> - password</p>
            </div>
          </div>
        </div>
      {/if}
    </div>
  </div>
</div>