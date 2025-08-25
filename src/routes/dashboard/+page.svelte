<script lang="ts">
  import { projects } from '$lib/stores/projects';
  import { goto } from '$app/navigation';
  import { currentUser, logout } from '$lib/stores/auth/auth';
  
  // mock notifications
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
  
  let searchQuery = '';
  let showProfileMenu = false;
  let showNotifications = false;
  
  // get user's projects
  $: myProjects = $projects.filter(project => project.authorId === $currentUser?.id);
  
  // find most popular project
  $: mostPopularProject = myProjects.length > 0 
    ? myProjects.reduce((prev, current) => prev.score > current.score ? prev : current)
    : null;
  
  // unread notifications count
  $: unreadCount = notifications.filter(n => !n.read).length;
  
  function handleSearch() {
    if (searchQuery.trim()) {
      goto(`/projects?search=${encodeURIComponent(searchQuery)}`);
    } else {
      goto('/projects');
    }
  }
  
  function editProject(projectId: string) {
    console.log('Edit project:', projectId);//mocks
  }
  
  function deleteProject(projectId: string) {
    console.log('Delete project:', projectId);//mocks
  }
  
  function duplicateProject(projectId: string) {
    console.log('Duplicate project:', projectId);//mocks
  }
  
  function editProfile() {
    console.log('Edit profile');//mocks
  }
  
  function markAsRead(notificationId: string) {
    console.log('Mark notification as read:', notificationId);//mocks
  }
  
  function getNotificationIcon(type: string) {
    switch(type) {
      case 'upvote': return '👍';
      case 'comment': return '💬';
      case 'collaboration': return '🤝';
      default: return '📝';
    }
  }
</script>

