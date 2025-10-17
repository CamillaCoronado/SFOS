<script lang="ts">
  import { updateProject, projects } from '$lib/stores/projects';
  import { goto } from '$app/navigation';
  import { page } from '$app/stores';
  import { currentUser } from '$lib/stores/auth/auth';
  import NeedsEditor, { type Needs } from '$lib/components/NeedsEditor.svelte';
  import { onMount } from 'svelte';

  // get project from store
  $: project = $projects.find(p => p.id === $page.params.id);
  $: canEdit = $currentUser && project && $currentUser.id === project.authorId;

  // form state
  let title = '';
  let description = '';
  let tags = '';
  let githubUrl = '';
  let imageUrl = '';
  let experienceLevel: 'beginner' | 'intermediate' | 'advanced' = 'beginner';
  let timeCommitment = '';
  let duration = '';
  let contactMethod: 'discord' | 'email' | 'github' | 'other' = 'email';
  let contactInfo = '';
  let kind: 'project' | 'idea' = 'project';
  let needs: Needs = { eng:0, design:0, data:0, product:0, research:0, ops:0, policy:0 };

  let isLoading = false;
  let error: string | null = null;
  let fieldErrors: Record<string,string> = {};
  let loaded = false;

  // populate form when project loads
  $: if (project && !loaded) {
    title = project.title;
    description = project.description;
    tags = project.tags?.join(', ') || '';
    githubUrl = project.githubUrl || '';
    imageUrl = project.imageUrl || '';
    experienceLevel = project.experienceLevel;
    timeCommitment = project.timeCommitment;
    duration = project.duration;
    contactMethod = project.contactMethod;
    contactInfo = project.contactInfo;
    kind = project.kind || 'project';
    needs = project.needs || { eng:0, design:0, data:0, product:0, research:0, ops:0, policy:0 };
    loaded = true;
  }

  $: isProject = kind === 'project';
  $: pageTitle = isProject ? 'edit project' : 'edit idea';
  $: submitLabel = isProject ? 'save project' : 'save idea';
  $: descPH = isProject
  ? 'what problem are you solving? what\'s the approach, milestones, and what you need from contributors.'
  : 'describe the spark. what\'s the problem, a possible direction, and what kind of feedback you want.';

  function validate() {
    fieldErrors = {};
    if (!title.trim()) fieldErrors.title = 'title is required.';
    if (!description.trim()) fieldErrors.description = 'description is required.';

    if (isProject) {
      if (!timeCommitment.trim()) fieldErrors.timeCommitment = 'time commitment is required for projects.';
      if (!duration.trim()) fieldErrors.duration = 'duration is required for projects.';
      const sumNeeds = Object.values(needs).reduce((a,b)=>a+(Number(b)||0),0);
      if (sumNeeds === 0) fieldErrors.needs = 'select at least one contributor need.';
      if (!contactInfo.trim()) fieldErrors.contactInfo = 'contact information is required for projects.';
    }
    return Object.keys(fieldErrors).length === 0;
  }

  async function handleSubmit(e: Event) {
    e.preventDefault();
    if (!project) return;
    error = null;
    if (!validate()) return;

    isLoading = true;
    try {
      await updateProject(project.id, {
        title: title.trim(),
        description: description.trim(),
        tags: tags.split(',').map(t => t.trim()).filter(Boolean),
        githubUrl: githubUrl || undefined,
        imageUrl: imageUrl || undefined,
        experienceLevel: isProject ? experienceLevel : 'beginner',
        timeCommitment: isProject ? timeCommitment : '',
        duration: isProject ? duration : '',
        contactMethod,
        contactInfo: contactInfo || '',
        needs: isProject ? needs : null,
        kind
      });
      await goto(`/project/${project.id}`);
    } catch (err) {
      console.error('update failed:', err);
      error = err instanceof Error ? err.message : 'failed to update';
    } finally {
      isLoading = false;
    }
  }
</script>

