<!-- src/routes/projects/+page.svelte -->
<script lang="ts">
  import { projects } from '$lib/stores/projects';
  import ProjectCard from '$lib/components/ProjectCard.svelte';
  import { currentUser } from '$lib/stores/auth/auth';
  import { logout } from '$lib/stores/auth/auth'; 
  import { goto } from '$app/navigation';
  import { page } from '$app/stores';
  import ProjectsSearchForm from '$lib/components/ProjectsSearchForm.svelte';
  import Header from '$lib/components/Header.svelte';
  
  let searchQuery = '';
  let selectedTags: string[] = [];
  let showNotifications = false;
  let showProfileMenu = false;
  $: unreadCount = notifications.filter(n => !n.read).length;

   $: {
    const q = $page.url.searchParams.get('q') ?? '';
    if (q !== searchQuery) searchQuery = q;
  }

  // debounce
  let searchDebounced = '';
  let _searchT: ReturnType<typeof setTimeout> | null = null;

  // minimal debounce to drive filtering from searchQuery
  $: {
    if (_searchT) clearTimeout(_searchT);
    _searchT = setTimeout(() => {
      searchDebounced = searchQuery.trim();
    }, 200);
  }

  const num = (v: unknown) => Number.isFinite(+(<any>v)) ? +(<any>v) : 0;

  $: popularProjects = [...$projects]
    .map(p => ({
      ...p,
      rank: num(p.score) + 0.2 * num(p.comments)  // adjust weight (0.2) as you like
    }))
    .sort((a, b) => {
      if (b.rank !== a.rank) return b.rank - a.rank;
      return new Date(b.createdAt ?? 0).getTime() - new Date(a.createdAt ?? 0).getTime();
    })
    .slice(0, 4);

  export const notifications = [
    {
      id: '1',
      type: 'upvote',
      message: 'sarah_chen upvoted your project "AI-Powered Code Review Tool"',
      projectId: '1',
      read: false,
      createdAt: new Date('2025-08-02T10:30:00')
    },
    {
      id: '2', 
      type: 'comment',
      message: 'marcus_j commented on "AI-Powered Code Review Tool"',
      projectId: '1',
      read: false,
      createdAt: new Date('2025-08-02T09:15:00')
    },
    {
      id: '3',
      type: 'collaboration',
      message: 'alex_rivera wants to collaborate on "AI-Powered Code Review Tool"',
      projectId: '1',
      read: true,
      createdAt: new Date('2025-08-01T16:45:00')
    }
  ];

  function getNotificationIcon(type: string) {
    switch(type) {
      case 'upvote': return '👍';
      case 'comment': return '💬';
      case 'collaboration': return '🤝';
      default: return '📝';
    }
  }

  function markAsRead(notificationId: string) {
    console.log('Mark notification as read:', notificationId);//mock
  }
  
  // tags
  $: allTags = [...new Set($projects.flatMap(p => p.tags))];
  
  // filter
  $: filteredProjects = $projects.filter(project => {
    const q = searchDebounced.toLowerCase();
    const matchesSearch =
      !q ||
      project.title.toLowerCase().includes(q) ||
      project.description.toLowerCase().includes(q);

    const matchesTags =
      selectedTags.length === 0 ||
      selectedTags.some(tag => project.tags.includes(tag));

    return matchesSearch && matchesTags;
  });
</script>

<div class="min-h-screen bg-gray-50">
  <!-- Header -->
  <Header />

  <!-- Search -->
  <div class="max-w-7xl mx-auto px-4 py-6">
    <div class="w-full mx-auto mt-[72px]">
     <!-- Bind value so typing updates searchQuery; component internals unchanged -->
     <ProjectsSearchForm
      initial={searchQuery}
      on:search={(e) => (searchQuery = e.detail)}
    />
    </div>
  </div>

  <!-- Popular projects -->
  {#if !searchDebounced && popularProjects.length > 0}
    <div class="max-w-7xl mx-auto px-4 pb-12">
      <h2 class="text-2xl font-bold text-gray-900 mb-6">Popular Projects</h2>
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {#each popularProjects as project}
          <ProjectCard {project} variant="standard" />
        {/each}
      </div>
    </div>
  {/if}

  <!-- Projects list -->
  <div class="max-w-7xl mx-auto px-4 pb-12">
    {#if searchDebounced}
      <h2 class="text-2xl font-bold text-gray-900 mb-6">
        Search results ({filteredProjects.length})
      </h2>
    {:else}
      <h2 class="text-2xl font-bold text-gray-900 mb-6">
        All Projects ({$projects.length})
      </h2>
    {/if}

    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {#each filteredProjects as project}
        <ProjectCard {project} variant="standard" />
      {:else}
        <div class="col-span-full text-center py-12 text-gray-500">
          No projects found.
        </div>
      {/each}
    </div>
  </div>
</div>
