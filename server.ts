/**
 * Express + Vite Full-Stack Server for Wonder World Kids Learning
 * Features:
 * 1. Download tracking API (/api/download-zip)
 * 2. Analytics & Sales Stats API (/api/admin/stats)
 * 3. PayPal Server-Side Checkout & Tax Capture API (/api/paypal/capture-order)
 * 4. Mounts Vite dev middleware in development
 */

import express from 'express';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = Number(process.env.PORT) || 3000;

app.use(express.json());

// In-memory / file-persisted stats store
const STATS_FILE = path.join(__dirname, 'stats.json');

interface AppStats {
  zipDownloads: number;
  pwaInstalls: number;
  purchases: number;
  revenueUsd: number;
  lastUpdated: string;
}

function loadStats(): AppStats {
  try {
    if (fs.existsSync(STATS_FILE)) {
      const data = fs.readFileSync(STATS_FILE, 'utf-8');
      return JSON.parse(data);
    }
  } catch (err) {
    console.error('Error loading stats:', err);
  }
  return { zipDownloads: 0, pwaInstalls: 0, purchases: 0, revenueUsd: 0, lastUpdated: new Date().toISOString() };
}

function saveStats(stats: AppStats) {
  try {
    stats.lastUpdated = new Date().toISOString();
    fs.writeFileSync(STATS_FILE, JSON.stringify(stats, null, 2));
  } catch (err) {
    console.error('Error saving stats:', err);
  }
}

// 1. Legacy Zip Download Route Deprecated (PWA Only)
app.get('/api/download-zip', (req, res) => {
  res.status(410).json({
    success: false,
    message: 'Direct ZIP code downloads have been discontinued. Wonder World Kids installs directly as a 100% offline Progressive Web App (PWA) with full local caching.'
  });
});

// Explicit SEO handlers for Googlebot, Bingbot & Search Console
app.get('/sitemap.xml', (req, res) => {
  const sitemapPath = path.join(__dirname, 'public', 'sitemap.xml');
  if (fs.existsSync(sitemapPath)) {
    res.setHeader('Content-Type', 'application/xml; charset=utf-8');
    res.sendFile(sitemapPath);
  } else {
    res.status(404).send('sitemap.xml not found');
  }
});

app.get('/robots.txt', (req, res) => {
  const robotsPath = path.join(__dirname, 'public', 'robots.txt');
  if (fs.existsSync(robotsPath)) {
    res.setHeader('Content-Type', 'text/plain; charset=utf-8');
    res.sendFile(robotsPath);
  } else {
    res.status(404).send('robots.txt not found');
  }
});

// 2. Track PWA Installation Event
app.post('/api/track-pwa-install', (req, res) => {
  const stats = loadStats();
  stats.pwaInstalls += 1;
  saveStats(stats);
  res.json({ success: true, totalPwaInstalls: stats.pwaInstalls });
});

// 3. Record Successful Purchase & License Generation
app.post('/api/record-purchase', (req, res) => {
  const { transactionId, amount, country } = req.body;
  const stats = loadStats();
  stats.purchases += 1;
  stats.revenueUsd += amount || 9;
  saveStats(stats);

  res.json({
    success: true,
    totalPurchases: stats.purchases,
    totalRevenue: stats.revenueUsd,
    licenseKey: `WWK-${Math.random().toString(36).substring(2, 8).toUpperCase()}-${Date.now().toString().slice(-4)}`
  });
});

// 4. Gumroad License Verification Proxy
app.post('/api/verify-license', async (req, res) => {
  const { license_key, product_permalink = 'wvpisb' } = req.body;
  if (!license_key) {
    return res.status(400).json({ success: false, message: 'License key is required.' });
  }

  try {
    const formData = new URLSearchParams();
    formData.append('product_permalink', product_permalink);
    formData.append('license_key', license_key);
    formData.append('increment_uses_count', 'false');

    const gumroadRes = await fetch('https://api.gumroad.com/v2/licenses/verify', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: formData.toString()
    });

    const data = await gumroadRes.json();
    res.status(gumroadRes.status).json(data);
  } catch (err: any) {
    console.error('Error verifying Gumroad license on server:', err);
    res.status(500).json({ success: false, message: 'Failed to contact Gumroad license server.' });
  }
});

// 5. Admin Analytics Stats Endpoint
app.get('/api/admin/stats', (req, res) => {
  const stats = loadStats();
  res.json({
    ...stats,
    pricePerLicense: 9,
    currency: 'USD'
  });
});

// Static Assets & Production / Dev Handler
const distPath = path.join(__dirname, 'dist');
const isProduction = process.env.NODE_ENV === 'production';

if (isProduction && fs.existsSync(distPath)) {
  app.use(express.static(distPath));
  app.get('*', (req, res) => {
    res.sendFile(path.join(distPath, 'index.html'));
  });
} else {
  const { createServer: createViteServer } = await import('vite');
  const vite = await createViteServer({
    server: { middlewareMode: true },
    appType: 'spa'
  });
  app.use(vite.middlewares);
}

app.listen(PORT, '0.0.0.0', () => {
  console.log(`Wonder World Kids Learning Server running at http://localhost:${PORT}`);
});
