import { createClient } from 'redis';

const client = createClient({
    username: 'default',
    password: 'REDACTED',
    socket: {
        host: 'redis-11988.c15.us-east-1-2.ec2.redns.redis-cloud.com',
        port: 11988
    }
});

client.on('error', err => console.log('Redis Client Error', err));

await client.connect();

const redisKey = 'site:www.allbirds.com';
const [tab] = chrome.tabs.query({ active: true, currentWindow: true });

//   if (!tab || !tab.url) return;

//   const hostname = new URL(tab.url).hostname;
//   const redisKey = `site:${hostname}:coupons`;

//   // Get discount codes
//   const codes = client.sMembers(redisKey);

//   if (codes.length > 0) {
//     if (message.action === "openPopup") {
//     // Open the popup for the current tab
//     chrome.action.openPopup();
    
    
//     // Send the cart total to the popup
//     chrome.runtime.sendMessage({
//       action: "showPopup",
//       cartTotal: message.cartTotal
//     });
//   }

// Fetch members of the 'coupons' set from the given key
const coupons = await client.sMembers(`${redisKey}:coupons`);

console.log('Discount codes:', coupons);

if (coupons.length === 0) {
      console.log('No discount codes found.');
    } else {
      console.log('Discount codes:', coupons);
    }
// console.log(value);  // >>> bar