<div class="min-h-screen bg-gray-50">
  <!-- Header -->
  <header class="bg-white shadow-sm fixed w-full top-0 z-50">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="flex items-center justify-between h-16">
        <!-- Logo -->
        <button onclick={() => goto('/')} class="flex items-center">
          <img alt= "logo" src="/logo.png" class="w-8 h-8 object-cover">
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
                <button onclick={editProfile} class="block w-full text-left px-4 py-2 text-gray-700 hover:bg-gray-50 text-sm">
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

  <!-- Main Content -->
  <div class="mt-[72px]">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <!-- Welcome Section -->
      <div class="mb-8">
        <h1 class="text-3xl font-bold text-gray-900 mb-2">Welcome back, {$currentUser?.username}!</h1>
        <p class="text-gray-600 mb-6">Manage your projects and track your impact.</p>
        
        <!-- Search Bar -->
         <div class="w-full mx-auto mb-8 inline-block">
            <div class="flex max-w-md">
            <input
                type="text"
                bind:value={searchQuery}
                placeholder="Search projects"
                class="flex-1 px-4 py-3 border border-gray-300 rounded-l-lg focus:outline-none"
            />
            <button aria-label="projects" class="bg-blue-500 text-white px-6 py-3 rounded-r-lg hover:bg-blue-600 cursor-pointer">
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
            </button>
            <button onclick={() => goto('/projects')} class= "mx-4 text-blue-600 cursor-pointer">See all projects</button>
            </div>
            
        </div>
        

        
        <!-- Most Popular Project -->
        {#if mostPopularProject}
          <div class="bg-gradient-to-r from-orange-50 to-orange-100 border border-orange-200 rounded-lg p-6">
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
        
        {#if myProjects.length > 0}
          <div class="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {#each myProjects as project}
              <div class="bg-white rounded-lg border border-gray-200 p-6 group relative">
                <!-- Action Buttons -->
                <div class="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity">
                  <div class="flex space-x-1">
                    <button 
                    aria-label="edit project"
                      onclick={() => editProject(project.id)}
                      class="cursor-pointer p-1 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded"
                      title="Edit"
                    >
                      <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"/>
                      </svg>
                    </button>
                    <button
                      aria-label="duplicate project"
                      onclick={() => duplicateProject(project.id)}
                      class="cursor-pointer p-1 text-gray-400 hover:text-green-600 hover:bg-green-50 rounded"
                      title="Duplicate"
                    >
                      <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"/>
                      </svg>
                    </button>
                    <button 
                      aria-label="delete project"
                      onclick={() => deleteProject(project.id)}
                      class="cursor-pointer p-1 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded"
                      title="Delete"
                    >
                      <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/>
                      </svg>
                    </button>
                  </div>
                </div>
                
                <!-- Project Content -->
                <a href="/project/{project.id}" class="block">
                  <h3 class="text-lg font-semibold text-gray-900 mb-2 pr-16">
                    {project.title.length > 30 ? project.title.slice(0, 30) + '...' : project.title}
                  </h3>
                  <p class="text-gray-600 text-sm mb-4">
                    {project.description.length > 100 ? project.description.slice(0, 100) + '...' : project.description}
                  </p>
                  
                  <!-- Tags -->
                  <div class="flex flex-wrap gap-1 mb-4">
                    {#each project.tags.slice(0, 3) as tag}
                      <span class="bg-blue-100 text-blue-700 px-2 py-1 rounded text-xs">
                        {tag.length > 10 ? tag.slice(0, 10) + '...' : tag}
                      </span>
                    {/each}
                  </div>
                  
                  <!-- Stats -->
                  <div class="flex items-center justify-between text-gray-500 text-sm">
                    <div class="flex items-center space-x-3">
                      <span class="flex items-center">
                        <svg class="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 15l7-7 7 7"/>
                        </svg>
                        {project.upvotes}
                      </span>
                      <span class="flex items-center">
                        <svg class="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"/>
                        </svg>
                        {project.downvotes}
                      </span>
                      <span class="flex items-center">
                        <svg class="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"/>
                        </svg>
                        {project.comments}
                      </span>
                    </div>
                    <span class="text-xs text-gray-400">
                      {new Date(project.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                </a>
              </div>
            {/each}
          </div>
        {:else}
          <div class="text-center py-12">
            <svg class="w-16 h-16 text-gray-300 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"/>
            </svg>
            <h3 class="text-lg font-medium text-gray-900 mb-2">No projects yet</h3>
            <p class="text-gray-500 mb-6">Create your first project to get started!</p>
            <a 
              href="/create"
              class="bg-orange-500 text-white px-6 py-2 rounded-lg hover:bg-orange-600 transition-colors"
            >
              Create Your First Project
            </a>
          </div>
        {/if}
      </div>
       <!-- Notifications Section -->
      <div class="mb-8">
        <h2 class="text-xl font-bold text-gray-900 mb-4">Recent Activity</h2>
        <div class="bg-white rounded-lg border border-gray-200 divide-y divide-gray-200">
          {#each notifications.slice(0, 3) as notification}
            <div class="p-4 hover:bg-gray-50 {notification.read ? 'opacity-60' : ''}">
              <div class="flex items-start space-x-3">
                <span class="text-lg">{getNotificationIcon(notification.type)}</span>
                <div class="flex-1 min-w-0">
                  <p class="text-sm text-gray-900">{notification.message}</p>
                  <p class="text-xs text-gray-500 mt-1">{notification.createdAt.toLocaleDateString()} at {notification.createdAt.toLocaleTimeString()}</p>
                </div>
                {#if !notification.read}
                  <div class="w-2 h-2 bg-blue-500 rounded-full mt-2"></div>
                {/if}
              </div>
            </div>
          {/each}
          <div class="p-4 text-center">
            <button class="text-sm text-orange-600 hover:text-orange-800 font-medium">View all activity</button>
          </div>
        </div>
      </div>
    </div>
  </div>
</div>

<!-- Click outside to close menus -->
{#if showProfileMenu || showNotifications}
  <!-- svelte-ignore a11y-click-events-have-key-events -->
  <!-- svelte-ignore a11y-no-static-element-interactions -->
  <div class="fixed inset-0 z-0" onclick={() => {showProfileMenu = false; showNotifications = false;}}></div>
{/if}