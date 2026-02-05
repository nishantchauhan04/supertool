import { jsPDF } from 'jspdf'

export default function(container) {
  container.innerHTML = `
    <div class="space-y-6">
      <div class="file-drop-zone" id="drop-zone">
        <svg class="w-16 h-16 mx-auto text-gray-400 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"></path>
        </svg>
        <p class="text-lg font-medium text-gray-700 dark:text-gray-300 mb-2">Drop images here or click to upload</p>
        <p class="text-sm text-gray-500 dark:text-gray-400">Supports JPG, PNG (Multiple files allowed)</p>
        <input type="file" id="file-input" accept="image/*" multiple class="hidden" />
      </div>
      
      <div id="options" class="hidden space-y-4">
        <div>
          <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Page Size</label>
          <select id="page-size" class="input-field">
            <option value="a4">A4 (210 × 297 mm)</option>
            <option value="letter">Letter (8.5 × 11 in)</option>
            <option value="legal">Legal (8.5 × 14 in)</option>
            <option value="a3">A3 (297 × 420 mm)</option>
          </select>
        </div>
        
        <div>
          <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Orientation</label>
          <div class="flex space-x-4">
            <label class="flex items-center space-x-2">
              <input type="radio" name="orientation" value="portrait" checked class="text-primary-500" />
              <span class="text-gray-700 dark:text-gray-300">Portrait</span>
            </label>
            <label class="flex items-center space-x-2">
              <input type="radio" name="orientation" value="landscape" class="text-primary-500" />
              <span class="text-gray-700 dark:text-gray-300">Landscape</span>
            </label>
          </div>
        </div>
        
        <div>
          <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Image Fit</label>
          <select id="image-fit" class="input-field">
            <option value="contain">Fit to page (maintain aspect ratio)</option>
            <option value="cover">Fill page (may crop)</option>
            <option value="stretch">Stretch to fill</option>
          </select>
        </div>
        
        <div id="images-preview" class="space-y-2">
          <div class="flex items-center justify-between">
            <h3 class="text-sm font-medium text-gray-700 dark:text-gray-300">Images (<span id="image-count">0</span>)</h3>
            <button onclick="clearImages()" class="text-sm text-red-500 hover:text-red-600">Clear All</button>
          </div>
          <div id="images-list" class="space-y-2 max-h-64 overflow-y-auto"></div>
        </div>
        
        <button onclick="generatePDF()" class="btn-primary w-full">Generate PDF</button>
      </div>
      
      <div id="progress" class="hidden">
        <div class="bg-gray-200 dark:bg-gray-700 rounded-full h-2 overflow-hidden">
          <div id="progress-bar" class="bg-primary-500 h-full transition-all duration-300" style="width: 0%"></div>
        </div>
        <p class="text-sm text-gray-600 dark:text-gray-400 text-center mt-2">Generating PDF...</p>
      </div>
    </div>
  `
  
  const dropZone = document.getElementById('drop-zone')
  const fileInput = document.getElementById('file-input')
  const options = document.getElementById('options')
  const imagesList = document.getElementById('images-list')
  const imageCount = document.getElementById('image-count')
  const progress = document.getElementById('progress')
  const progressBar = document.getElementById('progress-bar')
  
  let selectedImages = []
  
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
    const imageFiles = Array.from(files).filter(file => file.type.startsWith('image/'))
    
    if (imageFiles.length === 0) {
      alert('Please select valid image files')
      return
    }
    
    imageFiles.forEach(file => {
      const reader = new FileReader()
      reader.onload = (e) => {
        selectedImages.push({
          name: file.name,
          data: e.target.result
        })
        updateImagesList()
      }
      reader.readAsDataURL(file)
    })
    
    options.classList.remove('hidden')
  }
  
  function updateImagesList() {
    imageCount.textContent = selectedImages.length
    imagesList.innerHTML = ''
    
    selectedImages.forEach((image, index) => {
      const item = document.createElement('div')
      item.className = 'flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg'
      item.innerHTML = `
        <div class="flex items-center space-x-3">
          <img src="${image.data}" class="w-12 h-12 object-cover rounded" />
          <span class="text-sm text-gray-700 dark:text-gray-300">${image.name}</span>
        </div>
        <div class="flex items-center space-x-2">
          <button onclick="moveImage(${index}, -1)" ${index === 0 ? 'disabled' : ''} class="p-1 hover:bg-gray-200 dark:hover:bg-gray-600 rounded disabled:opacity-50">
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 15l7-7 7 7"></path>
            </svg>
          </button>
          <button onclick="moveImage(${index}, 1)" ${index === selectedImages.length - 1 ? 'disabled' : ''} class="p-1 hover:bg-gray-200 dark:hover:bg-gray-600 rounded disabled:opacity-50">
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"></path>
            </svg>
          </button>
          <button onclick="removeImage(${index})" class="p-1 hover:bg-red-100 dark:hover:bg-red-900/30 rounded text-red-500">
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
            </svg>
          </button>
        </div>
      `
      imagesList.appendChild(item)
    })
  }
  
  window.moveImage = (index, direction) => {
    const newIndex = index + direction
    if (newIndex < 0 || newIndex >= selectedImages.length) return
    
    const temp = selectedImages[index]
    selectedImages[index] = selectedImages[newIndex]
    selectedImages[newIndex] = temp
    updateImagesList()
  }
  
  window.removeImage = (index) => {
    selectedImages.splice(index, 1)
    updateImagesList()
  }
  
  window.clearImages = () => {
    selectedImages = []
    updateImagesList()
    options.classList.add('hidden')
  }
  
  window.generatePDF = async () => {
    if (selectedImages.length === 0) return
    
    progress.classList.remove('hidden')
    progressBar.style.width = '0%'
    
    const pageSize = document.getElementById('page-size').value
    const orientation = document.querySelector('input[name="orientation"]:checked').value
    const imageFit = document.getElementById('image-fit').value
    
    const pdf = new jsPDF({
      orientation: orientation,
      unit: 'mm',
      format: pageSize
    })
    
    const pageWidth = pdf.internal.pageSize.getWidth()
    const pageHeight = pdf.internal.pageSize.getHeight()
    
    for (let i = 0; i < selectedImages.length; i++) {
      if (i > 0) {
        pdf.addPage()
      }
      
      const img = selectedImages[i]
      const imgElement = new Image()
      
      await new Promise((resolve) => {
        imgElement.onload = () => {
          const imgWidth = imgElement.width
          const imgHeight = imgElement.height
          const imgRatio = imgWidth / imgHeight
          const pageRatio = pageWidth / pageHeight
          
          let finalWidth, finalHeight, x, y
          
          if (imageFit === 'contain') {
            if (imgRatio > pageRatio) {
              finalWidth = pageWidth
              finalHeight = pageWidth / imgRatio
              x = 0
              y = (pageHeight - finalHeight) / 2
            } else {
              finalHeight = pageHeight
              finalWidth = pageHeight * imgRatio
              x = (pageWidth - finalWidth) / 2
              y = 0
            }
          } else if (imageFit === 'cover') {
            if (imgRatio > pageRatio) {
              finalHeight = pageHeight
              finalWidth = pageHeight * imgRatio
              x = (pageWidth - finalWidth) / 2
              y = 0
            } else {
              finalWidth = pageWidth
              finalHeight = pageWidth / imgRatio
              x = 0
              y = (pageHeight - finalHeight) / 2
            }
          } else { // stretch
            finalWidth = pageWidth
            finalHeight = pageHeight
            x = 0
            y = 0
          }
          
          pdf.addImage(img.data, 'JPEG', x, y, finalWidth, finalHeight)
          resolve()
        }
        imgElement.src = img.data
      })
      
      progressBar.style.width = `${((i + 1) / selectedImages.length) * 100}%`
    }
    
    pdf.save(`images-to-pdf-${Date.now()}.pdf`)
    progress.classList.add('hidden')
  }
}

// Made with Bob
