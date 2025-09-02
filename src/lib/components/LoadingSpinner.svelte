<script lang="ts">
  export let size = 28;                 
  export let color = '#6A2AF8';         
  export let label = 'Loading…';
</script>

<span class="inline-flex items-center gap-2" role="status" aria-live="polite" aria-busy="true">
  <svg viewBox="0 0 24 24" style="width:{size}px;height:{size}px" aria-hidden="true">
    <defs>
      <linearGradient id="spinGrad" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0%" stop-color={color}/>
        <stop offset="100%" stop-color="#FF6FD8"/>
      </linearGradient>
    </defs>

    <!-- faint track -->
    <circle cx="12" cy="12" r="9" stroke="currentColor" stroke-width="3" fill="none" opacity="1"/>

    <!-- animated arc -->
    <circle
      cx="12" cy="12" r="9"
      stroke="url(#spinGrad)" stroke-width="3" fill="none"
      stroke-linecap="round"
      class="spinner__arc"
    />

    <!-- tiny dot riding the edge -->
    <circle cx="12" cy="3" r="1.6" fill={color} class="spinner__dot"/>
  </svg>
  <span class="sr-only">{label}</span>
</span>

<style>
  .spinner__arc {
    stroke-dasharray: 80 200;
    stroke-dashoffset: 0;
    transform-origin: 12px 12px;
    animation: spin 1s linear infinite, dash 1.4s ease-in-out infinite;
  }
  .spinner__dot {
    transform-origin: 12px 12px;
    animation: spin 1s linear infinite;
  }
  @keyframes spin { to { transform: rotate(360deg); } }
  @keyframes dash {
    0%   { stroke-dasharray: 1 200;  stroke-dashoffset: 0; }
    50%  { stroke-dasharray: 110 200; stroke-dashoffset: -40; }
    100% { stroke-dasharray: 110 200; stroke-dashoffset: -140; }
  }
</style>
