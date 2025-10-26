<script lang="ts">
  import { currentUser, logout, toggleGovBadge } from '$lib/stores/auth/auth';
  import { goto } from '$app/navigation';
  import { onMount } from 'svelte';
  import { doc, updateDoc, getDoc, deleteDoc } from 'firebase/firestore';
  import { updateEmail, updatePassword, deleteUser, EmailAuthProvider, reauthenticateWithCredential } from 'firebase/auth';
  import { auth, db } from '$lib/firebase';
  import Header from '$lib/components/Header.svelte';
  import type { UserProfile } from '$lib/stores/auth/auth';
  import AvatarUploader from '$lib/components/AvatarUploader.svelte';

  let activeTab: 'profile' | 'account' | 'privacy' = 'profile';
  
  // profile fields
  let displayName = '';
  let bio = '';
  let avatarUrl = '';
  let showGovBadge = false;
  let isGovEligible = false;
  
  // privacy fields
  let emailVisibility: 'public' | 'logged-in' | 'private' = 'logged-in';
  
  // account fields
  let newEmail = '';
  let currentPassword = '';
  let newPassword = '';
  let confirmPassword = '';
  
  // delete account
  let deleteConfirmPassword = '';
  let showDeleteModal = false;
  
  // ui state
  let loading = false;
  let error = '';
  let success = '';
  let profileLoading = true;

  onMount(async () => {
    if (!$currentUser) {
      goto('/auth');
      return;
    }
    
    await loadProfile();
  });

  async function loadProfile() {
    if (!$currentUser) return;
    
    try {
      const userDoc = await getDoc(doc(db, 'users', $currentUser.id));
      if (userDoc.exists()) {
        const data = userDoc.data() as UserProfile;
        displayName = data.displayName || '';
        bio = (data as any).bio || '';
        avatarUrl = (data as any).avatarUrl || '';
        emailVisibility = (data as any).emailVisibility || 'logged-in';
        
        if (data.gov) {
          showGovBadge = data.gov.showBadge || false;
          isGovEligible = data.gov.eligible || false;
        }
      }
    } catch (err) {
      console.error('Failed to load profile:', err);
    } finally {
      profileLoading = false;
    }
  }

   function handleAvatarUpload(url: string) {
    avatarUrl = url;
  }

  async function saveProfile() {
    if (!$currentUser) return;
    
    loading = true;
    error = '';
    success = '';
    
    try {
      const userRef = doc(db, 'users', $currentUser.id);
      await updateDoc(userRef, {
        displayName: displayName.trim(),
        bio: bio.trim(),
        avatarUrl: avatarUrl.trim() || null
      });
      
      success = 'Profile updated successfully';
      setTimeout(() => success = '', 3000);
    } catch (err: any) {
      error = err.message || 'Failed to update profile';
    } finally {
      loading = false;
    }
  }

  async function toggleBadge() {
    if (!$currentUser || !isGovEligible) return;
    
    loading = true;
    error = '';
    
    try {
      await toggleGovBadge($currentUser.id, !showGovBadge);
      showGovBadge = !showGovBadge;
      success = `Gov badge ${showGovBadge ? 'enabled' : 'disabled'}`;
      setTimeout(() => success = '', 3000);
    } catch (err: any) {
      error = err.message || 'Failed to toggle badge';
    } finally {
      loading = false;
    }
  }

  async function savePrivacy() {
    if (!$currentUser) return;
    
    loading = true;
    error = '';
    success = '';
    
    try {
      const userRef = doc(db, 'users', $currentUser.id);
      await updateDoc(userRef, {
        emailVisibility
      });
      
      success = 'Privacy settings updated';
      setTimeout(() => success = '', 3000);
    } catch (err: any) {
      error = err.message || 'Failed to update privacy settings';
    } finally {
      loading = false;
    }
  }

  async function changeEmail() {
    if (!auth.currentUser || !newEmail.trim() || !currentPassword) return;
    
    loading = true;
    error = '';
    success = '';
    
    try {
      // reauthenticate first
      const credential = EmailAuthProvider.credential(
        auth.currentUser.email!,
        currentPassword
      );
      await reauthenticateWithCredential(auth.currentUser, credential);
      
      // update email
      await updateEmail(auth.currentUser, newEmail.trim());
      
      // update firestore
      const userRef = doc(db, 'users', $currentUser!.id);
      await updateDoc(userRef, {
        email: newEmail.trim()
      });
      
      success = 'Email updated successfully';
      newEmail = '';
      currentPassword = '';
      setTimeout(() => success = '', 3000);
    } catch (err: any) {
      if (err.code === 'auth/wrong-password') {
        error = 'Incorrect password';
      } else if (err.code === 'auth/email-already-in-use') {
        error = 'Email already in use';
      } else {
        error = err.message || 'Failed to update email';
      }
    } finally {
      loading = false;
    }
  }

  async function changePassword() {
    if (!auth.currentUser || !currentPassword || !newPassword || newPassword !== confirmPassword) return;
    
    loading = true;
    error = '';
    success = '';
    
    try {
      // reauthenticate first
      const credential = EmailAuthProvider.credential(
        auth.currentUser.email!,
        currentPassword
      );
      await reauthenticateWithCredential(auth.currentUser, credential);
      
      // update password
      await updatePassword(auth.currentUser, newPassword);
      
      success = 'Password updated successfully';
      currentPassword = '';
      newPassword = '';
      confirmPassword = '';
      setTimeout(() => success = '', 3000);
    } catch (err: any) {
      if (err.code === 'auth/wrong-password') {
        error = 'Incorrect current password';
      } else if (err.code === 'auth/weak-password') {
        error = 'Password is too weak';
      } else {
        error = err.message || 'Failed to update password';
      }
    } finally {
      loading = false;
    }
  }

  async function deleteAccount() {
    if (!auth.currentUser || !$currentUser || !deleteConfirmPassword) return;
    
    loading = true;
    error = '';
    
    try {
      // reauthenticate
      const credential = EmailAuthProvider.credential(
        auth.currentUser.email!,
        deleteConfirmPassword
      );
      await reauthenticateWithCredential(auth.currentUser, credential);
      
      // delete user doc
      await deleteDoc(doc(db, 'users', $currentUser.id));
      
      // delete auth user
      await deleteUser(auth.currentUser);
      
      // logout and redirect
      await logout();
    } catch (err: any) {
      if (err.code === 'auth/wrong-password') {
        error = 'Incorrect password';
      } else {
        error = err.message || 'Failed to delete account';
      }
      loading = false;
    }
  }
