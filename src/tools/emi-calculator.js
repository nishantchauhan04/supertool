export default function(container) {
  container.innerHTML = `
    <div class="space-y-6">
      <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div class="space-y-4">
          <h3 class="text-lg font-semibold text-gray-900 dark:text-white">Loan Details</h3>
          
          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Loan Amount (₹)
            </label>
            <input 
              type="number" 
              id="loan-amount" 
              class="input-field"
              value="1000000"
              min="0"
              step="10000"
            />
            <input 
              type="range" 
              id="loan-amount-slider" 
              class="w-full mt-2"
              min="100000"
              max="10000000"
              step="100000"
              value="1000000"
            />
          </div>
          
          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Interest Rate (% per annum)
            </label>
            <input 
              type="number" 
              id="interest-rate" 
              class="input-field"
              value="8.5"
              min="0"
              max="30"
              step="0.1"
            />
            <input 
              type="range" 
              id="interest-rate-slider" 
              class="w-full mt-2"
              min="1"
              max="30"
              step="0.1"
              value="8.5"
            />
          </div>
          
          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Loan Tenure (Years)
            </label>
            <input 
              type="number" 
              id="loan-tenure" 
              class="input-field"
              value="20"
              min="1"
              max="30"
            />
            <input 
              type="range" 
              id="loan-tenure-slider" 
              class="w-full mt-2"
              min="1"
              max="30"
              value="20"
            />
          </div>
          
          <button onclick="calculateEMI()" class="btn-primary w-full">Calculate EMI</button>
        </div>
        
        <div class="space-y-4">
          <h3 class="text-lg font-semibold text-gray-900 dark:text-white">Results</h3>
          
          <div id="emi-results" class="space-y-3">
            <div class="p-4 bg-primary-50 dark:bg-primary-900/20 rounded-lg border border-primary-200 dark:border-primary-800">
              <div class="text-sm text-gray-600 dark:text-gray-400 mb-1">Monthly EMI</div>
              <div id="monthly-emi" class="text-3xl font-bold text-primary-600 dark:text-primary-400">₹0</div>
            </div>
            
            <div class="grid grid-cols-2 gap-3">
              <div class="p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                <div class="text-xs text-gray-600 dark:text-gray-400 mb-1">Principal Amount</div>
                <div id="principal-amount" class="text-lg font-semibold text-gray-900 dark:text-white">₹0</div>
              </div>
              
              <div class="p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                <div class="text-xs text-gray-600 dark:text-gray-400 mb-1">Total Interest</div>
                <div id="total-interest" class="text-lg font-semibold text-gray-900 dark:text-white">₹0</div>
              </div>
              
              <div class="p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg col-span-2">
                <div class="text-xs text-gray-600 dark:text-gray-400 mb-1">Total Amount Payable</div>
                <div id="total-amount" class="text-xl font-semibold text-gray-900 dark:text-white">₹0</div>
              </div>
            </div>
            
            <div class="p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
              <div class="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">Payment Breakdown</div>
              <div class="flex items-center space-x-2 mb-2">
                <div class="flex-1 h-8 bg-primary-500 rounded" id="principal-bar"></div>
                <div class="flex-1 h-8 bg-orange-500 rounded" id="interest-bar"></div>
              </div>
              <div class="flex justify-between text-xs text-gray-600 dark:text-gray-400">
                <div class="flex items-center">
                  <div class="w-3 h-3 bg-primary-500 rounded mr-1"></div>
                  <span>Principal (<span id="principal-percent">0</span>%)</span>
                </div>
                <div class="flex items-center">
                  <div class="w-3 h-3 bg-orange-500 rounded mr-1"></div>
                  <span>Interest (<span id="interest-percent">0</span>%)</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <div id="amortization-section" class="hidden">
        <h3 class="text-lg font-semibold text-gray-900 dark:text-white mb-4">Amortization Schedule (First Year)</h3>
        <div class="overflow-x-auto">
          <table class="w-full text-sm">
            <thead class="bg-gray-50 dark:bg-gray-700/50">
              <tr>
                <th class="px-4 py-2 text-left text-gray-700 dark:text-gray-300">Month</th>
                <th class="px-4 py-2 text-right text-gray-700 dark:text-gray-300">EMI</th>
                <th class="px-4 py-2 text-right text-gray-700 dark:text-gray-300">Principal</th>
                <th class="px-4 py-2 text-right text-gray-700 dark:text-gray-300">Interest</th>
                <th class="px-4 py-2 text-right text-gray-700 dark:text-gray-300">Balance</th>
              </tr>
            </thead>
            <tbody id="amortization-table" class="divide-y divide-gray-200 dark:divide-gray-700">
            </tbody>
          </table>
        </div>
      </div>
    </div>
  `
  
  // Sync inputs with sliders
  const loanAmount = document.getElementById('loan-amount')
  const loanAmountSlider = document.getElementById('loan-amount-slider')
  const interestRate = document.getElementById('interest-rate')
  const interestRateSlider = document.getElementById('interest-rate-slider')
  const loanTenure = document.getElementById('loan-tenure')
  const loanTenureSlider = document.getElementById('loan-tenure-slider')
  
  loanAmount.addEventListener('input', () => {
    loanAmountSlider.value = loanAmount.value
    calculateEMI()
  })
  
  loanAmountSlider.addEventListener('input', () => {
    loanAmount.value = loanAmountSlider.value
    calculateEMI()
  })
  
  interestRate.addEventListener('input', () => {
    interestRateSlider.value = interestRate.value
    calculateEMI()
  })
  
  interestRateSlider.addEventListener('input', () => {
    interestRate.value = interestRateSlider.value
    calculateEMI()
  })
  
  loanTenure.addEventListener('input', () => {
    loanTenureSlider.value = loanTenure.value
    calculateEMI()
  })
  
  loanTenureSlider.addEventListener('input', () => {
    loanTenure.value = loanTenureSlider.value
    calculateEMI()
  })
  
  window.calculateEMI = () => {
    const P = parseFloat(loanAmount.value) || 0
    const r = (parseFloat(interestRate.value) || 0) / 12 / 100
    const n = (parseFloat(loanTenure.value) || 0) * 12
    
    if (P <= 0 || r <= 0 || n <= 0) {
      return
    }
    
    // EMI = [P x R x (1+R)^N]/[(1+R)^N-1]
    const emi = (P * r * Math.pow(1 + r, n)) / (Math.pow(1 + r, n) - 1)
    const totalAmount = emi * n
    const totalInterest = totalAmount - P
    
    document.getElementById('monthly-emi').textContent = `₹${Math.round(emi).toLocaleString('en-IN')}`
    document.getElementById('principal-amount').textContent = `₹${Math.round(P).toLocaleString('en-IN')}`
    document.getElementById('total-interest').textContent = `₹${Math.round(totalInterest).toLocaleString('en-IN')}`
    document.getElementById('total-amount').textContent = `₹${Math.round(totalAmount).toLocaleString('en-IN')}`
    
    const principalPercent = Math.round((P / totalAmount) * 100)
    const interestPercent = 100 - principalPercent
    
    document.getElementById('principal-percent').textContent = principalPercent
    document.getElementById('interest-percent').textContent = interestPercent
    document.getElementById('principal-bar').style.width = `${principalPercent}%`
    document.getElementById('interest-bar').style.width = `${interestPercent}%`
    
    // Generate amortization schedule for first year
    generateAmortizationSchedule(P, r, n, emi)
  }
  
  function generateAmortizationSchedule(principal, monthlyRate, totalMonths, emi) {
    const table = document.getElementById('amortization-table')
    const section = document.getElementById('amortization-section')
    table.innerHTML = ''
    
    let balance = principal
    const monthsToShow = Math.min(12, totalMonths)
    
    for (let month = 1; month <= monthsToShow; month++) {
      const interestPayment = balance * monthlyRate
      const principalPayment = emi - interestPayment
      balance -= principalPayment
      
      const row = document.createElement('tr')
      row.className = 'hover:bg-gray-50 dark:hover:bg-gray-700/30'
      row.innerHTML = `
        <td class="px-4 py-2 text-gray-900 dark:text-white">${month}</td>
        <td class="px-4 py-2 text-right text-gray-900 dark:text-white">₹${Math.round(emi).toLocaleString('en-IN')}</td>
        <td class="px-4 py-2 text-right text-gray-900 dark:text-white">₹${Math.round(principalPayment).toLocaleString('en-IN')}</td>
        <td class="px-4 py-2 text-right text-gray-900 dark:text-white">₹${Math.round(interestPayment).toLocaleString('en-IN')}</td>
        <td class="px-4 py-2 text-right text-gray-900 dark:text-white">₹${Math.round(balance).toLocaleString('en-IN')}</td>
      `
      table.appendChild(row)
    }
    
    section.classList.remove('hidden')
  }
  
  // Calculate on load
  calculateEMI()
}

// Made with Bob
