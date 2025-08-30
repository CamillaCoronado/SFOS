<script lang="ts">
  import { goto } from '$app/navigation';
  import { projects } from '$lib/stores/projects';
  import { page } from '$app/stores';
  import { createEventDispatcher } from 'svelte';

  export let initial = '';

  const dispatch = createEventDispatcher<{ search: string, filter: string[] }>();

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
    new Set(($projects ?? []).flatMap(p => (p.tags ?? []).map(t => t.trim())))
  ).filter(Boolean).sort((a, b) => a.localeCompare(b));
  
  function onTagsChange(e: Event) {
    const sel = e.currentTarget as HTMLSelectElement;
    const values = Array.from(sel.selectedOptions).map(o => o.value);
    dispatch('filter', values);
  }
   
</script>

<form
  onsubmit={submit}
  class="flex w-full max-w-xl items-center gap-2 px-3 py-2"
>
  <input
    type="search"
    placeholder="Search projects…"
    bind:value={q}
    oninput={handleInput}
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

<div class="relative">
  <svg class="relative top-7 left-2" width="20" height="16" viewBox="0 0 20 16" fill="none" xmlns="http://www.w3.org/2000/svg">
    <line x1="5.12085" y1="1.84065" x2="19.4615" y2="1.84065" stroke="#878686"/>
    <line x1="5.12085" y1="8.21428" x2="19.4615" y2="8.21428" stroke="#878686"/>
    <line x1="5.12085" y1="14.5879" x2="19.4615" y2="14.5879" stroke="#878686"/>
    <circle cx="1.93398" cy="13.4945" r="1.59341" fill="#878686"/>
    <circle cx="1.93398" cy="7.91758" r="1.59341" fill="#878686"/>
    <circle cx="1.93398" cy="2.34066" r="1.59341" fill="#878686"/>
  </svg>
  <select 
  aria-label="tags"
  class="inline-block appearance-none text-center bg-white border border-gray-300 rounded-lg pl-8 py-2 pr-8 focus:outline-none focus:ring-2 focus:ring-blue-500"
  onchange={onTagsChange}>
    <option>Tags</option>
    {#each allTags as tag}
      <option value={tag}>{tag}</option>
    {/each}
  </select>
  <svg class="w-4 h-4 top-7 text-gray-400 absolute right-2 pointer-events-none" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"/>
  </svg>
</div>
