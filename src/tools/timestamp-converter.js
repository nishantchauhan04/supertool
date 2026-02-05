export default function(container) {
  container.innerHTML = `
    <div class="space-y-6">
      <!-- Current Timestamp -->
      <div class="bg-primary-50 dark:bg-primary-900/20 rounded-lg p-4 border border-primary-200 dark:border-primary-800">
        <div class="text-sm text-gray-600 dark:text-gray-400 mb-1">Current Timestamp</div>
        <div id="current-timestamp" class="text-2xl font-mono font-bold text-gray-900 dark:text-white"></div>
        <div id="current-date" class="text-sm text-gray-600 dark:text-gray-400 mt-1"></div>
      </div>
      
      <!-- Timestamp to Date -->
      <div class="space-y-4">
        <h3 class="text-lg font-semibold text-gray-900 dark:text-white">Timestamp to Date</h3>
        <div>
          <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Timestamp (seconds or milliseconds)</label>
          <input 
            type="text" 
            id="timestamp-input" 
            class="input-field font-mono"
            placeholder="e.g., 1738310400 or 1738310400000"
          />
        </div>
        <button onclick="convertTimestamp()" class="btn-primary w-full">Convert to Date</button>
        <div id="timestamp-result" class="hidden space-y-2 p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
          <div class="grid grid-cols-2 gap-2 text-sm">
            <div class="text-gray-600 dark:text-gray-400">Local Time:</div>
            <div id="local-time" class="font-mono text-gray-900 dark:text-white"></div>
            <div class="text-gray-600 dark:text-gray-400">UTC Time:</div>
            <div id="utc-time" class="font-mono text-gray-900 dark:text-white"></div>
            <div class="text-gray-600 dark:text-gray-400">ISO 8601:</div>
            <div id="iso-time" class="font-mono text-gray-900 dark:text-white"></div>
          </div>
        </div>
      </div>
      
      <!-- Date to Timestamp -->
      <div class="space-y-4">
        <h3 class="text-lg font-semibold text-gray-900 dark:text-white">Date to Timestamp</h3>
        <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Date</label>
            <input 
              type="date" 
              id="date-input" 
              class="input-field"
            />
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Time</label>
            <input 
              type="time" 
              id="time-input" 
              class="input-field"
            />
          </div>
        </div>
        <button onclick="convertDate()" class="btn-primary w-full">Convert to Timestamp</button>
        <div id="date-result" class="hidden space-y-2 p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
          <div class="grid grid-cols-2 gap-2 text-sm">
            <div class="text-gray-600 dark:text-gray-400">Seconds:</div>
            <div id="seconds-result" class="font-mono text-gray-900 dark:text-white"></div>
            <div class="text-gray-600 dark:text-gray-400">Milliseconds:</div>
            <div id="milliseconds-result" class="font-mono text-gray-900 dark:text-white"></div>
          </div>
        </div>
      </div>
    </div>
  `
  
  // Update current timestamp every second
  function updateCurrentTimestamp() {
    const now = Date.now()
    document.getElementById('current-timestamp').textContent = Math.floor(now / 1000)
    document.getElementById('current-date').textContent = new Date(now).toLocaleString()
  }
  
  updateCurrentTimestamp()
  const interval = setInterval(updateCurrentTimestamp, 1000)
  
  // Clean up interval when modal closes
  const observer = new MutationObserver((mutations) => {
    mutations.forEach((mutation) => {
      if (mutation.removedNodes.length > 0) {
        clearInterval(interval)
        observer.disconnect()
      }
    })
  })
  
  observer.observe(container.parentElement, { childList: true })
  
  // Set default date and time to now
  const now = new Date()
  document.getElementById('date-input').valueAsDate = now
  document.getElementById('time-input').value = now.toTimeString().slice(0, 5)
  
  // Convert timestamp to date
  window.convertTimestamp = () => {
    const input = document.getElementById('timestamp-input').value.trim()
    const result = document.getElementById('timestamp-result')
    
    if (!input) {
      result.classList.add('hidden')
      return
    }
    
    let timestamp = parseInt(input)
    
    // If timestamp is in seconds (10 digits), convert to milliseconds
    if (timestamp.toString().length === 10) {
      timestamp *= 1000
    }
    
    const date = new Date(timestamp)
    
    if (isNaN(date.getTime())) {
      alert('Invalid timestamp')
      return
    }
    
    document.getElementById('local-time').textContent = date.toLocaleString()
    document.getElementById('utc-time').textContent = date.toUTCString()
    document.getElementById('iso-time').textContent = date.toISOString()
    result.classList.remove('hidden')
  }
  
  // Convert date to timestamp
  window.convertDate = () => {
    const dateInput = document.getElementById('date-input').value
    const timeInput = document.getElementById('time-input').value
    const result = document.getElementById('date-result')
    
    if (!dateInput || !timeInput) {
      result.classList.add('hidden')
      return
    }
    
    const dateTime = new Date(`${dateInput}T${timeInput}`)
    const timestamp = dateTime.getTime()
    
    document.getElementById('seconds-result').textContent = Math.floor(timestamp / 1000)
    document.getElementById('milliseconds-result').textContent = timestamp
    result.classList.remove('hidden')
  }
}

// Made with Bob
