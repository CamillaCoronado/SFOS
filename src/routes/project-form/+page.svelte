<script lang="ts">
  import { addProject } from '$lib/stores/projects';
  import { goto } from '$app/navigation';
  
  let title: string = '';
  let description: string = '';
  let tags: string = '';
  let githubUrl: string = '';
  let imageUrl: string = '';
  let experienceLevel: 'beginner' | 'intermediate' | 'advanced' = 'beginner';
  let timeCommitment: string = '';
  let duration: string = '';
  let contactMethod: 'discord' | 'email' | 'github' | 'other' = 'email';
  let contactInfo: string = '';
  
  function handleSubmit() {
    const projectId = addProject({
      title,
      description,
      tags: tags.split(',').map(t => t.trim()).filter(t => t),
      githubUrl: githubUrl || undefined,
      imageUrl: imageUrl || undefined,
      experienceLevel,
      timeCommitment,
      duration,
      contactMethod,
      contactInfo
    });
    
    goto('/projects');
  }
</script>

<div class="min-h-screen bg-gray-50 py-12">
  <div class="max-w-2xl mx-auto px-4">
    <div class="bg-white shadow-sm border border-gray-200 rounded-lg p-8">
      <h1 class="text-2xl font-semibold text-gray-900 mb-6">Create Project</h1>
      
      <form onsubmit={handleSubmit} class="space-y-6">
        <!-- Title -->
        <div>
          <label for="title" class="block text-sm font-medium text-gray-700 mb-2">
            Project Title*
          </label>
          <input
            id="title"
            type="text"
            bind:value={title}
            required
            class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            placeholder="What's your project about?"
          />
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
            class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            placeholder="Describe your project in detail..."
          ></textarea>
        </div>

        <!-- Tags -->
        <div>
          <label for="tags" class="block text-sm font-medium text-gray-700 mb-2">
            Tags
          </label>
          <input
            id="tags"
            type="text"
            bind:value={tags}
            class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            placeholder="web development, react, design (comma separated)"
          />
          <p class="text-sm text-gray-500 mt-1">Separate tags with commas</p>
        </div>

        <!-- Experience Level -->
        <div>
          <label for="experienceLevel" class="block text-sm font-medium text-gray-700 mb-2">
            Experience Level Required*
          </label>
          <select
            id="experienceLevel"
            bind:value={experienceLevel}
            class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="beginner">Beginner</option>
            <option value="intermediate">Intermediate</option>
            <option value="advanced">Advanced</option>
          </select>
        </div>

        <!-- Time Commitment & Duration -->
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label for="timeCommitment" class="block text-sm font-medium text-gray-700 mb-2">
              Time Commitment*
            </label>
            <input
              id="timeCommitment"
              type="text"
              bind:value={timeCommitment}
              required
              class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              placeholder="5-10 hours/week"
            />
          </div>
          
          <div>
            <label for="duration" class="block text-sm font-medium text-gray-700 mb-2">
              Duration*
            </label>
            <input
              id="duration"
              type="text"
              bind:value={duration}
              required
              class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              placeholder="2-3 months"
            />
          </div>
        </div>

        <!-- Contact Method -->
        <div>
          <label for="contactMethod" class="block text-sm font-medium text-gray-700 mb-2">
            Preferred Contact Method*
          </label>
          <select
            id="contactMethod"
            bind:value={contactMethod}
            class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="discord">Discord</option>
            <option value="email">Email</option>
            <option value="github">GitHub</option>
            <option value="other">Other</option>
          </select>
        </div>

        <!-- Contact Info -->
        <div>
          <label for="contactInfo" class="block text-sm font-medium text-gray-700 mb-2">
            Contact Information*
          </label>
          <input
            id="contactInfo"
            type="text"
            bind:value={contactInfo}
            required
            class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            placeholder={contactMethod === 'discord' ? 'username#1234' : 
                        contactMethod === 'email' ? 'your@email.com' :
                        contactMethod === 'github' ? 'github.com/username' : 'Contact details'}
          />
        </div>

        <!-- GitHub URL (Optional) -->
        <div>
          <label for="githubUrl" class="block text-sm font-medium text-gray-700 mb-2">
            GitHub Repository (Optional)
          </label>
          <input
            id="githubUrl"
            type="url"
            bind:value={githubUrl}
            class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            placeholder="https://github.com/username/repo"
          />
        </div>

        <!-- Image URL (Optional) -->
        <div>
          <label for="imageUrl" class="block text-sm font-medium text-gray-700 mb-2">
            Project Image URL (Optional)
          </label>
          <input
            id="imageUrl"
            type="url"
            bind:value={imageUrl}
            class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            placeholder="https://example.com/image.jpg"
          />
        </div>

        <!-- Submit Button -->
        <div class="pt-4">
          <button
            type="submit"
            class="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors"
          >
            Create Project
          </button>
        </div>
      </form>
    </div>
  </div>
</div>