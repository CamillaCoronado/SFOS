<script lang="ts">
  import { addProject } from '$lib/stores/projects';
  import { goto } from '$app/navigation';

  // form state
  let title = '';
  let description = '';
  let tags = '';
  let projectType: 'tech' | 'policy' | 'problem' = 'tech';

  // tech project fields
  let stage: 'idea' | 'scoping' | 'ready' | 'progress' | 'live' = 'idea';
  let timeEstimate: 'weekend' | 'weeks' | 'months' | 'ongoing' = 'weeks';
  let techNeeded: string[] = [];
  let lookingFor: string[] = [];

  // policy fields
  let relevantAgency = '';
  let policyTimeline: 'immediate' | '6-12mo' | '1-2yr' | 'multi-year' = '6-12mo';
  let requires: string[] = [];
  let precedents = '';

  // problem fields
  let whoAffected = '';
  let whatsNotWorking = '';
  let attemptedSolutions = '';
  let openTo: string[] = [];

  // optional sections (collapsed by default, but contact required)
  let showPartner = false;
  let showLinks = false;
  let showImage = false;

  // contact is required, so always visible
  let contactMethod: 'discord' | 'email' | 'github' | 'other' = 'email';
  let contactInfo = '';
  
  // optional fields
  let partnerOrgs = '';
  let githubUrl = '';
  let links: string[] = ['', '', ''];
  let imageUrl = '';

  let isLoading = false;
  let error: string | null = null;
  let fieldErrors: Record<string,string> = {};

  // wizard step tracking
  let currentStep = 1;
  const totalSteps = 4;

  let status: 'draft' | 'published' = 'draft';

  $: pageTitle = projectType === 'tech' ? 'Civic tech project' 
    : projectType === 'policy' ? 'Policy proposal' 
    : 'Problem/opportunity';

  $: descPlaceholder = projectType === 'tech' 
    ? 'Describe what you\'re building and why it matters. What\'s the current status? What help do you need?'
    : projectType === 'policy'
    ? 'Explain the policy change you\'re proposing. What problem does it solve? What would success look like?'
    : 'What\'s broken or missing right now? Who does it affect? What kinds of solutions might help?';

  $: helpText = projectType === 'tech'
    ? 'Civic tech projects work best when you can clearly explain what you\'re building, where you are in the process, and what kind of help would be most useful right now.'
    : projectType === 'policy'
    ? 'Policy proposals need a clear agency owner and realistic timeline. Think about what would need to happen (budget, legislation, etc.) to make this real.'
    : 'Problem posts help surface gaps and opportunities. Be specific about who\'s affected and what\'s not working—solutions can come from tech, policy, organizing, or research.';

  // count filled optional fields for badges
  $: partnerCount = partnerOrgs.trim() ? 1 : 0;
  $: linksCount = links.filter(l => l.trim()).length + (githubUrl.trim() ? 1 : 0);
  $: imageCount = imageUrl.trim() ? 1 : 0;

  function validateStep(step: number): boolean {
    fieldErrors = {};
    
    if (step === 1) {
      // Just type selection, always valid
      return true;
    }
    
    if (step === 2) {
      if (!title.trim()) fieldErrors.title = 'Give your post a clear title';
      if (!description.trim()) fieldErrors.description = 'Describe what this is about';
      return Object.keys(fieldErrors).length === 0;
    }
    
    if (step === 3) {
      if (projectType === 'policy') {
        if (!relevantAgency.trim()) fieldErrors.relevantAgency = 'Which agency would handle this?';
      } else if (projectType === 'problem') {
        if (!whoAffected.trim()) fieldErrors.whoAffected = 'Who experiences this problem?';
        if (!whatsNotWorking.trim()) fieldErrors.whatsNotWorking = 'Explain what\'s not working';
      }
      return Object.keys(fieldErrors).length === 0;
    }
    
    if (step === 4) {
      if (!contactInfo.trim()) fieldErrors.contactInfo = 'Let people know how to reach you';
      return Object.keys(fieldErrors).length === 0;
    }
    
    return true;
  }

  function nextStep() {
    if (validateStep(currentStep)) {
      currentStep = Math.min(currentStep + 1, totalSteps);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }

  function prevStep() {
    currentStep = Math.max(currentStep - 1, 1);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  async function handleSubmit(submitStatus: 'draft' | 'published') {
    status = submitStatus;
    error = null;
    
    // Validate all steps
    for (let i = 1; i <= totalSteps; i++) {
      if (!validateStep(i)) {
        currentStep = i;
        error = 'Please fill in all required fields';
        return;
      }
    }

    isLoading = true;
    try {
      const cleanLinks = links.filter(l => l.trim());
      await addProject({
        title: title.trim(),
        description: description.trim(),
        tags: tags.split(',').map(t => t.trim()).filter(Boolean),
        githubUrl: githubUrl || undefined,
        imageUrl: imageUrl || undefined,
        contactMethod,
        contactInfo: contactInfo.trim(),
        projectType,
        // tech fields
        stage: projectType === 'tech' ? stage : undefined,
        timeEstimate: projectType === 'tech' ? timeEstimate : undefined,
        techNeeded: projectType === 'tech' ? techNeeded : undefined,
        lookingFor: projectType === 'tech' ? lookingFor : undefined,
        // policy fields
        relevantAgency: projectType === 'policy' ? relevantAgency : undefined,
        policyTimeline: projectType === 'policy' ? policyTimeline : undefined,
        requires: projectType === 'policy' ? requires : undefined,
        precedents: projectType === 'policy' ? precedents : undefined,
        // problem fields
        whoAffected: projectType === 'problem' ? whoAffected : undefined,
        whatsNotWorking: projectType === 'problem' ? whatsNotWorking : undefined,
        attemptedSolutions: projectType === 'problem' ? attemptedSolutions : undefined,
        openTo: projectType === 'problem' ? openTo : undefined,
        // shared optional
        partnerOrgs: partnerOrgs || undefined,
        links: cleanLinks.length > 0 ? cleanLinks : undefined,
        authorType: 'civic-hacker',
        status: submitStatus
      });
      await goto('/dashboard');
    } catch (err) {
      console.error('Submission failed:', err);
      error = err instanceof Error ? err.message : 'Something went wrong. Try again?';
    } finally {
      isLoading = false;
    }
  }
</script>

<div class="min-h-screen bg-gray-50 py-12">
  <div class="max-w-2xl mx-auto px-4">
    <div class="bg-white shadow-sm border border-gray-200 rounded-lg p-8">
      <!-- Progress indicator -->
      <div class="mb-8">
        <div class="flex items-center justify-between mb-2">
          <h1 class="text-2xl font-semibold text-gray-900">Add a {pageTitle}</h1>
          <span class="text-sm text-gray-500">Step {currentStep} of {totalSteps}</span>
        </div>
        <div class="w-full bg-gray-200 rounded-full h-2">
          <div class="bg-blue-600 h-2 rounded-full transition-all duration-300" style="width: {(currentStep / totalSteps) * 100}%"></div>
        </div>
      </div>

      {#if error}
        <div class="mb-4 rounded-md border border-red-300 bg-red-50 px-3 py-2 text-red-800 text-sm">{error}</div>
      {/if}

      <form on:submit|preventDefault={() => handleSubmit('published')} class="space-y-6">
        
        <!-- Step 1: Project Type -->
        {#if currentStep === 1}
          <div class="space-y-4">
            <div>
              <h2 class="text-lg font-medium text-gray-900 mb-2">What type of post is this?</h2>
              <p class="text-sm text-gray-600 mb-4">Choose the option that best describes what you're sharing</p>
            </div>

            <div class="space-y-3">
              <button type="button" 
                class="w-full text-left p-4 border-2 rounded-lg transition-all {projectType === 'tech' ? 'border-blue-500 bg-blue-50' : 'border-gray-300 hover:border-gray-400'}"
                on:click={() => projectType = 'tech'}>
                <div class="flex items-start gap-3">
                  <div class="mt-0.5">
                    <div class="w-5 h-5 rounded-full border-2 flex items-center justify-center {projectType === 'tech' ? 'border-blue-600 bg-blue-600' : 'border-gray-300'}">
                      {#if projectType === 'tech'}
                        <svg class="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 12 12">
                          <path d="M10 3L4.5 8.5L2 6"/>
                        </svg>
                      {/if}
                    </div>
                  </div>
                  <div class="flex-1">
                    <div class="font-medium text-gray-900">Civic tech project</div>
                    <ol>
                      <li class="text-s list-disc text-gray-600 mt-1">You have a civic tech project you’re building (or thinking of building).</li>
                      <li class="text-sm list-disc text-gray-600 mt-1">You’re looking for feedback, collaborators, or users.</li>
                    </ol>
                  </div>
                </div>
              </button>

              <button type="button"
                class="w-full text-left p-4 border-2 rounded-lg transition-all {projectType === 'policy' ? 'border-blue-500 bg-blue-50' : 'border-gray-300 hover:border-gray-400'}"
                on:click={() => projectType = 'policy'}>
                <div class="flex items-start gap-3">
                  <div class="mt-0.5">
                    <div class="w-5 h-5 rounded-full border-2 flex items-center justify-center {projectType === 'policy' ? 'border-blue-600 bg-blue-600' : 'border-gray-300'}">
                      {#if projectType === 'policy'}
                        <svg class="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 12 12">
                          <path d="M10 3L4.5 8.5L2 6"/>
                        </svg>
                      {/if}
                    </div>
                  </div>
                  <div class="flex-1">
                    <div class="font-medium text-gray-900">Policy idea</div>
                    <div class="text-sm text-gray-600 mt-1">You have an idea for how the city could change something through policy</div>
                  </div>
                </div>
              </button>

              <button type="button"
                class="w-full text-left p-4 border-2 rounded-lg transition-all {projectType === 'problem' ? 'border-blue-500 bg-blue-50' : 'border-gray-300 hover:border-gray-400'}"
                on:click={() => projectType = 'problem'}>
                <div class="flex items-start gap-3">
                  <div class="mt-0.5">
                    <div class="w-5 h-5 rounded-full border-2 flex items-center justify-center {projectType === 'problem' ? 'border-blue-600 bg-blue-600' : 'border-gray-300'}">
                      {#if projectType === 'problem'}
                        <svg class="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 12 12">
                          <path d="M10 3L4.5 8.5L2 6"/>
                        </svg>
                      {/if}
                    </div>
                  </div>
                  <div class="flex-1">
                    <div class="font-medium text-gray-900">Problem or opportunity</div>
                    <div class="text-sm text-gray-600 mt-1">You've noticed a problem that needs solving (not sure if tech/policy yet)</div>
                  </div>
                </div>
              </button>
            </div>

            <div class="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
              <p class="text-sm text-gray-700">{helpText}</p>
            </div>
          </div>
        {/if}

        <!-- Step 2: Title & Description -->
        {#if currentStep === 2}
          <div class="space-y-6">
            <div>
              <h2 class="text-lg font-medium text-gray-900 mb-2">Tell us about it</h2>
              <p class="text-sm text-gray-600 mb-4">Give your post a title and description that helps others understand what it's about</p>
            </div>

            <div>
              <label for="title" class="block text-sm font-medium text-gray-700 mb-2">
                Title*
              </label>
              <input
                id="title"
                type="text"
                bind:value={title}
                required
                class="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 {fieldErrors.title ? 'border-red-400' : 'border-gray-300'}"
                placeholder={projectType === 'tech' ? 'E.g., "Bike lane map for SF"' : projectType === 'policy' ? 'E.g., "Expand composting to all parks"' : 'E.g., "311 responses too slow for urgent issues"'}
              />
              <p class="text-xs text-gray-500 mt-1">Keep it short and clear—this is what people will see first</p>
              {#if fieldErrors.title}<p class="text-xs text-red-600 mt-1">{fieldErrors.title}</p>{/if}
            </div>

            <div>
              <label for="description" class="block text-sm font-medium text-gray-700 mb-2">
                Description*
              </label>
              <textarea
                id="description"
                bind:value={description}
                required
                rows="6"
                maxlength="500"
                class="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 {fieldErrors.description ? 'border-red-400' : 'border-gray-300'}"
                placeholder={descPlaceholder}
              ></textarea>
              <p class="text-xs text-gray-500 mt-1">{description.length}/500 characters</p>
              {#if fieldErrors.description}<p class="text-xs text-red-600 mt-1">{fieldErrors.description}</p>{/if}
            </div>

            <div>
              <label for="tags" class="block text-sm font-medium text-gray-700 mb-2">
                Topic categories <span class="text-gray-500 font-normal">(optional)</span>
              </label>
              <input
                id="tags"
                type="text"
                bind:value={tags}
                class="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 border-gray-300"
                placeholder="Housing, transit, parks, public safety..."
              />
              <p class="text-xs text-gray-500 mt-1">Separate topics with commas to help people find your post</p>
            </div>
          </div>
        {/if}

        <!-- Step 3: Type-specific details -->
        {#if currentStep === 3}
          <div class="space-y-6">
            <div>
              <h2 class="text-lg font-medium text-gray-900 mb-2">Project details</h2>
              <p class="text-sm text-gray-600 mb-4">
                {#if projectType === 'tech'}
                  Help people understand where you are and what you need
                {:else if projectType === 'policy'}
                  Provide context about implementation and requirements
                {:else}
                  Give details about the problem and who it affects
                {/if}
              </p>
            </div>

            {#if projectType === 'tech'}
              <div class="space-y-4 p-4 bg-blue-50 rounded-md border border-blue-100">
                <div>
                  <label for="stage" class="block text-sm font-medium text-gray-700 mb-2">Where are you at?*</label>
                  <select id="stage" bind:value={stage} class="w-full px-3 py-2 border rounded-md border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500">
                    <option value="idea">Planning</option>
                    <option value="progress">Actively building</option>
                    <option value="live">Live and needs maintenance</option>
                  </select>
                  <p class="text-xs text-gray-500 mt-1">This helps people know how they can contribute</p>
                </div>

                <div>
                  <label for="timeEstimate" class="block text-sm font-medium text-gray-700 mb-2">How much time will this take?*</label>
                  <select id="timeEstimate" bind:value={timeEstimate} class="w-full px-3 py-2 border rounded-md border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500">
                    <option value="weekend">One weekend</option>
                    <option value="weeks">Few weeks</option>
                    <option value="months">Few months</option>
                    <option value="ongoing">Ongoing commitment</option>
                  </select>
                </div>

                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-2">What skills would help? <span class="text-gray-500 font-normal">(optional)</span></label>
                  <div class="grid grid-cols-2 gap-2">
                    {#each ['Frontend', 'Backend', 'Data/ML', 'Design', 'Product', 'DevOps', 'Mobile'] as tech}
                      <label class="flex items-center">
                        <input type="checkbox" bind:group={techNeeded} value={tech.toLowerCase()} class="mr-2 h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500">
                        <span class="text-sm text-gray-700">{tech}</span>
                      </label>
                    {/each}
                  </div>
                </div>

                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-2">What would be most helpful? <span class="text-gray-500 font-normal">(optional)</span></label>
                  <div class="space-y-2">
                    {#each ['Feedback', 'Collaborators', 'Advisors', 'User testing', 'Funding'] as need}
                      <label class="flex items-center">
                        <input type="checkbox" bind:group={lookingFor} value={need.toLowerCase()} class="mr-2 h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500">
                        <span class="text-sm text-gray-700">{need}</span>
                      </label>
                    {/each}
                  </div>
                </div>
              </div>

            {:else if projectType === 'policy'}
              <div class="space-y-4 p-4 bg-purple-50 rounded-md border border-purple-100">
                <div>
                  <label for="relevantAgency" class="block text-sm font-medium text-gray-700 mb-2">Which city agency would handle this?*</label>
                  <select
                    id="relevantAgency"
                    bind:value={relevantAgency}
                    required
                    class="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 {fieldErrors.relevantAgency ? 'border-red-400' : 'border-gray-300'}"
                  >
                    <option value="">Select an agency...</option>
                    <option value="I don't know">I don't know</option>
                    <option value="Mayor's Office">Mayor's Office</option>
                    <option value="Board of Supervisors">Board of Supervisors</option>
                    <option value="Planning Department">Planning Department</option>
                    <option value="SFMTA">SFMTA (Transportation)</option>
                    <option value="Public Works">Public Works</option>
                    <option value="Recreation and Parks">Recreation and Parks</option>
                    <option value="Public Health">Public Health</option>
                    <option value="Public Utilities Commission">Public Utilities Commission (PUC)</option>
                    <option value="Fire Department">Fire Department</option>
                    <option value="Police Department">Police Department</option>
                    <option value="Department of Housing">Department of Housing</option>
                    <option value="Building Inspection">Building Inspection</option>
                    <option value="Department of the Environment">Department of the Environment</option>
                    <option value="Emergency Management">Emergency Management</option>
                    <option value="Human Services Agency">Human Services Agency</option>
                    <option value="Department of Homelessness and Supportive Housing">Department of Homelessness and Supportive Housing</option>
                    <option value="Economic and Workforce Development">Economic and Workforce Development</option>
                    <option value="Department of Children, Youth and Their Families">Department of Children, Youth and Their Families</option>
                    <option value="Department of Elections">Department of Elections</option>
                    <option value="Department of Technology">Department of Technology</option>
                    <option value="Multiple agencies">Multiple agencies</option>
                  </select>
                  <p class="text-xs text-gray-500 mt-1">Choose the agency that would need to act on this proposal</p>
                  {#if fieldErrors.relevantAgency}<p class="text-xs text-red-600 mt-1">{fieldErrors.relevantAgency}</p>{/if}
                </div>

                <div>
                  <label for="policyTimeline" class="block text-sm font-medium text-gray-700 mb-2">How long to implement?*</label>
                  <select id="policyTimeline" bind:value={policyTimeline} class="w-full px-3 py-2 border rounded-md border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500">
                    <option value="immediate">Could happen right away</option>
                    <option value="6-12mo">6-12 months</option>
                    <option value="1-2yr">1-2 years</option>
                    <option value="multi-year">Multiple years</option>
                  </select>
                </div>

                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-2">What would this need? <span class="text-gray-500 font-normal">(optional)</span></label>
                  <div class="space-y-2">
                    {#each ['Legislation', 'Budget allocation', 'Regulatory change', 'Interagency coordination', 'None (administrative)'] as req}
                      <label class="flex items-center">
                        <input type="checkbox" bind:group={requires} value={req.toLowerCase()} class="mr-2 h-4 w-4 text-purple-600 border-gray-300 rounded focus:ring-purple-500">
                        <span class="text-sm text-gray-700">{req}</span>
                      </label>
                    {/each}
                  </div>
                </div>

                <div>
                  <label for="precedents" class="block text-sm font-medium text-gray-700 mb-2">Has anyone else done this? <span class="text-gray-500 font-normal">(optional)</span></label>
                  <textarea
                    id="precedents"
                    bind:value={precedents}
                    rows="2"
                    class="w-full px-3 py-2 border rounded-md border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Mention other cities or organizations with similar policies..."
                  ></textarea>
                </div>
              </div>

            {:else if projectType === 'problem'}
              <div class="space-y-4 p-4 bg-amber-50 rounded-md border border-amber-100">
                <div>
                  <label for="whoAffected" class="block text-sm font-medium text-gray-700 mb-2">Who experiences this problem?*</label>
                  <input
                    id="whoAffected"
                    type="text"
                    bind:value={whoAffected}
                    required
                    class="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 {fieldErrors.whoAffected ? 'border-red-400' : 'border-gray-300'}"
                    placeholder="Small business owners, transit riders, families with kids..."
                  />
                  <p class="text-xs text-gray-500 mt-1">Be specific about who this affects</p>
                  {#if fieldErrors.whoAffected}<p class="text-xs text-red-600 mt-1">{fieldErrors.whoAffected}</p>{/if}
                </div>

                <div>
                  <label for="whatsNotWorking" class="block text-sm font-medium text-gray-700 mb-2">What's not working?*</label>
                  <textarea
                    id="whatsNotWorking"
                    bind:value={whatsNotWorking}
                    required
                    rows="3"
                    class="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 {fieldErrors.whatsNotWorking ? 'border-red-400' : 'border-gray-300'}"
                    placeholder="Describe the current situation and why it's a problem..."
                  ></textarea>
                  {#if fieldErrors.whatsNotWorking}<p class="text-xs text-red-600 mt-1">{fieldErrors.whatsNotWorking}</p>{/if}
                </div>

                <div>
                  <label for="attemptedSolutions" class="block text-sm font-medium text-gray-700 mb-2">What's been tried? <span class="text-gray-500 font-normal">(optional)</span></label>
                  <textarea
                    id="attemptedSolutions"
                    bind:value={attemptedSolutions}
                    rows="2"
                    class="w-full px-3 py-2 border rounded-md border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Any workarounds or previous attempts to fix this?"
                  ></textarea>
                </div>

                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-2">What kinds of solutions make sense? <span class="text-gray-500 font-normal">(optional)</span></label>
                  <div class="space-y-2">
                    {#each ['Tech solutions', 'Policy solutions', 'Community organizing', 'Research/analysis'] as approach}
                      <label class="flex items-center">
                        <input type="checkbox" bind:group={openTo} value={approach.toLowerCase()} class="mr-2 h-4 w-4 text-amber-600 border-gray-300 rounded focus:ring-amber-500">
                        <span class="text-sm text-gray-700">{approach}</span>
                      </label>
                    {/each}
                  </div>
                </div>
              </div>
            {/if}
          </div>
        {/if}

        <!-- Step 4: Contact & Optional Info -->
        {#if currentStep === 4}
          <div class="space-y-6">
            <div>
              <h2 class="text-lg font-medium text-gray-900 mb-2">How can people reach you?</h2>
              <p class="text-sm text-gray-600 mb-4">Your contact info will only be shown to logged-in users</p>
            </div>

            <div class="space-y-3 p-4 bg-gray-50 rounded-md border border-gray-200">
              <div>
                <label for="contactMethod" class="block text-sm font-medium text-gray-700 mb-2">Preferred method*</label>
                <select
                  id="contactMethod"
                  bind:value={contactMethod}
                  class="w-full px-3 py-2 border rounded-md text-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 border-gray-300"
                >
                  <option value="email">Email</option>
                  <option value="discord">Discord</option>
                  <option value="github">GitHub</option>
                  <option value="other">Other</option>
                </select>
              </div>

              <div>
                <label for="contactInfo" class="block text-sm font-medium text-gray-700 mb-2">Contact info*</label>
                <input
                  id="contactInfo"
                  type="text"
                  bind:value={contactInfo}
                  required
                  class="w-full px-3 py-2 border rounded-md text-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 {fieldErrors.contactInfo ? 'border-red-400' : 'border-gray-300'}"
                  placeholder={
                    contactMethod === 'discord' ? 'username#1234' :
                    contactMethod === 'email' ? 'your@email.com' :
                    contactMethod === 'github' ? 'github.com/username' : 'Your contact info'
                  }
                />
                {#if fieldErrors.contactInfo}<p class="text-xs text-red-600 mt-1">{fieldErrors.contactInfo}</p>{/if}
              </div>
            </div>

            <div class="border-t pt-4 space-y-3">
              <p class="text-sm font-medium text-gray-600">Additional info <span class="text-gray-500 font-normal">(all optional)</span></p>

              <!-- partner orgs -->
              {#if !showPartner}
                <button type="button" 
                  class="text-sm text-blue-600 hover:text-blue-700 flex items-center gap-2"
                  on:click={() => showPartner = true}>
                  <span>+ Add partner/sponsor info</span>
                  {#if partnerCount > 0}
                    <span class="text-xs bg-blue-100 text-blue-700 px-2 py-0.5 rounded-full">{partnerCount}</span>
                  {/if}
                </button>
              {:else}
                <div class="space-y-2 p-3 bg-gray-50 rounded-md border border-gray-200">
                  <div class="flex items-center justify-between">
                    <p class="text-sm font-medium text-gray-700">
                      {#if projectType === 'tech'}
                        Working with any govt agencies or orgs?
                      {:else if projectType === 'policy'}
                        Is there a sponsoring office or champion?
                      {:else}
                        Any orgs already aware of this issue?
                      {/if}
                    </p>
                    <button type="button" class="text-xs text-gray-500 hover:text-gray-700" on:click={() => showPartner = false}>Hide</button>
                  </div>
                  <input
                    type="text"
                    bind:value={partnerOrgs}
                    class="w-full px-3 py-2 border rounded-md text-sm border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Org names, contact names, or emails"
                  />
                </div>
              {/if}

              <!-- links -->
              {#if !showLinks}
                <button type="button" 
                  class="text-sm text-blue-600 hover:text-blue-700 flex items-center gap-2"
                  on:click={() => showLinks = true}>
                  <span>+ Add relevant links</span>
                  {#if linksCount > 0}
                    <span class="text-xs bg-blue-100 text-blue-700 px-2 py-0.5 rounded-full">{linksCount}</span>
                  {/if}
                </button>
              {:else}
                <div class="space-y-2 p-3 bg-gray-50 rounded-md border border-gray-200">
                  <div class="flex items-center justify-between">
                    <p class="text-sm font-medium text-gray-700">Links to docs, repos, demos, etc</p>
                    <button type="button" class="text-xs text-gray-500 hover:text-gray-700" on:click={() => showLinks = false}>Hide</button>
                  </div>
                  <div>
                    <label class="block text-xs text-gray-600 mb-1">GitHub repo</label>
                    <input
                      type="url"
                      bind:value={githubUrl}
                      class="w-full px-3 py-2 border rounded-md text-sm border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                      placeholder="https://github.com/username/repo"
                    />
                  </div>
                  {#each links as link, i}
                    <div>
                      <label class="block text-xs text-gray-600 mb-1">Other link {i + 1}</label>
                      <input
                        type="url"
                        bind:value={links[i]}
                        class="w-full px-3 py-2 border rounded-md text-sm border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                        placeholder="https://..."
                      />
                    </div>
                  {/each}
                </div>
              {/if}

              <!-- image -->
              {#if !showImage}
                <button type="button" 
                  class="text-sm text-blue-600 hover:text-blue-700 flex items-center gap-2"
                  on:click={() => showImage = true}>
                  <span>+ Add a cover image</span>
                  {#if imageCount > 0}
                    <span class="text-xs bg-blue-100 text-blue-700 px-2 py-0.5 rounded-full">{imageCount}</span>
                  {/if}
                </button>
              {:else}
                <div class="space-y-2 p-3 bg-gray-50 rounded-md border border-gray-200">
                  <div class="flex items-center justify-between">
                    <p class="text-sm font-medium text-gray-700">Cover image</p>
                    <button type="button" class="text-xs text-gray-500 hover:text-gray-700" on:click={() => showImage = false}>Hide</button>
                  </div>
                  <input
                    type="url"
                    bind:value={imageUrl}
                    class="w-full px-3 py-2 border rounded-md text-sm border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    placeholder="https://example.com/image.jpg"
                  />
                  {#if imageUrl.trim()}
                    <img src={imageUrl} alt="preview" class="w-full h-32 object-cover rounded-md mt-2" on:error={() => {}} />
                  {/if}
                </div>
              {/if}
            </div>
          </div>
        {/if}

        <!-- Navigation buttons -->
        <div class="pt-4 flex gap-3 {currentStep === 1 ? 'justify-end' : 'justify-between'}">
          {#if currentStep > 1}
            <button
              type="button"
              on:click={prevStep}
              class="px-6 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 transition-colors font-medium"
            >
              Back
            </button>
          {/if}

          {#if currentStep < totalSteps}
            <button
              type="button"
              on:click={nextStep}
              class="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors font-medium"
            >
              Continue
            </button>
          {:else}
            <div class="pt-4 flex gap-3">
              <button
                type="button"
                on:click={() => handleSubmit('draft')}
                disabled={isLoading}
                class="flex-1 px-6 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed font-medium"
              >
                {isLoading && status === 'draft' ? 'Saving...' : 'Save as draft'}
              </button>
              
              <button
                type="submit"
                disabled={isLoading}
                class="flex-1 px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed font-medium"
              >
                {isLoading && status === 'published' ? 'Publishing...' : 'Publish your post'}
              </button>
            </div>
          {/if}
        </div>
      </form>
    </div>
  </div>
</div>