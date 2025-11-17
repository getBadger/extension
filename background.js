import { createClient } from 'redis';

// Redis configuration
const redisConfig = {
    username: 'default',
    password: process.env.REDIS_PASSWORD,
    socket: {
        host: 'redis-11988.c15.us-east-1-2.ec2.cloud.redislabs.com',
        port: 11988
    }
};

let redisClient = null;

// Initialize Redis connection
async function initRedis() {
    if (!redisClient) {
        redisClient = createClient(redisConfig);
        redisClient.on('error', err => console.log('Redis Client Error', err));
        await redisClient.connect();
    }
    return redisClient;
}

// Initialize extension when installed
chrome.runtime.onInstalled.addListener(() => {
    console.log('Badger extension installed');
    initRedis();
});

// Listen for messages from content script
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if (message.action === "openPopup") {
        chrome.action.openPopup();
        chrome.runtime.sendMessage({
            action: "showPopup",
            cartTotal: message.cartTotal
        });
    }
});

// Check for coupons in Redis when page loads
chrome.tabs.onUpdated.addListener(async (tabId, changeInfo, tab) => {
    if (changeInfo.status === 'complete' && tab.url) {
        try {
            const hostname = new URL(tab.url).hostname;
            const redisKey = `site:www.${hostname}:coupons`;
            
            const client = await initRedis();
            const coupons = await client.smembers(redisKey);
            
            if (coupons && coupons.length > 0) {
                console.log(`✅ Found ${coupons.length} coupons for ${hostname}`);
                
                // Fetch coupon details
                const couponDetails = [];
                for (const code of coupons) {
                    const details = await client.hgetall(`coupon:${code}`);
                    if (details) {
                        couponDetails.push(details);
                    }
                }
                
                // Update badge to show coupon count
                chrome.action.setBadgeText({ text: coupons.length.toString(), tabId });
                chrome.action.setBadgeBackgroundColor({ color: '#4CAF50', tabId });
                
                // Send coupons to popup
                chrome.runtime.sendMessage({
                    action: "showPopup",
                    coupons: couponDetails,
                    count: coupons.length
                }).catch(() => {
                    // Popup not open yet, that's fine
                });
            } else {
                // No coupons found, hide the extension
                chrome.action.disable(tabId);
                console.log(`❌ No coupons found for ${hostname}`);
            }
        } catch (error) {
            console.error('Error checking coupons:', error);
        }
    }
});