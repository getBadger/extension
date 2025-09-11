let isSearching = false;
let bestSavings = 0;
let bestCoupon = null;

// Add global variables for persistent savings tracking
let totalSavingsHistory = {
  originalPrice: 0,
  finalPrice: 0,
  savedAmount: 0,
  appliedCoupon: null,
  lastUpdated: null
};

// Common coupon input selectors
const SELECTORS = {
  input: [
    '#couponCode',
    '#voucherCode',
    '#discount-code',
    'input[name="coupon"]',
    'input[name="discount"]',
    'input[name="voucher"]',
    'input[name="ppw-claimCode"]',
    'input[placeholder="Enter code"]',
    'input[placeholder="Enter Code"]',
    'input[placeholder*="coupon" i]',
    'input[placeholder*="promo" i]',
    'input[placeholder*="discount" i]',
    'input[placeholder*="voucher" i]'
  ],
  button: [
    'button[type="submit"][aria-label="Apply Discount Code"]',
    'button[type="submit"] span:contains("Apply")',
    'button[type="submit"][value="Apply"]',
    'button[aria-label="Apply Discount Code"]',
    'input[type="submit"][value="Apply"]',
    'input[type="submit"]',
    'input[value="Apply"]'
  ],
  total: [
    '[role="row"] [role="cell"] strong.notranslate',
    '[data-testid="order-summary"] [data-testid="order-total"]',
    '#subtotals-marketplace-table .a-color-price.a-text-bold .order-summary-line-definition',
    '[value$="$"]'
  ]
};

// List of test coupon codes
const TEST_COUPONS = [
  'SAVE10',
  'AFF-FIRST15'
  // 'WELCOME20',
  // 'DISCOUNT25',
  // 'FREESHIP'
];



// Function to update total savings
function updateTotalSavings(originalPrice, newPrice, coupon) {
  totalSavingsHistory = {
    originalPrice: originalPrice,
    finalPrice: newPrice,
    savedAmount: originalPrice - newPrice,
    appliedCoupon: coupon,
    lastUpdated: new Date().toISOString()
  };
  
  // Store in chrome.storage for persistence
  // chrome.storage.local.set({ 'badgerSavings': totalSavingsHistory }, () => {
  //   console.log('Savings history updated:', totalSavingsHistory);
  // });
}

// Function to get saved total savings
function getTotalSavings() {
  return new Promise((resolve) => {
    chrome.storage.local.get(['badgerSavings'], (result) => {
      if (result.badgerSavings) {
        totalSavingsHistory = result.badgerSavings;
      }
      resolve(totalSavingsHistory);
    });
  });
}

