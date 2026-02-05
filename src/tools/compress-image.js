import imageCompression from 'browser-image-compression'

export default function(container) {
  container.innerHTML = `
    <div class="space-y-6">
      <div class="file-drop-zone" id="drop-zone">
        <svg class="w-16 h-16 mx-auto text-gray-400 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"></path>
        </svg>
        <p class="text-lg font-medium text-gray-700 dark:text-gray-300 mb-2">Drop images here or click to upload</p>
        <p class="text-sm text-gray-500 dark:text-gray-400">Supports JPG, PNG, WebP (Max 10MB per file)</p>
        <input type="file" id="file-input" accept="image/*" multiple class="hidden" />
      </div>
      
      <div id="options" class="hidden space-y-4">
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Quality (%)
            </label>
            <input type="range" id="quality-slider" min="10" max="100" value="80" class="w-full" />
            <div class="text-center text-sm text-gray-600 dark:text-gray-400 mt-1">
              <span id="quality-value">80</span>%
            </div>
          </div>
          
          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Max Width (px)
            </label>
            <input type="number" id="max-width" class="input-field" value="1920" min="100" step="100" />
          </div>
        </div>
        
        <button onclick="compressImages()" class="btn-primary w-full">Compress Images</button>
      </div>
      
      <div id="results" class="hidden space-y-4">
        <h3 class="text-lg font-semibold text-gray-900 dark:text-white">Compressed Images</h3>
        <div id="images-list" class="space-y-3"></div>
      </div>
      
      <div id="progress" class="hidden">
        <div class="bg-gray-200 dark:bg-gray-700 rounded-full h-2 overflow-hidden">
          <div id="progress-bar" class="bg-primary-500 h-full transition-all duration-300" style="width: 0%"></div>
        </div>
        <p class="text-sm text-gray-600 dark:text-gray-400 text-center mt-2">
          Processing <span id="progress-text">0/0</span>
        </p>
      </div>
    </div>
  `
  
  const dropZone = document.getElementById('drop-zone')
  const fileInput = document.getElementById('file-input')
  const options = document.getElementById('options')
  const results = document.getElementById('results')
  const imagesList = document.getElementById('images-list')
  const progress = document.getElementById('progress')
  const progressBar = document.getElementById('progress-bar')
  const progressText = document.getElementById('progress-text')
  const qualitySlider = document.getElementById('quality-slider')
  const qualityValue = document.getElementById('quality-value')
  
  let selectedFiles = []
  
  // Update quality display
  qualitySlider.addEventListener('input', () => {
    qualityValue.textContent = qualitySlider.value
  })
  
  // Click to upload
  dropZone.addEventListener('click', () => fileInput.click())
  
  // File input change
  fileInput.addEventListener('change', (e) => {
    handleFiles(e.target.files)
  })
  
  // Drag and drop
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
    handleFiles(e.dataTransfer.files)
  })
  
  function handleFiles(files) {
    selectedFiles = Array.from(files).filter(file => file.type.startsWith('image/'))
    
    if (selectedFiles.length === 0) {
      alert('Please select valid image files')
      return
    }
    
    options.classList.remove('hidden')
    dropZone.querySelector('p').textContent = `${selectedFiles.length} image(s) selected`
  }
  
  window.compressImages = async () => {
    if (selectedFiles.length === 0) return
    
    const quality = parseInt(qualitySlider.value) / 100
    const maxWidth = parseInt(document.getElementById('max-width').value)
    
    imagesList.innerHTML = ''
    results.classList.remove('hidden')
    progress.classList.remove('hidden')
    
    const compressionOptions = {
      maxSizeMB: 10,
      maxWidthOrHeight: maxWidth,
      useWebWorker: true,
      initialQuality: quality
    }
    
    for (let i = 0; i < selectedFiles.length; i++) {
      const file = selectedFiles[i]
      progressText.textContent = `${i + 1}/${selectedFiles.length}`
      progressBar.style.width = `${((i + 1) / selectedFiles.length) * 100}%`
      
      try {
        const originalSize = file.size
        const compressedFile = await imageCompression(file, compressionOptions)
        const compressedSize = compressedFile.size
        const reduction = ((1 - compressedSize / originalSize) * 100).toFixed(1)
        
        const imageUrl = URL.createObjectURL(compressedFile)
        
        const resultItem = document.createElement('div')
        resultItem.className = 'flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg'
        resultItem.innerHTML = `
          <div class="flex items-center space-x-4 flex-1">
            <img src="${imageUrl}" class="w-16 h-16 object-cover rounded" />
            <div class="flex-1">
              <p class="font-medium text-gray-900 dark:text-white">${file.name}</p>
              <p class="text-sm text-gray-600 dark:text-gray-400">
                ${formatBytes(originalSize)} → ${formatBytes(compressedSize)} 
                <span class="text-green-600 dark:text-green-400">(${reduction}% smaller)</span>
              </p>
            </div>
          </div>
          <button onclick="downloadImage('${imageUrl}', '${file.name}')" class="btn-secondary text-sm py-2 px-4">
            Download
          </button>
        `
        imagesList.appendChild(resultItem)
      } catch (error) {
        console.error('Error compressing image:', error)
        const errorItem = document.createElement('div')
        errorItem.className = 'p-4 bg-red-50 dark:bg-red-900/20 rounded-lg text-red-600 dark:text-red-400'
        errorItem.textContent = `Error compressing ${file.name}`
        imagesList.appendChild(errorItem)
      }
    }
    
    progress.classList.add('hidden')
  }
  
  window.downloadImage = (url, filename) => {
    const a = document.createElement('a')
    a.href = url
    a.download = `compressed_${filename}`
    a.click()
  }
  
  function formatBytes(bytes) {
    if (bytes === 0) return '0 Bytes'
    const k = 1024
    const sizes = ['Bytes', 'KB', 'MB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i]
  }
}

// Made with Bob
