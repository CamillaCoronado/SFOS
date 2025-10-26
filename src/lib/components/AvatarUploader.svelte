<!-- src/lib/components/AvatarUploader.svelte -->
<script lang="ts">
  import { storage } from '$lib/firebase';
  import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
  import { currentUser } from '$lib/stores/auth/auth';

  export let avatarUrl = '';
  export let onUpload: (url: string) => void;

  let uploading = false;
  let error = '';

  async function handleFileChange(e: Event) {
    const target = e.target as HTMLInputElement;
    const file = target.files?.[0];
    
    if (!file) return;
    
    // validate
    if (!file.type.startsWith('image/')) {
      error = 'Please upload an image file';
      return;
    }
    
    if (file.size > 2 * 1024 * 1024) {
      error = 'Image must be less than 2MB';
      return;
    }
    
    uploading = true;
    error = '';
    
    try {
      // upload to firebase storage
      const storageRef = ref(storage, `avatars/${$currentUser?.id}/${Date.now()}-${file.name}`);
      await uploadBytes(storageRef, file);
      const url = await getDownloadURL(storageRef);
      
      avatarUrl = url;
      onUpload(url);
    } catch (err: any) {
      error = err.message || 'Failed to upload image';
    } finally {
      uploading = false;
    }
  }
</script>

<div class="space-y-3">
  <div class="flex items-center gap-4">
    {#if avatarUrl}
      <img src={avatarUrl} alt="Avatar preview" class="w-20 h-20 rounded-full object-cover border-2 border-gray-200" />
    {:else}
      <div class="w-20 h-20 rounded-full bg-gray-200 flex items-center justify-center">
        <svg class="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"/>
        </svg>
      </div>
    {/if}
    
    <div>
      <label class="cursor-pointer inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50">
        {uploading ? 'Uploading...' : 'Upload photo'}
        <input 
          type="file" 
          accept="image/*" 
          onchange={handleFileChange}
          disabled={uploading}
          class="hidden"
        />
      </label>
      <p class="text-xs text-gray-500 mt-1">JPG, PNG or GIF (max 2MB)</p>
    </div>
  </div>
  
  {#if error}
    <p class="text-xs text-red-600">{error}</p>
  {/if}
</div>