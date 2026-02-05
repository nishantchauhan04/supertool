export default function(container) {
  container.innerHTML = `
    <div class="space-y-6">
      <div class="file-drop-zone" id="drop-zone">
        <svg class="w-16 h-16 mx-auto text-gray-400 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
        </svg>
        <p class="text-lg font-medium text-gray-700 dark:text-gray-300 mb-2">Drop image here or click to upload</p>
        <p class="text-sm text-gray-500 dark:text-gray-400">Supports JPG, PNG, WebP</p>
        <input type="file" id="file-input" accept="image/*" class="hidden" />
      </div>
      
      <div id="options" class="hidden space-y-4">
        <div class="flex space-x-2 border-b border-gray-200 dark:border-gray-700 mb-4">
          <button id="pixels-tab" class="px-4 py-2 font-medium border-b-2 border-primary-500 text-primary-500">By Pixels</button>
          <button id="percent-tab" class="px-4 py-2 font-medium text-gray-600 dark:text-gray-400">By Percentage</button>
          <button id="preset-tab" class="px-4 py-2 font-medium text-gray-600 dark:text-gray-400">Presets</button>
        </div>
        
        <!-- By Pixels -->
        <div id="pixels-section">
          <div class="grid grid-cols-2 gap-4 mb-4">
            <div>
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Width (px)</label>
              <input type="number" id="width-input" class="input-field" min="1" />
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Height (px)</label>
              <input type="number" id="height-input" class="input-field" min="1" />
            </div>
          </div>
          <label class="flex items-center space-x-2 text-sm text-gray-700 dark:text-gray-300">
            <input type="checkbox" id="maintain-ratio" checked class="rounded" />
            <span>Maintain aspect ratio</span>
          </label>
        </div>
        
        <!-- By Percentage -->
        <div id="percent-section" class="hidden">
          <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Scale (%)</label>
          <input type="range" id="scale-slider" min="10" max="200" value="100" class="w-full" />
          <div class="text-center text-sm text-gray-600 dark:text-gray-400 mt-1">
            <span id="scale-value">100</span>%
          </div>
        </div>
        
        <!-- Presets -->
        <div id="preset-section" class="hidden">
          <div class="grid grid-cols-2 gap-3">
            <button onclick="applyPreset(1080, 1080)" class="btn-secondary">Instagram Square (1080x1080)</button>
            <button onclick="applyPreset(1080, 1350)" class="btn-secondary">Instagram Portrait (1080x1350)</button>
            <button onclick="applyPreset(1200, 630)" class="btn-secondary">Facebook Post (1200x630)</button>
            <button onclick="applyPreset(1024, 512)" class="btn-secondary">Twitter Header (1024x512)</button>
            <button onclick="applyPreset(1920, 1080)" class="btn-secondary">Full HD (1920x1080)</button>
            <button onclick="applyPreset(800, 600)" class="btn-secondary">Small (800x600)</button>
          </div>
        </div>
        
        <button onclick="resizeImage()" class="btn-primary w-full">Resize Image</button>
      </div>
      
      <div id="preview" class="hidden">
        <h3 class="text-lg font-semibold text-gray-900 dark:text-white mb-4">Preview</h3>
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <p class="text-sm text-gray-600 dark:text-gray-400 mb-2">Original</p>
            <div class="border border-gray-300 dark:border-gray-600 rounded-lg p-2 bg-gray-50 dark:bg-gray-700/50">
              <img id="original-preview" class="max-w-full h-auto" />
              <p id="original-size" class="text-xs text-gray-500 dark:text-gray-400 mt-2"></p>
            </div>
          </div>
          <div>
            <p class="text-sm text-gray-600 dark:text-gray-400 mb-2">Resized</p>
            <div class="border border-gray-300 dark:border-gray-600 rounded-lg p-2 bg-gray-50 dark:bg-gray-700/50">
              <canvas id="resized-canvas" class="max-w-full h-auto"></canvas>
              <p id="resized-size" class="text-xs text-gray-500 dark:text-gray-400 mt-2"></p>
            </div>
          </div>
        </div>
        <button onclick="downloadResized()" class="btn-primary w-full mt-4">Download Resized Image</button>
      </div>
    </div>
  `
  
  const dropZone = document.getElementById('drop-zone')
  const fileInput = document.getElementById('file-input')
  const options = document.getElementById('options')
  const preview = document.getElementById('preview')
  const widthInput = document.getElementById('width-input')
  const heightInput = document.getElementById('height-input')
  const maintainRatio = document.getElementById('maintain-ratio')
  const scaleSlider = document.getElementById('scale-slider')
  const scaleValue = document.getElementById('scale-value')
  
  let originalImage = null
  let originalWidth = 0
  let originalHeight = 0
  let aspectRatio = 1
  
  // Tab switching
  const pixelsTab = document.getElementById('pixels-tab')
  const percentTab = document.getElementById('percent-tab')
  const presetTab = document.getElementById('preset-tab')
  const pixelsSection = document.getElementById('pixels-section')
  const percentSection = document.getElementById('percent-section')
  const presetSection = document.getElementById('preset-section')
  
  function switchTab(activeTab, activeSection) {
    [pixelsTab, percentTab, presetTab].forEach(tab => {
      tab.classList.remove('border-primary-500', 'text-primary-500')
      tab.classList.add('text-gray-600', 'dark:text-gray-400')
    })
    activeTab.classList.add('border-primary-500', 'text-primary-500')
    activeTab.classList.remove('text-gray-600', 'dark:text-gray-400')
    
    pixelsSection.classList.add('hidden')
    percentSection.classList.add('hidden')
    presetSection.classList.add('hidden')
    activeSection.classList.remove('hidden')
  }
  
  pixelsTab.addEventListener('click', () => switchTab(pixelsTab, pixelsSection))
  percentTab.addEventListener('click', () => switchTab(percentTab, percentSection))
  presetTab.addEventListener('click', () => switchTab(presetTab, presetSection))
  
  // Scale slider
  scaleSlider.addEventListener('input', () => {
    scaleValue.textContent = scaleSlider.value
  })
  
  // Maintain aspect ratio
  widthInput.addEventListener('input', () => {
    if (maintainRatio.checked && originalWidth > 0) {
      heightInput.value = Math.round(widthInput.value / aspectRatio)
    }
  })
  
  heightInput.addEventListener('input', () => {
    if (maintainRatio.checked && originalHeight > 0) {
      widthInput.value = Math.round(heightInput.value * aspectRatio)
    }
  })
  
  // File handling
  dropZone.addEventListener('click', () => fileInput.click())
  fileInput.addEventListener('change', (e) => handleFile(e.target.files[0]))
  
  dropZone.addEventListener('dragover', (e) => {
    e.preventDefault()
    dropZone.classList.add('drag-over')
  })
  
  dropZone.addEventListener('dragleave', () => {
    dropZone.classList.remove('drag-over')
  })
  
  dropZone.addEventListener('drop', (e) => {
    e.preventDefault()
    dropZone.classList.remove('drag-over')
    handleFile(e.dataTransfer.files[0])
  })
  
  function handleFile(file) {
    if (!file || !file.type.startsWith('image/')) {
      alert('Please select a valid image file')
      return
    }
    
    const reader = new FileReader()
    reader.onload = (e) => {
      originalImage = new Image()
      originalImage.onload = () => {
        originalWidth = originalImage.width
        originalHeight = originalImage.height
        aspectRatio = originalWidth / originalHeight
        
        widthInput.value = originalWidth
        heightInput.value = originalHeight
        
        document.getElementById('original-preview').src = e.target.result
        document.getElementById('original-size').textContent = `${originalWidth} × ${originalHeight}px`
        
        options.classList.remove('hidden')
        dropZone.querySelector('p').textContent = file.name
      }
      originalImage.src = e.target.result
    }
    reader.readAsDataURL(file)
  }
  
  window.applyPreset = (width, height) => {
    widthInput.value = width
    heightInput.value = height
    maintainRatio.checked = false
  }
  
  window.resizeImage = () => {
    if (!originalImage) return
    
    let newWidth, newHeight
    
    if (!percentSection.classList.contains('hidden')) {
      // By percentage
      const scale = parseInt(scaleSlider.value) / 100
      newWidth = Math.round(originalWidth * scale)
      newHeight = Math.round(originalHeight * scale)
    } else {
      // By pixels or preset
      newWidth = parseInt(widthInput.value)
      newHeight = parseInt(heightInput.value)
    }
    
    const canvas = document.getElementById('resized-canvas')
    const ctx = canvas.getContext('2d')
    
    canvas.width = newWidth
    canvas.height = newHeight
    
    ctx.drawImage(originalImage, 0, 0, newWidth, newHeight)
    
    document.getElementById('resized-size').textContent = `${newWidth} × ${newHeight}px`
    preview.classList.remove('hidden')
  }
  
  window.downloadResized = () => {
    const canvas = document.getElementById('resized-canvas')
    canvas.toBlob((blob) => {
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `resized_${Date.now()}.png`
      a.click()
      URL.revokeObjectURL(url)
    })
  }
}

// Made with Bob
