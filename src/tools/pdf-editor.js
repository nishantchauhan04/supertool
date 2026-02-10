export default function(container) {
  // Redirect to dedicated PDF editor page
  window.location.href = '/pdf-editor.html'
  
  // Show loading message
  container.innerHTML = `
    <div class="text-center py-12">
      <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-500 mx-auto mb-4"></div>
      <p class="text-gray-600 dark:text-gray-400">Opening PDF Editor...</p>
    </div>
  `
}

// Made with Bob
