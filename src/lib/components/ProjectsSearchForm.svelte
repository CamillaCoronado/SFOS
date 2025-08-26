<script lang="ts">
  import { goto } from '$app/navigation';
  import { page } from '$app/stores';
  import { createEventDispatcher } from 'svelte';

  export let initial = '';

  const dispatch = createEventDispatcher<{ search: string }>();

  let q = initial;

  function submit(e: Event) {
    e.preventDefault();
    const query = q.trim();
    goto(`/projects${query ? `?q=${encodeURIComponent(query)}` : ''}`);
  }

  function handleInput(e: Event) {
    q = (e.target as HTMLInputElement).value;
    dispatch('search', q);
  }

  // auto-hide "All projects" when already on /projects
  $: onProjectsPage = $page.url.pathname === '/projects';
</script>

<form
  on:submit={submit}
  class="flex w-full max-w-xl items-center gap-2 px-3 py-2"
>
  <input
    type="search"
    placeholder="Search projects…"
    bind:value={q}
    on:input={handleInput}
    class="flex-1 rounded-full border border-transparent bg-white px-4 py-2 text-sm text-gray-800 placeholder-gray-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-500 outline-none"
  />

  <button
    type="submit"
    class="rounded-full cursor-pointer bg-blue-500 px-4 py-2 text-sm font-medium text-white transition hover:bg-blue-600"
  >
    Search
  </button>

  {#if !onProjectsPage}
    <a
      href="/projects"
      class="px-4 py-2 text-sm font-medium text-blue-500 hover:text-blue-600 hover:underline"
    >
      All projects
    </a>
  {/if}
</form>
