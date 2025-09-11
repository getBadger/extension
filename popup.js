document.addEventListener('DOMContentLoaded', function() {
  const findCouponsButton = document.getElementById('findCoupons');
  const stopSearchButton = document.getElementById('stopSearch');
  const statusDiv = document.getElementById('status');
  const savingsDiv = document.getElementById('savings');
  const totalDiv = document.getElementById('cart-total');
  let isSearching = false;

  // Get current price when popup opens
  chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
    const currentUrl = tabs[0].url;
    
      // Request current price from content script
      chrome.tabs.sendMessage(tabs[0].id, { action: "getCurrentPrice" }, function(response) {
        if (response && response.price) {
          totalDiv.textContent = `Cart Total: $${response.price.toFixed(2)}`;
        }
      });
    
  });

  findCouponsButton.addEventListener('click', async function() {
    isSearching = true;
    findCouponsButton.style.display = 'none';
    stopSearchButton.style.display = 'block';
    
    const tabs = await chrome.tabs.query({active: true, currentWindow: true});
    const currentTab = tabs[0];

    // Send message to content script to start coupon search
    chrome.tabs.sendMessage(currentTab.id, {
      action: "startCouponSearch"
    });

    statusDiv.textContent = "Searching for coupons...";
  });

  stopSearchButton.addEventListener('click', async function() {
    isSearching = false;
    findCouponsButton.style.display = 'block';
    stopSearchButton.style.display = 'none';

    const tabs = await chrome.tabs.query({active: true, currentWindow: true});
    const currentTab = tabs[0];

    // Send message to content script to stop coupon search
    chrome.tabs.sendMessage(currentTab.id, {
      action: "stopCouponSearch"
    });

    statusDiv.textContent = "Coupon search stopped.";
  });

  // Listen for messages from content script
  chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    console.log('Received message:', message);
    
    if (message.type === "couponResult") {
      statusDiv.textContent = message.status;
      if (message.savings) {
        savingsDiv.textContent = `Total Savings: $${message.savings.toFixed(2)}`;
      }
    }
    
    // Handle cart total updates
    if (message.cartTotal) {
      console.log('Updating cart total:', message.cartTotal.toFixed(2));
      totalDiv.textContent = `Cart Total: $${message.cartTotal.toFixed(2)}`;
    }

    if (message.type === "couponApplied") {
      const foundCouponButton = document.getElementById('foundCoupon');
      const stopSearchButton = document.getElementById('stopSearch');
      stopSearchButton.style.display = 'none';
      foundCouponButton.style.display = 'block';
    }

    if (message.type === "noDiscounts") {
      const noDiscountsButton = document.getElementById('noDiscounts');
      noDiscountsButton.style.display = 'block';
    }
  
  });

});




// popup.js
// document.addEventListener('DOMContentLoaded', () => {
//     const couponList = document.getElementById('coupon-list');

//     chrome.runtime.onMessage.addListener((message) => {
//         if (message.action === "showPopup") {
//             if (message.coupons && message.coupons.length > 0) {
//                 couponList.innerHTML = ''; // Clear previous content
//                 message.coupons.forEach(coupon => {
//                     const li = document.createElement('li');
//                     li.textContent = coupon;
//                     couponList.appendChild(li);
//                 });
//             } else {
//                 couponList.textContent = 'No discount codes found for this site.';
//             }
//         }
//     });

//     // You can also request data when the popup is opened
//     // This is more common
//     chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
//         const tab = tabs[0];
//         if (tab && tab.url) {
//             const hostname = new URL(tab.url).hostname;
//             const apiEndpoint = `http://localhost:3000/api/coupons?site=${hostname}`;

//             fetch(apiEndpoint)
//                 .then(response => response.json())
//                 .then(data => {
//                     if (data.coupons && data.coupons.length > 0) {
//                         couponList.innerHTML = '';
//                         data.coupons.forEach(coupon => {
//                             const li = document.createElement('li');
//                             li.textContent = coupon;
//                             couponList.appendChild(li);
//                         });
//                     } else {
//                         couponList.textContent = 'No discount codes found for this site.';
//                     }
//                 })
//                 .catch(error => {
//                     console.error('Error fetching coupons:', error);
//                     couponList.textContent = 'Error fetching data.';
//                 });
//         }
//     });
// });
  