// PDF Editor App
pdfjsLib.GlobalWorkerOptions.workerSrc = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js'

let pdfDoc = null
let pdfBytes = null
let currentPage = 1
let totalPages = 0
let elements = [] // Changed from images to elements (can be image or text)
let selectedElement = null
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
const elementsList = document.getElementById('elements-list')
const pageInfo = document.getElementById('page-info')
const downloadBtn = document.getElementById('download-btn')
const backBtn = document.getElementById('back-btn')

// Properties
const noSelection = document.getElementById('no-selection')
const imageProperties = document.getElementById('image-properties')
const textProperties = document.getElementById('text-properties')
const propX = document.getElementById('prop-x')
const propY = document.getElementById('prop-y')
const propWidth = document.getElementById('prop-width')
const propHeight = document.getElementById('prop-height')
const deleteBtn = document.getElementById('delete-btn')

// Text properties
const propText = document.getElementById('prop-text')
const propFontSize = document.getElementById('prop-fontsize')
const propColor = document.getElementById('prop-color')
const propFontWeight = document.getElementById('prop-fontweight')
const propTextX = document.getElementById('prop-text-x')
const propTextY = document.getElementById('prop-text-y')
const deleteTextBtn = document.getElementById('delete-text-btn')

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

// Add text button
document.getElementById('add-text-btn').addEventListener('click', addText)

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

// Delete buttons
deleteBtn.addEventListener('click', () => {
  if (selectedElement) {
    elements = elements.filter(el => el.id !== selectedElement.id)
    selectedElement = null
    renderPage()
    updateElementsList()
    showProperties(null)
  }
})

deleteTextBtn.addEventListener('click', () => {
  if (selectedElement) {
    elements = elements.filter(el => el.id !== selectedElement.id)
    selectedElement = null
    renderPage()
    updateElementsList()
    showProperties(null)
  }
})

// Image property inputs
propX.addEventListener('input', () => {
  if (selectedElement && selectedElement.type === 'image') {
    selectedElement.x = parseInt(propX.value)
    updateElementDOM(selectedElement)
  }
})

propY.addEventListener('input', () => {
  if (selectedElement && selectedElement.type === 'image') {
    selectedElement.y = parseInt(propY.value)
    updateElementDOM(selectedElement)
  }
})

propWidth.addEventListener('input', () => {
  if (selectedElement && selectedElement.type === 'image') {
    selectedElement.width = parseInt(propWidth.value)
    updateElementDOM(selectedElement)
  }
})

propHeight.addEventListener('input', () => {
  if (selectedElement && selectedElement.type === 'image') {
    selectedElement.height = parseInt(propHeight.value)
    updateElementDOM(selectedElement)
  }
})

// Text property inputs
propText.addEventListener('input', () => {
  if (selectedElement && selectedElement.type === 'text') {
    selectedElement.text = propText.value
    updateElementDOM(selectedElement)
  }
})

propFontSize.addEventListener('input', () => {
  if (selectedElement && selectedElement.type === 'text') {
    selectedElement.fontSize = parseInt(propFontSize.value)
    updateElementDOM(selectedElement)
  }
})

propColor.addEventListener('input', () => {
  if (selectedElement && selectedElement.type === 'text') {
    selectedElement.color = propColor.value
    updateElementDOM(selectedElement)
  }
})

propFontWeight.addEventListener('change', () => {
  if (selectedElement && selectedElement.type === 'text') {
    selectedElement.fontWeight = propFontWeight.value
    updateElementDOM(selectedElement)
  }
})

propTextX.addEventListener('input', () => {
  if (selectedElement && selectedElement.type === 'text') {
    selectedElement.x = parseInt(propTextX.value)
    updateElementDOM(selectedElement)
  }
})

