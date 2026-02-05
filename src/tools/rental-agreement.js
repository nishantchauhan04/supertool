import { jsPDF } from 'jspdf'

export default function(container) {
  container.innerHTML = `
    <div class="space-y-6">
      <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
        <!-- Landlord Details -->
        <div class="space-y-4">
          <h3 class="text-lg font-semibold text-gray-900 dark:text-white">Landlord Details</h3>
          
          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Full Name</label>
            <input type="text" id="landlord-name" class="input-field" placeholder="John Doe" />
          </div>
          
          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Address</label>
            <textarea id="landlord-address" rows="2" class="input-field" placeholder="123 Main Street, City, State"></textarea>
          </div>
          
          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Phone</label>
            <input type="tel" id="landlord-phone" class="input-field" placeholder="+1 234 567 8900" />
          </div>
          
          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Email</label>
            <input type="email" id="landlord-email" class="input-field" placeholder="landlord@example.com" />
          </div>
        </div>
        
        <!-- Tenant Details -->
        <div class="space-y-4">
          <h3 class="text-lg font-semibold text-gray-900 dark:text-white">Tenant Details</h3>
          
          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Full Name</label>
            <input type="text" id="tenant-name" class="input-field" placeholder="Jane Smith" />
          </div>
          
          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Address</label>
            <textarea id="tenant-address" rows="2" class="input-field" placeholder="456 Oak Avenue, City, State"></textarea>
          </div>
          
          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Phone</label>
            <input type="tel" id="tenant-phone" class="input-field" placeholder="+1 234 567 8901" />
          </div>
          
          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Email</label>
            <input type="email" id="tenant-email" class="input-field" placeholder="tenant@example.com" />
          </div>
        </div>
      </div>
      
      <!-- Property & Rental Details -->
      <div class="space-y-4">
        <h3 class="text-lg font-semibold text-gray-900 dark:text-white">Property & Rental Details</h3>
        
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Property Address</label>
            <textarea id="property-address" rows="2" class="input-field" placeholder="789 Rental Street, City, State, ZIP"></textarea>
          </div>
          
          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Property Type</label>
            <select id="property-type" class="input-field">
              <option>Apartment</option>
              <option>House</option>
              <option>Condo</option>
              <option>Studio</option>
              <option>Room</option>
            </select>
          </div>
          
          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Monthly Rent (₹)</label>
            <input type="number" id="monthly-rent" class="input-field" placeholder="25000" />
          </div>
          
          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Security Deposit (₹)</label>
            <input type="number" id="security-deposit" class="input-field" placeholder="50000" />
          </div>
          
          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Lease Start Date</label>
            <input type="date" id="start-date" class="input-field" />
          </div>
          
          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Lease Duration (Months)</label>
            <input type="number" id="lease-duration" class="input-field" value="12" min="1" />
          </div>
          
          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Rent Due Date (Day of Month)</label>
            <input type="number" id="rent-due-date" class="input-field" value="1" min="1" max="31" />
          </div>
          
          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Late Fee (₹)</label>
            <input type="number" id="late-fee" class="input-field" placeholder="500" />
          </div>
        </div>
      </div>
      
      <!-- Additional Terms -->
      <div>
        <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Additional Terms & Conditions</label>
        <textarea id="additional-terms" rows="4" class="input-field" placeholder="Enter any additional terms, rules, or conditions..."></textarea>
      </div>
      
      <div class="flex space-x-4">
        <button onclick="previewAgreement()" class="btn-secondary flex-1">Preview</button>
        <button onclick="generateAgreement()" class="btn-primary flex-1">Generate PDF</button>
      </div>
      
      <!-- Preview Modal -->
      <div id="preview-modal" class="hidden fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
        <div class="bg-white dark:bg-gray-800 rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
          <div class="sticky top-0 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 px-6 py-4 flex items-center justify-between">
            <h3 class="text-xl font-bold text-gray-900 dark:text-white">Agreement Preview</h3>
            <button onclick="closePreview()" class="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg">
              <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
              </svg>
            </button>
          </div>
          <div id="preview-content" class="p-6 text-sm text-gray-700 dark:text-gray-300"></div>
        </div>
      </div>
    </div>
  `
  
  // Set default start date to today
  const today = new Date().toISOString().split('T')[0]
  document.getElementById('start-date').value = today
  
  function getFormData() {
    return {
      landlordName: document.getElementById('landlord-name').value,
      landlordAddress: document.getElementById('landlord-address').value,
      landlordPhone: document.getElementById('landlord-phone').value,
      landlordEmail: document.getElementById('landlord-email').value,
      tenantName: document.getElementById('tenant-name').value,
      tenantAddress: document.getElementById('tenant-address').value,
      tenantPhone: document.getElementById('tenant-phone').value,
      tenantEmail: document.getElementById('tenant-email').value,
      propertyAddress: document.getElementById('property-address').value,
      propertyType: document.getElementById('property-type').value,
      monthlyRent: document.getElementById('monthly-rent').value,
      securityDeposit: document.getElementById('security-deposit').value,
      startDate: document.getElementById('start-date').value,
      leaseDuration: document.getElementById('lease-duration').value,
      rentDueDate: document.getElementById('rent-due-date').value,
      lateFee: document.getElementById('late-fee').value,
      additionalTerms: document.getElementById('additional-terms').value
    }
  }
  
  function validateForm(data) {
    const required = ['landlordName', 'tenantName', 'propertyAddress', 'monthlyRent', 'securityDeposit', 'startDate']
    for (const field of required) {
      if (!data[field]) {
        alert(`Please fill in: ${field.replace(/([A-Z])/g, ' $1').trim()}`)
        return false
      }
    }
    return true
  }
  
  function generateAgreementText(data) {
    const endDate = new Date(data.startDate)
    endDate.setMonth(endDate.getMonth() + parseInt(data.leaseDuration))
    
    return `
RENTAL AGREEMENT

This Rental Agreement ("Agreement") is entered into on ${new Date(data.startDate).toLocaleDateString()} between:

LANDLORD:
Name: ${data.landlordName}
Address: ${data.landlordAddress}
Phone: ${data.landlordPhone}
Email: ${data.landlordEmail}

AND

TENANT:
Name: ${data.tenantName}
Address: ${data.tenantAddress}
Phone: ${data.tenantPhone}
Email: ${data.tenantEmail}

PROPERTY DETAILS:
Address: ${data.propertyAddress}
Type: ${data.propertyType}

TERMS AND CONDITIONS:

1. LEASE TERM
   The lease term shall commence on ${new Date(data.startDate).toLocaleDateString()} and continue for ${data.leaseDuration} months, ending on ${endDate.toLocaleDateString()}.

2. RENT
   The monthly rent for the property is ₹${parseInt(data.monthlyRent).toLocaleString('en-IN')}, payable on or before the ${data.rentDueDate}${getOrdinalSuffix(data.rentDueDate)} day of each month.

3. SECURITY DEPOSIT
   The Tenant shall pay a security deposit of ₹${parseInt(data.securityDeposit).toLocaleString('en-IN')} upon signing this agreement. This deposit will be refunded at the end of the lease term, subject to property inspection and deductions for any damages.

4. LATE PAYMENT
   A late fee of ₹${data.lateFee || '0'} will be charged if rent is not received by the due date.

5. UTILITIES
   The Tenant shall be responsible for payment of all utilities including electricity, water, gas, internet, and other services.

6. MAINTENANCE
   The Tenant agrees to maintain the property in good condition and report any damages or required repairs to the Landlord promptly.

7. TERMINATION
   Either party may terminate this agreement by providing 30 days written notice to the other party.

8. ADDITIONAL TERMS
   ${data.additionalTerms || 'None specified'}

SIGNATURES:

Landlord: _______________________     Date: __________
${data.landlordName}

Tenant: _______________________       Date: __________
${data.tenantName}

Witness 1: _______________________    Date: __________

Witness 2: _______________________    Date: __________
`
  }
  
  function getOrdinalSuffix(day) {
    const j = day % 10
    const k = day % 100
    if (j === 1 && k !== 11) return 'st'
    if (j === 2 && k !== 12) return 'nd'
    if (j === 3 && k !== 13) return 'rd'
    return 'th'
  }
  
  window.previewAgreement = () => {
    const data = getFormData()
    if (!validateForm(data)) return
    
    const agreementText = generateAgreementText(data)
    const previewContent = document.getElementById('preview-content')
    previewContent.innerHTML = `<pre class="whitespace-pre-wrap font-mono text-xs">${agreementText}</pre>`
    document.getElementById('preview-modal').classList.remove('hidden')
  }
  
  window.closePreview = () => {
    document.getElementById('preview-modal').classList.add('hidden')
  }
  
  window.generateAgreement = () => {
    const data = getFormData()
    if (!validateForm(data)) return
    
    const agreementText = generateAgreementText(data)
    const pdf = new jsPDF()
    
    // Add title
    pdf.setFontSize(16)
    pdf.setFont(undefined, 'bold')
    pdf.text('RENTAL AGREEMENT', 105, 20, { align: 'center' })
    
    // Add content
    pdf.setFontSize(10)
    pdf.setFont(undefined, 'normal')
    
    const lines = pdf.splitTextToSize(agreementText, 180)
    pdf.text(lines, 15, 35)
    
    // Save PDF
    pdf.save(`rental-agreement-${data.tenantName.replace(/\s+/g, '-')}-${Date.now()}.pdf`)
  }
}

// Made with Bob
