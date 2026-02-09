import './style.css'
import { tools } from './tools/toolsData.js'
import { initTheme } from './utils/theme.js'
import { openToolModal } from './components/Modal.js'
import { trackPageVisit } from './utils/analytics.js'

// Initialize theme
initTheme()

// Track page visit
trackPageVisit()

// Render tool cards
function renderTools() {
  const toolsGrid = document.getElementById('tools-grid')
  
  tools.forEach((tool, index) => {
    const card = document.createElement('div')
    card.className = 'tool-card animate-slide-up'
    card.style.animationDelay = `${index * 0.05}s`
    
    card.innerHTML = `
      <div class="flex items-center justify-center w-16 h-16 rounded-xl bg-gradient-to-br ${tool.gradient} mb-4">
        ${tool.icon}
      </div>
      <h3 class="text-xl font-semibold text-gray-900 dark:text-white mb-2">${tool.name}</h3>
      <p class="text-gray-600 dark:text-gray-400 text-sm mb-4">${tool.description}</p>
      <div class="flex items-center text-primary-500 dark:text-primary-400 text-sm font-medium">
        <span>Open Tool</span>
        <svg class="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"></path>
        </svg>
      </div>
    `
    
    card.addEventListener('click', () => openToolModal(tool))
    toolsGrid.appendChild(card)
  })
}

// Initialize app
renderTools()

// Made with Bob