propTextY.addEventListener('input', () => {
  if (selectedElement && selectedElement.type === 'text') {
    selectedElement.y = parseInt(propTextY.value)
    updateElementDOM(selectedElement)
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
    elements = []
    
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
  
  // Clear existing elements
  document.querySelectorAll('.image-layer, .text-layer').forEach(el => el.remove())
  
  // Render elements for current page
  elements.filter(el => el.page === currentPage).forEach(el => {
    createElementDOM(el)
  })
  
  updateElementsList()
}

function addText() {
  const text = {
    id: Date.now() + Math.random(),
    type: 'text',
    text: 'Double click to edit',
    page: currentPage,
    x: 100,
    y: 100,
    fontSize: 16,
    color: '#000000',
    fontWeight: 'normal'
  }
  elements.push(text)
  createElementDOM(text)
  updateElementsList()
  selectElement(text)
}

function addImage(file) {
  const reader = new FileReader()
  reader.onload = (e) => {
    const img = {
      id: Date.now() + Math.random(),
      type: 'image',
      src: e.target.result,
      page: currentPage,
      x: 50,
      y: 50,
      width: 200,
      height: 200
    }
    elements.push(img)
    createElementDOM(img)
    updateElementsList()
    selectElement(img)
  }
  reader.readAsDataURL(file)
}

function createElementDOM(element) {
  if (element.type === 'image') {
    createImageElement(element)
  } else if (element.type === 'text') {
    createTextElement(element)
  }
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

function createTextElement(text) {
  const div = document.createElement('div')
  div.className = 'text-layer'
  div.dataset.id = text.id
  div.style.left = text.x + 'px'
  div.style.top = text.y + 'px'
  div.style.fontSize = text.fontSize + 'px'
  div.style.color = text.color
  div.style.fontWeight = text.fontWeight
  div.textContent = text.text
  
  // Resize handles
  const handles = ['nw', 'ne', 'sw', 'se']
  handles.forEach(pos => {
    const handle = document.createElement('div')
    handle.className = `resize-handle ${pos}`
    handle.dataset.handle = pos
    div.appendChild(handle)
  })
  
  // Events
  div.addEventListener('mousedown', (e) => handleMouseDown(e, text))
  div.addEventListener('dblclick', () => {
    const newText = prompt('Edit text:', text.text)
    if (newText !== null) {
      text.text = newText
      div.childNodes[0].textContent = newText
      if (selectedElement && selectedElement.id === text.id) {
        propText.value = newText
      }
    }
  })
  
  canvasWrapper.appendChild(div)
}

function updateElementDOM(element) {
  const selector = element.type === 'image' ? '.image-layer' : '.text-layer'
  const el = document.querySelector(`${selector}[data-id="${element.id}"]`)
  if (!el) return
  
  el.style.left = element.x + 'px'
  el.style.top = element.y + 'px'
  
  if (element.type === 'image') {
    el.style.width = element.width + 'px'
    el.style.height = element.height + 'px'
  } else if (element.type === 'text') {
    el.style.fontSize = element.fontSize + 'px'
    el.style.color = element.color
    el.style.fontWeight = element.fontWeight
    el.childNodes[0].textContent = element.text
  }
}

function handleMouseDown(e, element) {
  e.stopPropagation()
  
  selectElement(element)
  
  const target = e.target
  
  if (target.classList.contains('resize-handle')) {
    isResizing = true
    resizeHandle = target.dataset.handle
    dragStart = {
      x: e.clientX,
      y: e.clientY,
      elX: element.x,
      elY: element.y,
      elWidth: element.width || 100,
      elHeight: element.height || 50
    }
  } else {
    isDragging = true
    dragStart = {
      x: e.clientX - element.x,
      y: e.clientY - element.y
    }
  }
}

document.addEventListener('mousemove', (e) => {
  if (!selectedElement) return
  
  if (isDragging) {
    selectedElement.x = e.clientX - dragStart.x
    selectedElement.y = e.clientY - dragStart.y
    updateElementDOM(selectedElement)
    updateProperties(selectedElement)
  } else if (isResizing && selectedElement.type === 'image') {
    const dx = e.clientX - dragStart.x
    const dy = e.clientY - dragStart.y
    
    switch (resizeHandle) {
      case 'se':
        selectedElement.width = Math.max(20, dragStart.elWidth + dx)
        selectedElement.height = Math.max(20, dragStart.elHeight + dy)
        break
      case 'sw':
        selectedElement.x = dragStart.elX + dx
        selectedElement.width = Math.max(20, dragStart.elWidth - dx)
        selectedElement.height = Math.max(20, dragStart.elHeight + dy)
        break
      case 'ne':
        selectedElement.y = dragStart.elY + dy
        selectedElement.width = Math.max(20, dragStart.elWidth + dx)
        selectedElement.height = Math.max(20, dragStart.elHeight - dy)
        break
      case 'nw':
        selectedElement.x = dragStart.elX + dx
        selectedElement.y = dragStart.elY + dy
        selectedElement.width = Math.max(20, dragStart.elWidth - dx)
        selectedElement.height = Math.max(20, dragStart.elHeight - dy)
        break
    }
    
    updateElementDOM(selectedElement)
    updateProperties(selectedElement)
  }
})

document.addEventListener('mouseup', () => {
  isDragging = false
  isResizing = false
  resizeHandle = null
})

function selectElement(element) {
  selectedElement = element
  
  // Update UI
  document.querySelectorAll('.image-layer, .text-layer').forEach(el => {
    el.classList.remove('selected')
  })
  const selector = element.type === 'image' ? '.image-layer' : '.text-layer'
  document.querySelector(`${selector}[data-id="${element.id}"]`)?.classList.add('selected')
  
  document.querySelectorAll('.image-item').forEach(el => {
    el.classList.remove('selected')
  })
  document.querySelector(`.image-item[data-id="${element.id}"]`)?.classList.add('selected')
  
  showProperties(element)
}

function showProperties(element) {
  if (!element) {
    noSelection.classList.remove('hidden')
    imageProperties.classList.add('hidden')
    textProperties.classList.add('hidden')
  } else if (element.type === 'image') {
    noSelection.classList.add('hidden')
    imageProperties.classList.remove('hidden')
    textProperties.classList.add('hidden')
    updateProperties(element)
  } else if (element.type === 'text') {
    noSelection.classList.add('hidden')
    imageProperties.classList.add('hidden')
    textProperties.classList.remove('hidden')
    updateProperties(element)
  }
}

function updateProperties(element) {
  if (element.type === 'image') {
    propX.value = Math.round(element.x)
    propY.value = Math.round(element.y)
    propWidth.value = Math.round(element.width)
    propHeight.value = Math.round(element.height)
  } else if (element.type === 'text') {
    propText.value = element.text
    propFontSize.value = element.fontSize
    propColor.value = element.color
    propFontWeight.value = element.fontWeight
    propTextX.value = Math.round(element.x)
    propTextY.value = Math.round(element.y)
  }
}

function updateElementsList() {
  elementsList.innerHTML = ''
  const pageElements = elements.filter(el => el.page === currentPage)
  
  if (pageElements.length === 0) {
    elementsList.innerHTML = '<p style="color: #6b7280; font-size: 0.875rem; text-align: center; padding: 1rem 0;">No elements on this page</p>'
    return
  }
  
  pageElements.forEach((el, index) => {
    const div = document.createElement('div')
    div.className = 'image-item'
    div.dataset.id = el.id
    if (selectedElement && selectedElement.id === el.id) {
      div.classList.add('selected')
    }
    
    if (el.type === 'image') {
      div.innerHTML = `
        <img src="${el.src}" alt="Image ${index + 1}">
        <span style="flex: 1; font-size: 0.875rem;">Image ${index + 1}</span>
      `
    } else if (el.type === 'text') {
      div.innerHTML = `
        <div style="width: 40px; height: 40px; background: #10b981; border-radius: 4px; display: flex; align-items: center; justify-content: center; color: white; font-weight: bold;">T</div>
        <span style="flex: 1; font-size: 0.875rem;">${el.text.substring(0, 20)}${el.text.length > 20 ? '...' : ''}</span>
      `
    }
    
    div.addEventListener('click', () => selectElement(el))
    elementsList.appendChild(div)
  })
}

async function downloadPDF() {
  if (!pdfBytes) return
  
  try {
    const pdfLibDoc = await PDFLib.PDFDocument.load(pdfBytes)
    
    // Load standard font
    const font = await pdfLibDoc.embedFont(PDFLib.StandardFonts.Helvetica)
    const fontBold = await pdfLibDoc.embedFont(PDFLib.StandardFonts.HelveticaBold)
    
    for (const element of elements) {
      const page = pdfLibDoc.getPage(element.page - 1)
      const { width, height } = page.getSize()
      
      // Convert canvas coordinates to PDF coordinates
      const scale = canvas.width / width
      
      if (element.type === 'image') {
        let image
        if (element.src.includes('image/png')) {
          image = await pdfLibDoc.embedPng(element.src)
        } else {
          image = await pdfLibDoc.embedJpg(element.src)
        }
        
        const x = element.x / scale
        const y = height - (element.y / scale) - (element.height / scale)
        const w = element.width / scale
        const h = element.height / scale
        
        page.drawImage(image, { x, y, width: w, height: h })
      } else if (element.type === 'text') {
        const x = element.x / scale
        const y = height - (element.y / scale) - (element.fontSize / scale)
        const size = element.fontSize / scale
        
        // Convert hex color to RGB
        const r = parseInt(element.color.slice(1, 3), 16) / 255
        const g = parseInt(element.color.slice(3, 5), 16) / 255
        const b = parseInt(element.color.slice(5, 7), 16) / 255
        
        page.drawText(element.text, {
          x,
          y,
          size,
          font: element.fontWeight === 'bold' ? fontBold : font,
          color: PDFLib.rgb(r, g, b)
        })
      }
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
    console.error(error)
  }
}

// Made with Bob
