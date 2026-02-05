export default function(container) {
  container.innerHTML = `
    <div class="space-y-6">
      <div class="flex space-x-2 border-b border-gray-200 dark:border-gray-700">
        <button id="format-tab" class="px-4 py-2 font-medium border-b-2 border-primary-500 text-primary-500">Format</button>
        <button id="validate-tab" class="px-4 py-2 font-medium text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200">Validate</button>
        <button id="minify-tab" class="px-4 py-2 font-medium text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200">Minify</button>
      </div>
      
      <div>
        <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Input JSON</label>
        <textarea 
          id="json-input" 
          rows="12" 
          class="input-field font-mono text-sm resize-none"
          placeholder='{"name": "John", "age": 30}'
        ></textarea>
      </div>
      
      <div class="flex space-x-3">
        <button onclick="formatJSON()" class="btn-primary flex-1">Format & Beautify</button>
        <button onclick="validateJSON()" class="btn-secondary flex-1">Validate</button>
        <button onclick="minifyJSON()" class="btn-secondary flex-1">Minify</button>
      </div>
      
      <div id="validation-message" class="hidden"></div>
      
      <div>
        <div class="flex items-center justify-between mb-2">
          <label class="block text-sm font-medium text-gray-700 dark:text-gray-300">Output</label>
          <button onclick="copyOutput()" class="text-sm text-primary-500 hover:text-primary-600 font-medium">Copy</button>
        </div>
        <textarea 
          id="json-output" 
          rows="12" 
          class="input-field font-mono text-sm resize-none"
          readonly
        ></textarea>
      </div>
      
      <div id="json-stats" class="hidden grid grid-cols-2 sm:grid-cols-4 gap-4 p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
        <div>
          <div class="text-xs text-gray-600 dark:text-gray-400">Size</div>
          <div id="json-size" class="font-semibold text-gray-900 dark:text-white"></div>
        </div>
        <div>
          <div class="text-xs text-gray-600 dark:text-gray-400">Lines</div>
          <div id="json-lines" class="font-semibold text-gray-900 dark:text-white"></div>
        </div>
        <div>
          <div class="text-xs text-gray-600 dark:text-gray-400">Characters</div>
          <div id="json-chars" class="font-semibold text-gray-900 dark:text-white"></div>
        </div>
        <div>
          <div class="text-xs text-gray-600 dark:text-gray-400">Valid</div>
          <div id="json-valid" class="font-semibold"></div>
        </div>
      </div>
    </div>
  `
  
  const input = document.getElementById('json-input')
  const output = document.getElementById('json-output')
  const validationMessage = document.getElementById('validation-message')
  const stats = document.getElementById('json-stats')
  
  function showMessage(message, type = 'success') {
    validationMessage.className = `p-4 rounded-lg ${
      type === 'success' 
        ? 'bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-400 border border-green-200 dark:border-green-800' 
        : 'bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-400 border border-red-200 dark:border-red-800'
    }`
    validationMessage.textContent = message
    validationMessage.classList.remove('hidden')
  }
  
  function updateStats(jsonString, isValid) {
    const size = new Blob([jsonString]).size
    const lines = jsonString.split('\n').length
    const chars = jsonString.length
    
    document.getElementById('json-size').textContent = formatBytes(size)
    document.getElementById('json-lines').textContent = lines
    document.getElementById('json-chars').textContent = chars.toLocaleString()
    
    const validElement = document.getElementById('json-valid')
    if (isValid) {
      validElement.textContent = '✓ Valid'
      validElement.className = 'font-semibold text-green-600 dark:text-green-400'
    } else {
      validElement.textContent = '✗ Invalid'
      validElement.className = 'font-semibold text-red-600 dark:text-red-400'
    }
    
    stats.classList.remove('hidden')
  }
  
  function formatBytes(bytes) {
    if (bytes === 0) return '0 Bytes'
    const k = 1024
    const sizes = ['Bytes', 'KB', 'MB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i]
  }
  
  window.formatJSON = () => {
    const inputText = input.value.trim()
    
    if (!inputText) {
      output.value = ''
      validationMessage.classList.add('hidden')
      stats.classList.add('hidden')
      return
    }
    
    try {
      const parsed = JSON.parse(inputText)
      const formatted = JSON.stringify(parsed, null, 2)
      output.value = formatted
      showMessage('✓ JSON is valid and formatted successfully!', 'success')
      updateStats(formatted, true)
    } catch (error) {
      output.value = ''
      showMessage(`✗ Invalid JSON: ${error.message}`, 'error')
      updateStats(inputText, false)
    }
  }
  
  window.validateJSON = () => {
    const inputText = input.value.trim()
    
    if (!inputText) {
      showMessage('Please enter JSON to validate', 'error')
      stats.classList.add('hidden')
      return
    }
    
    try {
      JSON.parse(inputText)
      showMessage('✓ JSON is valid!', 'success')
      updateStats(inputText, true)
      output.value = 'JSON is valid ✓'
    } catch (error) {
      showMessage(`✗ Invalid JSON: ${error.message}`, 'error')
      updateStats(inputText, false)
      output.value = `Error: ${error.message}`
    }
  }
  
  window.minifyJSON = () => {
    const inputText = input.value.trim()
    
    if (!inputText) {
      output.value = ''
      validationMessage.classList.add('hidden')
      stats.classList.add('hidden')
      return
    }
    
    try {
      const parsed = JSON.parse(inputText)
      const minified = JSON.stringify(parsed)
      output.value = minified
      showMessage('✓ JSON minified successfully!', 'success')
      updateStats(minified, true)
    } catch (error) {
      output.value = ''
      showMessage(`✗ Invalid JSON: ${error.message}`, 'error')
      updateStats(inputText, false)
    }
  }
  
  window.copyOutput = () => {
    output.select()
    document.execCommand('copy')
    
    const btn = event.target
    const originalText = btn.textContent
    btn.textContent = 'Copied!'
    setTimeout(() => {
      btn.textContent = originalText
    }, 2000)
  }
  
  // Tab switching
  const formatTab = document.getElementById('format-tab')
  const validateTab = document.getElementById('validate-tab')
  const minifyTab = document.getElementById('minify-tab')
  
  function setActiveTab(activeTab) {
    [formatTab, validateTab, minifyTab].forEach(tab => {
      if (tab === activeTab) {
        tab.classList.add('border-primary-500', 'text-primary-500')
        tab.classList.remove('text-gray-600', 'dark:text-gray-400')
      } else {
        tab.classList.remove('border-primary-500', 'text-primary-500')
        tab.classList.add('text-gray-600', 'dark:text-gray-400')
      }
    })
  }
  
  formatTab.addEventListener('click', () => setActiveTab(formatTab))
  validateTab.addEventListener('click', () => setActiveTab(validateTab))
  minifyTab.addEventListener('click', () => setActiveTab(minifyTab))
}

// Made with Bob
