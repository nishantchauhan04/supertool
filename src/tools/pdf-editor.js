import { PDFDocument, rgb } from 'pdf-lib'

export default function(container) {
  let pdfDoc = null
  let pdfBytes = null
  let currentPage = 0
  let images = []
  
  container.innerHTML = `
    <div class="space-y-6">
      <!-- Upload PDF Section -->
      <div class="file-drop-zone" id="pdf-drop-zone">
        <svg class="w-16 h-16 mx-auto text-gray-400 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z"></path>
        </svg>
        <p class="text-lg font-medium text-gray-700 dark:text-gray-300 mb-2">Drop PDF here or click to upload</p>
        <p class="text-sm text-gray-500 dark:text-gray-400">Upload a PDF file to edit</p>
        <input type="file" id="pdf-input" accept=".pdf" class="hidden" />
      </div>

      <!-- Editor Section (Hidden initially) -->
      <div id="editor-section" class="hidden space-y-6">
        <!-- PDF Info -->
        <div class="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
          <div class="flex items-center justify-between">
            <div>
              <p class="text-sm font-medium text-blue-900 dark:text-blue-100">PDF Loaded</p>
              <p class="text-xs text-blue-700 dark:text-blue-300 mt-1" id="pdf-info">0 pages</p>
            </div>
            <button id="new-pdf-btn" class="btn-secondary text-sm">
              Load Different PDF
            </button>
          </div>
        </div>

        <!-- Page Navigation -->
        <div class="flex items-center justify-between bg-gray-50 dark:bg-gray-800 rounded-lg p-4">
          <button id="prev-page" class="btn-secondary" disabled>
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7"></path>
            </svg>
          </button>
          <div class="text-center">
            <p class="text-sm font-medium text-gray-700 dark:text-gray-300">
              Page <span id="current-page">1</span> of <span id="total-pages">1</span>
            </p>
          </div>
          <button id="next-page" class="btn-secondary">
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"></path>
            </svg>
          </button>
        </div>

        <!-- PDF Preview Canvas -->
        <div class="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg p-4 bg-gray-50 dark:bg-gray-800">
          <div class="flex justify-center">
            <canvas id="pdf-canvas" class="max-w-full shadow-lg"></canvas>
          </div>
        </div>

        <!-- Add Images Section -->
        <div class="space-y-4">
          <h3 class="text-lg font-semibold text-gray-900 dark:text-white">Add Images to Current Page</h3>
          
          <div class="file-drop-zone" id="image-drop-zone">
            <svg class="w-12 h-12 mx-auto text-gray-400 mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
            </svg>
            <p class="text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Drop images here or click to upload</p>
            <p class="text-xs text-gray-500 dark:text-gray-400">JPG, PNG (Multiple files allowed)</p>
            <input type="file" id="image-input" accept="image/*" multiple class="hidden" />
          </div>

          <!-- Images List -->
          <div id="images-list" class="space-y-2"></div>
        </div>

        <!-- Image Position Controls -->
        <div id="image-controls" class="hidden space-y-4 bg-gray-50 dark:bg-gray-800 rounded-lg p-4">
          <h4 class="text-sm font-semibold text-gray-900 dark:text-white">Image Position & Size</h4>
          
          <div class="grid grid-cols-2 gap-4">
            <div>
              <label class="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">X Position (%)</label>
              <input type="number" id="img-x" min="0" max="100" value="10" class="input-field text-sm" />
            </div>
            <div>
              <label class="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">Y Position (%)</label>
              <input type="number" id="img-y" min="0" max="100" value="10" class="input-field text-sm" />
            </div>
            <div>
              <label class="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">Width (%)</label>
              <input type="number" id="img-width" min="1" max="100" value="30" class="input-field text-sm" />
            </div>
            <div>
              <label class="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">Height (%)</label>
              <input type="number" id="img-height" min="1" max="100" value="30" class="input-field text-sm" />
            </div>
          </div>

          <div class="flex space-x-2">
            <button id="apply-image" class="btn-primary flex-1">
              Apply to Current Page
            </button>
            <button id="remove-image" class="btn-secondary">
              Remove
            </button>
          </div>
        </div>

        <!-- Action Buttons -->
        <div class="flex space-x-4">
          <button id="download-pdf" class="btn-primary flex-1">
            <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"></path>
            </svg>
            Download Modified PDF
          </button>
        </div>
      </div>
    </div>
  `

  const pdfDropZone = container.querySelector('#pdf-drop-zone')
  const pdfInput = container.querySelector('#pdf-input')
  const editorSection = container.querySelector('#editor-section')
  const imageDropZone = container.querySelector('#image-drop-zone')
  const imageInput = container.querySelector('#image-input')
  const imagesList = container.querySelector('#images-list')
  const imageControls = container.querySelector('#image-controls')
  const pdfCanvas = container.querySelector('#pdf-canvas')
  const ctx = pdfCanvas.getContext('2d')

  // PDF Upload
  pdfDropZone.addEventListener('click', () => pdfInput.click())
  pdfDropZone.addEventListener('dragover', (e) => {
    e.preventDefault()
    pdfDropZone.classList.add('border-primary-500')
  })
  pdfDropZone.addEventListener('dragleave', () => {
    pdfDropZone.classList.remove('border-primary-500')
  })
  pdfDropZone.addEventListener('drop', (e) => {
    e.preventDefault()
    pdfDropZone.classList.remove('border-primary-500')
    if (e.dataTransfer.files.length) {
      handlePDFUpload(e.dataTransfer.files[0])
    }
  })
  pdfInput.addEventListener('change', (e) => {
    if (e.target.files.length) {
      handlePDFUpload(e.target.files[0])
    }
  })

  // Image Upload
  imageDropZone.addEventListener('click', () => imageInput.click())
  imageDropZone.addEventListener('dragover', (e) => {
    e.preventDefault()
    imageDropZone.classList.add('border-primary-500')
  })
  imageDropZone.addEventListener('dragleave', () => {
    imageDropZone.classList.remove('border-primary-500')
  })
  imageDropZone.addEventListener('drop', (e) => {
    e.preventDefault()
    imageDropZone.classList.remove('border-primary-500')
    if (e.dataTransfer.files.length) {
      handleImageUpload(Array.from(e.dataTransfer.files))
    }
  })
  imageInput.addEventListener('change', (e) => {
    if (e.target.files.length) {
      handleImageUpload(Array.from(e.target.files))
    }
  })

  // Page Navigation
  container.querySelector('#prev-page').addEventListener('click', () => {
    if (currentPage > 0) {
      currentPage--
      renderPage()
    }
  })
  container.querySelector('#next-page').addEventListener('click', () => {
    if (pdfDoc && currentPage < pdfDoc.getPageCount() - 1) {
      currentPage++
      renderPage()
    }
  })

  // New PDF Button
  container.querySelector('#new-pdf-btn').addEventListener('click', () => {
    pdfDoc = null
    pdfBytes = null
    currentPage = 0
    images = []
    editorSection.classList.add('hidden')
    pdfDropZone.parentElement.classList.remove('hidden')
    imagesList.innerHTML = ''
    imageControls.classList.add('hidden')
  })

  // Download Button
  container.querySelector('#download-pdf').addEventListener('click', downloadPDF)

  async function handlePDFUpload(file) {
    if (!file.type.includes('pdf')) {
      alert('Please upload a PDF file')
      return
    }

    try {
      const arrayBuffer = await file.arrayBuffer()
      pdfDoc = await PDFDocument.load(arrayBuffer)
      pdfBytes = arrayBuffer
      currentPage = 0
      images = []

      // Show editor
      pdfDropZone.parentElement.classList.add('hidden')
      editorSection.classList.remove('hidden')

      // Update info
      const pageCount = pdfDoc.getPageCount()
      container.querySelector('#pdf-info').textContent = `${pageCount} page${pageCount > 1 ? 's' : ''}`
      container.querySelector('#total-pages').textContent = pageCount

      renderPage()
    } catch (error) {
      console.error('Error loading PDF:', error)
      alert('Error loading PDF. Please try another file.')
    }
  }

  async function renderPage() {
    if (!pdfDoc) return

    const pageCount = pdfDoc.getPageCount()
    container.querySelector('#current-page').textContent = currentPage + 1
    container.querySelector('#prev-page').disabled = currentPage === 0
    container.querySelector('#next-page').disabled = currentPage === pageCount - 1

    // Render PDF page to canvas
    try {
      const page = pdfDoc.getPage(currentPage)
      const { width, height } = page.getSize()
      
      // Set canvas size
      const scale = Math.min(800 / width, 600 / height)
      pdfCanvas.width = width * scale
      pdfCanvas.height = height * scale

      // Draw white background
      ctx.fillStyle = 'white'
      ctx.fillRect(0, 0, pdfCanvas.width, pdfCanvas.height)

      // Draw page info
      ctx.fillStyle = '#666'
      ctx.font = '14px Arial'
      ctx.textAlign = 'center'
      ctx.fillText(`Page ${currentPage + 1} Preview`, pdfCanvas.width / 2, pdfCanvas.height / 2)
      ctx.fillText(`${Math.round(width)} × ${Math.round(height)} pts`, pdfCanvas.width / 2, pdfCanvas.height / 2 + 20)

      // Draw images for this page
      const pageImages = images.filter(img => img.page === currentPage)
      for (const img of pageImages) {
        const imgElement = new Image()
        imgElement.src = img.dataUrl
        await new Promise(resolve => {
          imgElement.onload = () => {
            const x = (img.x / 100) * pdfCanvas.width
            const y = (img.y / 100) * pdfCanvas.height
            const w = (img.width / 100) * pdfCanvas.width
            const h = (img.height / 100) * pdfCanvas.height
            ctx.drawImage(imgElement, x, y, w, h)
            resolve()
          }
        })
      }
    } catch (error) {
      console.error('Error rendering page:', error)
    }
  }

  function handleImageUpload(files) {
    files.forEach(file => {
      if (!file.type.startsWith('image/')) return

      const reader = new FileReader()
      reader.onload = (e) => {
        const img = {
          id: Date.now() + Math.random(),
          name: file.name,
          dataUrl: e.target.result,
          page: currentPage,
          x: 10,
          y: 10,
          width: 30,
          height: 30
        }
        images.push(img)
        addImageToList(img)
      }
      reader.readAsDataURL(file)
    })
  }

  function addImageToList(img) {
    const div = document.createElement('div')
    div.className = 'flex items-center justify-between bg-white dark:bg-gray-700 rounded-lg p-3 border border-gray-200 dark:border-gray-600'
    div.innerHTML = `
      <div class="flex items-center space-x-3">
        <img src="${img.dataUrl}" class="w-12 h-12 object-cover rounded" />
        <div>
          <p class="text-sm font-medium text-gray-900 dark:text-white">${img.name}</p>
          <p class="text-xs text-gray-500 dark:text-gray-400">Page ${img.page + 1}</p>
        </div>
      </div>
      <button class="text-red-500 hover:text-red-700" data-id="${img.id}">
        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path>
        </svg>
      </button>
    `

    div.querySelector('button').addEventListener('click', () => {
      images = images.filter(i => i.id !== img.id)
      div.remove()
      renderPage()
      if (images.length === 0) {
        imageControls.classList.add('hidden')
      }
    })

    div.addEventListener('click', (e) => {
      if (e.target.tagName !== 'BUTTON') {
        selectImage(img)
      }
    })

    imagesList.appendChild(div)
    imageControls.classList.remove('hidden')
  }

  function selectImage(img) {
    container.querySelector('#img-x').value = img.x
    container.querySelector('#img-y').value = img.y
    container.querySelector('#img-width').value = img.width
    container.querySelector('#img-height').value = img.height

    const applyBtn = container.querySelector('#apply-image')
    const removeBtn = container.querySelector('#remove-image')

    applyBtn.onclick = () => {
      img.x = parseFloat(container.querySelector('#img-x').value)
      img.y = parseFloat(container.querySelector('#img-y').value)
      img.width = parseFloat(container.querySelector('#img-width').value)
      img.height = parseFloat(container.querySelector('#img-height').value)
      renderPage()
    }

    removeBtn.onclick = () => {
      images = images.filter(i => i.id !== img.id)
      imagesList.querySelector(`[data-id="${img.id}"]`).parentElement.remove()
      renderPage()
      if (images.length === 0) {
        imageControls.classList.add('hidden')
      }
    }
  }

  async function downloadPDF() {
    if (!pdfDoc) return

    try {
      // Create a new PDF from the original
      const modifiedPdf = await PDFDocument.load(pdfBytes)

      // Add images to pages
      for (const img of images) {
        const page = modifiedPdf.getPage(img.page)
        const { width, height } = page.getSize()

        // Embed image
        let image
        if (img.dataUrl.includes('image/png')) {
          image = await modifiedPdf.embedPng(img.dataUrl)
        } else {
          image = await modifiedPdf.embedJpg(img.dataUrl)
        }

        // Calculate position and size
        const x = (img.x / 100) * width
        const y = height - ((img.y / 100) * height) - ((img.height / 100) * height)
        const w = (img.width / 100) * width
        const h = (img.height / 100) * height

        // Draw image
        page.drawImage(image, {
          x,
          y,
          width: w,
          height: h
        })
      }

      // Save and download
      const pdfBytesModified = await modifiedPdf.save()
      const blob = new Blob([pdfBytesModified], { type: 'application/pdf' })
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = 'edited-document.pdf'
      a.click()
      URL.revokeObjectURL(url)
    } catch (error) {
      console.error('Error creating PDF:', error)
      alert('Error creating PDF. Please try again.')
    }
  }
}

// Made with Bob
