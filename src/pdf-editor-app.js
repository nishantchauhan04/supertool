// PDF Editor App
pdfjsLib.GlobalWorkerOptions.workerSrc = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js'

let pdfDoc = null
let pdfBytes = null
let currentPage = 1
let totalPages = 0
let images = []
let selectedImage = null
let isDragging = false
let isResizing = false
let resizeHandle = null
let dragStart = { x: 0, y: 0 }

// Elements
const uploadArea = document.getElementById('upload-area')
const pdfInput = document.getElementById('pdf-input')
const uploadSection = document.getElementById('upload-section')
const editorLayout = document.getElementById('editor-layout')
const canvas = document.getElementById('pdf-canvas')
const ctx = canvas.getContext('2d')
const canvasWrapper = document.getElementById('canvas-wrapper')
const imageInput = document.getElementById('image-input')
const imageList = document.getElementById('image-list')
const pageInfo = document.getElementById('page-info')
const downloadBtn = document.getElementById('download-btn')
const backBtn = document.getElementById('back-btn')

// Properties
const noSelection = document.getElementById('no-selection')
const imageProperties = document.getElementById('image-properties')
const propX = document.getElementById('prop-x')
const propY = document.getElementById('prop-y')
const propWidth = document.getElementById('prop-width')
const propHeight = document.getElementById('prop-height')
const deleteBtn = document.getElementById('delete-btn')

// Upload handlers
uploadArea.addEventListener('click', () => pdfInput.click())
pdfInput.addEventListener('change', (e) => {
  if (e.target.files[0]) loadPDF(e.target.files[0])
})

uploadArea.addEventListener('dragover', (e) => {
  e.preventDefault()
  uploadArea.classList.add('dragover')
})

uploadArea.addEventListener('dragleave', () => {
  uploadArea.classList.remove('dragover')
})

uploadArea.addEventListener('drop', (e) => {
  e.preventDefault()
  uploadArea.classList.remove('dragover')
  if (e.dataTransfer.files[0]) loadPDF(e.dataTransfer.files[0])
})

// Image upload
document.getElementById('add-image-btn').addEventListener('click', () => imageInput.click())
imageInput.addEventListener('change', (e) => {
  if (e.target.files[0]) addImage(e.target.files[0])
})

// Page navigation
document.getElementById('prev-page').addEventListener('click', () => {
  if (currentPage > 1) {
    currentPage--
    renderPage()
  }
})

document.getElementById('next-page').addEventListener('click', () => {
  if (currentPage < totalPages) {
    currentPage++
    renderPage()
  }
})

// Back button
backBtn.addEventListener('click', () => {
  window.location.href = '/'
})

// Download
downloadBtn.addEventListener('click', downloadPDF)

// Delete
deleteBtn.addEventListener('click', () => {
  if (selectedImage) {
    images = images.filter(img => img.id !== selectedImage.id)
    selectedImage = null
    renderPage()
    updateImageList()
    showProperties(null)
  }
})

// Property inputs
propX.addEventListener('input', () => {
  if (selectedImage) {
    selectedImage.x = parseInt(propX.value)
    updateImageElement(selectedImage)
  }
})

propY.addEventListener('input', () => {
  if (selectedImage) {
    selectedImage.y = parseInt(propY.value)
    updateImageElement(selectedImage)
  }
})

propWidth.addEventListener('input', () => {
  if (selectedImage) {
    selectedImage.width = parseInt(propWidth.value)
    updateImageElement(selectedImage)
  }
})

propHeight.addEventListener('input', () => {
  if (selectedImage) {
    selectedImage.height = parseInt(propHeight.value)
    updateImageElement(selectedImage)
  }
})

