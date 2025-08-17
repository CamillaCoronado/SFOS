<script lang="ts">
import { upvoteProject, downvoteProject, getCurrentUserVote } from '$lib/stores/projects';
import { currentUser } from '$lib/stores/auth/auth';

let userVote: VoteType | null = $state(null);
let { project }: { project: Project } = $props();


$effect(() => {
    if (currentUser && project.id) {
        getCurrentUserVote(project.id).then(vote => {
        userVote = vote;
        });
    }
});

</script>

<div class="flex items-center p-2 rounded {userVote === 'up' ? 'bg-green-100' : userVote === 'down' ? 'bg-red-100' : 'bg-gray-50'}">
    <button aria-label="upvote" onclick={()=>upvoteProject(project.id)} class="flex items-center mr-2 hover:text-green-600">
        <svg class="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 15l7-7 7 7"/>
        </svg>
        </button>
        
        <span>{project.score}</span>
        
        <button 
        aria-label="downvote" 
        onclick={()=>downvoteProject(project.id)} 
        class="flex items-center mr-4 hover:text-red-600">
        <svg class="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"/>
        </svg>
    </button>
</div>