</script>

<div class="min-h-screen bg-gray-50">
  <Header />
  
  <div class="mt-[72px]">
    <div class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 class="text-3xl font-bold text-gray-900 mb-8">Settings</h1>
      
      {#if error}
        <div class="mb-4 rounded-md border border-red-300 bg-red-50 px-4 py-3 text-red-800 text-sm">
          {error}
        </div>
      {/if}
      
      {#if success}
        <div class="mb-4 rounded-md border border-green-300 bg-green-50 px-4 py-3 text-green-800 text-sm">
          {success}
        </div>
      {/if}
      
      <div class="bg-white rounded-lg shadow-sm border border-gray-200">
        <!-- Tabs -->
        <div class="border-b border-gray-200">
          <nav class="flex -mb-px">
            <button
              class="px-6 py-4 text-sm font-medium border-b-2 transition-colors {activeTab === 'profile' ? 'border-blue-500 text-blue-600' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}"
              on:click={() => activeTab = 'profile'}
            >
              Profile
            </button>
            <button
              class="px-6 py-4 text-sm font-medium border-b-2 transition-colors {activeTab === 'account' ? 'border-blue-500 text-blue-600' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}"
              on:click={() => activeTab = 'account'}
            >
              Account
            </button>
            <button
              class="px-6 py-4 text-sm font-medium border-b-2 transition-colors {activeTab === 'privacy' ? 'border-blue-500 text-blue-600' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}"
              on:click={() => activeTab = 'privacy'}
            >
              Privacy
            </button>
          </nav>
        </div>
        
        <div class="p-6">
          {#if profileLoading}
            <div class="text-center py-8 text-gray-500">Loading...</div>
          {:else}
            <!-- Profile Tab -->
            {#if activeTab === 'profile'}
              <div class="space-y-6">
                <div>
                  <label for="displayName" class="block text-sm font-medium text-gray-700 mb-2">
                    Display name
                  </label>
                  <input
                    id="displayName"
                    type="text"
                    bind:value={displayName}
                    class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Your name"
                  />
                </div>
                
                <div>
                  <label for="bio" class="block text-sm font-medium text-gray-700 mb-2">
                    Bio
                  </label>
                  <textarea
                    id="bio"
                    bind:value={bio}
                    rows="4"
                    maxlength="200"
                    class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Tell others about yourself..."
                  ></textarea>
                  <p class="text-xs text-gray-500 mt-1">{bio.length}/200 characters</p>
                </div>
                
                <div>
                 <div>
                    <label class="block text-sm font-medium text-gray-700 mb-2">
                        Avatar
                    </label>
                    <AvatarUploader {avatarUrl} onUpload={handleAvatarUpload} />
                    </div>
                </div>
                
                {#if isGovEligible}
                  <div class="border-t pt-6">
                    <div class="flex items-center justify-between">
                      <div>
                        <h3 class="text-sm font-medium text-gray-900">Government badge</h3>
                        <p class="text-sm text-gray-500 mt-1">Show a verified government badge on your profile and posts</p>
                      </div>
                      <button
                        type="button"
                        on:click={toggleBadge}
                        disabled={loading}
                        class="relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 {showGovBadge ? 'bg-blue-600' : 'bg-gray-200'}"
                      >
                        <span class="translate-x-0 pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out {showGovBadge ? 'translate-x-5' : 'translate-x-0'}"></span>
                      </button>
                    </div>
                  </div>
                {/if}
                
                <div class="pt-4">
                  <button
                    on:click={saveProfile}
                    disabled={loading}
                    class="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed font-medium"
                  >
                    {loading ? 'Saving...' : 'Save profile'}
                  </button>
                </div>
              </div>
            {/if}
            
            <!-- Account Tab -->
            {#if activeTab === 'account'}
              <div class="space-y-8">
                <!-- Change Email -->
                <div>
                  <h3 class="text-lg font-medium text-gray-900 mb-4">Change email</h3>
                  <div class="space-y-4">
                    <div>
                      <label for="currentEmail" class="block text-sm font-medium text-gray-700 mb-2">
                        Current email
                      </label>
                      <input
                        id="currentEmail"
                        type="email"
                        value={$currentUser?.email}
                        disabled
                        class="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-50 text-gray-500"
                      />
                    </div>
                    
                    <div>
                      <label for="newEmail" class="block text-sm font-medium text-gray-700 mb-2">
                        New email
                      </label>
                      <input
                        id="newEmail"
                        type="email"
                        bind:value={newEmail}
                        class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                        placeholder="new@example.com"
                      />
                    </div>
                    
                    <div>
                      <label for="emailPassword" class="block text-sm font-medium text-gray-700 mb-2">
                        Current password
                      </label>
                      <input
                        id="emailPassword"
                        type="password"
                        bind:value={currentPassword}
                        class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                        placeholder="Enter your password"
                      />
                    </div>
                    
                    <button
                      on:click={changeEmail}
                      disabled={loading || !newEmail.trim() || !currentPassword}
                      class="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed font-medium"
                    >
                      {loading ? 'Updating...' : 'Update email'}
                    </button>
                  </div>
                </div>
                
                <!-- Change Password -->
                <div class="border-t pt-8">
                  <h3 class="text-lg font-medium text-gray-900 mb-4">Change password</h3>
                  <div class="space-y-4">
                    <div>
                      <label for="currentPasswordChange" class="block text-sm font-medium text-gray-700 mb-2">
                        Current password
                      </label>
                      <input
                        id="currentPasswordChange"
                        type="password"
                        bind:value={currentPassword}
                        class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                      />
                    </div>
                    
                    <div>
                      <label for="newPassword" class="block text-sm font-medium text-gray-700 mb-2">
                        New password
                      </label>
                      <input
                        id="newPassword"
                        type="password"
                        bind:value={newPassword}
                        class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                      />
                    </div>
                    
                    <div>
                      <label for="confirmPassword" class="block text-sm font-medium text-gray-700 mb-2">
                        Confirm new password
                      </label>
                      <input
                        id="confirmPassword"
                        type="password"
                        bind:value={confirmPassword}
                        class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                      />
                      {#if newPassword && confirmPassword && newPassword !== confirmPassword}
                        <p class="text-xs text-red-600 mt-1">Passwords don't match</p>
                      {/if}
                    </div>
                    
                    <button
                      on:click={changePassword}
                      disabled={loading || !currentPassword || !newPassword || newPassword !== confirmPassword}
                      class="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed font-medium"
                    >
                      {loading ? 'Updating...' : 'Update password'}
                    </button>
                  </div>
                </div>
                
                <!-- Delete Account -->
                <div class="border-t pt-8">
                  <h3 class="text-lg font-medium text-gray-900 mb-2">Delete account</h3>
                  <p class="text-sm text-gray-500 mb-4">Permanently delete your account and all associated data. This cannot be undone.</p>
                  <button
                    on:click={() => showDeleteModal = true}
                    class="px-6 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 font-medium"
                  >
                    Delete account
                  </button>
                </div>
              </div>
            {/if}
            
            <!-- Privacy Tab -->
            {#if activeTab === 'privacy'}
              <div class="space-y-6">
                <div>
                  <h3 class="text-lg font-medium text-gray-900 mb-4">Email visibility</h3>
                  <div class="space-y-3">
                    <label class="flex items-start">
                      <input
                        type="radio"
                        bind:group={emailVisibility}
                        value="public"
                        class="mt-1 h-4 w-4 text-blue-600 border-gray-300 focus:ring-blue-500"
                      />
                      <div class="ml-3">
                        <div class="text-sm font-medium text-gray-900">Public</div>
                        <div class="text-sm text-gray-500">Anyone can see your email address</div>
                      </div>
                    </label>
                    
                    <label class="flex items-start">
                      <input
                        type="radio"
                        bind:group={emailVisibility}
                        value="logged-in"
                        class="mt-1 h-4 w-4 text-blue-600 border-gray-300 focus:ring-blue-500"
                      />
                      <div class="ml-3">
                        <div class="text-sm font-medium text-gray-900">Logged-in users only</div>
                        <div class="text-sm text-gray-500">Only people with accounts can see your email</div>
                      </div>
                    </label>
                    
                    <label class="flex items-start">
                      <input
                        type="radio"
                        bind:group={emailVisibility}
                        value="private"
                        class="mt-1 h-4 w-4 text-blue-600 border-gray-300 focus:ring-blue-500"
                      />
                      <div class="ml-3">
                        <div class="text-sm font-medium text-gray-900">Private</div>
                        <div class="text-sm text-gray-500">Hide your email from everyone</div>
                      </div>
                    </label>
                  </div>
                </div>
                
                <div class="pt-4">
                  <button
                    on:click={savePrivacy}
                    disabled={loading}
                    class="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed font-medium"
                  >
                    {loading ? 'Saving...' : 'Save privacy settings'}
                  </button>
                </div>
              </div>
            {/if}
          {/if}
        </div>
      </div>
    </div>
  </div>
</div>

<!-- Delete Account Modal -->
{#if showDeleteModal}
  <div class="fixed inset-0 z-50 flex items-center justify-center bg-black/50" on:click={() => showDeleteModal = false}>
    <div class="rounded-xl bg-white p-6 shadow-xl max-w-md w-full mx-4" on:click={(e) => e.stopPropagation()}>
      <h3 class="text-lg font-semibold text-gray-900">Delete account?</h3>
      <p class="mt-2 text-sm text-gray-600">This will permanently delete your account, all your projects, and all associated data. This action cannot be undone.</p>
      
      {#if error}
        <div class="mt-4 rounded-md border border-red-300 bg-red-50 px-3 py-2 text-red-800 text-sm">
          {error}
        </div>
      {/if}
      
      <div class="mt-4">
        <label for="deletePassword" class="block text-sm font-medium text-gray-700 mb-2">
          Enter your password to confirm
        </label>
        <input
          id="deletePassword"
          type="password"
          bind:value={deleteConfirmPassword}
          class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-red-500 focus:border-red-500"
          placeholder="Your password"
        />
      </div>
      
      <div class="mt-6 flex gap-3 justify-end">
        <button
          on:click={() => {
            showDeleteModal = false;
            deleteConfirmPassword = '';
            error = '';
          }}
          disabled={loading}
          class="rounded-lg px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 disabled:opacity-50"
        >
          Cancel
        </button>
        <button
          on:click={deleteAccount}
          disabled={loading || !deleteConfirmPassword}
          class="rounded-lg bg-red-600 px-4 py-2 text-sm font-medium text-white hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? 'Deleting...' : 'Delete account'}
        </button>
      </div>
    </div>
  </div>
{/if}