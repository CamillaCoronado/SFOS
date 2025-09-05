<!-- src/routes/learn-more/+page.svelte -->
<script lang="ts">
  import { goto } from '$app/navigation';
</script>

<div class="min-h-screen bg-gray-50 text-gray-800">
  <!-- Top navigation with jump links -->
    <nav class="sticky top-0 bg-white shadow-sm z-10">
    <div class="max-w-5xl mx-auto px-4 py-3 flex items-center justify-between">
      <!-- Branding / Home -->
      <a href="/" class="flex items-center gap-2">
        <img src="/logo.png" alt="SFOS Logo" class="w-8 h-8 object-cover" />
        <span class="text-xl font-semibold text-orange-500">SFOS</span>
      </a>

      <!-- Jump links -->
      <div class="flex gap-6 text-sm font-medium">
        <a href="#hackers" class="hover:text-orange-500">For Hackers</a>
        <a href="#government" class="hover:text-orange-500">For Government</a>
        <a href="#residents" class="hover:text-orange-500">For Residents &amp; Civic Orgs</a>
      </div>
    </div>
  </nav>

  <!-- Sections -->
 <section id="hackers" class="max-w-5xl mx-auto px-4 py-20">
  <h2 class="text-2xl font-bold mb-4">For Hackers</h2>

  <p class="mb-4">
    How to get involved in civic tech in San Francisco – for technologists, data scientists, designers, and more.
  </p>

  <h3 class="text-lg font-semibold mt-6 mb-2">Use SF OS to:</h3>
  <ul class="list-disc pl-6 space-y-2 text-gray-700">
    <li>Start hacking on a listed project idea — just leave a comment so collaborators, advisors, or end-users can get in touch.</li>
    <li>Join an ongoing project — message the project lead shown on the card.</li>
    <li>Recruit a team — leave a note on the project with your skills + a public contact.</li>
    <li>Comment on ideas to refine them or offer suggestions.</li>
    <li>Browse the library of pain-points &amp; proposals; add your expertise in the comments.</li>
    <li>Help refine policy ideas for how the City could leverage technology better. If a proposal inspires you, advocate for it: e-mail your supervisor or the contact shown.</li>
  </ul>

  <h3 class="text-lg font-semibold mt-6 mb-2">Ways to plug in beyond SF OS:</h3>
  <ul class="list-disc pl-6 space-y-2 text-gray-700">
    <li><strong>SF Civic Tech Meetup</strong> — weekly hack-night (formerly the Code for America SF chapter).</li>
    <li><strong>Civlab.org</strong> — builds civic tech projects and runs “How SF Government Actually Works.”</li>
    <li><strong>Hackathons</strong> — watch Devpost for social good hackathons; Gray Area and SF10x have hosted Civic Tech hackathons.</li>
    <li><strong>National orgs</strong>: Code for America, U.S. Digital Response (standby roster for crisis tech support).</li>
  </ul>

  <h3 class="text-lg font-semibold mt-6 mb-2">Work with SF Government directly:</h3>
  <ul class="list-disc pl-6 space-y-2 text-gray-700">
    <li><strong>Corporate volunteering</strong>: Civic Bridge (pro-bono sprint on government challenges), opportunities from the Partnership for San Francisco (launching 2025).</li>
    <li><strong>Fellowships</strong>: FUSE Corps Executive Fellowship (1-year for experienced executives).</li>
    <li><strong>Jobs</strong>: City tech careers portal (SF Careers), TechToGov transition guide.</li>
    <li><strong>Contracts &amp; procurement</strong>: SF City Partner, Technology Marketplace, SFMTA bids, SFPUC bids, Public Works Bid Opportunities.</li>
    <li>Respond to government RFIs on tech issues — share ideas and perspectives even if you don’t submit a full proposal.</li>
  </ul>

  <h3 class="text-lg font-semibold mt-6 mb-2">Civic Tech job boards:</h3>
  <ul class="list-disc pl-6 space-y-2 text-gray-700">
    <li><strong>Tech Jobs for Good</strong></li>
    <li><strong>Responsible Tech Board</strong> (All Tech Is Human)</li>
  </ul>

  <h3 class="text-lg font-semibold mt-6 mb-2">Further resources:</h3>
  <ul class="list-disc pl-6 space-y-2 text-gray-700">
    <li><strong>SF govt agencies</strong>: Mayor’s Office for Innovation + i-team, Digital and Data Services.</li>
    <li><strong>SF data sources</strong>: DataSF (~400 datasets), SF GovGraph.</li>
    <li><strong>Civic tech field guide</strong> — a global resource list.</li>
    <li><strong>Emerging pilots</strong>: 2025 Gen-AI Copilot sandbox.</li>
  </ul>

  <p class="mt-6 text-gray-700">
    Know another opportunity or resource? Leave a comment here.
  </p>
