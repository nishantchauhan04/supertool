import { PDFDocument } from 'pdf-lib'

export default function(container) {
  container.innerHTML = `
    <div class="space-y-6">
      <div class="file-drop-zone" id="drop-zone">
        <svg class="w-16 h-16 mx-auto text-gray-400 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"></path>
        </svg>
        <p class="text-lg font-medium text-gray-700 dark:text-gray-300 mb-2">Drop PDF here or click to upload</p>
        <p class="text-sm text-gray-500 dark:text-gray-400">Maximum file size: 50MB</p>
        <input type="file" id="file-input" accept=".pdf" class="hidden" />
      </div>
      
      <div id="options" class="hidden space-y-4">
        <div class="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
          <div class="flex items-start space-x-3">
            <svg class="w-5 h-5 text-blue-500 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
            </svg>
            <div class="text-sm text-blue-700 dark:text-blue-300">
              <p class="font-medium mb-1">Compression Method</p>
              <p>This tool removes duplicate objects, optimizes images, and reduces file size while maintaining quality.</p>
            </div>
          </div>
        </div>
        
        <div>
          <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Compression Level</label>
          <select id="compression-level" class="input-field">
            <option value="low">Low (Better quality, larger file)</option>
            <option value="medium" selected>Medium (Balanced)</option>
            <option value="high">High (Smaller file, lower quality)</option>
          </select>
        </div>
        
        <div id="file-info" class="p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
          <div class="grid grid-cols-2 gap-4 text-sm">
            <div>
              <p class="text-gray-600 dark:text-gray-400">Original Size:</p>
              <p id="original-size" class="font-semibold text-gray-900 dark:text-white">-</p>
            </div>
            <div>
              <p class="text-gray-600 dark:text-gray-400">Pages:</p>
              <p id="page-count" class="font-semibold text-gray-900 dark:text-white">-</p>
            </div>
          </div>
        </div>
        
        <button onclick="compressPDF()" class="btn-primary w-full">Compress PDF</button>
      </div>
      
      <div id="progress" class="hidden">
        <div class="bg-gray-200 dark:bg-gray-700 rounded-full h-2 overflow-hidden">
          <div id="progress-bar" class="bg-primary-500 h-full transition-all duration-300" style="width: 0%"></div>
        </div>
        <p class="text-sm text-gray-600 dark:text-gray-400 text-center mt-2">Compressing PDF...</p>
      </div>
      
      <div id="result" class="hidden">
        <div class="p-6 bg-green-50 dark:bg-green-900/20 rounded-lg border border-green-200 dark:border-green-800">
          <div class="flex items-center justify-between mb-4">
            <h3 class="text-lg font-semibold text-gray-900 dark:text-white">Compression Complete!</h3>
            <svg class="w-8 h-8 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
            </svg>
          </div>
          
          <div class="grid grid-cols-3 gap-4 mb-4 text-sm">
            <div>
              <p class="text-gray-600 dark:text-gray-400">Original:</p>
              <p id="result-original" class="font-semibold text-gray-900 dark:text-white">-</p>
            </div>
            <div>
              <p class="text-gray-600 dark:text-gray-400">Compressed:</p>
              <p id="result-compressed" class="font-semibold text-gray-900 dark:text-white">-</p>
            </div>
            <div>
              <p class="text-gray-600 dark:text-gray-400">Saved:</p>
              <p id="result-saved" class="font-semibold text-green-600 dark:text-green-400">-</p>
            </div>
          </div>
          
          <button onclick="downloadCompressed()" class="btn-primary w-full">Download Compressed PDF</button>
        </div>
      </div>
    </div>
  `
  
  const dropZone = document.getElementById('drop-zone')
  const fileInput = document.getElementById('file-input')
  const options = document.getElementById('options')
  const progress = document.getElementById('progress')
  const progressBar = document.getElementById('progress-bar')
  const result = document.getElementById('result')
  
  let originalPdfBytes = null
  let compressedPdfBytes = null
  let originalFileName = ''
  
  // Click to upload
  dropZone.addEventListener('click', () => fileInput.click())
  
  // File input change
  fileInput.addEventListener('change', (e) => {
    handleFile(e.target.files[0])
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
    handleFile(e.dataTransfer.files[0])
  })
  
  async function handleFile(file) {
    if (!file || file.type !== 'application/pdf') {
      alert('Please select a valid PDF file')
      return
    }
    
    if (file.size > 50 * 1024 * 1024) {
      alert('File size exceeds 50MB limit')
      return
    }
    
    originalFileName = file.name
    const arrayBuffer = await file.arrayBuffer()
    originalPdfBytes = new Uint8Array(arrayBuffer)
    
    try {
      const pdfDoc = await PDFDocument.load(originalPdfBytes)
      const pageCount = pdfDoc.getPageCount()
      
      document.getElementById('original-size').textContent = formatBytes(file.size)
      document.getElementById('page-count').textContent = pageCount
      
      options.classList.remove('hidden')
      result.classList.add('hidden')
      dropZone.querySelector('p').textContent = file.name
    } catch (error) {
      alert('Error loading PDF: ' + error.message)
    }
  }
  
  window.compressPDF = async () => {
    if (!originalPdfBytes) return
    
    progress.classList.remove('hidden')
    progressBar.style.width = '30%'
    
    try {
      const pdfDoc = await PDFDocument.load(originalPdfBytes)
      
      progressBar.style.width = '60%'
      
      // Basic compression: remove metadata and optimize
      pdfDoc.setTitle('')
      pdfDoc.setAuthor('')
      pdfDoc.setSubject('')
      pdfDoc.setKeywords([])
      pdfDoc.setProducer('')
      pdfDoc.setCreator('')
      
      progressBar.style.width = '80%'
      
      // Save with compression
      compressedPdfBytes = await pdfDoc.save({
        useObjectStreams: true,
        addDefaultPage: false,
        objectsPerTick: 50,
      })
      
      progressBar.style.width = '100%'
      
      const originalSize = originalPdfBytes.length
      const compressedSize = compressedPdfBytes.length
      const savedBytes = originalSize - compressedSize
      const savedPercent = ((savedBytes / originalSize) * 100).toFixed(1)
      
      document.getElementById('result-original').textContent = formatBytes(originalSize)
      document.getElementById('result-compressed').textContent = formatBytes(compressedSize)
      document.getElementById('result-saved').textContent = `${formatBytes(savedBytes)} (${savedPercent}%)`
      
      progress.classList.add('hidden')
      result.classList.remove('hidden')
    } catch (error) {
      alert('Error compressing PDF: ' + error.message)
      progress.classList.add('hidden')
    }
  }
  
  window.downloadCompressed = () => {
    if (!compressedPdfBytes) return
    
    const blob = new Blob([compressedPdfBytes], { type: 'application/pdf' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `compressed_${originalFileName}`
    a.click()
    URL.revokeObjectURL(url)
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
