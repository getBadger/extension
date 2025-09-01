// let availableDeals = [
//   { code: "AFF-FIRST15", discount: "15", description: "15% off your first order" },
//   { code: "SAVE10", discount: "10%", description: "10% off your order" },
//   { code: "FREESHIP", discount: "Free Shipping", description: "Free shipping on your order" },
//   { code: "SAVE25", discount: "25%", description: "25% off orders over $100" },

//   ];
  
// let currentDeal = null;

// // Listen for the popup to open and send the available deals
// chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
//   if (request.action === "getDeals") {
//     sendResponse({ availableDeals, currentDeal });
//   } else if (request.action === "applyDeal") {
//     currentDeal = request.deal;
//     sendResponse({ success: true, appliedDeal: currentDeal });
//   }
// });

// Initialize extension when installed
chrome.runtime.onInstalled.addListener(() => {
  console.log('Badger extension installed');
});

// Listen for tab updates to check if we're on a shopping site
chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
  if (changeInfo.status === 'complete' && tab.url) {
   
    // if (tab.url.toLowerCase().includes('checkout') || tab.url.toLowerCase().includes('shop')) {
    //   // Update the extension icon to indicate it's active
    //   chrome.action.setIcon({
    //     path: {
    //       "16": "images/badger_icon_active_16.png",
    //       "32": "images/badger_icon_active_32.png",
    //       "48": "images/badger_icon_active_48.png",
    //       "128": "images/badger_icon_active_128.png"
    //     },
    //     tabId: tabId
    //   });
    // } else {
    //   // Reset to default icon
    //   chrome.action.setIcon({
    //     path: {
    //       "16": "images/badger_icon_16.png",
    //       "32": "images/badger_icon_32.png",
    //       "48": "images/badger_icon_48.png",
    //       "128": "images/badger_icon_128.png"
    //     },
    //     tabId: tabId
    //   });
    // }
  }
});

// Listen for messages from content script
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.type === "couponResult") {
    // You could store statistics here
    console.log(`Coupon result: ${message.status}`);
    if (message.savings > 0) {
      console.log(`Total savings: $${message.savings.toFixed(2)}`);
    }
  }
});



// chrome.tabs.onUpdated.addListener(async (tabId, info, tab) => {
//   if (!tab.url) return;
//   const url = new URL(tab.url);
//   // Enables the side panel on google.com
//   if (url.origin === GOOGLE_ORIGIN) {
//     await chrome.sidePanel.setOptions({
//       tabId,
//       path: 'sidepanel.html',
//       enabled: true
//     });
//   } else {
//     // Disables the side panel on all other sites
//     await chrome.sidePanel.setOptions({
//       tabId,
//       enabled: false
//     });
//   }
// });

// Allows users to open the side panel by clicking on the action toolbar icon
// chrome.sidePanel
//   .setPanelBehavior({ openPanelOnActionClick: true })
//   .catch((error) => console.error(error));
  