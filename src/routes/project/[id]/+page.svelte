<!-- src/routes/project/[id]/+page.svelte — polished detail view, Reddit‑style horizontal voting; comments last on mobile, clean on desktop -->
<script lang="ts">
  import { page } from '$app/stores';
  import { projects } from '$lib/stores/projects';
  import Voting from '$lib/components/Voting.svelte';
  import CommentThread from '$lib/CommentThread.svelte';
  import GovBadge from '$lib/components/GovBadge.svelte';
  import { readable, type Readable } from 'svelte/store';
  import { userProfileStore } from '$lib/stores/userProfiles';
  import type { UserProfile } from '$lib/stores/auth/auth';
  import NeedsChips from '$lib/components/NeedsChips.svelte';

  // Load selected project
  $: project = $projects.find((p) => p.id === $page.params.id);

  // Author profile (for gov badge)
  let authorProfile: Readable<UserProfile | null> = readable(null);
  $: if (project) authorProfile = userProfileStore(project.authorId);

  // Formatting helpers
  function fmtDate(d: Date | string) {
    const dt = d instanceof Date ? d : new Date(d);
    return dt.toLocaleDateString();
  }
</script>

{#if project}
  <div class="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 py-8">
    <!-- Back & breadcrumbs -->
    <div class="mb-4 flex items-center gap-2 text-sm">
      <a href="/projects" class="inline-flex items-center gap-1 text-gray-600 hover:text-gray-900">
        <span aria-hidden>←</span> Back to Projects
      </a>
      <span class="text-gray-300">/</span>
    </div>

    <!-- Header card -->
    <header class="relative overflow-hidden rounded-3xl bg-white ring-1 ring-gray-200 shadow-sm">
      <div class="h-28 bg-gradient-to-br from-indigo-200 via-fuchsia-200 to-rose-200"></div>
      <div class="p-6 sm:p-8">
        <div class="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
          <div class="min-w-0">
            <div class="flex items-center gap-2 text-xs text-gray-600">
              <span class="inline-flex items-center gap-1 rounded-full border border-blue-200 bg-blue-50 px-2 py-0.5 text-blue-700">{project.kind === 'idea' ? 'Idea' : 'Project'}</span>
              <span class="text-gray-400">•</span>
              <span class="capitalize">{project.experienceLevel} level</span>
              <span class="text-gray-400">•</span>
              <span>{fmtDate(project.createdAt)}</span>
            </div>
            <h1 class="mt-2 text-2xl sm:text-3xl font-bold tracking-tight text-gray-900">{project.title}</h1>
            <div class="mt-2 flex items-center gap-3 text-sm text-gray-600">
              <span>by {project.authorName}</span>
              {#if $authorProfile?.gov?.verified && $authorProfile?.gov?.showBadge}
                <GovBadge size="xs" />
              {/if}
            </div>
          </div>

          <!-- Voting CTA -->
          <div class="shrink-0">
            <div class="rounded-xl ring-1 ring-gray-200 bg-gray-50 px-3 py-2">
              <Voting {project} />
            </div>
          </div>
        </div>
      </div>
    </header>

    <!-- Body: three siblings with responsive order -->
    <div class="mt-8 grid grid-cols-1 lg:grid-cols-3 gap-6">
      <!-- 1) Article (main) -->
      <section class="order-1 lg:order-1 lg:col-span-2">
        <article class="rounded-2xl bg-white ring-1 ring-gray-200 p-6 shadow-sm">
          <h2 class="sr-only">Description</h2>
          <p class="text-gray-700 text-[15px] leading-relaxed">{project.description}</p>

          <!-- Tags -->
          {#if project.tags?.length}
            <div class="mt-6">
              <h3 class="mb-2 text-sm font-semibold text-gray-900">Tags</h3>
              <div class="flex flex-wrap gap-2">
                {#each project.tags as tag}
                  <span class="rounded-full bg-blue-100 px-3 py-1 text-xs font-medium text-blue-700">{tag}</span>
                {/each}
              </div>
            </div>
          {/if}
        </article>
      </section>

      <!-- 2) Sidebar (mobile: middle, desktop: right column) -->
      <aside class="order-2 md:order-3 space-y-6">
        {#if project.needs}
          <div class="rounded-2xl bg-white ring-1 ring-gray-200 p-6 shadow-sm">
            <h3 class="text-base font-semibold text-gray-900 mb-2">Contributors needed</h3>
            <NeedsChips needs={project.needs} />
          </div>
        {/if}

        <div class="rounded-2xl bg-white ring-1 ring-gray-200 p-6 shadow-sm">
          <h3 class="text-base font-semibold text-gray-900 mb-3">Project details</h3>
          <dl class="space-y-3 text-sm">
            <div class="flex justify-between gap-4">
              <dt class="text-gray-500">Time Commitment</dt>
              <dd class="text-gray-900">{project.timeCommitment}</dd>
            </div>
            <div class="flex justify-between gap-4">
              <dt class="text-gray-500">Duration</dt>
              <dd class="text-gray-900">{project.duration}</dd>
            </div>
            <div class="flex justify-between gap-4">
              <dt class="text-gray-500">Contact</dt>
              <dd class="text-gray-900 capitalize">{project.contactMethod}: {project.contactInfo}</dd>
            </div>
            {#if project.githubUrl}
              <div class="flex items-center justify-between gap-4">
                <dt class="text-gray-500">Repository</dt>
                <dd>
                  <a href={project.githubUrl} target="_blank" class="text-indigo-700 hover:text-indigo-900 font-medium">View on GitHub →</a>
                </dd>
              </div>
            {/if}
          </dl>
        </div>

        <!-- Share / secondary CTA -->
        <div class="rounded-2xl bg-gradient-to-br from-indigo-600 to-fuchsia-600 p-1 shadow-sm">
          <div class="rounded-[18px] bg-white p-5">
            <h3 class="text-base font-semibold text-gray-900">Invite collaborators</h3>
            <p class="mt-1 text-sm text-gray-600">Know someone perfect for this? Share it.</p>
            <div class="mt-3 flex items-center gap-2">
              <a href={`mailto:?subject=${encodeURIComponent('Check this project on SFOS: ' + project.title)}&body=${encodeURIComponent(location.href)}`} class="inline-flex items-center rounded-lg bg-indigo-600 px-3 py-2 text-sm font-medium text-white hover:bg-indigo-700">Email</a>
              <button type="button" class="inline-flex items-center rounded-lg bg-gray-900 px-3 py-2 text-sm font-medium text-white hover:bg-black/90" onclick={() => navigator.clipboard.writeText(location.href)}>Copy link</button>
            </div>
          </div>
        </div>
      </aside>

      <!-- 3) Comments (mobile: last, desktop: below article) -->
      <section class="order-3 md:order-2 lg:col-span-2">
        <div class="rounded-2xl bg-white ring-1 ring-gray-200 p-6 shadow-sm">
          <h3 class="text-base font-semibold text-gray-900 mb-3">Comments</h3>
          <CommentThread projectId={project.id} />
        </div>
      </section>
    </div>
  </div>
{:else}
  <div class="mx-auto max-w-4xl px-4 py-16 text-center">
    <h1 class="text-2xl font-bold text-gray-900 mb-2">Project Not Found</h1>
    <p class="text-gray-600 mb-6">The project you're looking for doesn't exist.</p>
    <a href="/projects" class="inline-flex items-center rounded-lg bg-indigo-600 px-4 py-2 text-white hover:bg-indigo-700">Back to Projects</a>
  </div>
{/if}
