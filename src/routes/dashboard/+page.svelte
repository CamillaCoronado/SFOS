<script lang="ts">
  import { projects } from '$lib/stores/projects';
  import { goto } from '$app/navigation';
  import { currentUser, logout } from '$lib/stores/auth/auth';
  import ProjectsSearchForm from '$lib/components/ProjectsSearchForm.svelte';
  import Header from '$lib/components/Header.svelte';
  import ProjectCard from '$lib/components/ProjectCard.svelte';
  import { deleteProject as deleteProjectFn } from '$lib/stores/projects';

  let showDeleteConfirm = false;
  let projectToDelete: string | null = null;
  let statusFilter: 'all' | 'published' | 'draft' = 'all';

  // get user's projects with status filter
  $: myProjects = $projects.filter(project => {
    const isMyProject = project.authorId === $currentUser?.id;
    const matchesStatus = statusFilter === 'all' || project.status === statusFilter;
    return isMyProject && matchesStatus;
  });

  // Source data (treat missing fields gracefully)
  $: list = ($projects ?? []).map(p => ({
    kind: (p.kind ?? 'project') as 'project' | 'idea',
    tags: (p.tags ?? []).filter(Boolean)
  }));

  // Donut: projects vs ideas
  $: projectsCount = list.filter(p => p.kind === 'project').length;
  $: ideasCount    = list.filter(p => p.kind === 'idea').length;
  $: total         = projectsCount + ideasCount;

  // Bars: top tags (top 5)
  function count<T extends string>(arr: T[]) {
    const m = new Map<T, number>();
    for (const k of arr) m.set(k, (m.get(k) ?? 0) + 1);
    return [...m.entries()];
  }
  $: tagsFlat = list.flatMap(p => p.tags);
  $: tagCounts = count(tagsFlat).sort((a,b) => b[1]-a[1]).slice(0, 5);
  $: maxTag = Math.max(1, ...tagCounts.map(([,n]) => n));

  // Donut geometry
  const R = 54;
  const C = 2 * Math.PI * R;
  $: segProject = total ? (projectsCount / total) * C : 0;
  $: segIdea    = total ? (ideasCount    / total) * C : 0;

  // how many to show per batch
  const pageSize = 4;
  let visible = pageSize;

  // recompute slice whenever list/visible changes
  $: shown = myProjects.slice(0, visible);

  function loadMore() {
    visible = Math.min(visible + pageSize, myProjects.length);
  }

  let searchQuery = '';
  
  // find most popular project (from all user's projects, regardless of filter)
  $: allMyProjects = $projects.filter(p => p.authorId === $currentUser?.id);
  $: mostPopularProject = allMyProjects.length > 0 
    ? allMyProjects.reduce((prev, current) => prev.score > current.score ? prev : current)
    : null;
  
  function editProject(projectId: string) {
    goto(`/project/${projectId}/edit`);
  }
  
  function deleteProject(projectId: string) {
    projectToDelete = projectId;
    showDeleteConfirm = true;
  }
  
  async function confirmDelete() {
    if (!projectToDelete) return;
    try {
      await deleteProjectFn(projectToDelete);
      showDeleteConfirm = false;
      projectToDelete = null;
    } catch (err: any) {
      alert(err.message);
    }
  }
</script>

