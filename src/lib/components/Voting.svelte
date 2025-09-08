<script lang="ts">
  import { upvoteProject, downvoteProject, getCurrentUserVote } from '$lib/stores/projects';
  import type { Project, VoteType } from '$lib/stores/projects';
  import { currentUser } from '$lib/stores/auth/auth';
  import { goto } from '$app/navigation';

  let { project }: { project: Project } = $props();
  let userVote: VoteType | null = $state(null);
  let showAuthModal = $state(false);

  $effect(() => {
    if ($currentUser && project?.id) {
      getCurrentUserVote(project.id).then(v => (userVote = v));
    } else {
      userVote = null;
    }
  });

  function requireAuth(): boolean {
    if ($currentUser) return true;
    showAuthModal = true;
    return false;
  }

  function abbreviate(n: number | undefined) {
    const v = Number(n ?? 0);
    if (v >= 1_000_000) return (v / 1_000_000).toFixed(v % 1_000_000 ? 1 : 0) + 'M';
    if (v >= 1_000) return (v / 1_000).toFixed(v % 1_000 ? 1 : 0) + 'k';
    return String(v);
  }

  function handleUpvote(e?: Event) {
    e?.preventDefault(); e?.stopPropagation();
    if (!requireAuth()) return;
    upvoteProject(project.id);
  }

  function handleDownvote(e?: Event) {
    e?.preventDefault(); e?.stopPropagation();
    if (!requireAuth()) return;
    downvoteProject(project.id);
  }

  function goAuth(mode: 'login' | 'register') {
    const redirect = `/project/${project.id}`;
    goto(`/auth?mode=${mode}&redirect=${encodeURIComponent(redirect)}`);
  }
</script>

<!-- voting UI (unchanged except handlers) -->
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

<!-- lightweight auth modal -->
{#if showAuthModal}
  <div class="fixed inset-0 z-[60] bg-black/40" onclick={() => (showAuthModal = false)}></div>
  <div
    class="fixed inset-0 z-[61] grid place-items-center p-4"
    role="dialog"
    aria-modal="true"
    aria-label="Sign up to vote"
  >
    <div class="w-full max-w-sm rounded-2xl bg-white shadow-xl">
      <div class="p-5">
        <h3 class="text-lg font-semibold mb-1">Sign up to vote</h3>
        <p class="text-sm text-gray-600 mb-4">
          Create an account to upvote and downvote projects.
        </p>
        <div class="flex gap-2">
          <button
            class="flex-1 rounded-xl bg-orange-600 text-white px-4 py-2 hover:bg-orange-700"
            onclick={(e) => { e.stopPropagation(); goAuth('register'); }}
          >
            Sign up
          </button>
          <button
            class="flex-1 rounded-xl border border-gray-300 px-4 py-2 hover:bg-gray-50"
            onclick={(e) => { e.stopPropagation(); goAuth('login'); }}
          >
            Sign in
          </button>
        </div>
      </div>
      <button
        class="absolute top-3 right-3 rounded-full p-2 hover:bg-gray-100"
        aria-label="Close"
        onclick={() => (showAuthModal = false)}
      >
        ✕
      </button>
    </div>
  </div>
{/if}
