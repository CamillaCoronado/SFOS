<script lang="ts">
  import { goto } from '$app/navigation';
  import { projects } from '$lib/stores/projects';
  import { page } from '$app/stores';
  import { createEventDispatcher } from 'svelte';

  export let initial = '';
  export let showFilters = true;
  const dispatch = createEventDispatcher<{ search: string; filter: string[] }>();

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

  $: onProjectsPage = $page.url.pathname === '/projects';
  $: allTags = Array.from(
    new Set(($projects ?? []).flatMap((p) => (p.tags ?? []).map((t) => t.trim())))
  )
    .filter(Boolean)
    .sort((a, b) => a.localeCompare(b));

  function onTagsChange(e: Event) {
    const sel = e.currentTarget as HTMLSelectElement;
    const values = Array.from(sel.selectedOptions).map((o) => o.value);
    dispatch('filter', values);
  }

</script>

<form
  onsubmit={submit}
  class="flex w-full max-w-3xl flex-wrap items-center gap-2"
>
  <!-- Search -->
  <input
    type="search"
    placeholder="Search projects…"
    bind:value={q}
    oninput={handleInput}
    class="h-10 min-w-0 flex-1 rounded-full border border-gray-200 bg-white px-4 text-sm text-gray-800 placeholder-gray-400 outline-none ring-0 transition focus:border-blue-500 focus:ring-2 focus:ring-blue-500"
  />

   {#if showFilters}
  <!-- Tags (with icon + caret) -->
  <div class="relative h-10">
    <!-- filter icon -->
    <svg
      class="pointer-events-none absolute left-3 top-1/2 h-4 w-5 -translate-y-1/2 text-gray-400"
      viewBox="0 0 20 16"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      <line x1="5.12" y1="1.84" x2="19.46" y2="1.84" stroke="currentColor" />
      <line x1="5.12" y1="8.21" x2="19.46" y2="8.21" stroke="currentColor" />
      <line x1="5.12" y1="14.59" x2="19.46" y2="14.59" stroke="currentColor" />
      <circle cx="1.93" cy="13.49" r="1.59" fill="currentColor" />
      <circle cx="1.93" cy="7.92" r="1.59" fill="currentColor" />
      <circle cx="1.93" cy="2.34" r="1.59" fill="currentColor" />
    </svg>
      <select
        aria-label="tags"
        class="h-10 appearance-none rounded-full border border-gray-200 bg-white pl-10 pr-8 text-sm text-gray-800 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-500"
        onchange={onTagsChange}
      >
        <option>Tags</option>
        {#each allTags as tag}
          <option value={tag}>{tag}</option>
        {/each}
      </select>
    

    <!-- caret -->
    <svg
      class="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      aria-hidden="true"
    >
      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
    </svg>
  </div>
  {/if}

  <!-- Submit -->
  <button
    type="submit"
    class="h-10 shrink-0 rounded-full bg-blue-500 px-4 text-sm font-medium text-white transition hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
  >
    Search
  </button>

  {#if !onProjectsPage}
    <a
      href="/projects"
      class="h-10 shrink-0 rounded-full px-4 text-sm font-medium leading-10 text-blue-600 hover:underline"
    >
      Browse all →
    </a>
  {/if}
</form>
