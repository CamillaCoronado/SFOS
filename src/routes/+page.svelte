<!-- src/routes/+page.svelte -->
<script lang="ts">
  // Lightweight state for demo-only interactions
  let email = '';
  let q = '';
  const trending = [
    'housing', 'transport', 'climate', 'education', 'public-space', 'mutual-aid', 'safety'
  ];

  function submitWaitlist(e: Event) {
    e.preventDefault();
    // TODO: wire to real waitlist action
    email = '';
  }

  function submitSearch(e: Event) {
    e.preventDefault();
    // TODO: wire to real navigation (e.g., goto(`/projects?q=${encodeURIComponent(q)}`))
  }
</script>

<div class="min-h-screen bg-gray-50 text-gray-900">
  <!-- HERO -->
  <section class="relative overflow-hidden">
    <div class="absolute inset-0 -z-10">
      <div class="absolute -top-32 -right-20 h-72 w-72 rounded-full blur-3xl opacity-25 bg-gradient-to-tr from-emerald-400 to-cyan-500"></div>
      <div class="absolute -bottom-24 -left-10 h-72 w-72 rounded-full blur-3xl opacity-30 bg-gradient-to-tr from-indigo-500 to-fuchsia-500"></div>
      <div class="absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(255,255,255,0.6),rgba(255,255,255,0))]"></div>
    </div>

    <div class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 pt-24 pb-16 sm:pb-24">
      <div class="flex flex-col items-center text-center gap-6">
        <span class="inline-flex items-center gap-2 rounded-full bg-white/80 px-3 py-1 text-xs sm:text-sm shadow-sm ring-1 ring-black/5">
          <span class="inline-block h-2 w-2 rounded-full bg-emerald-500 animate-pulse"></span>
          Live: 128 projects active this week
        </span>

        <h1 class="text-4xl sm:text-6xl font-extrabold tracking-tight">
          Build the city you live in.
        </h1>
        <p class="max-w-2xl text-base sm:text-lg text-gray-600">
          SFOS is where neighbors launch small, useful projects—then grow them with votes, contributors, and micro‑grants.
        </p>

        <div class="flex flex-col sm:flex-row items-center gap-3 w-full sm:w-auto">
          <form on:submit|preventDefault={submitSearch} class="w-full sm:w-auto flex items-center gap-2">
            <input
              type="search"
              placeholder="Search projects, tags, or neighborhoods"
              bind:value={q}
              class="w-full sm:w-[420px] rounded-xl bg-white shadow-sm ring-1 ring-gray-200 px-4 py-3 text-sm placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
            <button type="submit" class="rounded-xl px-4 py-3 text-sm font-medium bg-indigo-600 text-white hover:bg-indigo-700 active:scale-[.99]">Search</button>
          </form>

          <a href="/projects" class="sm:ml-2 text-sm font-medium text-indigo-700 hover:text-indigo-900">Browse all →</a>
        </div>

        <!-- Trending chips -->
        <div class="flex flex-wrap items-center justify-center gap-2 pt-1">
          {#each trending as t}
            <a href={`/projects?t=${encodeURIComponent(t)}`}
              class="rounded-full border border-gray-200 bg-white px-3 py-1.5 text-xs text-gray-700 hover:border-indigo-300 hover:text-indigo-700">
              #{t}
            </a>
          {/each}
        </div>
      </div>
    </div>
  </section>

<<<<<<< Updated upstream
  <!-- How It Works -->
  <section class="mx-auto px-4 sm:px-6 lg:px-8 mt-8">
    <h2 class="text-3xl font-bold text-gray-900 mb-12">How SFOS Works</h2>
    <div class="space-y-8">
      <!-- Step 1 -->
      <div class="flex items-start space-x-4 border-b pb-8">
        <div class="flex-shrink-0 w-12 h-12 bg-yellow-400 rounded-full flex items-center justify-center">
          <svg class="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 20 20">
            <path d="M11 3a1 1 0 10-2 0v1a1 1 0 102 0V3zM15.657 5.757a1 1 0 00-1.414-1.414l-.707.707a1 1 0 001.414 1.414l.707-.707zM18 10a1 1 0 01-1 1h-1a1 1 0 110-2h1a1 1 0 011 1zM5.05 6.464A1 1 0 106.464 5.05l-.707-.707a1 1 0 00-1.414 1.414l.707.707zM5 10a1 1 0 01-1 1H3a1 1 0 110-2h1a1 1 0 011 1zM8 16v-1a1 1 0 012 0v1a1 1 0 11-2 0zM12 14a1 1 0 00-.707.293l-.707.707a1 1 0 101.414 1.414l.707-.707A1 1 0 0012 14zM4.343 12.343a1 1 0 00-1.414 1.414l.707.707a1 1 0 001.414-1.414l-.707-.707z"/>
          </svg>
        </div>
        <div class="flex-1">
          <h2 class= "text-3xl">Civic Hackers</h2>
          <p class="text-gray-700">
            Explore existing ideas, find teammates, and turn your projects into reality.
            Share your solutions, get direct feedback from government and community experts, and discover more ways to contribute to civic tech across San Francisco. 
            <a href="/learn-more#hackers" class="text-blue-600 hover:underline">learn more</a>.
          </p>
        </div>
      </div>
      
      <!-- Step 2 -->
      <div class="flex items-start space-x-4 border-b pb-8">
        <div class="flex-shrink-0 w-12 h-12 bg-gray-700 rounded-full flex items-center justify-center">
          <svg class="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"/>
          </svg>
        </div>
        <div class="flex-1">
          <h2 class= "text-3xl">Government Employee</h2>
          <p class="text-gray-700">
            Post tech challenges and ideas that civic technologists can tackle.
            Offer your insights to guide projects toward real-world impact and find innovative solutions faster.
            <a href="/learn-more#government" class="text-blue-600 hover:underline">learn more</a>.
          </p>
        </div>
      </div>
      <div class="flex items-start space-x-4 border-b pb-8">
        <div class="flex-shrink-0 w-12 h-12 bg-yellow-400 rounded-full flex items-center justify-center">
          <svg class="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 20 20">
            <path d="M11 3a1 1 0 10-2 0v1a1 1 0 102 0V3zM15.657 5.757a1 1 0 00-1.414-1.414l-.707.707a1 1 0 001.414 1.414l.707-.707zM18 10a1 1 0 01-1 1h-1a1 1 0 110-2h1a1 1 0 011 1zM5.05 6.464A1 1 0 106.464 5.05l-.707-.707a1 1 0 00-1.414 1.414l.707.707zM5 10a1 1 0 01-1 1H3a1 1 0 110-2h1a1 1 0 011 1zM8 16v-1a1 1 0 012 0v1a1 1 0 11-2 0zM12 14a1 1 0 00-.707.293l-.707.707a1 1 0 101.414 1.414l.707-.707A1 1 0 0012 14zM4.343 12.343a1 1 0 00-1.414 1.414l.707.707a1 1 0 001.414-1.414l-.707-.707z"/>
          </svg>
        </div>
        <div class="flex-1">
          <h2 class= "text-3xl">Residents & Civic Organizations</h2>
          <p class="text-gray-700">
            Suggest projects addressing your community’s needs, help shape ongoing initiatives, and let technologists know what would truly benefit your neighborhood.
            <a href="/learn-more#residents" class="text-blue-600 hover:underline">learn more</a>.
          </p>
        </div>
=======
  <!-- FEATURED PROJECTS -->
  <section class="py-10 sm:py-14">
    <div class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
      <div class="flex items-end justify-between">
        <h2 class="text-xl sm:text-2xl font-bold">Featured now</h2>
        <a href="/projects?sort=popular" class="text-sm text-indigo-700 hover:text-indigo-900">See more</a>
>>>>>>> Stashed changes
      </div>

      <div class="mt-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        <!-- Card 1 -->
        <article class="group rounded-2xl bg-white ring-1 ring-gray-200 shadow-sm hover:shadow-md transition overflow-hidden">
          <div class="aspect-[16/9] bg-gradient-to-br from-amber-300 to-pink-300"></div>
          <div class="p-4">
            <div class="flex items-center gap-2 text-xs text-gray-500">
              <span class="inline-flex items-center gap-1 rounded-full bg-emerald-50 text-emerald-700 px-2 py-0.5 ring-1 ring-emerald-100">▲ 236</span>
              <span>SoMa</span>
              <span>•</span>
              <span>public-space</span>
            </div>
            <h3 class="mt-2 text-base font-semibold group-hover:text-indigo-700">Parklet Kit: plug‑and‑play seating for small shops</h3>
            <p class="mt-1 text-sm text-gray-600 line-clamp-2">Volunteer‑built modules that bolt into a curb space; micro‑grant covers lumber and paint.</p>
          </div>
        </article>

        <!-- Card 2 -->
        <article class="group rounded-2xl bg-white ring-1 ring-gray-200 shadow-sm hover:shadow-md transition overflow-hidden">
          <div class="aspect-[16/9] bg-gradient-to-br from-cyan-300 to-indigo-300"></div>
          <div class="p-4">
            <div class="flex items-center gap-2 text-xs text-gray-500">
              <span class="inline-flex items-center gap-1 rounded-full bg-emerald-50 text-emerald-700 px-2 py-0.5 ring-1 ring-emerald-100">▲ 189</span>
              <span>Mission</span>
              <span>•</span>
              <span>transport</span>
            </div>
            <h3 class="mt-2 text-base font-semibold group-hover:text-indigo-700">Green‑wave bike lights on Valencia</h3>
            <p class="mt-1 text-sm text-gray-600 line-clamp-2">Community data + city partnership to sync signals for 13–16 mph cycling.</p>
          </div>
        </article>

        <!-- Card 3 -->
        <article class="group rounded-2xl bg-white ring-1 ring-gray-200 shadow-sm hover:shadow-md transition overflow-hidden">
          <div class="aspect-[16/9] bg-gradient-to-br from-lime-300 to-emerald-300"></div>
          <div class="p-4">
            <div class="flex items-center gap-2 text-xs text-gray-500">
              <span class="inline-flex items-center gap-1 rounded-full bg-emerald-50 text-emerald-700 px-2 py-0.5 ring-1 ring-emerald-100">▲ 121</span>
              <span>Bayview</span>
              <span>•</span>
              <span>mutual-aid</span>
            </div>
            <h3 class="mt-2 text-base font-semibold group-hover:text-indigo-700">Back‑yard produce boxes</h3>
            <p class="mt-1 text-sm text-gray-600 line-clamp-2">Match gardeners with nearby fridges; weekly swaps reduce food waste.</p>
          </div>
        </article>
      </div>
    </div>
  </section>

  <!-- HOW IT WORKS -->
  <section class="py-10 sm:py-14 bg-white">
    <div class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
      <h2 class="text-xl sm:text-2xl font-bold">How it works</h2>
      <ol class="mt-6 grid grid-cols-1 sm:grid-cols-3 gap-5">
        <li class="rounded-2xl ring-1 ring-gray-200 p-5">
          <div class="text-xs font-medium text-gray-500">Step 1</div>
          <h3 class="mt-1 font-semibold">Post a project</h3>
          <p class="mt-1 text-sm text-gray-600">Idea, neighborhood, needs. Keep it small and shippable.</p>
        </li>
        <li class="rounded-2xl ring-1 ring-gray-200 p-5">
          <div class="text-xs font-medium text-gray-500">Step 2</div>
          <h3 class="mt-1 font-semibold">Gather momentum</h3>
          <p class="mt-1 text-sm text-gray-600">Votes surface demand; comments find collaborators.</p>
        </li>
        <li class="rounded-2xl ring-1 ring-gray-200 p-5">
          <div class="text-xs font-medium text-gray-500">Step 3</div>
          <h3 class="mt-1 font-semibold">Build & show progress</h3>
          <p class="mt-1 text-sm text-gray-600">Ship updates; unlock micro‑grants as milestones land.</p>
        </li>
      </ol>
    </div>
  </section>

  <!-- STATS / SOCIAL PROOF -->
  <section class="py-10 sm:py-14">
    <div class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
      <div class="grid grid-cols-1 sm:grid-cols-3 gap-5">
        <div class="rounded-2xl bg-white ring-1 ring-gray-200 p-6 text-center">
          <div class="text-3xl font-extrabold">3,128</div>
          <div class="mt-1 text-sm text-gray-600">neighbors building</div>
        </div>
        <div class="rounded-2xl bg-white ring-1 ring-gray-200 p-6 text-center">
          <div class="text-3xl font-extrabold">412</div>
          <div class="mt-1 text-sm text-gray-600">active projects</div>
        </div>
        <div class="rounded-2xl bg-white ring-1 ring-gray-200 p-6 text-center">
          <div class="text-3xl font-extrabold">68%</div>
          <div class="mt-1 text-sm text-gray-600">ship rate last 90 days</div>
        </div>
      </div>
    </div>
  </section>

  <!-- CTA -->
  <section class="py-12 sm:py-16">
    <div class="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
      <div class="rounded-3xl bg-gradient-to-br from-indigo-600 to-fuchsia-600 p-1 shadow-md">
        <div class="rounded-[22px] bg-white p-6 sm:p-8">
          <h3 class="text-xl sm:text-2xl font-bold">Join the first 1,000</h3>
          <p class="mt-1 text-sm text-gray-600">Get early access, monthly project drops, and community build‑days.</p>
          <form on:submit|preventDefault={submitWaitlist} class="mt-4 flex flex-col sm:flex-row gap-3">
            <input type="email" required placeholder="you@citymail.com" bind:value={email}
                   class="w-full rounded-xl bg-white shadow-sm ring-1 ring-gray-200 px-4 py-3 text-sm placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500" />
            <button type="submit" class="rounded-xl px-4 py-3 text-sm font-medium bg-indigo-600 text-white hover:bg-indigo-700 active:scale-[.99]">Get updates</button>
          </form>
          <p class="mt-2 text-xs text-gray-500">We’ll only email about launches and community days.</p>
        </div>
      </div>
    </div>
  </section>

  <!-- FOOTER -->
  <footer class="border-t border-gray-200 py-10">
    <div class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
      <div class="flex flex-col sm:flex-row items-center justify-between gap-4 text-sm text-gray-600">
        <div class="flex items-center gap-2">
          <img src="/logo.png" alt="SFOS" class="h-6 w-6" />
          <span>SFOS — community projects for San Francisco</span>
        </div>
        <nav class="flex items-center gap-4">
          <a href="/projects" class="hover:text-gray-900">Projects</a>
          <a href="/about" class="hover:text-gray-900">About</a>
          <a href="/guidelines" class="hover:text-gray-900">Guidelines</a>
        </nav>
      </div>
    </div>
  </footer>
</div>

<style>
  /* Optional: line clamp utility if @tailwind/typography isn't used */
  .line-clamp-2{display:-webkit-box;-webkit-line-clamp:2;-webkit-box-orient:vertical;overflow:hidden}
</style>
