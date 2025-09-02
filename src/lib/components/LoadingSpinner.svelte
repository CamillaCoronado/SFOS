<script lang="ts">
  export let size = 20;          // px
  export let label = 'Loading…'; // for screen readers
</script>

<span class="inline-flex items-center gap-2" role="status" aria-live="polite" aria-busy="true">
  <svg
    class="animate-spin"
    viewBox="0 0 24 24"
    style="width:{size}px;height:{size}px"
    aria-hidden="true"
  >
    <circle cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4" fill="none" opacity="0.25" />
    <path d="M4 12a8 8 0 0 1 8-8v4a4 4 0 0 0-4 4H4z" fill="currentColor" opacity="0.75" />
  </svg>
  <span class="sr-only">{label}</span>
</span>
