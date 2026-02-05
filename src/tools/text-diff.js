export default function(container) {
  container.innerHTML = `
    <div class="space-y-6">
      <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Original Text</label>
          <textarea 
            id="text1" 
            rows="15" 
            class="input-field font-mono text-sm resize-none"
            placeholder="Enter original text..."
          ></textarea>
        </div>
        
        <div>
          <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Modified Text</label>
          <textarea 
            id="text2" 
            rows="15" 
            class="input-field font-mono text-sm resize-none"
            placeholder="Enter modified text..."
          ></textarea>
        </div>
      </div>
      
      <button onclick="compareDiff()" class="btn-primary w-full">Compare Texts</button>
      
      <div id="diff-results" class="hidden">
        <div class="flex items-center justify-between mb-2">
          <h3 class="text-lg font-semibold text-gray-900 dark:text-white">Differences</h3>
          <div class="flex space-x-4 text-sm">
            <span class="flex items-center">
              <span class="w-3 h-3 bg-green-200 dark:bg-green-800 rounded mr-1"></span>
              <span class="text-gray-600 dark:text-gray-400">Added (<span id="added-count">0</span>)</span>
            </span>
            <span class="flex items-center">
              <span class="w-3 h-3 bg-red-200 dark:bg-red-800 rounded mr-1"></span>
              <span class="text-gray-600 dark:text-gray-400">Removed (<span id="removed-count">0</span>)</span>
            </span>
          </div>
        </div>
        
        <div id="diff-output" class="p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg font-mono text-sm overflow-x-auto max-h-96 overflow-y-auto"></div>
      </div>
    </div>
  `
  
  window.compareDiff = () => {
    const text1 = document.getElementById('text1').value
    const text2 = document.getElementById('text2').value
    const results = document.getElementById('diff-results')
    const output = document.getElementById('diff-output')
    
    if (!text1 && !text2) {
      results.classList.add('hidden')
      return
    }
    
    const lines1 = text1.split('\n')
    const lines2 = text2.split('\n')
    
    const diff = computeDiff(lines1, lines2)
    
    let addedCount = 0
    let removedCount = 0
    let html = ''
    
    diff.forEach(item => {
      if (item.type === 'added') {
        addedCount++
        html += `<div class="bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-200 px-2 py-1 border-l-4 border-green-500">+ ${escapeHtml(item.value)}</div>`
      } else if (item.type === 'removed') {
        removedCount++
        html += `<div class="bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-200 px-2 py-1 border-l-4 border-red-500">- ${escapeHtml(item.value)}</div>`
      } else {
        html += `<div class="text-gray-700 dark:text-gray-300 px-2 py-1">&nbsp; ${escapeHtml(item.value)}</div>`
      }
    })
    
    document.getElementById('added-count').textContent = addedCount
    document.getElementById('removed-count').textContent = removedCount
    output.innerHTML = html || '<div class="text-gray-500 dark:text-gray-400 text-center py-8">No differences found</div>'
    results.classList.remove('hidden')
  }
  
  function computeDiff(lines1, lines2) {
    const result = []
    const maxLen = Math.max(lines1.length, lines2.length)
    
    // Simple line-by-line comparison
    let i = 0, j = 0
    
    while (i < lines1.length || j < lines2.length) {
      if (i >= lines1.length) {
        // Only lines2 left
        result.push({ type: 'added', value: lines2[j] })
        j++
      } else if (j >= lines2.length) {
        // Only lines1 left
        result.push({ type: 'removed', value: lines1[i] })
        i++
      } else if (lines1[i] === lines2[j]) {
        // Lines match
        result.push({ type: 'unchanged', value: lines1[i] })
        i++
        j++
      } else {
        // Lines differ - check if next line matches
        if (i + 1 < lines1.length && lines1[i + 1] === lines2[j]) {
          result.push({ type: 'removed', value: lines1[i] })
          i++
        } else if (j + 1 < lines2.length && lines1[i] === lines2[j + 1]) {
          result.push({ type: 'added', value: lines2[j] })
          j++
        } else {
          // Both lines are different
          result.push({ type: 'removed', value: lines1[i] })
          result.push({ type: 'added', value: lines2[j] })
          i++
          j++
        }
      }
    }
    
    return result
  }
  
  function escapeHtml(text) {
    const div = document.createElement('div')
    div.textContent = text
    return div.innerHTML
  }
}

// Made with Bob
