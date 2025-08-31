<script context="module" lang="ts">
  export type Needs = {
    eng: number; design: number; data: number; product: number;
    research: number; ops: number; policy: number;
  };
</script>

<script lang="ts">
  export let needs: Needs;

  const rows = [
  ['eng','Developer'], ['design','Designer'], ['data','Data Scientist'],
  ['product','Product Manager'], ['research','Researcher'], ['ops','DevOps'], ['policy','Policy/Legal'],
] as const;

  function inc(k: keyof Needs) { if (needs[k] < 9) needs = { ...needs, [k]: needs[k] + 1 }; }
  function dec(k: keyof Needs) { if (needs[k] > 0) needs = { ...needs, [k]: needs[k] - 1 }; }
</script>

<div class="grid grid-cols-2 gap-3">
  {#each rows as [k, label]}
    <div class="flex items-center justify-between rounded-md border px-3 py-2 {needs[k] ? '' : 'opacity-60'}">
      <span class="text-sm">{label}</span>
      <div class="flex items-center gap-2">
        <button type="button" class="w-7 h-7 border rounded" onclick={() => dec(k)}>–</button>
        <span class="w-6 text-center text-sm">{needs[k]}</span>
        <button type="button" class="w-7 h-7 border rounded" onclick={() => inc(k)}>+</button>
      </div>
    </div>
  {/each}
</div>
