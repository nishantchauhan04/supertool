export function initTheme() {
  const themeToggle = document.getElementById('theme-toggle')
  const html = document.documentElement
  
  // Check for saved theme preference or default to light mode
  const savedTheme = localStorage.getItem('theme') || 'light'
  
  if (savedTheme === 'dark') {
    html.classList.add('dark')
  }
  
  themeToggle.addEventListener('click', () => {
    html.classList.toggle('dark')
    const currentTheme = html.classList.contains('dark') ? 'dark' : 'light'
    localStorage.setItem('theme', currentTheme)
  })
}

// Made with Bob
