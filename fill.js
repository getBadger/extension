import { createClient } from 'redis';

const client = createClient({
  username: 'default',
  password: process.env.REDIS_PASSWORD,
  socket: {
    host: 'redis-11988.c15.us-east-1-2.ec2.redns.redis-cloud.com',
    port: 11988
  }
});

client.on('error', err => console.error('Redis Client Error', err));

await client.connect();

// Dummy coupon entries
const dummyCoupons = [
  {
    merchant_id: '12',
    site: 'www.allbirds.com',
    coupons: [
      {
        id: '1001',
        code: 'SAVE10',
        status: '0',
        expires_at: '2025-12-31T23:59:59Z',
        sources: ['store']
      },
      {
        id: '1002',
        code: 'AFF-First15',
        status: '0',
        expires_at: '2025-10-01T00:00:00Z',
        sources: ['partner']
      }
    ]
  },
  {
    merchant_id: '13',
    site: 'www.amazon.com',
    coupons: [
      {
        id: '2001',
        code: 'WELCOME20',
        status: '0',
        expires_at: '2026-01-01T00:00:00Z',
        sources: ['user', 'partner']
      },
      {
        id: '2002',
        code: 'HOLIDAY25',
        status: '0',
        expires_at: '2025-11-15T00:00:00Z',
        sources: ['affiliate']
      }
    ]
  }
];

// Helper to add each coupon
for (const siteEntry of dummyCoupons) {
  const { merchant_id, site, coupons } = siteEntry;

  // Set merchant ID (optional global key)
  await client.set(`merchant:${site}`, merchant_id);

  for (const coupon of coupons) {
    const { id, code, status, expires_at, sources } = coupon;

    const couponKey = `code:${merchant_id}:${code.toLowerCase()}`;

    // 1. Save hash data
    await client.hSet(couponKey, {
      id,
      code,
      status,
      expires_at
    });

    // 2. Save sources
    await client.sAdd(`${couponKey}:source`, ...sources);

    // 3. Add code to site-to-coupons mapping (this is the key your API will likely use)
    // This creates a list of codes per site
    await client.sAdd(`site:${site}:coupons`, code.toLowerCase());
  }
}

console.log("✅ Dummy coupons populated.");
await client.quit();