// Initialize on checkout pages
async function initializeBadger() {


  if (isCheckoutPage()) {

    const hostname = location.hostname;
    let coupons = [];

    try {
      const response = await fetch(`https://code-api-42s1.onrender.com/api/coupons?site=${hostname}`);
      const data = await response.json();
      coupons = data.coupons || [];
    } catch (error) {
      console.error('Error fetching coupons:', error);
    }

    try {
      const response = await fetch(`https://code-api-42s1.onrender.com/api/coupons?site=${hostname}`);
      const data = await response.json();
      coupons = data.coupons || [];
    } catch (error) {
      console.error('Error fetching coupons:', error);
    }

    console.log('Checkout page detected, initializing Badger...');
    const cartTotal = getCurrentPrice();
    console.log('Cart total:', cartTotal);
    
    await wait(1000);
    
    // Create the popup container
    const popup = document.createElement('div');
    popup.id = 'badger-popup';
    popup.style.cssText = `
      position: fixed;
      top: 20px;
      right: 20px;
      background-color: white;
      padding: 15px;
      border-radius: 8px;
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
      z-index: 999999;
      width: 300px;
      font-family: Arial, sans-serif;
    `;

    popup.innerHTML = `
      <div style="display: flex; align-items: center; margin-bottom: 10px;">
        <img src="${chrome.runtime.getURL('images/badger_icon_48.png')}" style="width: 32px; height: 32px; margin-right: 10px;">
        <h2 style="margin: 0; color: #333; font-size: 16px;">Badger Coupons!</h2>
      </div>
      <p style="margin: 8px 0; color: #666; font-size: 14px;">Current Cart Total: $${cartTotal.toFixed(2)}</p>
      <div id="badger-savings" style="margin: 8px 0; color: #4CAF50; font-size: 14px;">Total Savings: $0.00</div>
      <div id="badger-status" style="margin: 8px 0; color: #666; min-height: 16px; font-size: 13px;"></div>
      <div id="badger-progress-container" style="width: 100%; height: 4px; background-color: #f0f0f0; border-radius: 2px; overflow: hidden; margin: 8px 0; display: none;">
        <div id="badger-progress-bar" style="width: 0%; height: 100%; background-color: #4CAF50; transition: width 0.3s ease;"></div>
      </div>

      <button id="badger-find-coupons" style="
        background-color: #4CAF50;
        color: white;
        border: none;
        padding: 8px 15px;
        border-radius: 4px;
        cursor: pointer;
        width: 100%;
        font-size: 14px;
        margin-top: 8px;
        transition: background-color 0.2s ease;
      ">Find & Apply Coupons</button>

      

      <button id="badger-close" style="position: absolute; top: 8px; right: 8px; background: none; border: none; font-size: 18px; cursor: pointer; color: #999; padding: 0; line-height: 1;">×</button>
    `;
      const couponList = popup.querySelector('#coupon-list');

    // if (coupons.length > 0) {
    //   coupons.forEach(coupon => {
    //     const li = document.createElement('li');
    //     li.style.marginBottom = '6px';

    //     const span = document.createElement('span');
    //     span.textContent = coupon;
    //     li.appendChild(span);

    //     const button = document.createElement('button');
    //     button.textContent = 'Copy';
    //     button.style.marginLeft = '10px';
    //     button.style.cursor = 'pointer';

    //     button.addEventListener('click', () => {
    //       navigator.clipboard.writeText(coupon)
    //         .then(() => alert(`Copied: ${coupon}`))
    //         .catch(err => console.error('Failed to copy:', err));
    //     });

    //     li.appendChild(button);
    //     couponList.appendChild(li);
    //   });
    // } else {
    //   couponList.innerHTML = '<li>No discount codes found for this site.</li>';
    // }



    // Add the popup to the page
    document.body.appendChild(popup);
    console.log('Popup added to page');

    // Add animation after a brief delay
    setTimeout(() => {
      popup.style.transition = 'transform 0.5s ease, opacity 0.5s ease';
      popup.style.transform = 'translateX(0)';
      popup.style.opacity = '1';
      console.log('Animation applied');
    }, 100);

    // Add event listeners
    document.getElementById('badger-find-coupons').addEventListener('click', () => {
      console.log('Find coupons button clicked');
      isSearching = true;

      // Show progress bar
      const progressContainer = document.getElementById('badger-progress-container');
      progressContainer.style.display = 'block';

      // Change button text
      const button = document.getElementById('badger-find-coupons');
      button.textContent = 'Applying Coupon...';
      button.disabled = true;
      button.style.backgroundColor = '#cccccc';
      findAndTestCoupons(coupons);
    });

    document.getElementById('badger-close').addEventListener('click', () => {
      console.log('Close button clicked');
      document.getElementById('badger-popup').remove();
    });
  } else {
    console.log('Not a checkout page');
  }
}

// Call the initialization function when the content script loads
initializeBadger()
  // .then(response => response.json())
  .catch(error => {
  console.error('Error initializing Badger:', error);
  });

// Listen for messages from popup
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.action === "startCouponSearch") {
    isSearching = true;
    findAndTestCoupons(coupons);
  } else if (message.action === "stopCouponSearch") {
    isSearching = false;
  } else if (message.action === "getCurrentPrice") {
    const currentPrice = getCurrentPrice();
    sendResponse({ price: currentPrice });
    return true; // Required for async response
  }
});

// Function to update progress bar and status
function updateProgress(status, progress, savings = null) {
  const statusDiv = document.getElementById('badger-status');
  const progressBar = document.getElementById('badger-progress-bar');
  const savingsDiv = document.getElementById('badger-savings');
  
  if (statusDiv && progressBar) {
    statusDiv.textContent = status;
    progressBar.style.width = `${progress}%`;
    
    // Update savings display if provided
    if (savings !== null) {
      savingsDiv.textContent = `Total Savings: $${savings.toFixed(2)}`;
    }
  }
}

