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