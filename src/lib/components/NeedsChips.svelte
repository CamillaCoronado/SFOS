<script lang="ts">
  import type { Needs } from './NeedsEditor.svelte';
  export let needs: Needs | undefined;

  const labels: Record<keyof Needs,string> = {
    eng:'Eng', design:'Design', data:'Data/ML', product:'Product',
    research:'Research', ops:'Ops', policy:'Policy/Legal'
  };

  $: pairs = needs
    ? (Object.entries(needs) as [keyof Needs, number][])
        .filter(([,v]) => v > 0)
        .sort((a, b) => a[0].localeCompare(b[0])) // stable alphabetical order
    : [];
</script>

{#if pairs.length}
  <div class="flex flex-wrap gap-2">
    {#each pairs as [k, v]}
      <span class="inline-flex items-center rounded-full bg-gray-100 text-gray-700 px-2 py-0.5 text-xs">
        {v} {labels[k]}
      </span>
    {/each}
  </div>
{/if}
