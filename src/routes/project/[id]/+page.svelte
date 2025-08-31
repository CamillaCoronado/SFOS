<script lang="ts">
  import { page } from '$app/stores';
  import { projects } from '$lib/stores/projects';
  import Voting from '$lib/components/Voting.svelte';
  import CommentThread from '$lib/CommentThread.svelte';
  import GovBadge from '$lib/components/GovBadge.svelte';
  import { readable, type Readable } from 'svelte/store';
  import { userProfileStore } from '$lib/stores/userProfiles';
  import type { UserProfile } from '$lib/stores/auth/auth';

  $: project = $projects.find(p => p.id === $page.params.id);


  let authorProfile: Readable<UserProfile | null> = readable(null);
  $: if (project) authorProfile = userProfileStore(project.authorId);
  
</script>

<div class="max-w-4xl mx-auto px-4 py-8">
  {#if project}
  <!-- back button -->
    <a href="/projects" class="inline-block bg-gray-100 text-gray-700 px-4 py-2 rounded hover:bg-gray-200">
      ← Back to Projects
    </a>
  <div class="bg-white shadow-sm border border-gray-200 rounded-lg p-8">
    <h1 class="text-3xl font-bold text-gray-900 mb-4">{project.title}</h1>
    
    <!-- meta info -->
    <div class="flex items-center gap-4 mb-6 text-sm text-gray-500">
      <span>by {project.authorName}</span>
      {#if $authorProfile?.gov?.verified && $authorProfile?.gov?.showBadge}
        <GovBadge size="xs" />
      {/if}
      <span>•</span>
      <span>{project.createdAt.toLocaleDateString()}</span>
      <span>•</span>
      <span class="capitalize">{project.experienceLevel} level</span>
    </div>
    
    <p class="text-gray-600 text-lg mb-8">{project.description}</p>
    
    <!-- voting section -->
    <div class="flex items-center gap-4 mb-8 p-4 bg-gray-50 rounded-lg">
      <Voting {project} />
    </div>
    
    <!-- project details grid -->
    <div class="grid md:grid-cols-2 gap-6 mb-8">
      <div>
        <h3 class="font-semibold text-gray-900 mb-2">Time Commitment</h3>
        <p class="text-gray-600">{project.timeCommitment}</p>
      </div>
      
      <div>
        <h3 class="font-semibold text-gray-900 mb-2">Duration</h3>
        <p class="text-gray-600">{project.duration}</p>
      </div>
      
      <div>
        <h3 class="font-semibold text-gray-900 mb-2">Contact</h3>
        <p class="text-gray-600 capitalize">{project.contactMethod}: {project.contactInfo}</p>
      </div>
      
      {#if project.githubUrl}
        <div>
          <h3 class="font-semibold text-gray-900 mb-2">Repository</h3>
          <a href={project.githubUrl} class="text-blue-600 hover:underline" target="_blank">
            View on GitHub
          </a>
        </div>
      {/if}
    </div>
    
    <!-- tags -->
    <div class="mb-8">
      <h3 class="font-semibold text-gray-900 mb-3">Tags</h3>
      <div class="flex flex-wrap gap-2">
        {#each project.tags as tag}
          <span class="bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-sm">{tag}</span>
        {/each}
      </div>
    </div>

    <div class="mt-10 border-t pt-8">
      <h3 class="font-semibold text-gray-900 mb-3">Comments</h3>
      <CommentThread projectId={project.id} />
    </div>
  </div>
  {:else}
  <div class="max-w-4xl mx-auto px-4 py-8 text-center">
    <h1 class="text-2xl font-bold text-gray-900 mb-4">Project Not Found</h1>
    <p class="text-gray-600 mb-6">The project you're looking for doesn't exist.</p>
    <a href="/projects" class="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">
      Back to Projects
    </a>
  </div>
{/if}
</div>