{#if !project}
  <div class="min-h-screen bg-gray-50 py-12">
    <div class="max-w-2xl mx-auto px-4 text-center">
      <h1 class="text-2xl font-bold text-gray-900 mb-2">project not found</h1>
      <a href="/projects" class="text-orange-600 hover:text-orange-700">back to projects</a>
    </div>
  </div>
{:else if !canEdit}
  <div class="min-h-screen bg-gray-50 py-12">
    <div class="max-w-2xl mx-auto px-4 text-center">
      <h1 class="text-2xl font-bold text-gray-900 mb-2">unauthorized</h1>
      <p class="text-gray-600 mb-4">you can only edit your own projects</p>
      <a href="/projects" class="text-orange-600 hover:text-orange-700">back to projects</a>
    </div>
  </div>
{:else}
  <div class="min-h-screen bg-gray-50 py-12">
    <div class="max-w-2xl mx-auto px-4">
      <div class="mb-4">
        <a href="/project/{project.id}" class="text-sm text-gray-600 hover:text-gray-900">← back to project</a>
      </div>

      <div class="bg-white shadow-sm border border-gray-200 rounded-lg p-8">
        <h1 class="text-2xl font-semibold text-gray-900 mb-1">{pageTitle}</h1>
        <p class="text-sm text-gray-500 mb-6">
          {#if isProject}
            projects need scope, timeline, and contributor needs.
          {:else}
            ideas are lightweight. share the problem and a possible direction.
          {/if}
        </p>

        {#if error}
          <div class="mb-4 rounded-md border border-red-300 bg-red-50 px-3 py-2 text-red-800 text-sm">{error}</div>
        {/if}

        <form onsubmit={handleSubmit} class="space-y-6">
          <!-- Type -->
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">type</label>
            <select bind:value={kind} class="w-full px-3 py-2 border rounded-md">
              <option value="project">project</option>
              <option value="idea">idea</option>
            </select>
          </div>

          <!-- Title -->
          <div>
            <label for="title" class="block text-sm font-medium text-gray-700 mb-2">
              {isProject ? 'project title*' : 'idea title*'}
            </label>
            <input
              id="title"
              type="text"
              bind:value={title}
              required
              class="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 {fieldErrors.title ? 'border-red-400' : 'border-gray-300'}"
              placeholder={isProject ? "what's your project about?" : "what's your idea?"}
            />
            {#if fieldErrors.title}<p class="text-xs text-red-600 mt-1">{fieldErrors.title}</p>{/if}
          </div>

          <!-- Description -->
          <div>
            <label for="description" class="block text-sm font-medium text-gray-700 mb-2">
              description*
            </label>
            <textarea
              id="description"
              bind:value={description}
              required
              rows="4"
              class="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 {fieldErrors.description ? 'border-red-400' : 'border-gray-300'}"
              placeholder={descPH}
            ></textarea>
            {#if !isProject}
              <p class="text-xs text-gray-500 mt-1">tip: ask a question or propose next steps you'd like feedback on.</p>
            {/if}
            {#if fieldErrors.description}<p class="text-xs text-red-600 mt-1">{fieldErrors.description}</p>{/if}
          </div>

          <!-- Tags -->
          <div>
            <label for="tags" class="block text-sm font-medium text-gray-700 mb-2">tags</label>
            <input
              id="tags"
              type="text"
              bind:value={tags}
              class="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 border-gray-300"
              placeholder="civic data, transit, parks (comma separated)"
            />
            <p class="text-sm text-gray-500 mt-1">separate tags with commas</p>
          </div>

          <!-- Project-only: Experience + Needs -->
          {#if isProject}
            <div>
              <label for="experienceLevel" class="block text-sm font-medium text-gray-700 mb-2">
                experience level required*
              </label>
              <select
                id="experienceLevel"
                bind:value={experienceLevel}
                class="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 border-gray-300"
              >
                <option value="beginner">beginner</option>
                <option value="intermediate">intermediate</option>
                <option value="advanced">advanced</option>
              </select>
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">
                contributors needed* {#if fieldErrors.needs}<span class="text-red-600 text-xs">({fieldErrors.needs})</span>{/if}
              </label>
              <NeedsEditor bind:needs={needs} />
              <p class="text-xs text-gray-500 mt-1">set at least one role above zero.</p>
            </div>
          {:else}
            <div class="rounded-md bg-gray-50 border border-gray-200 p-3">
              <p class="text-sm text-gray-700">
                want help right away? switch to <span class="font-medium">project</span> to list contributor needs, time, and duration.
              </p>
            </div>
          {/if}

          <!-- Time Commitment & Duration -->
          {#if isProject}
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label for="timeCommitment" class="block text-sm font-medium text-gray-700 mb-2">
                  time commitment*
                </label>
                <input
                  id="timeCommitment"
                  type="text"
                  bind:value={timeCommitment}
                  required={isProject}
                  class="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 {fieldErrors.timeCommitment ? 'border-red-400' : 'border-gray-300'}"
                  placeholder="5–10 hours/week"
                />
                {#if fieldErrors.timeCommitment}<p class="text-xs text-red-600 mt-1">{fieldErrors.timeCommitment}</p>{/if}
              </div>
              <div>
                <label for="duration" class="block text-sm font-medium text-gray-700 mb-2">
                  duration*
                </label>
                <input
                  id="duration"
                  type="text"
                  bind:value={duration}
                  required={isProject}
                  class="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 {fieldErrors.duration ? 'border-red-400' : 'border-gray-300'}"
                  placeholder="2–3 months"
                />
                {#if fieldErrors.duration}<p class="text-xs text-red-600 mt-1">{fieldErrors.duration}</p>{/if}
              </div>
            </div>
          {/if}

          <!-- Contact Method & Info -->
          <div>
            <label for="contactMethod" class="block text-sm font-medium text-gray-700 mb-2">
              preferred contact method{isProject ? '*' : ' (optional)'}
            </label>
            <select
              id="contactMethod"
              bind:value={contactMethod}
              class="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 border-gray-300"
            >
              <option value="discord">discord</option>
              <option value="email">email</option>
              <option value="github">github</option>
              <option value="other">other</option>
            </select>
          </div>

          <div>
            <label for="contactInfo" class="block text-sm font-medium text-gray-700 mb-2">
              contact information{isProject ? '*' : ' (optional)'}
            </label>
            <input
              id="contactInfo"
              type="text"
              bind:value={contactInfo}
              required={isProject}
              class="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 {fieldErrors.contactInfo ? 'border-red-400' : 'border-gray-300'}"
              placeholder={
                contactMethod === 'discord' ? 'username#1234' :
                contactMethod === 'email' ? 'your@email.com' :
                contactMethod === 'github' ? 'github.com/username' : 'contact details'
              }
            />
            {#if !isProject}
              <p class="text-xs text-gray-500 mt-1">add contact if you're open to collaborators or feedback.</p>
            {/if}
            {#if fieldErrors.contactInfo}<p class="text-xs text-red-600 mt-1">{fieldErrors.contactInfo}</p>{/if}
          </div>

          <!-- Optional links/images -->
          <div>
            <label for="githubUrl" class="block text-sm font-medium text-gray-700 mb-2">
              github repository (optional)
            </label>
            <input
              id="githubUrl"
              type="url"
              bind:value={githubUrl}
              class="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 border-gray-300"
              placeholder="https://github.com/username/repo"
            />
          </div>

          <div>
            <label for="imageUrl" class="block text-sm font-medium text-gray-700 mb-2">
              image url (optional)
            </label>
            <input
              id="imageUrl"
              type="url"
              bind:value={imageUrl}
              class="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 border-gray-300"
              placeholder="https://example.com/cover.jpg"
            />
          </div>

          <!-- Submit -->
          <div class="pt-4 flex gap-3">
            <button
              type="button"
              onclick={() => goto(`/project/${project.id}`)}
              class="flex-1 bg-gray-100 text-gray-700 py-2 px-4 rounded-md hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 transition-colors"
            >
              cancel
            </button>
            <button
              type="submit"
              class="flex-1 bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors disabled:opacity-60"
              disabled={isLoading}
            >
              {isLoading ? 'saving…' : submitLabel}
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
{/if}