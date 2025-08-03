<!-- src/routes/projects/+page.svelte -->
<script lang="ts">
  import { projects } from '$lib/stores/projects';
  import type { Project } from '$lib/stores/projects';
  import ProjectCard from '$lib/components/ProjectCard.svelte';
  
  let searchQuery = '';
  let selectedTags: string[] = [];
  
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
  <header class="bg-white shadow-sm fixed w-full top-0 z-20">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="flex items-center justify-between h-16">
        <!-- Logo -->
        <div class="flex items-center">
         <img alt= "logo" src="/logo.png" class="w-8 h-8 object-cover">
          <span class="ml-2 text-orange-500 text-xl font-semibold">SFOS</span>
        </div>
        
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
            <button class="bg-blue-500 text-white px-6 py-3 rounded-r-lg hover:bg-blue-600 cursor-pointer">
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