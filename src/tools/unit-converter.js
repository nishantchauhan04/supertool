export default function(container) {
  const conversions = {
    length: {
      name: 'Length',
      units: {
        cm: { name: 'Centimeters', toBase: 1 },
        inch: { name: 'Inches', toBase: 2.54 },
        m: { name: 'Meters', toBase: 100 },
        ft: { name: 'Feet', toBase: 30.48 },
        km: { name: 'Kilometers', toBase: 100000 },
        mile: { name: 'Miles', toBase: 160934 }
      }
    },
    weight: {
      name: 'Weight',
      units: {
        kg: { name: 'Kilograms', toBase: 1 },
        lbs: { name: 'Pounds', toBase: 0.453592 },
        g: { name: 'Grams', toBase: 0.001 },
        oz: { name: 'Ounces', toBase: 0.0283495 },
        ton: { name: 'Metric Tons', toBase: 1000 }
      }
    },
    area: {
      name: 'Area',
      units: {
        sqm: { name: 'Square Meters', toBase: 1 },
        sqft: { name: 'Square Feet', toBase: 0.092903 },
        sqkm: { name: 'Square Kilometers', toBase: 1000000 },
        acre: { name: 'Acres', toBase: 4046.86 },
        hectare: { name: 'Hectares', toBase: 10000 }
      }
    },
    temperature: {
      name: 'Temperature',
      units: {
        celsius: { name: 'Celsius' },
        fahrenheit: { name: 'Fahrenheit' },
        kelvin: { name: 'Kelvin' }
      }
    }
  }
  
  container.innerHTML = `
    <div class="space-y-6">
      <div>
        <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Category</label>
        <select id="category-select" class="input-field">
          ${Object.entries(conversions).map(([key, value]) => 
            `<option value="${key}">${value.name}</option>`
          ).join('')}
        </select>
      </div>
      
      <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div class="space-y-4">
          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">From</label>
            <select id="from-unit" class="input-field mb-2"></select>
            <input 
              type="number" 
              id="from-value" 
              class="input-field font-mono"
              placeholder="Enter value"
              step="any"
            />
          </div>
        </div>
        
        <div class="space-y-4">
          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">To</label>
            <select id="to-unit" class="input-field mb-2"></select>
            <div class="input-field font-mono bg-gray-50 dark:bg-gray-700/50" id="to-value">0</div>
          </div>
        </div>
      </div>
      
      <div class="flex justify-center">
        <button onclick="swapUnits()" class="p-3 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors">
          <svg class="w-6 h-6 text-gray-600 dark:text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4"></path>
          </svg>
        </button>
      </div>
      
      <div id="quick-conversions" class="grid grid-cols-2 sm:grid-cols-3 gap-2"></div>
    </div>
  `
  
  const categorySelect = document.getElementById('category-select')
  const fromUnit = document.getElementById('from-unit')
  const toUnit = document.getElementById('to-unit')
  const fromValue = document.getElementById('from-value')
  const toValue = document.getElementById('to-value')
  const quickConversions = document.getElementById('quick-conversions')
  
  function updateUnits() {
    const category = categorySelect.value
    const units = conversions[category].units
    
    fromUnit.innerHTML = ''
    toUnit.innerHTML = ''
    
    Object.entries(units).forEach(([key, value]) => {
      fromUnit.innerHTML += `<option value="${key}">${value.name}</option>`
      toUnit.innerHTML += `<option value="${key}">${value.name}</option>`
    })
    
    // Set different default units
    const unitKeys = Object.keys(units)
    if (unitKeys.length > 1) {
      toUnit.value = unitKeys[1]
    }
    
    convert()
    updateQuickConversions()
  }
  
  function convert() {
    const category = categorySelect.value
    const from = fromUnit.value
    const to = toUnit.value
    const value = parseFloat(fromValue.value) || 0
    
    let result
    
    if (category === 'temperature') {
      result = convertTemperature(value, from, to)
    } else {
      const units = conversions[category].units
      const baseValue = value * units[from].toBase
      result = baseValue / units[to].toBase
    }
    
    toValue.textContent = result.toFixed(6).replace(/\.?0+$/, '')
  }
  
  function convertTemperature(value, from, to) {
    let celsius
    
    // Convert to Celsius first
    switch(from) {
      case 'celsius':
        celsius = value
        break
      case 'fahrenheit':
        celsius = (value - 32) * 5/9
        break
      case 'kelvin':
        celsius = value - 273.15
        break
    }
    
    // Convert from Celsius to target
    switch(to) {
      case 'celsius':
        return celsius
      case 'fahrenheit':
        return celsius * 9/5 + 32
      case 'kelvin':
        return celsius + 273.15
    }
  }
  
  function updateQuickConversions() {
    const category = categorySelect.value
    const units = conversions[category].units
    const from = fromUnit.value
    const value = parseFloat(fromValue.value) || 1
    
    quickConversions.innerHTML = ''
    
    Object.entries(units).forEach(([key, unit]) => {
      if (key !== from) {
        let result
        if (category === 'temperature') {
          result = convertTemperature(value, from, key)
        } else {
          const baseValue = value * units[from].toBase
          result = baseValue / units[key].toBase
        }
        
        quickConversions.innerHTML += `
          <div class="p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg text-sm">
            <div class="text-gray-600 dark:text-gray-400 text-xs mb-1">${unit.name}</div>
            <div class="font-mono font-semibold text-gray-900 dark:text-white">${result.toFixed(4).replace(/\.?0+$/, '')}</div>
          </div>
        `
      }
    })
  }
  
  window.swapUnits = () => {
    const temp = fromUnit.value
    fromUnit.value = toUnit.value
    toUnit.value = temp
    convert()
    updateQuickConversions()
  }
  
  categorySelect.addEventListener('change', updateUnits)
  fromUnit.addEventListener('change', () => {
    convert()
    updateQuickConversions()
  })
  toUnit.addEventListener('change', convert)
  fromValue.addEventListener('input', () => {
    convert()
    updateQuickConversions()
  })
  
  updateUnits()
}

// Made with Bob
