<script lang="ts">
	import '../app.css';
	import favicon from '$lib/assets/favicon.svg';
	import { loadProjects } from '$lib/stores/projects';
	import { onMount } from 'svelte';

onMount(() => {
  loadProjects();
});

	let { children } = $props();
</script>

<svelte:head>
	<link rel="icon" href={favicon} />
</svelte:head>

{@render children?.()}