</section>


<section id="government" class="max-w-5xl mx-auto px-4 py-20">
  <h2 class="text-2xl font-bold mb-4">For Government</h2>

  <h3 class="text-lg font-semibold mt-6 mb-2">How to use this platform:</h3>
  <ul class="list-disc pl-6 space-y-2 text-gray-700">
    <li>
      <strong>Post your ideas.</strong> These can be detailed project specifications of civic tech projects you’d like volunteers to build, or broader “problem areas” for others to explore. Posting with a government email allows your idea to be tagged as official, and ideally you’ll leave a contact to advise the project.
    </li>
    <li>
      <strong>Comment and advise volunteer technologists.</strong> Browse ongoing projects and help ensure volunteer work aligns with real-world needs and impact.
    </li>
    <li>
      <strong>Browse the library of policy ideas.</strong> Items tagged “policy” suggest government actions to better leverage technology and support the civic-tech community. These are based on SF civic tech expertise and examples of successful initiatives worldwide.
    </li>
  </ul>

  <h3 class="text-lg font-semibold mt-6 mb-2">What kind of ideas might you post?</h3>
  <p class="mb-4 text-gray-700">
    Browse the library for inspiration. Some high-level principles:
  </p>
  <ul class="list-disc pl-6 space-y-2 text-gray-700">
    <li>
      <strong>Government efficiency &amp; effectiveness:</strong> What tech could make your work more efficient? Civic hackers may prototype and deliver solutions directly, or help explore concepts that can later be formally procured.
    </li>
    <li>
      <strong>Resident-facing tools:</strong> Many civic tech projects are designed for residents, not government. You have valuable insight into what would help the public: apps, websites, visualizations, or tools to understand issues, provide input, or navigate services and regulations.
    </li>
  </ul>
</section>


  <section id="residents" class="max-w-5xl mx-auto px-4 py-20">
  <h2 class="text-2xl font-bold mb-4">For Residents &amp; Civic Orgs</h2>

  <p class="mb-4 text-gray-700">
    What are the tech tools, apps, data analyses, or platforms you wish existed for you, your neighbors, or your local government?  
    If you work on a civic challenge, what parts of your work could the right tech make easier or more effective?
  </p>

  <h3 class="text-lg font-semibold mt-6 mb-2">How you can use SF OS:</h3>
  <ul class="list-disc pl-6 space-y-2 text-gray-700">
    <li>
      <strong>Submit a project:</strong> If you know of a tech solution you want built, add it to the library.
    </li>
    <li>
      <strong>Get inspired:</strong> Browse the SF OS library of project ideas to see what’s possible.
    </li>
    <li>
      <strong>Submit a problem area:</strong> If you don’t have a clear solution but know an area that could benefit from technology, post it as a “problem area” for discussion.
    </li>
    <li>
      <strong>Engage with the library:</strong> Upvote ideas to show hackers what you’d like to see built. Comment if you’d personally benefit, if you have suggestions for improvement, or if you see a better approach.
    </li>
    <li>
      <strong>Be an advisor:</strong> Sign up as a potential advisor if you have direct experience with the issue or would be a likely user of the project. You don’t need tech skills — your perspective is valuable. Just leave a comment with your contact info and the perspective you can offer.
    </li>
  </ul>
</section>

</div>
