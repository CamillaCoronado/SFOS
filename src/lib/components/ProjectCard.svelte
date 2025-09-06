<!-- src/lib/components/ProjectCard.svelte — Svelte 5 runes, Tailwind, polished visuals -->
<script lang="ts">
  import { goto } from '$app/navigation';
  import { page } from '$app/stores';
  import type { Project, VoteType } from '$lib/stores/projects';
  import Voting from './Voting.svelte';
  import NeedsChips from './NeedsChips.svelte';

  let {
    project,
    variant = 'standard',
    backgroundColor = ''
  }: {
    project: Project;
    variant?: 'popular' | 'standard' | 'dashboard';
    backgroundColor?: string;
  } = $props();

  // Visual language: Project vs Idea
  const cardCls = {
    project: 'ring-gray-200',
    idea:    'ring-amber-200'
  } as const;

  const badgeCls = {
    project: 'bg-blue-100 text-blue-700 border-blue-200',
    idea:    'bg-amber-100 text-amber-700 border-amber-200'
  } as const;

  const tagCls = {
    project: 'bg-blue-100 text-blue-700',
    idea:    'bg-amber-100 text-amber-700'
  } as const;

  const kind = $derived((project.kind ?? 'project') as keyof typeof cardCls);
  const kindLabel = $derived(kind === 'project' ? 'Project' : 'Idea');

  function truncateTitle(title: string, maxLength: number) {
    return title.length > maxLength ? title.slice(0, maxLength) + '…' : title;
  }

  function editProject(e: Event) {
    e.preventDefault(); e.stopPropagation();
    console.log('Edit project:', project.id);
  }

  function deleteProject(e: Event) {
    e.preventDefault(); e.stopPropagation();
    console.log('Delete project:', project.id);
  }

  function duplicateProject(e: Event) {
    e.preventDefault(); e.stopPropagation();
    console.log('Duplicate project:', project.id);
  }

  const mediaGradient = $derived(
    backgroundColor
      ? backgroundColor
      : kind === 'project' ? 'from-orange-300 to-fuchsia-300' : 'from-amber-300 to-rose-300'
  );
</script>

