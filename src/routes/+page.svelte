<!-- src/routes/+page.svelte -->
<script lang="ts">
  import Header from '$lib/components/Header.svelte';
  import ProjectsSearchForm from '$lib/components/ProjectsSearchForm.svelte';
  import ProjectCard from '$lib/components/ProjectCard.svelte';

  import { projects } from '$lib/stores/projects';
  import { goto } from '$app/navigation';

  let email = '';
  let q = '';
  let selectedTags: string[] = [];

  const trending = [
    'housing', 'transport', 'climate', 'education', 'public-space', 'mutual-aid', 'safety'
  ];
  
  const isVisible = (p: any) => (p.status ?? 'published') !== 'archived';

  $: list = ($projects ?? []).filter(isVisible);
  $: projectsCount = list.filter(p => (p.kind ?? 'project') === 'project').length;
  $: ideasCount    = list.filter(p => p.kind === 'idea').length;
  $: total         = list.length;

  function submitWaitlist(e: Event) {
    e.preventDefault();
    // TODO: wire to real waitlist action
    email = '';
  }

  // Featured = top 3 by score (fallback to first 3)
  $: featured = ($projects ?? [])
    .slice()
    .sort((a, b) => (b.score ?? 0) - (a.score ?? 0))
    .slice(0, 3);

  function goSearch(query: string) {
    const qs = new URLSearchParams();
    if (query?.trim()) qs.set('q', query.trim());
    if (selectedTags.length) qs.set('t', selectedTags.join(','));
    goto(`/projects${qs.toString() ? `?${qs}` : ''}`);
  }
</script>

<div class="min-h-screen bg-gray-50 text-gray-900">
  <!-- HEADER -->
  <Header />

  <!-- HERO -->
  <section class="relative overflow-hidden">
    <div class="absolute inset-0 -z-10">
      <div class="absolute -top-32 -right-20 h-72 w-72 rounded-full blur-3xl opacity-25 bg-gradient-to-tr from-emerald-400 to-cyan-500"></div>
      <div class="absolute -bottom-24 -left-10 h-72 w-72 rounded-full blur-3xl opacity-30 bg-gradient-to-tr from-orange-500 to-fuchsia-500"></div>
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
          SFOS is a platform for residents, government, and civic technologists to collectively find the best ideas for how tech projects can help the city - and to turn those ideas into reality.
        </p>

        <!-- Replaces inline search with your component -->
        <div class="flex flex-col sm:flex-row items-center gap-3 w-full sm:w-auto">
          <ProjectsSearchForm
            initial={q}
            showFilters={false}
            on:search={(e) => { q = e.detail; }}
            on:filter={(e) => { selectedTags = e.detail; }}
          />
        </div>

        <!-- Trending chips -->
        <div class="flex flex-wrap items-center justify-center gap-2 pt-1">
          {#each trending as t}
            <a href={`/projects?t=${encodeURIComponent(t)}`}
              class="rounded-full border border-gray-200 bg-white px-3 py-1.5 text-xs text-gray-700 hover:border-orange-300 hover:text-orange-500">
              #{t}
            </a>
          {/each}
        </div>
      </div>
    </div>
  </section>


<!-- HOW IT WORKS -->
<section class="py-12 sm:py-16 bg-white">
  <div class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
    <h2 class="text-2xl sm:text-3xl font-bold tracking-tight">How it works</h2>

    <ol class="mt-8 grid grid-cols-1 sm:grid-cols-3 gap-5">
      {#each [
        { n: '1', title: 'Post a project', copy: 'Anyone can add an idea or project to the library, and anyone can upvote, downvote, or comment.' },
        { n: '2', title: 'Gather momentum', copy: ' Ideas get discussed and refined into well-scoped projects' },
        { n: '3', title: 'Build & show progress', copy: 'Projects get collaborators, feedback, advisors, and sponsors–and get built' }
      ] as step}
        <li class="rounded-2xl bg-white ring-1 ring-gray-200 p-6">
          <div class="flex items-center gap-3">
            <span class="inline-flex h-8 w-8 items-center justify-center rounded-full bg-orange-500 text-white text-sm font-semibold">
              {step.n}
            </span>
            <h3 class="text-base font-semibold">{step.title}</h3>
          </div>
          <p class="mt-3 text-sm text-gray-600">{step.copy}</p>
        </li>
      {/each}
    </ol>
  </div>
</section>

