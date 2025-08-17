<script lang="ts">
    import { projects } from '$lib/stores/projects';
 
    import { page } from '$app/stores';
    import { goto } from '$app/navigation';
    import ProjectCard from '$lib/components/ProjectCard.svelte';


    let searchQuery = '';

</script>

<div class="min-h-screen bg-gray-50">
  <!-- Header -->
  <header class="bg-white shadow-sm fixed w-full top-0">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="flex items-center justify-between h-16">
        <!-- Logo -->
        <div class="flex items-center">
          <img alt= "logo" src="/logo.png" class="w-8 h-8 object-cover">
          <span class="ml-2 text-orange-500 text-xl font-semibold">SFOS</span>
        </div>
        
        <!-- Nav -->
        <div class="flex items-center space-x-4">
          <button onclick={() => goto('/auth?mode=login')} class="text-gray-700 hover:text-gray-900 cursor-pointer text-sm">Log in</button>
          <button onclick={() => goto('/auth?mode=register')} class="bg-orange-500 text-sm text-white px-4 py-2 rounded-full hover:bg-orange-600 cursor-pointer">
            Sign up
          </button>
        </div>
      </div>
    </div>
  </header>

  <!-- Search Bar -->
  <div class="w-full mx-auto px-4 mt-[72px] inline-block">
    <div class="flex w-full md:max-w-md">
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

  <!-- Hero Section -->
  <section class="mx-auto px-4 mt-8">
    <div class="grid md:grid-cols-2 gap-12 items-center">
      <div>
        <h1 class="text-4xl md:text-5xl font-bold text-gray-900 leading-tight">
          A platform for government, community, and technologists to connect and build towards a better SF.
        </h1>
        <!-- <h2>SFOS</h2> -->
        <p class="mt-6 text-lg text-gray-600">
          <bold>SF OS</bold> is a community-driven library of civic technology ideas, active projects, and actionable policies, ranging from big-picture visions to projects getting built right now. 
        </p>
        <button onclick={() => goto('/auth?mode=register')} class="mt-8 bg-blue-500 text-white px-6 py-3 rounded-lg hover:bg-blue-600 cursor-pointer">
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
  <section class="mx-auto px-4 sm:px-6 lg:px-8 mt-8">
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
          <h2 class= "text-3xl">Civic Hackers</h2>
          <p class="text-gray-700">
            Explore existing ideas, find teammates, and turn your projects into reality.
            Share your solutions, get direct feedback from government and community experts, and discover more ways to contribute to civic tech across San Francisco. 
            <a href="#" class="text-blue-600 hover:underline">learn more</a>.
          </p>
        </div>
      </div>
      
      <!-- Step 2 -->
      <div class="flex items-start space-x-4 border-b pb-8">
        <div class="flex-shrink-0 w-12 h-12 bg-gray-700 rounded-full flex items-center justify-center">
          <svg class="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"/>
          </svg>
        </div>
        <div class="flex-1">
          <h2 class= "text-3xl">Government</h2>
          <p class="text-gray-700">
            Post tech challenges and ideas that civic technologists can tackle.
            Offer your insights to guide projects toward real-world impact and find innovative solutions faster.
            <a href="#" class="text-blue-600 hover:underline">learn more</a>.
          </p>
        </div>
      </div>
      <div class="flex items-start space-x-4 border-b pb-8">
        <div class="flex-shrink-0 w-12 h-12 bg-yellow-400 rounded-full flex items-center justify-center">
          <svg class="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 20 20">
            <path d="M11 3a1 1 0 10-2 0v1a1 1 0 102 0V3zM15.657 5.757a1 1 0 00-1.414-1.414l-.707.707a1 1 0 001.414 1.414l.707-.707zM18 10a1 1 0 01-1 1h-1a1 1 0 110-2h1a1 1 0 011 1zM5.05 6.464A1 1 0 106.464 5.05l-.707-.707a1 1 0 00-1.414 1.414l.707.707zM5 10a1 1 0 01-1 1H3a1 1 0 110-2h1a1 1 0 011 1zM8 16v-1a1 1 0 012 0v1a1 1 0 11-2 0zM12 14a1 1 0 00-.707.293l-.707.707a1 1 0 101.414 1.414l.707-.707A1 1 0 0012 14zM4.343 12.343a1 1 0 00-1.414 1.414l.707.707a1 1 0 001.414-1.414l-.707-.707z"/>
          </svg>
        </div>
        <div class="flex-1">
          <h2 class= "text-3xl">Residents & Civic Organizations</h2>
          <p class="text-gray-700">
            Suggest projects addressing your community’s needs, help shape ongoing initiatives, and let technologists know what would truly benefit your neighborhood.
            <a href="#" class="text-blue-600 hover:underline">learn more</a>.
          </p>
        </div>
      </div>

      
    </div>
  </section>

  <!-- Popular Projects -->
<section class="mb-12 mx-auto px-4 sm:px-6 lg:px-8 mt-8">
      <h2 class="text-2xl font-bold text-gray-900 mb-6">Popular Projects</h2>
      
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {#each $projects.slice(0, 3) as project, index}
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
</div>