<a href="/project/{project.id}" class="block group focus:outline-none focus-visible:ring-2 focus-visible:ring-orange-600 rounded-2xl">
  {#if variant === 'popular'}
    <!-- Popular: compact, bold visuals -->
    <article class={`relative overflow-hidden rounded-2xl bg-white ring-1 ${cardCls[kind]} shadow-sm transition hover:shadow-md`}>
      <div class={`aspect-[16/9] bg-gradient-to-br ${mediaGradient}`}></div>
      <div class="p-4">
        <!-- Top row: badge + avatar circles -->
        <div class="flex items-start justify-between">
          <span class={`text-[10px] px-2 py-0.5 rounded-full border ${badgeCls[kind]}`}>{kindLabel}</span>
          <div class="flex">
            <div class="w-8 h-8 rounded-full bg-orange-500"></div>
            <div class="w-8 h-8 rounded-full bg-blue-500 -ml-2"></div>
          </div>
        </div>

        <h3 class="mt-2 text-base font-semibold text-gray-900 group-hover:text-orange-700">
          {truncateTitle(project.title, 60)}
        </h3>
        <p class="mt-1 text-sm text-gray-600 line-clamp-2">
          {project.description?.length > 140 ? project.description.slice(0, 140) + '…' : project.description}
        </p>

        <!-- Tags -->
        {#if project.tags?.length}
          <div class="mt-3 flex flex-wrap gap-1.5">
            {#each project.tags.slice(0, 3) as tag}
              <span class={`px-2 py-1 rounded text-[11px] ${tagCls[kind]}`}>
                {tag.length > 16 ? tag.slice(0, 16) + '…' : tag}
              </span>
            {/each}
          </div>
        {/if}

        <!-- Stats -->
        <div class="mt-4 flex items-center justify-between text-gray-600 text-sm">
          <div class="flex items-center gap-3">
            <Voting {project} />
            <span class="flex items-center">
              <svg class="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"/></svg>
              {project.comments}
            </span>
          </div>
          <span class="text-xs text-gray-400">{new Date(project.createdAt).toLocaleDateString()}</span>
        </div>
      </div>
    </article>

  {:else if variant === 'dashboard'}
    <!-- Dashboard: action-forward, roomy -->
    <article class="relative rounded-2xl bg-white ring-1 ring-gray-200 p-5 shadow-sm transition hover:shadow-md">
      <!-- Action buttons -->
      <div class="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity">
        <div class="flex gap-1">
          <button aria-label="Edit" onclick={editProject} class="p-1 rounded hover:bg-blue-50 text-gray-400 hover:text-blue-600">
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"/></svg>
          </button>
          <button aria-label="Duplicate" onclick={duplicateProject} class="p-1 rounded hover:bg-green-50 text-gray-400 hover:text-green-600">
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"/></svg>
          </button>
          <button aria-label="Delete" onclick={deleteProject} class="p-1 rounded hover:bg-red-50 text-gray-400 hover:text-red-600">
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/></svg>
          </button>
        </div>
      </div>

      <div class={`mb-3 aspect-[16/9] rounded-xl bg-gradient-to-br ${mediaGradient}`}></div>

      <div class="mb-2 flex items-start justify-between">
        <span class={`text-[10px] px-2 py-0.5 rounded-full border ${badgeCls[kind]}`}>{kindLabel}</span>
        <span class="text-xs text-gray-400">{new Date(project.createdAt).toLocaleDateString()}</span>
      </div>

      <h3 class="text-lg font-semibold text-gray-900">{truncateTitle(project.title, 80)}</h3>
      <p class="mt-1 text-sm text-gray-600 line-clamp-2">{project.description?.length > 160 ? project.description.slice(0, 160) + '…' : project.description}</p>

      {#if project.tags?.length}
        <div class="mt-3 flex flex-wrap gap-1.5">
          {#each project.tags.slice(0, 4) as tag}
            <span class={`px-2 py-1 rounded text-[11px] ${tagCls[kind]}`}>
              {tag.length > 16 ? tag.slice(0, 16) + '…' : tag}
            </span>
          {/each}
        </div>
      {/if}

      {#if project.needs}
        <div class="mt-3"><NeedsChips needs={project.needs} /></div>
      {/if}

      <div class="mt-4 flex items-center justify-between text-gray-600 text-sm">
        <div class="flex items-center gap-3">
          <Voting {project} />
          <span class="flex items-center">
            <svg class="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"/></svg>
            {project.comments}
          </span>
        </div>
      </div>
    </article>

  {:else}
    <!-- Standard: like Home featured cards -->
    <article class={`relative overflow-hidden rounded-2xl bg-white ring-1 ${cardCls[kind]} shadow-sm transition hover:shadow-md`}>
      <div class={`aspect-[16/9] bg-gradient-to-br ${mediaGradient}`}></div>
      <div class="p-4">
        <div class="flex items-start justify-between">
          <span class={`text-[10px] px-2 py-0.5 rounded-full border ${badgeCls[kind]}`}>{kindLabel}</span>
          <div class="flex">
            <div class="w-6 h-6 rounded-full bg-orange-500"></div>
            <div class="w-6 h-6 rounded-full bg-blue-500 -ml-2"></div>
          </div>
        </div>

        <h3 class="mt-2 text-base font-semibold text-gray-900 group-hover:text-orange-700">{truncateTitle(project.title, 72)}</h3>
        <p class="mt-1 text-sm text-gray-600 line-clamp-2">{project.description?.length > 150 ? project.description.slice(0, 150) + '…' : project.description}</p>

        <!-- Tags -->
        {#if project.tags?.length}
          <div class="mt-3 flex flex-wrap gap-1.5">
            {#each project.tags.slice(0, 3) as tag}
              <span class={`px-2 py-1 rounded text-[11px] ${tagCls[kind]}`}>
                {tag.length > 16 ? tag.slice(0, 16) + '…' : tag}
              </span>
            {/each}
          </div>
        {/if}

        {#if project.needs}
          <div class="mt-3"><NeedsChips needs={project.needs} /></div>
        {/if}

        <!-- Stats -->
        <div class="mt-4 flex items-center justify-between text-gray-600 text-sm">
          <div class="flex items-center gap-3">
            <Voting {project} />
            <span class="flex items-center">
              <svg class="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"/></svg>
              {project.comments}
            </span>
          </div>
        </div>
      </div>
    </article>
  {/if}
</a>

<style>
  /* line clamp utility for environments without @tailwind/typography plugin */
  .line-clamp-2{display:-webkit-box;-webkit-line-clamp:2;-webkit-box-orient:vertical;overflow:hidden}
</style>