async function findAndTestCoupons(coupons) {
  const couponInput = findSingleElement(SELECTORS.input);
  if (!couponInput) {
    updateProgress("Could not find coupon input field on this page.", 100);
    return;
  }

  // Reset savings at start
  bestSavings = 0;
  bestCoupon = null;
  updateProgress("Starting coupon search...", 0, 0);

  // Store original price
  const originalPrice = getCurrentPrice();
  const totalCoupons = coupons.length;
  
  for (let i = 0; i < coupons.length; i++) {
    if (!isSearching) break;
    
    // const coupon = TEST_COUPONS[i];
    const coupon = coupons[i];
    const progress = ((i + 1) / totalCoupons) * 100;

    updateProgress(`Applying coupon: ${coupon}`, progress, bestSavings);
    
    // Fill and submit coupon
    const success = await fillAndSubmitCoupon(couponInput, coupon);
    if (!success) {
      updateProgress(`Failed to apply coupon: ${coupon}`, progress, bestSavings);
      continue;
    }
    
    // Wait for price update
    await wait(2000);
    
    // Check new price
    const newPrice = getCurrentPrice();
    const savings = originalPrice - newPrice;
    
    if (savings > bestSavings) {
      bestSavings = savings;
      bestCoupon = coupon;
    }

    // If we've tested all coupons, apply the best one
    if (i === totalCoupons - 1 && bestCoupon != coupon) {
      const success = await fillAndSubmitCoupon(couponInput, bestCoupon);
      if (success) {
        await wait(2000);
        const finalPrice = getCurrentPrice();
        const finalSavings = originalPrice - finalPrice;
        updateProgress(`Best coupon: ${bestCoupon} saves $${finalSavings.toFixed(2)}!`, 100, finalSavings);
        // Final update to total savings
        updateTotalSavings(originalPrice, finalPrice, bestCoupon);
      }    
      // Remove the popup after a delay
      setTimeout(() => {
        const popup = document.getElementById('badger-popup');
        if (popup) popup.remove();
      }, 2000);
      return;
    }else{
      updateProgress("No working coupons found.", 100, 0);
    }

    if( i === totalCoupons - 1 && bestCoupon == coupon){
      const finalPrice = getCurrentPrice();
      const finalSavings = originalPrice - finalPrice;
      updateProgress(`Best coupon: ${bestCoupon} saves $${finalSavings.toFixed(2)}!`, 100, finalSavings);
      
      // Final update to total savings
      updateTotalSavings(originalPrice, finalPrice, bestCoupon);
      
      // Remove the popup after a delay
      setTimeout(() => {
        const popup = document.getElementById('badger-popup');
        if (popup) popup.remove();
      }, 2000);
      return;
    }else if( coupon == null){
      updateProgress("No working coupons found.", 100, 0);

      setTimeout(() => {
        const popup = document.getElementById('badger-popup');
        if (popup) popup.remove();
      }, 2000);
      return;
    }
    
  }
}


function findElement(selectors) {
  if (!selectors) return null;
  if (Array.isArray(selectors)) {
    for (const selector of selectors) {
      const elements = document.querySelectorAll(selector);
      if (elements.length > 0) {
        return elements;
      }
    }
  }
  return null;
}

function findSingleElement(selectors) {
  if (!selectors) return null;
  if (Array.isArray(selectors)) {
    for (const selector of selectors) {
      const element = document.querySelector(selector);
      if (element) return element;
    }
  } else {
    return document.querySelector(selectors);
  }
  return null;
}

async function fillAndSubmitCoupon(input, code) {
  try {
    // Focus the input first
    input.focus();
    
    // Set the value directly and trigger input event
    input.value = code;
    input.dispatchEvent(new Event('input', { bubbles: true }));
    input.dispatchEvent(new Event('change', { bubbles: true }));
    
    await wait(500); // Wait for potential validation

    // Try to find the apply button
    let applyButton = document.querySelector('button[type="submit"][aria-label="Apply Discount Code"]');
    
    // If not found, try alternate method
    if (!applyButton) {
      applyButton = Array.from(document.querySelectorAll('button[type="submit"]')).find(button => 
        button.textContent.trim().toLowerCase() === 'apply' || 
        button.querySelector('span')?.textContent.trim().toLowerCase() === 'apply'
      );
    }

    if (!applyButton) {
      console.log("Could not find apply button on this page.");
      return false;
    }

    // Try multiple ways to trigger the button
    try {
      // First try: Direct click
      applyButton.click();
      
      // Second try: Create and dispatch mouse events
      const clickEvent = new MouseEvent('click', {
        view: window,
        bubbles: true,
        cancelable: true
      });
      applyButton.dispatchEvent(clickEvent);
      
      // Third try: If button is in a form, submit the form
      const form = applyButton.closest('form');
      if (form) {
        form.dispatchEvent(new Event('submit', { bubbles: true, cancelable: true }));
      }

      return true;
    } catch (clickError) {
      console.log("Click error:", clickError);
      return false;
    }
  } catch (error) {
    console.log("Error applying coupon:", error);
    return false;
  }
}

function getCurrentPrice() {
  const priceElements = findElement(SELECTORS.total);
  if (!priceElements) {
    return 0;
  }

  for (const element of priceElements) {
    const text = element.textContent;
    const match = text.match(/\$\s*(\d+\.?\d*)/);
    if (match) {
      return parseFloat(match[1]);
    }
  }
  
  return 0;
}

function sendStatus(status) {
  chrome.runtime.sendMessage({
    type: "couponResult",
    status: status,
    savings: bestSavings,
    currentPrice: getCurrentPrice()
  });
}

function wait(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

function isCheckoutPage() {
  const url = window.location.href.toLowerCase();
  const checkoutPaths = [
    '/checkouts',
    '/checkout',
    '/cart',
    '/basket',
    '/payment',
    '/gp/buy',     // Amazon specific
    '/order'
    // '/shop' shopify
  ];
  
  return checkoutPaths.some(path => url.includes(path));
}
