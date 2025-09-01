// Initialize extension when installed
chrome.runtime.onInstalled.addListener(() => {
  console.log('Badger extension installed');
});

// Listen for messages from content script
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.action === "openPopup") {
    // Open the popup for the current tab
    chrome.action.openPopup();
    
    
    // Send the cart total to the popup
    chrome.runtime.sendMessage({
      action: "showPopup",
      cartTotal: message.cartTotal
    });
  }
}); 
 

chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
    if (changeInfo.status === 'complete' && tab.url.includes('checkout')) {
        const hostname = new URL(tab.url).hostname;
        const apiEndpoint = `http://localhost:3000/api/coupons?site=${hostname}`;

        fetch(apiEndpoint)
            .then(response => response.json())
            .then(data => {
                if (data.coupons && data.coupons.length > 0) {
                    // Send a message to the popup or open it
                    console.log('Discount codes found:', data.coupons);
                    // Open the popup if you want it to appear automatically
                    // Note: Chrome doesn't allow programmatic popup opening for security reasons,
                    // but you can show a badge or update the popup's content
                    chrome.runtime.sendMessage({ action: "showPopup", coupons: data.coupons });
                } else {
                    console.log('No discount codes found.');
                }
            })
            .catch(error => console.error('Error fetching coupons:', error));
    }
});