<script lang="ts">
  import { upvoteProject, downvoteProject, getCurrentUserVote } from '$lib/stores/projects';
  import type { Project, VoteType } from '$lib/stores/projects';
  import { currentUser } from '$lib/stores/auth/auth';

  let { project }: { project: Project } = $props();
  let userVote: VoteType | null = $state(null);

  $effect(() => {
    if ($currentUser && project?.id) {
      getCurrentUserVote(project.id).then(v => (userVote = v));
    } else {
      userVote = null;
    }
  });

  function abbreviate(n: number | undefined) {
    const v = Number(n ?? 0);
    if (v >= 1_000_000) return (v / 1_000_000).toFixed(v % 1_000_000 ? 1 : 0) + 'M';
    if (v >= 1_000) return (v / 1_000).toFixed(v % 1_000 ? 1 : 0) + 'k';
    return String(v);
  }

  function handleUpvote(e?: Event) {
    e?.preventDefault();
    e?.stopPropagation();
    upvoteProject(project.id);
  }

  function handleDownvote(e?: Event) {
    e?.preventDefault();
    e?.stopPropagation();
    downvoteProject(project.id);
  }
</script>

<div
  class="flex items-center justify-center gap-2 select-none"
  role="group"
  aria-label="Project voting controls"
>
  <button
    type="button"
    title={userVote === 'up' ? 'Remove upvote' : 'Upvote'}
    aria-pressed={userVote === 'up'}
    class="flex items-center justify-center w-5 h-5 rounded hover:bg-orange-50 focus:outline-none focus-visible:ring-2 focus-visible:ring-orange-500 transition"
    onclick={handleUpvote}
  >
    <div
      class={`w-0 h-0 border-l-4 border-r-4 border-b-6 ${
        userVote === 'up' ? 'border-b-orange-500' : 'border-b-gray-400'
      } border-l-transparent border-r-transparent`}
    ></div>
    <span class="sr-only">Upvote</span>
  </button>

  <span
    class={`w-5 h-5 flex items-center justify-center font-bold text-sm ${
      userVote === 'up'
        ? 'text-orange-600'
        : userVote === 'down'
        ? 'text-blue-600'
        : 'text-gray-700'
    }`}
    aria-live="polite"
    aria-atomic="true"
  >
    {abbreviate(project.score)}
  </span>

  <button
    type="button"
    title={userVote === 'down' ? 'Remove downvote' : 'Downvote'}
    aria-pressed={userVote === 'down'}
    class="flex items-center justify-center w-5 h-5 rounded hover:bg-blue-50 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 transition"
    onclick={handleDownvote}
  >
    <div
      class={`w-0 h-0 border-l-4 border-r-4 border-t-6 ${
        userVote === 'down' ? 'border-t-blue-500' : 'border-t-gray-400'
      } border-l-transparent border-r-transparent`}
    ></div>
    <span class="sr-only">Downvote</span>
  </button>
</div>
