// server.js
import { createClient } from 'redis';
import express from 'express';
import cors from 'cors';

const app = express();
const port = 3000;

app.use(cors());

const client = createClient({
    username: 'default',
    password: 'REDACTED',
    socket: {
        host: 'redis-11988.c15.us-east-1-2.ec2.redns.redis-cloud.com',
        port: 11988
    }
});

client.on('error', err => console.log('Redis Client Error', err));

app.get('/api/coupons', async (req, res) => {
    const hostname = req.query.site;
    if (!hostname) {
        return res.status(400).send('Missing site hostname.');
    }

    try {
        if (!client.isReady) {
            await client.connect();
        }

        const redisKey = `site:${hostname}:coupons`;
        const coupons = await client.sMembers(redisKey);
        console.log(`Fetched coupons for ${hostname}:`, coupons);

        res.json({ coupons });
    } catch (err) {
        console.error('Error fetching coupons:', err);
        res.status(500).send('Internal Server Error.');
    }
});

app.listen(port, () => {
    console.log(`Server listening at http://localhost:${port}`);
});