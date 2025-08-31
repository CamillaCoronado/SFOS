<!-- src/lib/components/ProjectCard.svelte -->
<script lang="ts">
  import { goto } from '$app/navigation';
  import { page } from '$app/stores';
  import type { Project, VoteType} from '$lib/stores/projects';
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
  
  function truncateTitle(title: string, maxLength: number) {
    return title.length > maxLength ? title.slice(0, maxLength) + '...' : title;
  }
  
  function editProject(e: Event) {
    e.preventDefault();
    e.stopPropagation();
    console.log('Edit project:', project.id);
  }
  
  function deleteProject(e: Event) {
    e.preventDefault();
    e.stopPropagation();
    console.log('Delete project:', project.id);
  }
  
  function duplicateProject(e: Event) {
    e.preventDefault();
    e.stopPropagation();
    console.log('Duplicate project:', project.id);
  }

</script>

<a href="/project/{project.id}" class="block group">
  {#if variant === 'popular'}
    <!-- Popular projects variant (colored background, horizontal layout) -->
    <div class="relative rounded-lg p-6 h-48 group-hover:shadow-md transition-shadow">
      <!-- Overlapping circles -->
      <div class="absolute top-4 right-4 flex">
        <div class="w-8 h-8 bg-orange-500 rounded-full"></div>
        <div class="w-8 h-8 bg-blue-500 rounded-full -ml-2"></div>
      </div>
      
      <div class="relative z-10">
        <h3 class="text-lg font-semibold text-gray-900 mb-2">{truncateTitle(project.title, 25)}</h3>
        <p class="text-gray-700 text-sm mb-4 line-clamp-3">{project.description.length > 100 ? project.description.slice(0, 100) + '...' : project.description}</p>
        
        <!-- Tags -->
        <div class="flex flex-wrap gap-1 mb-4">
          {#each project.tags.slice(0, 3) as tag}
            <span class="bg-blue-500 text-white px-2 py-1 rounded text-xs">
              {tag.length > 10 ? tag.slice(0, 10) + '...' : tag}
            </span>
          {/each}
        </div>
        
        <!-- Stats -->
        <div class="flex items-center text-gray-600 text-sm">
          <Voting {project} />
          <div class="flex items-center">
            <svg class="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"/>
            </svg>
            {project.comments}
          </div>
        </div>
      </div>
    </div>
    
  {:else if variant === 'dashboard'}
    <!-- Dashboard variant (with action buttons) -->
    <div class="bg-white rounded-lg border border-gray-200 p-6 group relative">
      <!-- Action Buttons -->
      <div class="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity">
        <div class="flex space-x-1">
          <button aria-label="edit" 
            onclick={editProject}
            class="p-1 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded"
            title="Edit"
          >
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"/>
            </svg>
          </button>
          <button
            aria-label="duplicate project" 
            onclick={duplicateProject}
            class="p-1 text-gray-400 hover:text-green-600 hover:bg-green-50 rounded"
            title="Duplicate"
          >
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"/>
            </svg>
          </button>
          <button 
            aria-label="delete project"
            class="p-1 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded"
            title="Delete"
          >
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/>
            </svg>
          </button>
        </div>
      </div>
      
      <h3 class="text-lg font-semibold text-gray-900 mb-2 pr-16">
        {truncateTitle(project.title, 30)}
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
          <Voting {project} />
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
    </div>
    
  {:else}
    <!-- Standard variant (white background, grid layout) -->
    <div class="bg-white rounded-lg border border-gray-200 p-6 group-hover:shadow-md transition-shadow">
      <!-- Overlapping circles -->
      <div class="flex justify-end mb-4">
        <div class="w-6 h-6 bg-orange-500 rounded-full"></div>
        <div class="w-6 h-6 bg-blue-500 rounded-full -ml-2"></div>
      </div>
      
      <h3 class="text-lg font-semibold text-gray-900 mb-2">{truncateTitle(project.title, 30)}</h3>
      <p class="text-gray-700 text-sm mb-4">{project.description.length > 100 ? project.description.slice(0, 100) + '...' : project.description}</p>
      
      <!-- Tags -->
      <div class="flex flex-wrap gap-1 mb-4">
        {#each project.tags.slice(0, 3) as tag}
          <span class="bg-blue-500 text-white px-2 py-1 rounded text-xs">
            {tag.length > 10 ? tag.slice(0, 10) + '...' : tag}
          </span>
        {/each}
      </div>
      {#if project.needs}
        <div class="mt-2"><NeedsChips needs={project.needs} /></div>
      {/if}
      
      <!-- Stats -->
      <div class="flex items-center text-gray-600 text-sm">
        <Voting {project} />
        <div class="flex items-center">
          <svg class="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"/>
          </svg>
          {project.comments}
        </div>
      </div>
    </div>
  {/if}
</a>