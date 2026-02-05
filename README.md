# 🛠️ SuperTool - All-in-One Toolkit

A fast, aesthetic, and privacy-focused web application featuring 13 powerful tools for everyday tasks. Built with Vite, Vanilla JavaScript, and Tailwind CSS.

## ✨ Features

### 🎨 Design
- **Modern UI**: Clean, aesthetic interface with smooth animations
- **Dark Mode**: Toggle between light and dark themes
- **Responsive**: Works perfectly on mobile, tablet, and desktop
- **Fast Loading**: Optimized for performance with lazy loading

### 🔒 Privacy First
- **Client-Side Processing**: All tools run in your browser
- **No Uploads**: Your data never leaves your device
- **No Tracking**: No analytics or data collection

## 🧰 All 13 Tools - Fully Functional!

### 📝 Text Tools
1. **JSON Formatter/Validator** - Format, validate, and minify JSON data with syntax highlighting
2. **Base64 Encode/Decode** - Encode and decode Base64 strings instantly
3. **Text Diff Checker** - Compare two texts and highlight differences line-by-line
4. **Case Converter** - Convert text to UPPERCASE, lowercase, Title Case, camelCase, snake_case

### 🖼️ Image & PDF Tools
5. **Image to PDF** - Convert multiple images to a single PDF with customizable page size and orientation
6. **Compress PDF** - Reduce PDF file size while maintaining quality
7. **Compress Image** - Compress and optimize images (JPG, PNG, WebP) with quality control
8. **Photo Resize** - Resize photos by pixels, percentage, or preset dimensions

### 🔢 Calculator Tools
9. **EMI Calculator** - Calculate loan EMI with detailed amortization schedule and visual breakdown
10. **Rent vs Buy Calculator** - Compare the financial impact of renting vs buying property

### 🔄 Converter Tools
11. **Unit Converter** - Convert between cm↔inch, kg↔lbs, sqft↔sqm, temperature, and more
12. **Timestamp Converter** - Convert between Unix timestamps and human-readable dates

### 📄 Document Tools
13. **Rental Agreement Generator** - Generate professional rental agreements with customizable templates

## 🚀 Getting Started

### Prerequisites
- Node.js 16+ and npm

### Installation

```bash
# Clone the repository
git clone <repository-url>
cd supertool

# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

## 🏗️ Tech Stack

- **Framework**: Vite
- **Language**: Vanilla JavaScript (ES6+)
- **Styling**: Tailwind CSS 3
- **PDF Generation**: jsPDF, pdf-lib
- **Image Processing**: browser-image-compression
- **Icons**: Heroicons (SVG)

## 📁 Project Structure

```
supertool/
├── src/
│   ├── tools/              # 13 tool implementations
│   │   ├── base64.js
│   │   ├── case-converter.js
│   │   ├── compress-image.js
│   │   ├── compress-pdf.js
│   │   ├── emi-calculator.js
│   │   ├── image-to-pdf.js
│   │   ├── json-formatter.js
│   │   ├── photo-resize.js
│   │   ├── rent-vs-buy.js
│   │   ├── rental-agreement.js
│   │   ├── text-diff.js
│   │   ├── timestamp-converter.js
│   │   ├── unit-converter.js
│   │   └── toolsData.js    # Tool metadata
│   ├── components/         # Reusable components
│   │   └── Modal.js
│   ├── utils/             # Utility functions
│   │   └── theme.js
│   ├── main.js            # App initialization
│   └── style.css          # Global styles
├── index.html             # Entry point
├── tailwind.config.js     # Tailwind configuration
├── postcss.config.js      # PostCSS configuration
└── package.json
```

## 🎯 Tool Features

### Image to PDF
- Multiple image upload with drag & drop
- Reorder images before conversion
- Choose page size (A4, Letter, Legal, A3)
- Portrait or landscape orientation
- Multiple fit options (contain, cover, stretch)

### Compress PDF
- Upload PDFs up to 50MB
- Automatic optimization
- Shows original vs compressed size
- Instant download

### Compress Image
- Batch process multiple images
- Adjustable quality (10-100%)
- Set maximum width
- Real-time compression preview
- Shows size reduction percentage

### Photo Resize
- Resize by pixels, percentage, or presets
- Maintain aspect ratio option
- Social media presets (Instagram, Facebook, Twitter)
- Live preview before download

### EMI Calculator
- Interactive sliders for easy input
- Visual payment breakdown
- Detailed amortization schedule
- Real-time calculations

### Rent vs Buy Calculator
- Comprehensive financial comparison
- Considers property appreciation
- Investment return calculations
- Clear recommendations

### Unit Converter
- Length, weight, area, temperature
- Real-time conversion
- Quick conversion display
- Swap units easily

### Timestamp Converter
- Live current timestamp display
- Convert timestamp to date
- Convert date to timestamp
- Multiple format outputs (local, UTC, ISO)

### JSON Formatter
- Format, validate, and minify
- Syntax highlighting
- Error detection with line numbers
- File size statistics

### Base64 Encode/Decode
- Encode text to Base64
- Decode Base64 to text
- Error handling for invalid input
- Copy to clipboard

### Text Diff Checker
- Line-by-line comparison
- Color-coded differences
- Addition and removal counts
- Side-by-side view

### Case Converter
- 6 conversion types
- Instant conversion
- Copy to clipboard
- Preserves formatting

### Rental Agreement Generator
- Professional templates
- Customizable terms
- Preview before download
- PDF export
- Landlord and tenant details
- Property and payment terms

## 🎨 Customization

### Adding a New Tool

1. Create a new file in `src/tools/your-tool.js`:
```javascript
export default function(container) {
  container.innerHTML = `
    <!-- Your tool HTML -->
  `
  // Your tool logic
}
```

2. Add tool metadata to `src/tools/toolsData.js`:
```javascript
{
  id: 'your-tool',
  name: 'Your Tool Name',
  description: 'Tool description',
  icon: `<!-- SVG icon -->`,
  gradient: 'from-color-500 to-color-600',
  category: 'category-name'
}
```

### Customizing Theme

Edit `tailwind.config.js` to customize colors, fonts, and other design tokens.

## 📱 Browser Support

- Chrome/Edge (latest)
- Firefox (latest)
- Safari (latest)
- Mobile browsers (iOS Safari, Chrome Mobile)

## ⚡ Performance

- **First Contentful Paint**: < 1s
- **Time to Interactive**: < 2s
- **Lighthouse Score**: 95+
- **Bundle Size**: Optimized with code splitting
- **Tool Load Time**: < 500ms (lazy loaded)

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📄 License

MIT License - feel free to use this project for personal or commercial purposes.

## 🙏 Acknowledgments

- Icons from [Heroicons](https://heroicons.com/)
- Built with [Vite](https://vitejs.dev/)
- Styled with [Tailwind CSS](https://tailwindcss.com/)
- PDF generation with [jsPDF](https://github.com/parallax/jsPDF) and [pdf-lib](https://pdf-lib.js.org/)
- Image compression with [browser-image-compression](https://github.com/Donaldcwl/browser-image-compression)

## 📞 Support

For issues or questions, please open an issue on GitHub.

---

Made with ❤️ for productivity and convenience