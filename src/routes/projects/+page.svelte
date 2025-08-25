<!-- src/routes/projects/+page.svelte -->
<script lang="ts">
  import { projects } from '$lib/stores/projects';
  import type { Project } from '$lib/stores/projects';
  import ProjectCard from '$lib/components/ProjectCard.svelte';
  import { currentUser } from '$lib/stores/auth/auth';
  import { logout } from '$lib/stores/auth/auth'; 
  import { goto } from '$app/navigation';
  
  let searchQuery = '';
  let selectedTags: string[] = [];
  let showNotifications = false;
  let showProfileMenu = false;
  $: unreadCount = notifications.filter(n => !n.read).length;

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
    console.log('Mark notification as read:', notificationId);//mocks
  }
  
  // get popular projects (top scoring)
  $: popularProjects = $projects
    .sort((a, b) => b.score - a.score)
    .slice(0, 4);
  
  // group projects by category (using first tag as category)
  $: projectsByCategory = $projects.reduce((acc, project) => {
    const category = project.tags[0] || 'uncategorized';
    if (!acc[category]) acc[category] = [];
    acc[category].push(project);
    return acc;
  }, {} as Record<string, Project[]>);
  
  // get all unique tags for filter
  $: allTags = [...new Set($projects.flatMap(p => p.tags))];
  
  // filter projects based on search and tags
  $: filteredProjects = $projects.filter(project => {
    const matchesSearch = project.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         project.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesTags = selectedTags.length === 0 || 
                       selectedTags.some(tag => project.tags.includes(tag));
    return matchesSearch && matchesTags;
  });

  const backgroundColors = [
    'bg-orange-100',
    'bg-blue-100', 
    'bg-green-100',
  ];
</script>

<div class="min-h-screen bg-gray-50">
  <!-- Header -->
 {#if $currentUser}
   <header class="bg-white shadow-sm fixed w-full top-0 z-50">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="flex items-center justify-between h-16">
        <!-- Logo -->
        <button onclick={() => goto('/')} class="flex items-center">
          <img alt="logo" src="/logo.png" class="w-8 h-8 object-cover">
          <span class="ml-2 text-orange-500 text-xl font-semibold">SFOS</span>
        </button>
        
        <!-- Navigation -->
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
                <div class="px-4 py-2 border-t border-gray-200">
                  <button class="text-sm text-blue-600 hover:text-blue-800">View all notifications</button>
                </div>
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
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"/>
              </svg>
            </button>
            
            {#if showProfileMenu}
              <div class="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-2 z-10">
                <button class="block w-full text-left px-4 py-2 text-gray-700 hover:bg-gray-50 text-sm">
                  Edit Profile
                </button>
                <button class="block w-full text-left px-4 py-2 text-gray-700 hover:bg-gray-50 text-sm">
                  Settings
                </button>
                <hr class="my-1 border-gray-200" />
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
        <!-- Logo -->
        <button onclick={() => goto('/')} class="flex items-center">
          <img alt="logo" src="/logo.png" class="w-8 h-8 object-cover">
          <span class="ml-2 text-orange-500 text-xl font-semibold">SFOS</span>
        </button>
        
        <!-- Nav -->
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

  <!-- Search and Filters -->
  <div class="max-w-7xl mx-auto px-4 py-6">
    <div class="flex gap-4 mb-8 items-end">
      <div class="flex-1 relative">
        <div class="w-full mx-auto mt-[72px] inline-block">
          <div class="flex w-full">
            <input
              type="text"
              bind:value={searchQuery}
              placeholder="Search projects"
              class="flex-1 px-4 py-3 border border-gray-300 rounded-l-lg focus:outline-none"
            />
            <button aria-label="search" class="bg-blue-500 text-white px-6 py-3 rounded-r-lg hover:bg-blue-600 cursor-pointer">
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </button>
          </div>
        </div>
        <svg class="w-5 h-5 text-gray-400 absolute left-3 top-2.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/>
        </svg>
      </div>
      
      <div class="relative">
        <svg class="relative top-7 left-2" width="20" height="16" viewBox="0 0 20 16" fill="none" xmlns="http://www.w3.org/2000/svg">
          <line x1="5.12085" y1="1.84065" x2="19.4615" y2="1.84065" stroke="#878686"/>
          <line x1="5.12085" y1="8.21428" x2="19.4615" y2="8.21428" stroke="#878686"/>
          <line x1="5.12085" y1="14.5879" x2="19.4615" y2="14.5879" stroke="#878686"/>
          <circle cx="1.93398" cy="13.4945" r="1.59341" fill="#878686"/>
          <circle cx="1.93398" cy="7.91758" r="1.59341" fill="#878686"/>
          <circle cx="1.93398" cy="2.34066" r="1.59341" fill="#878686"/>
        </svg>
        <select class="appearance-none text-center bg-white border border-gray-300 rounded-lg pl-8 py-2 pr-8 focus:outline-none focus:ring-2 focus:ring-blue-500">
          <option>Tags</option>
          {#each allTags as tag}
            <option value={tag}>{tag}</option>
          {/each}
        </select>
        <svg class="w-4 h-4 top-7 text-gray-400 absolute right-2 pointer-events-none" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"/>
        </svg>
      </div>
    </div>

    <!-- Popular Projects Section -->
    <section class="mb-12">
      <h2 class="text-2xl font-bold text-gray-900 mb-6">Popular Projects</h2>
      
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {#each $projects.slice(0, 4) as project, index}
          <ProjectCard 
            {project} 
            variant="popular" 
          />
        {:else}
          <div class="text-center py-12">
            <p class="text-gray-500">No projects found.</p>
          </div>
        {/each}
      </div>
    </section>

    <section class="mb-12">
      <h2 class="text-2xl font-bold text-gray-900 mb-6">All Projects</h2>
      
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {#each $projects as project}
          <ProjectCard {project} variant="standard" />
        {:else}
          <div class="text-center py-12">
            <p class="text-gray-500">No projects found.</p>
          </div>
        {/each}
      </div>
    </section>
  </div>
</div>
