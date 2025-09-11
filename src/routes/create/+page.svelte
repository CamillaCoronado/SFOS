<script lang="ts">
  import { addProject } from '$lib/stores/projects';
  import { goto } from '$app/navigation';
  import NeedsEditor, { type Needs } from '$lib/components/NeedsEditor.svelte';

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
  let userType: 'civic-hacker' | 'government' | 'resident-org' = 'civic-hacker';
  let kind: 'project' | 'idea' = 'project';

  // needs only matter for projects
  let needs: Needs = { eng:0, design:0, data:0, product:0, research:0, ops:0, policy:0 };

  let isLoading = false;
  let error: string | null = null;
  let fieldErrors: Record<string,string> = {};

  $: isProject = kind === 'project';
  $: pageTitle = isProject ? 'Create Project' : 'Share Idea';
  $: submitLabel = isProject ? 'Publish Project' : 'Post Idea';
  $: descPH = isProject
    ? 'What problem are you solving? What’s the approach, milestones, and what you need from contributors.'
    : 'Describe the spark. What’s the problem, a possible direction, and what kind of feedback you want.';

  function validate() {
    fieldErrors = {};
    if (!title.trim()) fieldErrors.title = 'Title is required.';
    if (!description.trim()) fieldErrors.description = 'Description is required.';

    if (isProject) {
      if (!timeCommitment.trim()) fieldErrors.timeCommitment = 'Time commitment is required for projects.';
      if (!duration.trim()) fieldErrors.duration = 'Duration is required for projects.';
      // at least one needed role?
      const sumNeeds = Object.values(needs).reduce((a,b)=>a+(Number(b)||0),0);
      if (sumNeeds === 0) fieldErrors.needs = 'Select at least one contributor need.';
      if (!contactInfo.trim()) fieldErrors.contactInfo = 'Contact information is required for projects.';
    } else {
      // idea: contact optional but recommended if you want collab
    }
    return Object.keys(fieldErrors).length === 0;
  }

  async function handleSubmit(e: Event) {
    e.preventDefault();
    error = null;
    if (!validate()) return;

    isLoading = true;
    try {
      await addProject({
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
        authorType: userType,
        needs: isProject ? needs : null,
        kind
      });
      await goto('/projects');
    } catch (err) {
      console.error('Submission failed:', err);
      error = err instanceof Error ? err.message : 'Failed to create item';
    } finally {
      isLoading = false;
    }
  }
</script>

<div class="min-h-screen bg-gray-50 py-12">
  <div class="max-w-2xl mx-auto px-4">
    <div class="bg-white shadow-sm border border-gray-200 rounded-lg p-8">
      <h1 class="text-2xl font-semibold text-gray-900 mb-1">{pageTitle}</h1>
      <p class="text-sm text-gray-500 mb-6">
        {#if isProject}
          Projects need scope, timeline, and contributor needs.
        {:else}
          Ideas are lightweight. Share the problem and a possible direction. You can convert to a project later.
        {/if}
      </p>

      {#if error}
        <div class="mb-4 rounded-md border border-red-300 bg-red-50 px-3 py-2 text-red-800 text-sm">{error}</div>
      {/if}

      <form onsubmit={handleSubmit} class="space-y-6">
        <!-- Type -->
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">Type</label>
          <select bind:value={kind} class="w-full px-3 py-2 border rounded-md">
            <option value="project">Project</option>
            <option value="idea">Idea</option>
          </select>
        </div>

        <!-- Title -->
        <div>
          <label for="title" class="block text-sm font-medium text-gray-700 mb-2">
            {isProject ? 'Project Title*' : 'Idea Title*'}
          </label>
          <input
            id="title"
            type="text"
            bind:value={title}
            required
            class="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 {fieldErrors.title ? 'border-red-400' : 'border-gray-300'}"
            placeholder={isProject ? "What's your project about?" : "What’s your idea?"}
          />
          {#if fieldErrors.title}<p class="text-xs text-red-600 mt-1">{fieldErrors.title}</p>{/if}
        </div>

        <!-- Description -->
        <div>
          <label for="description" class="block text-sm font-medium text-gray-700 mb-2">
            Description*
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
            <p class="text-xs text-gray-500 mt-1">Tip: Ask a question or propose next steps you’d like feedback on.</p>
          {/if}
          {#if fieldErrors.description}<p class="text-xs text-red-600 mt-1">{fieldErrors.description}</p>{/if}
        </div>

        <!-- Tags -->
        <div>
          <label for="tags" class="block text-sm font-medium text-gray-700 mb-2">Tags</label>
          <input
            id="tags"
            type="text"
            bind:value={tags}
            class="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 border-gray-300"
            placeholder="civic data, transit, parks (comma separated)"
          />
          <p class="text-sm text-gray-500 mt-1">Separate tags with commas</p>
        </div>

        <!-- Project-only: Experience + Needs -->
        {#if isProject}
          <div>
            <label for="experienceLevel" class="block text-sm font-medium text-gray-700 mb-2">
              Experience Level Required*
            </label>
            <select
              id="experienceLevel"
              bind:value={experienceLevel}
              class="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 border-gray-300"
            >
              <option value="beginner">Beginner</option>
              <option value="intermediate">Intermediate</option>
              <option value="advanced">Advanced</option>
            </select>
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">
              Contributors Needed* {#if fieldErrors.needs}<span class="text-red-600 text-xs">({fieldErrors.needs})</span>{/if}
            </label>
            <NeedsEditor bind:needs={needs} />
            <p class="text-xs text-gray-500 mt-1">Set at least one role above zero.</p>
          </div>
        {:else}
          <div class="rounded-md bg-gray-50 border border-gray-200 p-3">
            <p class="text-sm text-gray-700">
              Want help right away? Switch to <span class="font-medium">Project</span> to list contributor needs, time, and duration.
            </p>
          </div>
        {/if}

        <!-- Time Commitment & Duration (project required, idea optional/hidden) -->
        {#if isProject}
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label for="timeCommitment" class="block text-sm font-medium text-gray-700 mb-2">
                Time Commitment*
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
                Duration*
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

        <!-- Contact Method & Info (project required, idea optional) -->
        <div>
          <label for="contactMethod" class="block text-sm font-medium text-gray-700 mb-2">
            Preferred Contact Method{isProject ? '*' : ' (optional)'}
          </label>
          <select
            id="contactMethod"
            bind:value={contactMethod}
            class="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 border-gray-300"
          >
            <option value="discord">Discord</option>
            <option value="email">Email</option>
            <option value="github">GitHub</option>
            <option value="other">Other</option>
          </select>
        </div>

        <div>
          <label for="contactInfo" class="block text-sm font-medium text-gray-700 mb-2">
            Contact Information{isProject ? '*' : ' (optional)'}
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
              contactMethod === 'github' ? 'github.com/username' : 'Contact details'
            }
          />
          {#if !isProject}
            <p class="text-xs text-gray-500 mt-1">Add contact if you’re open to collaborators or feedback.</p>
          {/if}
          {#if fieldErrors.contactInfo}<p class="text-xs text-red-600 mt-1">{fieldErrors.contactInfo}</p>{/if}
        </div>

        <!-- Optional links/images for both -->
        <div>
          <label for="githubUrl" class="block text-sm font-medium text-gray-700 mb-2">
            GitHub Repository (optional)
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
            Image URL (optional)
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
        <div class="pt-4">
          <button
            type="submit"
            class="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors disabled:opacity-60"
            disabled={isLoading}
          >
            {isLoading ? 'Saving…' : submitLabel}
          </button>
        </div>
      </form>
    </div>
  </div>
</div>