<!-- WHO IT’S FOR -->
<section class="py-12 sm:py-16">
  <div class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
    <h2 class="text-2xl sm:text-3xl font-bold tracking-tight">Who it’s for</h2>

    <div class="mt-8 grid grid-cols-1 sm:grid-cols-3 gap-5">
      <!-- Civic Hackers -->
      <article class="rounded-2xl bg-white ring-1 ring-gray-200 p-6">
        <div class="flex items-center gap-3">
          <div class="h-10 w-10 rounded-full bg-orange-500/10 text-orange-500 flex items-center justify-center">
            <!-- spark icon -->
            <svg class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
              <path d="M11 3a1 1 0 10-2 0v1a1 1 0 102 0V3zM15.657 5.757a1 1 0 00-1.414-1.414l-.707.707a1 1 0 001.414 1.414l.707-.707zM18 10a1 1 0 01-1 1h-1a1 1 0 110-2h1a1 1 0 011 1zM5.05 6.464A1 1 0 106.464 5.05l-.707-.707a1 1 0 00-1.414 1.414l.707.707z"/>
            </svg>
          </div>
          <h3 class="text-base font-semibold">Civic hackers</h3>
        </div>
        <p class="mt-3 text-sm text-gray-600">
          Explore ideas, find teammates, and ship real tools. 
          <a href="/learn-more#hackers" class="text-orange-600 hover:underline">Learn more</a>.
        </p>
      </article>

      <!-- Government -->
      <article class="rounded-2xl bg-white ring-1 ring-gray-200 p-6">
        <div class="flex items-center gap-3">
          <div class="h-10 w-10 rounded-full bg-orange-500/10 text-orange-500 flex items-center justify-center">
            <!-- pencil -->
            <svg class="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" aria-hidden="true">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                d="M15.232 5.232l3.536 3.536M4 20l4.243-1.061a2 2 0 00.894-.516L19 8.5a2.5 2.5 0 10-3.536-3.536L5.6 14.828a2 2 0 00-.516.894L4 20z"/>
            </svg>
          </div>
          <h3 class="text-base font-semibold">Government staff</h3>
        </div>
        <p class="mt-3 text-sm text-gray-600">
          Post challenges, guide efforts, and accelerate impact.
          <a href="/learn-more#government" class="text-orange-600 hover:underline">Learn more</a>.
        </p>
      </article>

      <!-- Residents -->
      <article class="rounded-2xl bg-white ring-1 ring-gray-200 p-6">
        <div class="flex items-center gap-3">
          <div class="h-10 w-10 rounded-full bg-orange-500/10 text-orange-500 flex items-center justify-center">
            <!-- home/people -->
            <svg class="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" aria-hidden="true">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                d="M3 12l9-7 9 7M5 10v10h14V10M9 21v-6h6v6"/>
            </svg>
          </div>
          <h3 class="text-base font-semibold">Residents & orgs</h3>
        </div>
        <p class="mt-3 text-sm text-gray-600">
          Signal needs, shape initiatives, and track progress.
          <a href="/learn-more#residents" class="text-orange-600 hover:underline">Learn more</a>.
        </p>
      </article>
    </div>
  </div>
</section>

<!-- FEATURED PROJECTS using ProjectCard -->
<section class="py-10 sm:py-14">
  <div class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
    <div class="flex items-end justify-between">
      <h2 class="text-xl sm:text-2xl font-bold">Featured now</h2>
      <a href="/projects?sort=popular" class="text-sm text-orange-500 hover:text-orange-900">See more</a>
    </div>

    <div class="mt-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
      {#if featured.length === 0}
        <!-- graceful empty -->
        <div class="col-span-full rounded-2xl bg-white ring-1 ring-gray-200 p-6 text-center text-sm text-gray-600">
          No featured projects yet. <a href="/projects/new" class="text-orange-600 hover:underline">Start one →</a>
        </div>
      {:else}
        {#each featured as project}
          <ProjectCard {project} variant="popular" />
        {/each}
      {/if}
    </div>
  </div>
</section>


<section class="py-10 sm:py-14">
  <div class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
    <div class="grid grid-cols-1 sm:grid-cols-3 gap-5">
      <div class="rounded-2xl bg-white ring-1 ring-gray-200 p-6 text-center">
        <div class="text-3xl font-extrabold">{projectsCount}</div>
        <div class="mt-1 text-sm text-gray-600">projects</div>
      </div>
      <div class="rounded-2xl bg-white ring-1 ring-gray-200 p-6 text-center">
        <div class="text-3xl font-extrabold">{ideasCount}</div>
        <div class="mt-1 text-sm text-gray-600">ideas</div>
      </div>
      <div class="rounded-2xl bg-white ring-1 ring-gray-200 p-6 text-center">
        <div class="text-3xl font-extrabold">{total}</div>
        <div class="mt-1 text-sm text-gray-600">total contributions</div>
      </div>
    </div>
  </div>
</section>


  <!-- CTA -->
<section class="py-12 sm:py-16">
  <div class="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
    <div class="rounded-3xl bg-gradient-to-br from-orange-600 to-fuchsia-600 p-1 shadow-md">
      <div class="rounded-[22px] bg-white p-6 sm:p-8">
        <h3 class="text-xl sm:text-2xl font-bold">Join SFOS</h3>
        <p class="mt-1 text-sm text-gray-600">
          Sign up to share your ideas, vote on projects, and get invites to community build-days.
        </p>
        <form onsubmit={(e) => submitWaitlist(e)} class="mt-4 flex flex-col sm:flex-row gap-3">
          <input
            type="email"
            required
            placeholder="you@citymail.com"
            bind:value={email}
            class="w-full rounded-xl bg-white shadow-sm ring-1 ring-gray-200 px-4 py-3 text-sm placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-500"
          />
          <button
            type="submit"
            class="rounded-xl px-2 py-2 flex-[30%] min-w-4 text-sm font-medium bg-orange-600 text-white hover:bg-orange-700 active:scale-[.99]"
          >
            Sign up
          </button>
        </form>
        <p class="mt-2 text-xs text-gray-500">No spam — just project launches and community events.</p>
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
          <span>community projects for San Francisco</span>
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
  .line-clamp-2{display:-webkit-box;-webkit-line-clamp:2;-webkit-box-orient:vertical;overflow:hidden}
</style>