async function loadPDF(file) {
  try {
    const arrayBuffer = await file.arrayBuffer()
    pdfBytes = arrayBuffer
    
    // Load with PDF.js
    const loadingTask = pdfjsLib.getDocument({ data: arrayBuffer })
    pdfDoc = await loadingTask.promise
    totalPages = pdfDoc.numPages
    currentPage = 1
    images = []
    
    uploadSection.classList.add('hidden')
    editorLayout.classList.add('active')
    downloadBtn.classList.remove('hidden')
    
    renderPage()
  } catch (error) {
    alert('Error loading PDF: ' + error.message)
  }
}

async function renderPage() {
  if (!pdfDoc) return
  
  const page = await pdfDoc.getPage(currentPage)
  const viewport = page.getViewport({ scale: 1.5 })
  
  canvas.width = viewport.width
  canvas.height = viewport.height
  
  await page.render({
    canvasContext: ctx,
    viewport: viewport
  }).promise
  
  pageInfo.textContent = `Page ${currentPage} of ${totalPages}`
  
  // Clear existing image elements
  document.querySelectorAll('.image-layer').forEach(el => el.remove())
  
  // Render images for current page
  images.filter(img => img.page === currentPage).forEach(img => {
    createImageElement(img)
  })
  
  updateImageList()
}

function addImage(file) {
  const reader = new FileReader()
  reader.onload = (e) => {
    const img = {
      id: Date.now() + Math.random(),
      src: e.target.result,
      page: currentPage,
      x: 50,
      y: 50,
      width: 200,
      height: 200
    }
    images.push(img)
    createImageElement(img)
    updateImageList()
    selectImage(img)
  }
  reader.readAsDataURL(file)
}

function createImageElement(img) {
  const div = document.createElement('div')
  div.className = 'image-layer'
  div.dataset.id = img.id
  div.style.left = img.x + 'px'
  div.style.top = img.y + 'px'
  div.style.width = img.width + 'px'
  div.style.height = img.height + 'px'
  
  const imgEl = document.createElement('img')
  imgEl.src = img.src
  div.appendChild(imgEl)
  
  // Resize handles
  const handles = ['nw', 'ne', 'sw', 'se']
  handles.forEach(pos => {
    const handle = document.createElement('div')
    handle.className = `resize-handle ${pos}`
    handle.dataset.handle = pos
    div.appendChild(handle)
  })
  
  // Events
  div.addEventListener('mousedown', (e) => handleMouseDown(e, img))
  
  canvasWrapper.appendChild(div)
}

function updateImageElement(img) {
  const el = document.querySelector(`.image-layer[data-id="${img.id}"]`)
  if (el) {
    el.style.left = img.x + 'px'
    el.style.top = img.y + 'px'
    el.style.width = img.width + 'px'
    el.style.height = img.height + 'px'
  }
}

function handleMouseDown(e, img) {
  e.stopPropagation()
  
  selectImage(img)
  
  const target = e.target
  
  if (target.classList.contains('resize-handle')) {
    isResizing = true
    resizeHandle = target.dataset.handle
    dragStart = {
      x: e.clientX,
      y: e.clientY,
      imgX: img.x,
      imgY: img.y,
      imgWidth: img.width,
      imgHeight: img.height
    }
  } else {
    isDragging = true
    dragStart = {
      x: e.clientX - img.x,
      y: e.clientY - img.y
    }
  }
}

