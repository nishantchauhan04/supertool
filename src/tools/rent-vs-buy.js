export default function(container) {
  container.innerHTML = `
    <div class="space-y-6">
      <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
        <!-- Buying Section -->
        <div class="space-y-4">
          <h3 class="text-lg font-semibold text-gray-900 dark:text-white flex items-center">
            <svg class="w-5 h-5 mr-2 text-primary-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"></path>
            </svg>
            Buying
          </h3>
          
          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Property Price (₹)</label>
            <input type="number" id="property-price" class="input-field" value="5000000" step="100000" />
          </div>
          
          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Down Payment (%)</label>
            <input type="number" id="down-payment" class="input-field" value="20" min="0" max="100" />
          </div>
          
          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Loan Interest Rate (% p.a.)</label>
            <input type="number" id="loan-rate" class="input-field" value="8.5" step="0.1" />
          </div>
          
          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Loan Tenure (Years)</label>
            <input type="number" id="loan-tenure" class="input-field" value="20" min="1" max="30" />
          </div>
          
          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Property Tax (₹/year)</label>
            <input type="number" id="property-tax" class="input-field" value="15000" step="1000" />
          </div>
          
          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Maintenance (₹/month)</label>
            <input type="number" id="maintenance" class="input-field" value="3000" step="500" />
          </div>
          
          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Property Appreciation (% p.a.)</label>
            <input type="number" id="appreciation" class="input-field" value="5" step="0.5" />
          </div>
        </div>
        
        <!-- Renting Section -->
        <div class="space-y-4">
          <h3 class="text-lg font-semibold text-gray-900 dark:text-white flex items-center">
            <svg class="w-5 h-5 mr-2 text-orange-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"></path>
            </svg>
            Renting
          </h3>
          
          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Monthly Rent (₹)</label>
            <input type="number" id="monthly-rent" class="input-field" value="25000" step="1000" />
          </div>
          
          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Rent Increase (% p.a.)</label>
            <input type="number" id="rent-increase" class="input-field" value="5" step="0.5" />
          </div>
          
          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Security Deposit (₹)</label>
            <input type="number" id="security-deposit" class="input-field" value="50000" step="10000" />
          </div>
          
          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Investment Return (% p.a.)</label>
            <input type="number" id="investment-return" class="input-field" value="12" step="0.5" />
            <p class="text-xs text-gray-500 dark:text-gray-400 mt-1">Expected return on investing the down payment amount</p>
          </div>
          
          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Time Period (Years)</label>
            <input type="number" id="time-period" class="input-field" value="10" min="1" max="30" />
          </div>
        </div>
      </div>
      
      <button onclick="calculateComparison()" class="btn-primary w-full">Compare Rent vs Buy</button>
      
      <!-- Results -->
      <div id="comparison-results" class="hidden space-y-6">
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div class="p-6 bg-primary-50 dark:bg-primary-900/20 rounded-xl border-2 border-primary-200 dark:border-primary-800">
            <h4 class="text-lg font-semibold text-gray-900 dark:text-white mb-4">Buying</h4>
            <div class="space-y-3">
              <div class="flex justify-between text-sm">
                <span class="text-gray-600 dark:text-gray-400">Monthly EMI:</span>
                <span id="buy-emi" class="font-semibold text-gray-900 dark:text-white"></span>
              </div>
              <div class="flex justify-between text-sm">
                <span class="text-gray-600 dark:text-gray-400">Total Cost:</span>
                <span id="buy-total" class="font-semibold text-gray-900 dark:text-white"></span>
              </div>
              <div class="flex justify-between text-sm">
                <span class="text-gray-600 dark:text-gray-400">Property Value:</span>
                <span id="buy-value" class="font-semibold text-gray-900 dark:text-white"></span>
              </div>
              <div class="flex justify-between text-sm pt-3 border-t border-primary-200 dark:border-primary-700">
                <span class="text-gray-600 dark:text-gray-400">Net Position:</span>
                <span id="buy-net" class="font-bold text-lg text-primary-600 dark:text-primary-400"></span>
              </div>
            </div>
          </div>
          
          <div class="p-6 bg-orange-50 dark:bg-orange-900/20 rounded-xl border-2 border-orange-200 dark:border-orange-800">
            <h4 class="text-lg font-semibold text-gray-900 dark:text-white mb-4">Renting</h4>
            <div class="space-y-3">
              <div class="flex justify-between text-sm">
                <span class="text-gray-600 dark:text-gray-400">Current Rent:</span>
                <span id="rent-current" class="font-semibold text-gray-900 dark:text-white"></span>
              </div>
              <div class="flex justify-between text-sm">
                <span class="text-gray-600 dark:text-gray-400">Total Rent Paid:</span>
                <span id="rent-total" class="font-semibold text-gray-900 dark:text-white"></span>
              </div>
              <div class="flex justify-between text-sm">
                <span class="text-gray-600 dark:text-gray-400">Investment Value:</span>
                <span id="rent-investment" class="font-semibold text-gray-900 dark:text-white"></span>
              </div>
              <div class="flex justify-between text-sm pt-3 border-t border-orange-200 dark:border-orange-700">
                <span class="text-gray-600 dark:text-gray-400">Net Position:</span>
                <span id="rent-net" class="font-bold text-lg text-orange-600 dark:text-orange-400"></span>
              </div>
            </div>
          </div>
        </div>
        
        <div id="recommendation" class="p-6 rounded-xl border-2"></div>
      </div>
    </div>
  `
  
  window.calculateComparison = () => {
    const propertyPrice = parseFloat(document.getElementById('property-price').value) || 0
    const downPaymentPercent = parseFloat(document.getElementById('down-payment').value) || 0
    const loanRate = parseFloat(document.getElementById('loan-rate').value) || 0
    const loanTenure = parseFloat(document.getElementById('loan-tenure').value) || 0
    const propertyTax = parseFloat(document.getElementById('property-tax').value) || 0
    const maintenance = parseFloat(document.getElementById('maintenance').value) || 0
    const appreciation = parseFloat(document.getElementById('appreciation').value) || 0
    
    const monthlyRent = parseFloat(document.getElementById('monthly-rent').value) || 0
    const rentIncrease = parseFloat(document.getElementById('rent-increase').value) || 0
    const securityDeposit = parseFloat(document.getElementById('security-deposit').value) || 0
    const investmentReturn = parseFloat(document.getElementById('investment-return').value) || 0
    const timePeriod = parseFloat(document.getElementById('time-period').value) || 0
    
    // Calculate buying costs
    const downPayment = propertyPrice * (downPaymentPercent / 100)
    const loanAmount = propertyPrice - downPayment
    const monthlyRate = loanRate / 12 / 100
    const totalMonths = loanTenure * 12
    const emi = (loanAmount * monthlyRate * Math.pow(1 + monthlyRate, totalMonths)) / (Math.pow(1 + monthlyRate, totalMonths) - 1)
    
    const monthsInPeriod = timePeriod * 12
    const emiPaid = emi * Math.min(monthsInPeriod, totalMonths)
    const maintenancePaid = maintenance * monthsInPeriod
    const taxPaid = propertyTax * timePeriod
    const totalBuyCost = downPayment + emiPaid + maintenancePaid + taxPaid
    
    const futurePropertyValue = propertyPrice * Math.pow(1 + appreciation / 100, timePeriod)
    const buyNetPosition = futurePropertyValue - totalBuyCost
    
    // Calculate renting costs
    let totalRentPaid = 0
    let currentRent = monthlyRent
    for (let year = 0; year < timePeriod; year++) {
      totalRentPaid += currentRent * 12
      currentRent *= (1 + rentIncrease / 100)
    }
    
    const investmentValue = downPayment * Math.pow(1 + investmentReturn / 100, timePeriod)
    const rentNetPosition = investmentValue - totalRentPaid
    
    // Display results
    document.getElementById('buy-emi').textContent = `₹${Math.round(emi).toLocaleString('en-IN')}`
    document.getElementById('buy-total').textContent = `₹${Math.round(totalBuyCost).toLocaleString('en-IN')}`
    document.getElementById('buy-value').textContent = `₹${Math.round(futurePropertyValue).toLocaleString('en-IN')}`
    document.getElementById('buy-net').textContent = `₹${Math.round(buyNetPosition).toLocaleString('en-IN')}`
    
    document.getElementById('rent-current').textContent = `₹${Math.round(monthlyRent).toLocaleString('en-IN')}`
    document.getElementById('rent-total').textContent = `₹${Math.round(totalRentPaid).toLocaleString('en-IN')}`
    document.getElementById('rent-investment').textContent = `₹${Math.round(investmentValue).toLocaleString('en-IN')}`
    document.getElementById('rent-net').textContent = `₹${Math.round(rentNetPosition).toLocaleString('en-IN')}`
    
    // Recommendation
    const recommendation = document.getElementById('recommendation')
    const difference = Math.abs(buyNetPosition - rentNetPosition)
    
    if (buyNetPosition > rentNetPosition) {
      recommendation.className = 'p-6 rounded-xl border-2 bg-primary-50 dark:bg-primary-900/20 border-primary-200 dark:border-primary-800'
      recommendation.innerHTML = `
        <div class="flex items-start">
          <svg class="w-6 h-6 text-primary-500 mr-3 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
          </svg>
          <div>
            <h4 class="text-lg font-semibold text-gray-900 dark:text-white mb-2">Buying is Better</h4>
            <p class="text-gray-600 dark:text-gray-400">
              After ${timePeriod} years, buying gives you a better net position by <strong>₹${Math.round(difference).toLocaleString('en-IN')}</strong>.
              You'll own an asset worth ₹${Math.round(futurePropertyValue).toLocaleString('en-IN')}.
            </p>
          </div>
        </div>
      `
    } else {
      recommendation.className = 'p-6 rounded-xl border-2 bg-orange-50 dark:bg-orange-900/20 border-orange-200 dark:border-orange-800'
      recommendation.innerHTML = `
        <div class="flex items-start">
          <svg class="w-6 h-6 text-orange-500 mr-3 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
          </svg>
          <div>
            <h4 class="text-lg font-semibold text-gray-900 dark:text-white mb-2">Renting is Better</h4>
            <p class="text-gray-600 dark:text-gray-400">
              After ${timePeriod} years, renting and investing gives you a better net position by <strong>₹${Math.round(difference).toLocaleString('en-IN')}</strong>.
              Your investments would be worth ₹${Math.round(investmentValue).toLocaleString('en-IN')}.
            </p>
          </div>
        </div>
      `
    }
    
    document.getElementById('comparison-results').classList.remove('hidden')
  }
}

// Made with Bob
