
<script lang="ts">
  import { page } from '$app/stores';
  import { projects } from '$lib/stores/projects';
  import type { Project } from '$lib/stores/projects';

  import Voting from '$lib/components/Voting.svelte';
  import CommentThread from '$lib/CommentThread.svelte';
  import GovBadge from '$lib/components/GovBadge.svelte';
  import NeedsChips from '$lib/components/NeedsChips.svelte';

  import { readable, type Readable } from 'svelte/store';
  import { userProfileStore } from '$lib/stores/userProfiles';
  import type { UserProfile } from '$lib/stores/auth/auth';

  // Props / inputs
  export let project: Project | null = null;
  export let variant: 'popular' | 'standard' | 'dashboard' = 'standard';
  export let backgroundGradient = ''; // e.g. "from-sky-300 to-indigo-300"
  export let textToCopy = '';

  // Resolve project from store if not passed in
  $: project = project ?? $projects.find((p) => p.id === $page.params.id) ?? null;

  // Kind
  $: kind = (project?.kind ?? 'project') as 'project' | 'idea';

  // Author profile
  let authorProfile: Readable<UserProfile | null> = readable(null);
  $: authorProfile = project ? userProfileStore(project.authorId) : readable(null);

  // Gradient classes
  const DEFAULT_GRADIENT: Record<'project' | 'idea', string> = {
    project: 'from-orange-300 to-fuchsia-300',
    idea: 'from-amber-300 to-amber-500'
  };
  $: mediaGradient = (backgroundGradient && backgroundGradient.trim()) || DEFAULT_GRADIENT[kind];

  // Utilities
  function fmtDate(d: Date | string) {
    const dt = d instanceof Date ? d : new Date(d);
    return dt.toLocaleDateString();
  }

  // Copy button
  let copied = false;
  let timeout: ReturnType<typeof setTimeout>;
  async function copyText() {
    try {
      await navigator.clipboard.writeText(textToCopy || location.href);
      copied = true;
      clearTimeout(timeout);
      timeout = setTimeout(() => (copied = false), 1500);
    } catch {}
  }
</script>

