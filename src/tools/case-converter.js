export default function(container) {
  container.innerHTML = `
    <div class="space-y-6">
      <div>
        <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Input Text</label>
        <textarea 
          id="input-text" 
          rows="8" 
          class="input-field font-mono text-sm resize-none"
          placeholder="Enter your text here..."
        ></textarea>
      </div>
      
      <div class="grid grid-cols-2 sm:grid-cols-3 gap-3">
        <button onclick="convertCase('upper')" class="btn-secondary">UPPERCASE</button>
        <button onclick="convertCase('lower')" class="btn-secondary">lowercase</button>
        <button onclick="convertCase('title')" class="btn-secondary">Title Case</button>
        <button onclick="convertCase('sentence')" class="btn-secondary">Sentence case</button>
        <button onclick="convertCase('camel')" class="btn-secondary">camelCase</button>
        <button onclick="convertCase('snake')" class="btn-secondary">snake_case</button>
      </div>
      
      <div>
        <div class="flex items-center justify-between mb-2">
          <label class="block text-sm font-medium text-gray-700 dark:text-gray-300">Output</label>
          <button onclick="copyOutput()" class="text-sm text-primary-500 hover:text-primary-600 font-medium">Copy</button>
        </div>
        <textarea 
          id="output-text" 
          rows="8" 
          class="input-field font-mono text-sm resize-none"
          readonly
        ></textarea>
      </div>
    </div>
  `
  
  // Make functions globally accessible
  window.convertCase = (type) => {
    const input = document.getElementById('input-text').value
    const output = document.getElementById('output-text')
    
    if (!input) {
      output.value = ''
      return
    }
    
    switch(type) {
      case 'upper':
        output.value = input.toUpperCase()
        break
      case 'lower':
        output.value = input.toLowerCase()
        break
      case 'title':
        output.value = input.replace(/\w\S*/g, (txt) => {
          return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase()
        })
        break
      case 'sentence':
        output.value = input.toLowerCase().replace(/(^\s*\w|[.!?]\s*\w)/g, (c) => c.toUpperCase())
        break
      case 'camel':
        output.value = input
          .replace(/(?:^\w|[A-Z]|\b\w)/g, (word, index) => {
            return index === 0 ? word.toLowerCase() : word.toUpperCase()
          })
          .replace(/\s+/g, '')
        break
      case 'snake':
        output.value = input
          .replace(/\W+/g, ' ')
          .split(/ |\B(?=[A-Z])/)
          .map(word => word.toLowerCase())
          .join('_')
        break
    }
  }
  
  window.copyOutput = () => {
    const output = document.getElementById('output-text')
    output.select()
    document.execCommand('copy')
    
    // Show feedback
    const btn = event.target
    const originalText = btn.textContent
    btn.textContent = 'Copied!'
    setTimeout(() => {
      btn.textContent = originalText
    }, 2000)
  }
}

// Made with Bob
