<script lang="ts">
  import { createEventDispatcher } from "svelte";
  import { addComment } from "$lib/stores/projects";
  import type { User } from "firebase/auth";
  import { onMount } from "svelte";
  import { auth } from "$lib/firebase";
  import { onAuthStateChanged } from "firebase/auth";
  import { goto } from "$app/navigation";

  const dispatch = createEventDispatcher();

  export let projectId: string;
  export let replyTo: string | null = null;

  let user: User | null = null;
  let text = "";
  let posting = false;

  onMount(() => {
    onAuthStateChanged(auth, (u) => (user = u));
  });

  async function submit() {
    const body = text.trim();
    if (!user || !body) return;
    posting = true;
    try {
      await addComment(projectId, {
        text: body,
        authorId: user.uid,
        authorName: user.displayName ?? user.email ?? "Anonymous",
        replyTo
      });
      text = "";
      if (replyTo) dispatch("cancel");
    } finally {
      posting = false;
    }
  }
</script>

{#if !user}
  <!-- Sign in prompt -->
  <div class="border border-gray-300 rounded-2xl bg-white p-4 text-center">
    <p class="text-gray-600 text-sm mb-2">Sign in to comment</p>
    <button
      class="bg-blue-500 hover:bg-blue-600 text-white text-sm px-4 py-2 rounded-full"
      onclick={() => goto("/auth")}
    >
      Sign In / Sign Up
    </button>
  </div>
{:else}
  <!-- Reddit-like composer -->
  <div class="rounded-2xl border border-gray-300 bg-white">
    <form onsubmit={submit} class="flex flex-col">
      <textarea
        bind:value={text}
        rows="3"
        maxlength="10000"
        placeholder="What are your thoughts?"
        class="w-full rounded-t-2xl p-3 text-[15px] leading-6 text-gray-900 placeholder-gray-400 resize-y focus:outline-none"
      ></textarea>
      <div class="flex items-center justify-end gap-3 px-3 py-2 border-t border-gray-200">
        <button
          type="button"
          onclick={() => (text = "", replyTo && dispatch('cancel'))}
          class="px-4 py-1.5 rounded-full text-sm font-medium bg-gray-100 hover:bg-gray-200"
        >
          Cancel
        </button>
        <button
          type="submit"
          class="px-4 py-1.5 rounded-full text-sm font-medium text-white bg-gray-800 hover:bg-black disabled:opacity-50"
          disabled={posting || !text.trim()}
        >
          {posting ? "Posting…" : "Comment"}
        </button>
      </div>
    </form>
  </div>
{/if}