{#if project}
  <div class="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 py-8">
    <div class="mb-4 flex items-center gap-2 text-sm">
      <a href="/projects" class="inline-flex items-center gap-1 text-gray-600 hover:text-gray-900">
        <span aria-hidden>←</span> Back to Projects
      </a>
      <span class="text-gray-300">/</span>
    </div>

    <header class="relative overflow-hidden rounded-3xl bg-white ring-1 ring-gray-200 shadow-sm">
      <div class={`h-28 bg-gradient-to-br ${mediaGradient}`}></div>
      <div class="p-6 sm:p-8">
        <div class="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
          <div class="min-w-0">
            <div class="flex items-center gap-2 text-xs text-gray-600">
              <span class="inline-flex items-center gap-1 rounded-full border border-blue-200 bg-blue-50 px-2 py-0.5 text-blue-700">
                {project.kind === 'idea' ? 'Idea' : 'Project'}
              </span>
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
          <div class="shrink-0">
            <div class="rounded-xl ring-1 ring-gray-200 bg-gray-50 px-3 py-2">
              <Voting {project} />
            </div>
          </div>
        </div>
      </div>
    </header>

    <div class="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6">
      <div class="order-1 md:order-1 md:col-span-2 flex flex-col gap-5">
        <section>
          <article class="rounded-2xl bg-white ring-1 ring-gray-200 p-6 shadow-sm">
            <h2 class="sr-only">Description</h2>
            <p class="text-gray-700 text-[15px] leading-relaxed">{project.description}</p>

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

        <section class="hidden md:block">
          <div class="rounded-2xl bg-white ring-1 ring-gray-200 p-6 shadow-sm">
            <h3 class="text-base font-semibold text-gray-900 mb-3">Comments</h3>
            <CommentThread projectId={project.id} />
          </div>
        </section>
      </div>

      <aside class="order-2 md:order-3 md:col-span-1 md:col-start-3 md:row-start-1 self-start space-y-6">
        {#if project.needs}
          <div class="rounded-2xl bg-white ring-1 ring-gray-200 p-6 shadow-sm">
            <h3 class="text-base font-semibold text-gray-900 mb-2">Contributors needed</h3>
            <NeedsChips needs={project.needs} />
          </div>
        {/if}

        <div class="rounded-2xl bg-white ring-1 ring-gray-200 p-6 shadow-sm">
          <div class="flex items-center justify-between">
            <div class="flex gap-2">
              <h3 class="text-base font-semibold text-gray-900">Project details</h3>
              <div class="relative inline-block">
                <button
                aria-label="copy"
                  type="button"
                  onclick={copyText}
                  class="inline-flex items-center justify-center rounded-full p-1 text-orange-600 hover:text-orange-700 transition active:scale-95"
                  title="Copy to clipboard"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="h-5 w-5">
                    <rect x="7" y="3" width="10" height="10" rx="2" ry="2"></rect>
                    <rect x="3" y="7" width="10" height="10" rx="2" ry="2"></rect>
                  </svg>
                </button>
                {#if copied}
                  <div class="absolute -top-8 left-1/2 -translate-x-1/2 whitespace-nowrap rounded-md bg-gray-800 px-2 py-1 text-xs text-white shadow-md">Copied!</div>
                {/if}
              </div>
            </div>
            <span class="h-2 w-2 rounded-full bg-orange-500/80"></span>
          </div>

          <div class="mt-4 grid grid-cols-1 gap-4">
            <div class="flex items-center gap-3">
              <span class="text-lg">⏱️</span>
              <div class= "flex gap-1 items-center">
                <div class="text-sm text-gray-500">Time</div>
                <div class="text-gray-900">{project.timeCommitment}</div>
              </div>
            </div>
            <div class="flex items-center gap-3">
              <span class="text-lg">📅</span>
              <div class= "flex gap-1 items-center">
                <div class="text-sm text-gray-500">Duration</div>
                <div class="text-gray-900">{project.duration}</div>
              </div>
            </div>
          </div>

          <div class="mt-5">
            <div class="flex items-start flex-col gap-3">
              <div class="flex-1 flex items-center gap-1">
                <span class="text-lg">✉️</span>
                <div class="text-sm text-gray-500">Contact</div>
              </div>
              <div class="mt-1 flex items-center gap-2">
                  <span class="flex items-center rounded-full bg-gray-100 px-2.5 py-0.5 text-xs font-medium text-gray-700">
                    {project.contactMethod?.toLowerCase()}
                  </span>
                  {#if project.contactMethod?.toLowerCase() === 'email'}
                    <a href={`mailto:${project.contactInfo}`} class="text-xs font-medium text-gray-900 hover:text-orange-600 break-all">{project.contactInfo}</a>
                  {:else}
                    <span class="text-xs font-medium text-gray-900">{project.contactInfo}</span>
                  {/if}
                </div>
            </div>
          </div>

          {#if project.githubUrl}
            <div class="mt-5 flex items-center gap-3">
              <span class="text-lg">🧩</span>
              <div>
                <div class="text-sm text-gray-500">Repository</div>
                <a href={project.githubUrl} target="_blank" class="inline-flex items-center gap-1 font-medium text-orange-600 hover:text-orange-700">
                  View on GitHub
                  <svg class="h-3.5 w-3.5" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                    <path d="M12.293 2.293a1 1 0 011.414 0l4 4a1 1 0 01-1.414 1.414L14 5.414V13a1 1 0 11-2 0V5.414L8.707 7.707A1 1 0 017.293 6.293l4-4z"/>
                    <path d="M5 9a1 1 0 011 1v5h8v-2a1 1 0 112 0v3a1 1 0 01-1 1H5a1 1 0 01-1-1v-6a1 1 0 011-1z"/>
                  </svg>
                </a>
              </div>
            </div>
          {/if}
        </div>

        <div class="rounded-2xl bg-gradient-to-br from-orange-600 to-fuchsia-600 p-1 shadow-sm">
          <div class="rounded-[18px] bg-white p-5">
            <h3 class="text-base font-semibold text-gray-900">Invite collaborators</h3>
            <p class="mt-1 text-sm text-gray-600">Know someone perfect for this? Share it.</p>
            <div class="mt-3 flex items-center gap-2">
              <a
                href={`mailto:?subject=${encodeURIComponent('Check this project on SFOS: ' + project.title)}&body=${encodeURIComponent(location.href)}`}
                class="inline-flex items-center rounded-lg bg-orange-600 px-3 py-2 text-sm font-medium text-white hover:bg-orange-700"
              >Email</a>
              <button
                type="button"
                class="inline-flex items-center rounded-lg bg-gray-900 px-3 py-2 text-sm font-medium text-white hover:bg-black/90"
                onclick={() => navigator.clipboard.writeText(location.href)}
              >
                Copy link
              </button>
            </div>
          </div>
        </div>
      </aside>

      <section class="order-3 md:hidden">
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
    <a href="/projects" class="inline-flex items-center rounded-lg bg-orange-600 px-4 py-2 text-white hover:bg-orange-700">
      Back to Projects
    </a>
  </div>
{/if}
