export default function(container) {
  container.innerHTML = `
    <div class="space-y-6">
      <div class="flex space-x-2 border-b border-gray-200 dark:border-gray-700">
        <button id="encode-tab" class="px-4 py-2 font-medium border-b-2 border-primary-500 text-primary-500">Encode</button>
        <button id="decode-tab" class="px-4 py-2 font-medium text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200">Decode</button>
      </div>
      
      <div id="encode-section">
        <div class="space-y-4">
          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Input Text</label>
            <textarea 
              id="encode-input" 
              rows="6" 
              class="input-field font-mono text-sm resize-none"
              placeholder="Enter text to encode..."
            ></textarea>
          </div>
          
          <button onclick="encodeBase64()" class="btn-primary w-full">Encode to Base64</button>
          
          <div>
            <div class="flex items-center justify-between mb-2">
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-300">Base64 Output</label>
              <button onclick="copyText('encode-output')" class="text-sm text-primary-500 hover:text-primary-600 font-medium">Copy</button>
            </div>
            <textarea 
              id="encode-output" 
              rows="6" 
              class="input-field font-mono text-sm resize-none"
              readonly
            ></textarea>
          </div>
        </div>
      </div>
      
      <div id="decode-section" class="hidden">
        <div class="space-y-4">
          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Base64 Input</label>
            <textarea 
              id="decode-input" 
              rows="6" 
              class="input-field font-mono text-sm resize-none"
              placeholder="Enter Base64 string to decode..."
            ></textarea>
          </div>
          
          <button onclick="decodeBase64()" class="btn-primary w-full">Decode from Base64</button>
          
          <div>
            <div class="flex items-center justify-between mb-2">
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-300">Decoded Output</label>
              <button onclick="copyText('decode-output')" class="text-sm text-primary-500 hover:text-primary-600 font-medium">Copy</button>
            </div>
            <textarea 
              id="decode-output" 
              rows="6" 
              class="input-field font-mono text-sm resize-none"
              readonly
            ></textarea>
          </div>
          <div id="decode-error" class="hidden text-red-500 text-sm"></div>
        </div>
      </div>
    </div>
  `
  
  // Tab switching
  const encodeTab = document.getElementById('encode-tab')
  const decodeTab = document.getElementById('decode-tab')
  const encodeSection = document.getElementById('encode-section')
  const decodeSection = document.getElementById('decode-section')
  
  encodeTab.addEventListener('click', () => {
    encodeTab.classList.add('border-primary-500', 'text-primary-500')
    encodeTab.classList.remove('text-gray-600', 'dark:text-gray-400')
    decodeTab.classList.remove('border-primary-500', 'text-primary-500')
    decodeTab.classList.add('text-gray-600', 'dark:text-gray-400')
    encodeSection.classList.remove('hidden')
    decodeSection.classList.add('hidden')
  })
  
  decodeTab.addEventListener('click', () => {
    decodeTab.classList.add('border-primary-500', 'text-primary-500')
    decodeTab.classList.remove('text-gray-600', 'dark:text-gray-400')
    encodeTab.classList.remove('border-primary-500', 'text-primary-500')
    encodeTab.classList.add('text-gray-600', 'dark:text-gray-400')
    decodeSection.classList.remove('hidden')
    encodeSection.classList.add('hidden')
  })
  
  // Encode function
  window.encodeBase64 = () => {
    const input = document.getElementById('encode-input').value
    const output = document.getElementById('encode-output')
    
    if (!input) {
      output.value = ''
      return
    }
    
    try {
      output.value = btoa(unescape(encodeURIComponent(input)))
    } catch (error) {
      output.value = 'Error encoding text'
    }
  }
  
  // Decode function
  window.decodeBase64 = () => {
    const input = document.getElementById('decode-input').value
    const output = document.getElementById('decode-output')
    const errorDiv = document.getElementById('decode-error')
    
    if (!input) {
      output.value = ''
      errorDiv.classList.add('hidden')
      return
    }
    
    try {
      output.value = decodeURIComponent(escape(atob(input)))
      errorDiv.classList.add('hidden')
    } catch (error) {
      output.value = ''
      errorDiv.textContent = 'Invalid Base64 string'
      errorDiv.classList.remove('hidden')
    }
  }
  
  // Copy function
  window.copyText = (elementId) => {
    const element = document.getElementById(elementId)
    element.select()
    document.execCommand('copy')
    
    const btn = event.target
    const originalText = btn.textContent
    btn.textContent = 'Copied!'
    setTimeout(() => {
      btn.textContent = originalText
    }, 2000)
  }
}

// Made with Bob
