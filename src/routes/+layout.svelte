<script lang="ts">
	import '../app.css';
	import favicon from '$lib/assets/favicon.svg';
	import { loadProjects } from '$lib/stores/projects';
	import { onMount } from 'svelte';
	import { isLoading } from '$lib/stores/loading';
  	import LoadingSpinner from '$lib/components/LoadingSpinner.svelte';

  onMount(() => {
    let unsub: (() => void) | undefined;

    // loadProjects resolves after first snapshot and gives us the unsubscribe
    loadProjects()
      .then((u) => { unsub = u; })
      .catch((e) => console.error('loadProjects failed', e));

    return () => { unsub?.(); };
  });

let { children } = $props();
</script>

<svelte:head>
	<link rel="icon" type="image/png" href="/favicon.png" sizes="32x32" />
</svelte:head>

{@render children?.()}
{#if $isLoading}
  <div class="fixed inset-0 z-50 grid place-items-center bg-black/20 backdrop-blur-sm">
    <div class="rounded-xl bg-white px-4 py-3 shadow">
      <LoadingSpinner size={28} label="Loading…" />
    </div>
  </div>
{/if}
