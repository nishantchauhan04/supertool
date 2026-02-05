export function openToolModal(tool) {
  const modalContainer = document.getElementById('modal-container')
  
  const modal = document.createElement('div')
  modal.className = 'modal-overlay animate-fade-in'
  modal.innerHTML = `
    <div class="modal-content">
      <div class="sticky top-0 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 px-6 py-4 flex items-center justify-between z-10">
        <div class="flex items-center space-x-3">
          <div class="w-10 h-10 rounded-lg bg-gradient-to-br ${tool.gradient} flex items-center justify-center">
            ${tool.icon}
          </div>
          <h2 class="text-2xl font-bold text-gray-900 dark:text-white">${tool.name}</h2>
        </div>
        <button id="close-modal" class="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors">
          <svg class="w-6 h-6 text-gray-600 dark:text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
          </svg>
        </button>
      </div>
      <div id="tool-content" class="p-6">
        <!-- Tool content will be loaded here -->
      </div>
      
      <!-- Ad Slot 4: In-Modal Ad (Bottom) -->
      <div class="border-t border-gray-200 dark:border-gray-700 p-6 bg-gray-50 dark:bg-gray-900/50">
        <div class="max-w-3xl mx-auto">
          <ins class="adsbygoogle"
               style="display:block"
               data-ad-client="ca-pub-6455259419236944"
               data-ad-slot="5566778899"
               data-ad-format="auto"
               data-full-width-responsive="true"></ins>
          <script>
               (adsbygoogle = window.adsbygoogle || []).push({});
          </script>
        </div>
      </div>
    </div>
  `
  
  modalContainer.appendChild(modal)
  
  // Close modal on overlay click
  modal.addEventListener('click', (e) => {
    if (e.target === modal) {
      closeModal()
    }
  })
  
  // Close modal on close button click
  document.getElementById('close-modal').addEventListener('click', closeModal)
  
  // Close modal on Escape key
  document.addEventListener('keydown', handleEscape)
  
  // Load tool content
  loadToolContent(tool)
}

function closeModal() {
  const modalContainer = document.getElementById('modal-container')
  modalContainer.innerHTML = ''
  document.removeEventListener('keydown', handleEscape)
}

function handleEscape(e) {
  if (e.key === 'Escape') {
    closeModal()
  }
}

async function loadToolContent(tool) {
  const toolContent = document.getElementById('tool-content')
  
  try {
    // Dynamically import the tool module
    const toolModule = await import(`../tools/${tool.id}.js`)
    toolModule.default(toolContent)
  } catch (error) {
    console.error(`Error loading tool ${tool.id}:`, error)
    toolContent.innerHTML = `
      <div class="text-center py-12">
        <svg class="w-16 h-16 mx-auto text-gray-400 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
        </svg>
        <h3 class="text-xl font-semibold text-gray-900 dark:text-white mb-2">Tool Coming Soon</h3>
        <p class="text-gray-600 dark:text-gray-400">This tool is currently under development.</p>
      </div>
    `
  }
}

// Made with Bob
