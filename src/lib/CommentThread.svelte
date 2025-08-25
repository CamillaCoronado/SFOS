<!-- src/lib/CommentThread.svelte -->
<script lang="ts">
  import { onMount } from "svelte";
  import { browser } from "$app/environment";
  import CommentBox from "$lib/CommentBox.svelte";
  import {
    listenToComments,
    listenToReplies,
    deleteComment,
    type Comment
  } from "$lib/stores/projects";
  import type { User } from "firebase/auth";

  export let projectId: string;

  let user: User | null = null;
  let topLevel: Comment[] = [];

  // per-comment state
  const replies: Record<string, Comment[]> = {};
  const unsubReplies: Record<string, () => void> = {};
  const showRepliesList: Record<string, boolean> = {};
  const showReplyBox: Record<string, boolean> = {};
  let removeHandler: ((id: string) => Promise<void>) | null = null;

  const canDelete = (c: Comment) => !!user && user.uid === c.authorId;

  function loadReplies(id: string) {
    if (unsubReplies[id]) return; // already listening for this thread
    unsubReplies[id] = listenToReplies(projectId, id, (rows: Comment[]) => (replies[id] = rows));
  }

  // simple timestamp (swap to relative time later if you want)
  function ts(d: any) {
    const date = d?.toDate ? d.toDate() : new Date();
    return date.toLocaleString();
  }

  onMount(() => {
    if (!browser) return;

    let mounted = true;
    const unsubs: Array<() => void> = [];

    (async () => {
      const [{ onAuthStateChanged }, { auth }] = await Promise.all([
        import("firebase/auth"),
        import("$lib/firebase")
      ]);
      if (!mounted) return;

      unsubs.push(onAuthStateChanged(auth, (u) => { if (mounted) user = u; }));
      unsubs.push(
        listenToComments(projectId, (rows: Comment[]) => {
          if (mounted) topLevel = rows;
        })
      );

      removeHandler = async (id: string) => {
        if (!confirm("Delete this comment?")) return;
        await deleteComment(projectId, id);
      };
    })().catch(console.error);

    return () => {
      mounted = false;
      for (const fn of unsubs) { try { fn(); } catch {} }
      Object.values(unsubReplies).forEach((fn) => { try { fn(); } catch {} });
    };
  });
</script>

<div class="space-y-6">
  <!-- top-level composer -->
  <CommentBox {projectId} />

  {#if topLevel.length === 0}
    <div class="text-sm text-gray-500">No comments yet.</div>
  {/if}

  {#each topLevel as c (c.id)}
    <article class="space-y-2">
      <!-- header -->
      <div class="flex items-center gap-2 text-[13px]">
        <!-- avatar (initial) -->
        <div class="h-7 w-7 rounded-full bg-gray-200 flex items-center justify-center text-[11px] text-gray-600 select-none">
          {(c.authorName ?? "A").slice(0,1).toUpperCase()}
        </div>
        <div class="font-semibold text-gray-900">{c.authorName ?? "Anonymous"}</div>
        <span class="text-gray-500">• {ts(c.createdAt)}</span>
      </div>

      <!-- body -->
      <div class="pl-9 text-[15px] leading-6 text-gray-900 whitespace-pre-wrap">
        {c.text}
      </div>

      <!-- actions (Reddit-like) -->
      <div class="pl-9 flex items-center gap-4 text-[13px] text-gray-600">
        <!-- Reply: bubble icon + label; always opens composer below -->
        <button
          class="flex items-center gap-1 hover:underline"
          on:click={() => {
            loadReplies(c.id!);
            showReplyBox[c.id!] = true;
            showRepliesList[c.id!] = true;
          }}
          aria-label="Reply"
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" class="stroke-current">
            <path d="M21 12a8 8 0 0 1-8 8H7l-4 4v-6a8 8 0 1 1 18-6Z" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
          </svg>
          <span>Reply</span>
        </button>

        {#if canDelete(c)}
          <button
            class="hover:underline text-red-600"
            on:click={() => removeHandler && removeHandler(c.id!)}
            aria-label="Delete comment"
          >
            Delete
          </button>
        {/if}
      </div>

      <!-- replies thread with +/- pill on the thread line -->
      <div class="relative ml-4 pl-5 border-l border-gray-300 space-y-3">
        <!-- collapse/expand pill anchored on the line -->
        <button
          class="absolute -left-[11px] -top-[26px] h-5 w-5 rounded-full border border-gray-400 bg-white text-[12px] text-gray-700 hover:bg-gray-50"
          on:click={() => { loadReplies(c.id!); showRepliesList[c.id!] = !showRepliesList[c.id!]; }}
          aria-label={showRepliesList[c.id!] ? "Collapse thread" : "Expand thread"}
        >
          {showRepliesList[c.id!] ? "–" : "+"}
        </button>

        {#if showRepliesList[c.id!]}
          <!-- reply composer (opens when Reply pressed) -->
          {#if showReplyBox[c.id!]}
            <div class="mt-2 ml-5">
              <CommentBox
                {projectId}
                replyTo={c.id!}
                on:cancel={() => (showReplyBox[c.id!] = false)}
              />
            </div>
          {/if}

          <!-- replies list -->
          {#if replies[c.id!]?.length}
            <div class="space-y-4">
              {#each replies[c.id!] as r (r.id)}
                <div class="space-y-1">
                  <div class="flex items-center gap-2 text-[13px] ml-5">
                    <div class="h-6 w-6 rounded-full bg-gray-200 flex items-center justify-center text-[10px] text-gray-600 select-none">
                      {(r.authorName ?? "A").slice(0,1).toUpperCase()}
                    </div>
                    <div class="font-semibold text-gray-900">{r.authorName ?? "Anonymous"}</div>
                    <span class="text-gray-500">• {ts(r.createdAt)}</span>
                    {#if canDelete(r)}
                      <button
                        class="ml-3 hover:underline text-red-600"
                        on:click={() => removeHandler && removeHandler(r.id!)}
                      >
                        Delete
                      </button>
                    {/if}
                  </div>
                  <div class="ml-14 text-[15px] leading-6 text-gray-900 whitespace-pre-wrap">
                    {r.text}
                  </div>
                </div>
              {/each}
            </div>
          {:else}
            <div class="ml-5 text-[13px] text-gray-500">No replies yet.</div>
          {/if}
        {/if}
      </div>
    </article>
  {/each}
</div>
