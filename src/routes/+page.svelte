<script lang="ts">
    import { downvoteProject, projects, upvoteProject } from '$lib/stores/projects';

    let searchQuery = '';
    $: sortedProjects = $projects.sort((a, b) => b.score - a.score);
</script>

<div class="min-h-screen bg-gray-50">
  <!-- Header -->
  <header class="bg-white shadow-sm fixed w-full top-0">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="flex items-center justify-between h-16">
        <!-- Logo -->
        <div class="flex items-center">
          <div class="w-8 h-8 bg-orange-500 rounded-full"></div>
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

  <!-- Search Bar -->
  <div class="w-full mx-auto px-4 sm:px-6 lg:px-8 mt-[72px] inline-block">
    <div class="flex max-w-md">
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

  <!-- Hero Section -->
  <section class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-8">
    <div class="grid md:grid-cols-2 gap-12 items-center">
      <div>
        <h1 class="text-4xl md:text-5xl font-bold text-gray-900 leading-tight">
          The platform that connects civil leaders with technical people.
        </h1>
        <p class="mt-6 text-lg text-gray-600">
          Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.
        </p>
        <button class="mt-8 bg-blue-500 text-white px-6 py-3 rounded-lg hover:bg-blue-600 cursor-pointer">
          Create a Project
        </button>
      </div>
      
      <!-- Bridge Illustration -->
      <div class="flex justify-center">
        <img src="/golden-gate.png" alt="golden gate" class="w-full" />
      </div>
    </div>
  </section>

  <!-- How It Works -->
  <section class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-8">
    <h2 class="text-3xl font-bold text-gray-900 mb-12">How SFOS Works</h2>
    <div class="space-y-8">
      <!-- Step 1 -->
      <div class="flex items-start space-x-4 border-b pb-8">
        <div class="flex-shrink-0 w-12 h-12 bg-yellow-400 rounded-full flex items-center justify-center">
          <svg class="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 20 20">
            <path d="M11 3a1 1 0 10-2 0v1a1 1 0 102 0V3zM15.657 5.757a1 1 0 00-1.414-1.414l-.707.707a1 1 0 001.414 1.414l.707-.707zM18 10a1 1 0 01-1 1h-1a1 1 0 110-2h1a1 1 0 011 1zM5.05 6.464A1 1 0 106.464 5.05l-.707-.707a1 1 0 00-1.414 1.414l.707.707zM5 10a1 1 0 01-1 1H3a1 1 0 110-2h1a1 1 0 011 1zM8 16v-1a1 1 0 012 0v1a1 1 0 11-2 0zM12 14a1 1 0 00-.707.293l-.707.707a1 1 0 101.414 1.414l.707-.707A1 1 0 0012 14zM4.343 12.343a1 1 0 00-1.414 1.414l.707.707a1 1 0 001.414-1.414l-.707-.707z"/>
          </svg>
        </div>
        <div class="flex-1">
          <p class="text-gray-700">
            Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore. <a href="#" class="text-blue-600 hover:underline">learn more</a>.
          </p>
        </div>
      </div>
      
      <!-- Step 2 -->
      <div class="flex items-start space-x-4">
        <div class="flex-shrink-0 w-12 h-12 bg-gray-700 rounded-full flex items-center justify-center">
          <svg class="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"/>
          </svg>
        </div>
        <div class="flex-1">
          <p class="text-gray-700">
            Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. <a href="#" class="text-blue-600 hover:underline">learn more</a>.
          </p>
        </div>
      </div>
    </div>
  </section>

  <!-- Popular Projects -->
  <section class="max-w-7xl sm:px-6 lg:px-8 mt-8 mb-4">
  <h2 class="text-3xl font-bold text-gray-900 mb-8 pl-4">Popular Projects</h2>
  
  <div class="grid md:grid-cols-2 gap-6">
    {#each sortedProjects as project}
    <a href="/project/{project.id}" class="block hover:shadow-md transition-shadow">
      <div class="bg-white shadow-sm border border-gray-200 p-6">
        <h3 class="text-xl font-semibold text-gray-900 mb-2">{project.title}</h3>
        <p class="text-gray-600 mb-4">
          {project.description}
        </p>
        
        <!-- Tags -->
        <div class="flex flex-wrap gap-2 mb-4">
          {#each project.tags as tag}
            <span class="bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-sm">{tag}</span>
          {/each}
        </div>
        
        <!-- Stats -->
        <div class="flex items-center justify-between text-gray-500">
          <div class="flex items-center space-x-4">
            <span class="flex items-center">
                <button onclick={() => upvoteProject(project.id)}>
                    <svg class="w-5 h-5 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 15l7-7 7 7"/>
                    </svg>
                </button>
                </span>
                <span>{project.score}</span>
                <span class="flex items-center">
                <button onclick={() => downvoteProject(project.id)}>
                    <svg class="w-5 h-5 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"/>
                    </svg>
                </button>
            </span>
            <span class="flex items-center">
              <svg class="w-5 h-5 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"/>
              </svg>
              {project.comments}
            </span>
          </div>
          <div class="flex -space-x-2">
            {#each project.avatars.slice(0, 3) as avatar}
              <img src={avatar} alt="contributor" class="w-8 h-8 rounded-full border-2 border-white" />
            {:else}
              <!-- fallback avatars when no real ones -->
              <div class="w-8 h-8 bg-gray-300 rounded-full border-2 border-white"></div>
              <div class="w-8 h-8 bg-gray-400 rounded-full border-2 border-white"></div>
            {/each}
          </div>
        </div>
      </div>
      </a>
    {:else}
      <div class="col-span-2 text-center py-12">
        <p class="text-gray-500 text-lg">No projects yet. <a href="/create" class="text-blue-600 hover:underline">Create the first one!</a></p>
      </div>
    {/each}
  </div>
</section>
</div>