<div class="min-h-screen bg-gray-50">
  <Header />

  <div class="mt-[72px]">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <!-- Welcome Section -->
      <div class="mb-8">
        <h1 class="text-3xl font-bold text-gray-900 mb-2">Welcome, {$currentUser?.username}!</h1>
        <p class="text-gray-600 mb-6">Manage your projects and track your impact.</p>
        
        <ProjectsSearchForm
          initial={searchQuery}
          on:search={(e) => (searchQuery = e.detail)}
        />
        
        {#if mostPopularProject}
          <div class="bg-gradient-to-r from-orange-50 to-orange-100 border border-orange-200 rounded-lg p-6 mt-6">
            <div class="flex items-center">
              <div class="text-2xl mr-3">🔥</div>
              <div>
                <p class="text-orange-800 font-medium">Most popular project</p>
                <a href="/project/{mostPopularProject.id}" class="text-lg font-semibold text-orange-900 hover:underline">
                  {mostPopularProject.title}
                </a>
                <p class="text-orange-700 text-sm">{mostPopularProject.score} points · {mostPopularProject.upvotes} upvotes</p>
              </div>
            </div>
          </div>
        {/if}
      </div>

      <!-- My Projects Section -->
      <div class="mb-8">
        <div class="flex items-center justify-between mb-6">
          <h2 class="text-2xl font-bold text-gray-900">My Projects ({myProjects.length})</h2>
          <a 
            href="/create"
            class="bg-orange-500 text-white px-4 py-2 rounded-lg hover:bg-orange-600 transition-colors"
          >
            Create New Project
          </a>
        </div>

        <!-- Status Filter Tabs -->
        <div class="mb-6">
          <div class="flex gap-2 border-b border-gray-200">
            <button 
              onclick={() => statusFilter = 'all'}
              class="px-4 py-2 text-sm font-medium transition-colors {statusFilter === 'all' ? 'border-b-2 border-blue-500 text-blue-600' : 'text-gray-600 hover:text-gray-900'}"
            >
              All
            </button>
            <button 
              onclick={() => statusFilter = 'published'}
              class="px-4 py-2 text-sm font-medium transition-colors {statusFilter === 'published' ? 'border-b-2 border-blue-500 text-blue-600' : 'text-gray-600 hover:text-gray-900'}"
            >
              Published
            </button>
            <button 
              onclick={() => statusFilter = 'draft'}
              class="px-4 py-2 text-sm font-medium transition-colors {statusFilter === 'draft' ? 'border-b-2 border-blue-500 text-blue-600' : 'text-gray-600 hover:text-gray-900'}"
            >
              Drafts
            </button>
          </div>
        </div>
        
        {#if myProjects.length > 0}
          <div class="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {#each shown as project (project.id)}
              <div class="relative group">
                <ProjectCard {project} />

                <!-- Draft badge -->
                {#if project.status === 'draft'}
                  <span class="absolute top-3 left-3 z-20 inline-flex items-center px-2 py-1 rounded text-xs font-medium bg-yellow-100 text-yellow-800 border border-yellow-200">
                    Draft
                  </span>
                {/if}

                
                <a href={`/project/${project.id}`}
                  aria-label={`Open ${project.title}`}
                  class="absolute inset-0 z-10"
                />

                <div class="absolute top-3 right-3 z-20 opacity-0 group-hover:opacity-100 transition-opacity">
                  <div class="flex space-x-1 rounded-lg bg-white/85 backdrop-blur px-1 py-1 ring-1 ring-gray-200 shadow-sm">
                    <button
                      aria-label="edit project"
                      onclick={() => editProject(project.id)}
                      class="cursor-pointer p-1.5 text-gray-500 hover:text-blue-600 hover:bg-blue-50 rounded"
                      title="Edit"
                    >
                      <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                          d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"/>
                      </svg>
                    </button>
                    <button
                      aria-label="delete project"
                      onclick={() => deleteProject(project.id)}
                      class="cursor-pointer p-1.5 text-gray-500 hover:text-red-600 hover:bg-red-50 rounded"
                      title="Delete"
                    >
                      <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                          d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/>
                      </svg>
                    </button>
                  </div>
                </div>
              </div>
            {/each}
          </div>

          {#if visible < myProjects.length}
            <div class="flex items-center justify-center mt-8">
              <button
                onclick={loadMore}
                class="cursor-pointer rounded-full px-5 py-2.5 text-sm font-medium bg-gray-900 text-white hover:bg-gray-800 active:scale-[.99]"
              >
                Load more ({myProjects.length - visible} left)
              </button>
            </div>
          {/if}
        {:else}
          <div class="text-center py-12">
            <svg class="w-16 h-16 text-gray-300 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"/>
            </svg>
            <h3 class="text-lg font-medium text-gray-900 mb-2">No {statusFilter === 'all' ? 'projects' : statusFilter} yet</h3>
            <p class="text-gray-500 mb-6">
              {#if statusFilter === 'draft'}
                You don't have any draft projects
              {:else if statusFilter === 'published'}
                You haven't published any projects yet
              {:else}
                Create your first project to get started!
              {/if}
            </p>
            <a href="/create" class="bg-orange-500 text-white px-6 py-2 rounded-lg hover:bg-orange-600 transition-colors">
              Create Your First Project
            </a>
          </div>
        {/if}
      </div>

      <!-- Snapshot Section -->
      <section class="py-10 sm:py-14 bg-white">
        <div class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div class="flex items-end justify-between">
            <h2 class="text-xl sm:text-2xl font-bold">Snapshot</h2>
          </div>

          {#if total === 0 && tagCounts.length === 0}
            <div class="mt-6 rounded-2xl ring-1 ring-gray-200 p-6 text-sm text-gray-600">
              No data yet — create a project or add tags to see charts here.
            </div>
          {:else}
            <div class="mt-6 grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div class="rounded-2xl ring-1 ring-gray-200 p-6">
                <div class="flex items-center justify-between">
                  <h3 class="font-semibold">Ideas vs Projects</h3>
                  <div class="flex items-center gap-3 text-xs text-gray-600">
                    <span class="inline-flex items-center gap-1">
                      <span class="inline-block h-3 w-3 rounded-full bg-indigo-600"></span> Projects {projectsCount}
                    </span>
                    <span class="inline-flex items-center gap-1">
                      <span class="inline-block h-3 w-3 rounded-full bg-emerald-500"></span> Ideas {ideasCount}
                    </span>
                  </div>
                </div>

                <div class="mt-6 flex items-center gap-6">
                  <svg viewBox="0 0 140 140" class="h-40 w-40">
                    <circle cx="70" cy="70" r={R} fill="none" stroke="#E5E7EB" stroke-width="16" />
                    <circle
                      cx="70" cy="70" r={R} fill="none" stroke="currentColor" stroke-width="16"
                      class="text-indigo-600"
                      stroke-dasharray={`${segProject} ${C - segProject}`}
                      stroke-dashoffset={(C * 0.25)}
                      stroke-linecap="round"
                    />
                    <circle
                      cx="70" cy="70" r={R} fill="none" stroke="currentColor" stroke-width="16"
                      class="text-emerald-500"
                      stroke-dasharray={`${segIdea} ${C - segIdea}`}
                      stroke-dashoffset={(C * 0.25) - segProject}
                      stroke-linecap="round"
                    />
                    <text x="70" y="70" text-anchor="middle" dominant-baseline="central"
                      class="fill-gray-900" style="font: 600 18px/1 system-ui, -apple-system, Segoe UI, Roboto, Inter, sans-serif">
                      {total}
                    </text>
                  </svg>

                  <div class="text-sm text-gray-600">
                    <div><span class="font-medium text-gray-900">{projectsCount}</span> projects</div>
                    <div class="mt-1"><span class="font-medium text-gray-900">{ideasCount}</span> ideas</div>
                    <div class="mt-1"><span class="font-medium text-gray-900">{total}</span> total</div>
                  </div>
                </div>
              </div>

              <div class="rounded-2xl ring-1 ring-gray-200 p-6">
                <div class="flex items-center justify-between">
                  <h3 class="font-semibold">Top tags</h3>
                  <a href="/projects" class="text-xs text-indigo-700 hover:text-indigo-900">Browse projects →</a>
                </div>

                {#if tagCounts.length === 0}
                  <p class="mt-6 text-sm text-gray-600">No tags yet. Add tags to your projects to see this chart.</p>
                {:else}
                  <div class="mt-4 space-y-3">
                    {#each tagCounts as [tag, n]}
                      <div>
                        <div class="flex items-center justify-between text-xs text-gray-600">
                          <span class="truncate">#{tag}</span>
                          <span>{n}</span>
                        </div>
                        <div class="mt-1 h-2 rounded-full bg-gray-100">
                          <div
                            class="h-2 rounded-full bg-indigo-600"
                            style={`width:${Math.max(6, Math.round((n / maxTag) * 100))}%`}
                          ></div>
                        </div>
                      </div>
                    {/each}
                  </div>
                {/if}
              </div>
            </div>
          {/if}
        </div>
      </section>
    </div>
  </div>
</div>

{#if showDeleteConfirm}
  <div class="fixed inset-0 z-50 flex items-center justify-center bg-black/50" onclick={() => showDeleteConfirm = false}>
    <div class="rounded-xl bg-white p-6 shadow-xl max-w-sm" onclick={(e) => e.stopPropagation()}>
      <h3 class="text-lg font-semibold text-gray-900">delete project?</h3>
      <p class="mt-2 text-sm text-gray-600">this can't be undone</p>
      <div class="mt-4 flex gap-2 justify-end">
        <button onclick={() => showDeleteConfirm = false} class="rounded-lg px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100">
          cancel
        </button>
        <button onclick={confirmDelete} class="rounded-lg bg-red-600 px-4 py-2 text-sm font-medium text-white hover:bg-red-700">
          delete
        </button>
      </div>
    </div>
  </div>
{/if}