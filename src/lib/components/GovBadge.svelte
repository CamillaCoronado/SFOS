<script lang="ts">
  export let size: 'xs' | 'sm' = 'xs';
</script>

<span class={`inline-flex items-center rounded-full border border-blue-200 bg-blue-50 text-blue-700
  ${size === 'xs' ? 'px-1.5 py-0.5 text-[10px]' : 'px-2 py-0.5 text-xs'}`}>
  GOV
</span>
