<!-- src/routes/projects/+page.svelte -->
<script lang="ts">
  import { projects } from '$lib/stores/projects';
  import ProjectCard from '$lib/components/ProjectCard.svelte';
  import { currentUser } from '$lib/stores/auth/auth';
  import { logout } from '$lib/stores/auth/auth'; 
  import { goto } from '$app/navigation';
  import { page } from '$app/stores';
  import ProjectsSearchForm from '$lib/components/ProjectsSearchForm.svelte'; 
  
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
  {#if $currentUser}
    <header class="bg-white shadow-sm fixed w-full top-0 z-50">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex items-center justify-between h-16">
          <button onclick={() => goto('/')} class="flex items-center">
            <img alt="logo" src="/logo.png" class="w-8 h-8 object-cover">
            <span class="ml-2 text-orange-500 text-xl font-semibold">SFOS</span>
          </button>

          <div class="flex items-center space-x-6">
            <!-- Notifications -->
            <div class="relative">
              <button 
                onclick={() => showNotifications = !showNotifications}
                class="relative p-1 text-gray-700 hover:text-gray-900"
              >
                <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 17h5l-3.5-3.5A4.002 4.002 0 0018 13V9a6 6 0 10-12 0v4c0 1.035-.515 1.95-1.3 2.5L3 17h5m4 0v1a3 3 0 11-6 0v-1m6 0H9"/>
                </svg>
                {#if unreadCount > 0}
                  <span class="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                    {unreadCount}
                  </span>
                {/if}
              </button>
              {#if showNotifications}
                <div class="absolute right-0 mt-2 w-80 bg-white rounded-lg shadow-lg border border-gray-200 py-2 z-20 max-h-96 overflow-y-auto">
                  <div class="px-4 py-2 border-b border-gray-200">
                    <h3 class="font-medium text-gray-900">Notifications</h3>
                  </div>
                  {#each notifications.slice(0, 5) as notification}
                    <button 
                      onclick={() => markAsRead(notification.id)}
                      class="block w-full text-left px-4 py-3 hover:bg-gray-50 {notification.read ? 'opacity-60' : ''}"
                    >
                      <div class="flex items-start space-x-3">
                        <span class="text-lg">{getNotificationIcon(notification.type)}</span>
                        <div class="flex-1 min-w-0">
                          <p class="text-sm text-gray-900">{notification.message}</p>
                          <p class="text-xs text-gray-500 mt-1">{notification.createdAt.toLocaleTimeString()}</p>
                        </div>
                        {#if !notification.read}
                          <div class="w-2 h-2 bg-blue-500 rounded-full mt-1"></div>
                        {/if}
                      </div>
                    </button>
                  {/each}
                </div>
              {/if}
            </div>

            <!-- User Menu -->
            <div class="relative">
              <button 
                onclick={() => showProfileMenu = !showProfileMenu}
                class="flex items-center space-x-2 text-gray-700 hover:text-gray-900 text-sm"
              >
                <img src={$currentUser?.avatar} alt="profile" class="w-6 h-6 rounded-full bg-gray-300" />
                <span>{$currentUser?.username}</span>
              </button>
              {#if showProfileMenu}
                <div class="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-2 z-10">
                  <button class="block w-full text-left px-4 py-2 text-gray-700 hover:bg-gray-50 text-sm">
                    Edit Profile
                  </button>
                  <button onclick={logout} class="block w-full text-left px-4 py-2 text-gray-700 hover:bg-gray-50 text-sm">
                    Logout
                  </button>
                </div>
              {/if}
            </div>
          </div>
        </div>
      </div>
    </header>
  {:else}
    <header class="bg-white shadow-sm fixed w-full top-0 z-20">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex items-center justify-between h-16">
          <button onclick={() => goto('/')} class="flex items-center">
            <img alt="logo" src="/logo.png" class="w-8 h-8 object-cover">
            <span class="ml-2 text-orange-500 text-xl font-semibold">SFOS</span>
          </button>
          <div class="flex items-center space-x-4">
            <button class="text-gray-700 hover:text-gray-900 cursor-pointer text-sm">Log in</button>
            <button class="bg-orange-500 text-sm text-white px-4 py-2 rounded-full hover:bg-orange-600 cursor-pointer">
              Sign up
            </button>
          </div>
        </div>
      </div>
    </header>
  {/if}

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