document.addEventListener('mousemove', (e) => {
  if (!selectedImage) return
  
  if (isDragging) {
    selectedImage.x = e.clientX - dragStart.x
    selectedImage.y = e.clientY - dragStart.y
    updateImageElement(selectedImage)
    updateProperties(selectedImage)
  } else if (isResizing) {
    const dx = e.clientX - dragStart.x
    const dy = e.clientY - dragStart.y
    
    switch (resizeHandle) {
      case 'se':
        selectedImage.width = Math.max(20, dragStart.imgWidth + dx)
        selectedImage.height = Math.max(20, dragStart.imgHeight + dy)
        break
      case 'sw':
        selectedImage.x = dragStart.imgX + dx
        selectedImage.width = Math.max(20, dragStart.imgWidth - dx)
        selectedImage.height = Math.max(20, dragStart.imgHeight + dy)
        break
      case 'ne':
        selectedImage.y = dragStart.imgY + dy
        selectedImage.width = Math.max(20, dragStart.imgWidth + dx)
        selectedImage.height = Math.max(20, dragStart.imgHeight - dy)
        break
      case 'nw':
        selectedImage.x = dragStart.imgX + dx
        selectedImage.y = dragStart.imgY + dy
        selectedImage.width = Math.max(20, dragStart.imgWidth - dx)
        selectedImage.height = Math.max(20, dragStart.imgHeight - dy)
        break
    }
    
    updateImageElement(selectedImage)
    updateProperties(selectedImage)
  }
})

document.addEventListener('mouseup', () => {
  isDragging = false
  isResizing = false
  resizeHandle = null
})

function selectImage(img) {
  selectedImage = img
  
  // Update UI
  document.querySelectorAll('.image-layer').forEach(el => {
    el.classList.remove('selected')
  })
  document.querySelector(`.image-layer[data-id="${img.id}"]`)?.classList.add('selected')
  
  document.querySelectorAll('.image-item').forEach(el => {
    el.classList.remove('selected')
  })
  document.querySelector(`.image-item[data-id="${img.id}"]`)?.classList.add('selected')
  
  showProperties(img)
}

function showProperties(img) {
  if (img) {
    noSelection.classList.add('hidden')
    imageProperties.classList.remove('hidden')
    updateProperties(img)
  } else {
    noSelection.classList.remove('hidden')
    imageProperties.classList.add('hidden')
  }
}

function updateProperties(img) {
  propX.value = Math.round(img.x)
  propY.value = Math.round(img.y)
  propWidth.value = Math.round(img.width)
  propHeight.value = Math.round(img.height)
}

function updateImageList() {
  imageList.innerHTML = ''
  const pageImages = images.filter(img => img.page === currentPage)
  
  if (pageImages.length === 0) {
    imageList.innerHTML = '<p style="color: #6b7280; font-size: 0.875rem; text-align: center; padding: 1rem 0;">No images on this page</p>'
    return
  }
  
  pageImages.forEach((img, index) => {
    const div = document.createElement('div')
    div.className = 'image-item'
    div.dataset.id = img.id
    if (selectedImage && selectedImage.id === img.id) {
      div.classList.add('selected')
    }
    
    div.innerHTML = `
      <img src="${img.src}" alt="Image ${index + 1}">
      <span style="flex: 1; font-size: 0.875rem;">Image ${index + 1}</span>
    `
    
    div.addEventListener('click', () => selectImage(img))
    imageList.appendChild(div)
  })
}

async function downloadPDF() {
  if (!pdfBytes) return
  
  try {
    const pdfLibDoc = await PDFLib.PDFDocument.load(pdfBytes)
    
    for (const img of images) {
      const page = pdfLibDoc.getPage(img.page - 1)
      const { width, height } = page.getSize()
      
      let image
      if (img.src.includes('image/png')) {
        image = await pdfLibDoc.embedPng(img.src)
      } else {
        image = await pdfLibDoc.embedJpg(img.src)
      }
      
      // Convert canvas coordinates to PDF coordinates
      const scale = canvas.width / width
      const x = img.x / scale
      const y = height - (img.y / scale) - (img.height / scale)
      const w = img.width / scale
      const h = img.height / scale
      
      page.drawImage(image, { x, y, width: w, height: h })
    }
    
    const modifiedPdfBytes = await pdfLibDoc.save()
    const blob = new Blob([modifiedPdfBytes], { type: 'application/pdf' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'edited-document.pdf'
    a.click()
    URL.revokeObjectURL(url)
  } catch (error) {
    alert('Error saving PDF: ' + error.message)
  }
}

// Made with Bob
