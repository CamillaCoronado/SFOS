<script lang="ts">
	import '../app.css';
	import { loadProjects } from '$lib/stores/projects';
	import { onMount } from 'svelte';
	import { isLoading } from '$lib/stores/loading';
  	import LoadingSpinner from '$lib/components/LoadingSpinner.svelte';
	import { currentUser } from '$lib/stores/auth/auth';
	import type { LayoutData } from './$types';

	let { data, children }: { data: LayoutData, children?: any } = $props();

	// hydrate store immediately with server data if available
	if (data.serverUser && !$currentUser) {
		currentUser.set({
			id: data.serverUser.uid,
			username: data.serverUser.email?.split('@')[0] || 'user',
			email: data.serverUser.email || '',
			joinedAt: new Date()
		});
	}

  onMount(() => {
    let unsub: (() => void) | undefined;

    loadProjects()
      .then((u) => { unsub = u; })
      .catch((e) => console.error('loadProjects failed', e));

    return () => { unsub?.(); };
  });
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