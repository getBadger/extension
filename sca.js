// const hostname = new URL(tab.url).hostname;
const hostname = "www.allbirds.com";
// const apiEndpoint = `http://localhost:3000/api/coupons?site=${hostname}`;
const apiEndpoint = `https://ubiquitous-potato-xv9r64v466j367g-3000.app.github.dev/api/coupons?site=${hostname}`;

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
                } })
            .catch(error => console.error('Error fetching coupons:', error));