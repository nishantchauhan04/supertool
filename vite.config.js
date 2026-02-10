import { defineConfig } from 'vite'
import { resolve } from 'path'

export default defineConfig({
  build: {
    rollupOptions: {
      input: {
        main: resolve(__dirname, 'index.html'),
        about: resolve(__dirname, 'about.html'),
        faq: resolve(__dirname, 'faq.html'),
        guides: resolve(__dirname, 'guides.html'),
        blog: resolve(__dirname, 'blog.html'),
        privacy: resolve(__dirname, 'privacy.html'),
        'pdf-editor': resolve(__dirname, 'pdf-editor.html'),
        'blog-pdf': resolve(__dirname, 'blog/pdf-optimization.html'),
      },
    },
  },
})

// Made with Bob
