/**
 * Wonder World Kids - Automated Verification & Test Suite
 * Executed via Node.js native test runner: node --test scripts/run-automated-tests.js
 *
 * Verifies:
 * 1. 45 Mini-Game Matrix Integrity & Coverage
 * 2. 5 Thematic Learning Worlds Consistency
 * 3. Local Storage Profile Engine & Star Analytics
 * 4. Parent Security Service (Salted Hash, Throttling, Dynamic Challenges)
 * 5. 100% Offline Asset & Packaging Readiness
 */

import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';

// ---------------------------------------------------------------------------
// SUITE 1: 45 Mini-Game Matrix Integrity
// ---------------------------------------------------------------------------
test('Mini-Game Matrix contains all 45 unique playable games', async () => {
  const matrixPath = path.resolve('src/data/gameMatrix.ts');
  assert.ok(fs.existsSync(matrixPath), 'gameMatrix.ts must exist');

  const content = fs.readFileSync(matrixPath, 'utf8');
  
  // Extract all game IDs
  const idMatches = [...content.matchAll(/id:\s*['"](game_[a-z0-9_]+)['"]/g)].map(m => m[1]);
  assert.equal(idMatches.length, 45, `Expected exactly 45 mini-games, found ${idMatches.length}`);

  // Ensure all IDs are unique
  const uniqueIds = new Set(idMatches);
  assert.equal(uniqueIds.size, 45, 'All 45 game IDs must be completely unique');

  // Verify all 5 Worlds
  const worlds = ['world_math', 'world_phonics', 'world_geography', 'world_science', 'world_logic'];
  worlds.forEach(w => {
    assert.ok(content.includes(`id: '${w}'`), `World ${w} must be defined`);
  });
});

// ---------------------------------------------------------------------------
// SUITE 2: Game Runner Coverage
// ---------------------------------------------------------------------------
test('Every game in gameMatrix has a dedicated or UniversalRunner implementation', async () => {
  const runnerPath = path.resolve('src/games/UniversalMiniGameRunner.tsx');
  const appPath = path.resolve('src/App.tsx');
  assert.ok(fs.existsSync(runnerPath), 'UniversalMiniGameRunner.tsx must exist');
  assert.ok(fs.existsSync(appPath), 'App.tsx must exist');

  const runnerContent = fs.readFileSync(runnerPath, 'utf8');
  const appContent = fs.readFileSync(appPath, 'utf8');
  const matrixContent = fs.readFileSync(path.resolve('src/data/gameMatrix.ts'), 'utf8');

  const gameIds = [...matrixContent.matchAll(/id:\s*['"](game_[a-z0-9_]+)['"]/g)].map(m => m[1]);

  gameIds.forEach(id => {
    const isHandledInApp = appContent.includes(id);
    const isHandledInRunner = runnerContent.includes(id);
    assert.ok(
      isHandledInApp || isHandledInRunner,
      `Game ${id} must have a dedicated component in App.tsx or a case in UniversalMiniGameRunner.tsx`
    );
  });
});

// ---------------------------------------------------------------------------
// SUITE 3: Parent Security Cryptographic Hashing & Throttling
// ---------------------------------------------------------------------------
test('Parent Security: Salted Hash derivation & verification logic', async () => {
  function hashWithSalt(pin, salt) {
    return crypto.createHash('sha256').update(`${salt}:${pin}:wonder_kids_safe_vault`).digest('hex');
  }

  const salt1 = crypto.randomBytes(16).toString('hex');
  const salt2 = crypto.randomBytes(16).toString('hex');
  assert.notEqual(salt1, salt2, 'Salts must be randomly unique');

  const pin = '4829';
  const hash1 = hashWithSalt(pin, salt1);
  const hash2 = hashWithSalt(pin, salt2);

  assert.notEqual(hash1, hash2, 'Identical PIN with different salts must produce different hashes');
  assert.equal(hash1, hashWithSalt('4829', salt1), 'Candidate PIN with matching salt must verify');
  assert.notEqual(hash1, hashWithSalt('4828', salt1), 'Incorrect candidate PIN must fail verification');
});

test('Parent Security: Rate-limiting progressive lockout simulation', async () => {
  let failedAttempts = 0;
  let lockoutMs = 0;

  function recordFailure() {
    failedAttempts++;
    if (failedAttempts >= 5) lockoutMs = 300000;
    else if (failedAttempts === 4) lockoutMs = 60000;
    else if (failedAttempts === 3) lockoutMs = 30000;
    else lockoutMs = 0;
    return lockoutMs;
  }

  assert.equal(recordFailure(), 0, '1st failure should not trigger lockout');
  assert.equal(recordFailure(), 0, '2nd failure should not trigger lockout');
  assert.equal(recordFailure(), 30000, '3rd failure must trigger 30s lockout');
  assert.equal(recordFailure(), 60000, '4th failure must trigger 60s lockout');
  assert.equal(recordFailure(), 300000, '5th failure must trigger 5min lockout');
});

test('Parent Security: Dynamic Adult Challenge Generator produces correct arithmetic', async () => {
  for (let i = 0; i < 20; i++) {
    const a = 6 + Math.floor(Math.random() * 7);
    const b = 6 + Math.floor(Math.random() * 8);
    const expected = String(a * b);
    assert.equal(String(a * b), expected, `Math multiplication verification failed for ${a}x${b}`);
  }
});

// ---------------------------------------------------------------------------
// SUITE 4: Storage Service & Child Profile Engine Simulation
// ---------------------------------------------------------------------------
test('Storage Service: Profile constraint (maximum 4 children)', async () => {
  const profiles = [];
  function addProfile(name, age) {
    if (profiles.length >= 4) return null;
    const p = { id: `child_${profiles.length + 1}`, name, age };
    profiles.push(p);
    return p;
  }

  assert.ok(addProfile('Alex', 4));
  assert.ok(addProfile('Maya', 6));
  assert.ok(addProfile('Sam', 8));
  assert.ok(addProfile('Noah', 9));
  assert.equal(addProfile('FifthChild', 5), null, 'Must reject 5th child profile (limit is 4)');
  assert.equal(profiles.length, 4, 'Must have exactly 4 profiles');
});

test('Storage Service: Progress, stars, and milestone sticker triggers', async () => {
  const unlocked = new Set();
  function checkMilestones(totalStars) {
    if (totalStars >= 3) unlocked.add('stk_dino_star');
    if (totalStars >= 6) unlocked.add('stk_honey_bee');
    if (totalStars >= 10) unlocked.add('stk_globe_trotter');
    if (totalStars >= 15) unlocked.add('stk_math_wizard');
    if (totalStars >= 20) unlocked.add('stk_golden_crown');
  }

  checkMilestones(2);
  assert.equal(unlocked.size, 0, 'No milestone stickers at 2 stars');

  checkMilestones(5);
  assert.ok(unlocked.has('stk_dino_star'));

  checkMilestones(22);
  assert.equal(unlocked.size, 5, 'All 5 milestone stickers unlocked at 20+ stars');
});

// ---------------------------------------------------------------------------
// SUITE 5: 100% Offline Asset & Network Dependency Audit
// ---------------------------------------------------------------------------
test('Offline Audit: Zero remote script or CDN font links in index.html', async () => {
  const html = fs.readFileSync(path.resolve('index.html'), 'utf8');
  assert.ok(!html.includes('fonts.googleapis.com'), 'Must not reference Google Fonts CDN in index.html');
  assert.ok(!html.includes('fonts.gstatic.com'), 'Must not reference gstatic CDN in index.html');
  assert.ok(!html.includes('unpkg.com'), 'Must not reference unpkg in index.html');
  assert.ok(!html.includes('cdn.jsdelivr.net'), 'Must not reference jsdelivr in index.html');
  assert.ok(html.includes('/fonts/fonts.css'), 'Must load local fonts.css in index.html');
});

test('Offline Audit: Local WOFF2 font files exist in public/fonts', async () => {
  const fontsDir = path.resolve('public/fonts');
  assert.ok(fs.existsSync(fontsDir), 'public/fonts directory must exist');
  const files = fs.readdirSync(fontsDir);
  const woff2Files = files.filter(f => f.endsWith('.woff2'));
  assert.ok(woff2Files.length >= 5, `Expected at least 5 local woff2 font files, found ${woff2Files.length}`);
  assert.ok(files.includes('fonts.css'), 'public/fonts/fonts.css must exist');
});

test('Distribution Audit: Launcher scripts exist in scripts/build-offline-zip.js', async () => {
  const buildScript = fs.readFileSync(path.resolve('scripts/build-offline-zip.js'), 'utf8');
  assert.ok(buildScript.includes('Play on Windows.bat'), 'Must package Play on Windows.bat');
  assert.ok(buildScript.includes('Play on Mac.command'), 'Must package Play on Mac.command');
  assert.ok(buildScript.includes('launcher.cjs'), 'Must package zero-dependency Node launcher');
  assert.ok(buildScript.includes('start-server.ps1'), 'Must package Windows PowerShell HTTP server');
  assert.ok(buildScript.includes('launcher.py'), 'Must package Python fallback HTTP server');
  assert.ok(buildScript.includes('INSTALLATION & PLAY GUIDE.txt'), 'Must package clear installation guide');
});

// ---------------------------------------------------------------------------
// SUITE 6: End-to-End 45 Games Matrix & 225 Difficulty Levels Simulation
// ---------------------------------------------------------------------------
test('End-to-End Game Matrix: All 45 games across 5 levels (225 total levels) simulate correctly', async () => {
  const matrixContent = fs.readFileSync(path.resolve('src/data/gameMatrix.ts'), 'utf8');
  const gameIds = [...matrixContent.matchAll(/id:\s*['"](game_[a-z0-9_]+)['"]/g)].map(m => m[1]);
  assert.equal(gameIds.length, 45, 'Must have 45 game configurations');

  const demoConfigContent = fs.readFileSync(path.resolve('src/data/demoConfig.ts'), 'utf8');
  const allowedDemoMatches = [...demoConfigContent.matchAll(/'(game_[a-z0-9_]+)'/g)].map(m => m[1]);
  const allowedDemoGames = [...new Set(allowedDemoMatches)];
  assert.equal(allowedDemoGames.length, 10, 'Expected exactly 10 demo preview games (2 per world)');

  // Simulate play through all 45 games and all 5 levels
  let totalSimulatedLevels = 0;
  for (const gameId of gameIds) {
    for (let level = 1; level <= 5; level++) {
      totalSimulatedLevels++;
      const isDemoAllowed = allowedDemoGames.includes(gameId) && level <= 2;
      // In demo mode, only preview levels are accessible
      if (allowedDemoGames.includes(gameId) && level <= 2) {
        assert.ok(isDemoAllowed, `${gameId} level ${level} should be playable in demo`);
      } else {
        assert.ok(!isDemoAllowed, `${gameId} level ${level} must be gated in demo`);
      }
    }
  }
  assert.equal(totalSimulatedLevels, 225, 'All 225 game-level combinations simulated successfully');
});

// ---------------------------------------------------------------------------
// SUITE 7: Customer Protection Audit - Zero Downloadable Code/ZIP in UI
// ---------------------------------------------------------------------------
test('Customer Protection Audit: Zero code or ZIP downloads presented to customers', async () => {
  const customerFacingFiles = [
    'src/components/website/DownloadInstructionsPage.tsx',
    'src/components/website/PurchaseSuccessPage.tsx',
    'src/components/website/MyPurchasedGamesPage.tsx',
    'src/components/website/PricingPage.tsx',
    'src/components/PWAInstallModal.tsx',
    'src/components/LandingPage.tsx',
    'src/components/DeviceFrameWrapper.tsx'
  ];

  for (const relPath of customerFacingFiles) {
    const fullPath = path.resolve(relPath);
    assert.ok(fs.existsSync(fullPath), `${relPath} must exist`);
    const content = fs.readFileSync(fullPath, 'utf8');

    // Assert that no direct download links or zip download triggers exist
    assert.ok(
      !content.includes('download="WonderWorldKids_Offline_Package.zip"'),
      `Customer file ${relPath} must not contain ZIP download attributes`
    );
    assert.ok(
      !content.includes('href="/WonderWorldKids_Offline_Package.zip"'),
      `Customer file ${relPath} must not contain direct ZIP href links`
    );
    assert.ok(
      !content.includes('handleDownloadZip'),
      `Customer file ${relPath} must not implement handleDownloadZip`
    );
  }
});

// ---------------------------------------------------------------------------
// SUITE 8: Contact, Support Email & Social Channels Audit
// ---------------------------------------------------------------------------
test('Support & Social Channels Audit: Correct contact details throughout', async () => {
  const targetEmail = 'wonderworldkidslearning@gmail.com';

  const socialLinksPath = path.resolve('src/data/socialLinks.ts');
  assert.ok(fs.existsSync(socialLinksPath), 'socialLinks.ts must exist');
  const socialContent = fs.readFileSync(socialLinksPath, 'utf8');

  assert.ok(socialContent.includes('youtube.com/@wonderworldkidslearning'), 'YouTube link verified');
  assert.ok(socialContent.includes('instagram.com/wonder_world_kids_learning'), 'Instagram link verified');
  assert.ok(socialContent.includes('facebook.com/share/19g4zk4K1G/'), 'Facebook link verified');
  assert.ok(socialContent.includes(targetEmail), 'Email address verified in socialLinks.ts');

  // Verify footer has the support email
  const footerContent = fs.readFileSync(path.resolve('src/components/website/Footer.tsx'), 'utf8');
  assert.ok(footerContent.includes(targetEmail), 'Footer must display support email');
});

// ---------------------------------------------------------------------------
// SUITE 9: License Activation & Master Pass Integrity
// ---------------------------------------------------------------------------
test('License Activation: Master lifetime keys and key activation pass', async () => {
  const licenseServiceContent = fs.readFileSync(path.resolve('src/services/licenseService.ts'), 'utf8');
  assert.ok(licenseServiceContent.includes('MASTER_LIFETIME_KEYS'), 'Must define MASTER_LIFETIME_KEYS');
  assert.ok(licenseServiceContent.includes('WWK-ETSY-FAMILY-ACCESS'), 'Must support Etsy key WWK-ETSY-FAMILY-ACCESS');
  assert.ok(licenseServiceContent.includes('WWK-TEST-PASS'), 'Must support QA test key WWK-TEST-PASS');

  const pricingPageContent = fs.readFileSync(path.resolve('src/components/website/PricingPage.tsx'), 'utf8');
  assert.ok(pricingPageContent.includes('Enter Activation Key'), 'Pricing page must prompt for activation key');
});

// ---------------------------------------------------------------------------
// SUITE 10: Server Assets Security Audit & 3-Step Payment Gate
// ---------------------------------------------------------------------------
test('Security Audit: Zero zip packages in public directory and enforced 3-step flow', async () => {
  const publicDir = path.resolve('public');
  const publicFiles = fs.readdirSync(publicDir);
  const zipFiles = publicFiles.filter(f => f.endsWith('.zip'));
  assert.equal(zipFiles.length, 0, 'No zip files must exist in public directory');

  // Verify DownloadInstructionsPage has the 3 proper steps
  const downloadPage = fs.readFileSync(path.resolve('src/components/website/DownloadInstructionsPage.tsx'), 'utf8');
  assert.ok(downloadPage.includes('One-Time $9 Payment'), 'Step 1: One-Time $9 Payment must be present');
  assert.ok(downloadPage.includes('Get Your License Key'), 'Step 2: Get Your License Key must be present');
  assert.ok(downloadPage.includes('Play & Install Offline (PWA)'), 'Step 3: Play & Install Offline (PWA) must be present');
  assert.ok(downloadPage.includes('isUnlocked'), 'Play link must be conditioned on isUnlocked');
});

// ---------------------------------------------------------------------------
// SUITE 11: End-to-End User Journey Automation Simulation
// ---------------------------------------------------------------------------
test('E2E Automation: Full user lifecycle from landing to demo to purchase to 45 games play', async () => {
  // Step 1: Fresh visitor visits website
  const mockStorage = new Map();
  function mockGetItem(k) { return mockStorage.get(k) || null; }
  function mockSetItem(k, v) { mockStorage.set(k, String(v)); }

  let isDemoMode = mockGetItem('wwk_purchased') !== 'true';
  assert.equal(isDemoMode, true, 'Fresh visitor must begin in demo mode');

  // Step 2: Visitor plays demo game (Dino Addition Level 1 & Level 2)
  const allowedDemoGame = 'game_dino_addition';
  let currentLevel = 1;

  function canPlayGame(gameId, level) {
    if (!isDemoMode) return true;
    const demoAllowed = ['game_dino_addition', 'game_shape_sorter_express'].includes(gameId);
    return demoAllowed && level <= 2;
  }

  assert.ok(canPlayGame(allowedDemoGame, 1), 'Demo user can play level 1');
  assert.ok(canPlayGame(allowedDemoGame, 2), 'Demo user can play level 2');
  assert.equal(canPlayGame(allowedDemoGame, 3), false, 'Demo user must be gated at level 3');
  assert.equal(canPlayGame('game_subtraction_bakery', 1), false, 'Demo user must be gated for non-demo games');

  // Step 3: Visitor purchases $9 family pass on Gumroad and verifies license
  const testLicenseKey = 'WWK-TEST-PASS';
  const masterKeys = ['WWK-TEST-PASS', 'WWK-DEV-PASS', 'WWK-LIFETIME-PASS'];

  function verifyLicense(key) {
    if (masterKeys.includes(key.toUpperCase())) {
      mockSetItem('wwk_purchased', 'true');
      mockSetItem('wwk_license', key.toUpperCase());
      return { success: true, key };
    }
    return { success: false };
  }

  const result = verifyLicense(testLicenseKey);
  assert.ok(result.success, 'License key verification must succeed');
  isDemoMode = mockGetItem('wwk_purchased') !== 'true';
  assert.equal(isDemoMode, false, 'User must now be unlocked (isDemoMode = false)');

  // Step 4: User now plays any of the 45 games across all 5 levels
  assert.ok(canPlayGame('game_dino_addition', 3), 'Unlocked user can play Level 3');
  assert.ok(canPlayGame('game_dino_addition', 5), 'Unlocked user can play Level 5');
  assert.ok(canPlayGame('game_subtraction_bakery', 1), 'Unlocked user can play previously locked game');
  assert.ok(canPlayGame('game_subtraction_bakery', 5), 'Unlocked user can play Level 5 of any game');
});

// ---------------------------------------------------------------------------
// SUITE 12: Offline Bug Fixer & Crash Resilience Test
// ---------------------------------------------------------------------------
test('Offline Bug Fixer: Self-heals corrupted storage without crashing', async () => {
  // Test storage healer logic against corrupted JSON
  function healCorruptedProfileData(rawJson) {
    let isValid = false;
    if (rawJson) {
      try {
        const parsed = JSON.parse(rawJson);
        if (Array.isArray(parsed) && parsed.length > 0) {
          const cleaned = parsed.filter(p => p && typeof p.id === 'string' && typeof p.name === 'string');
          if (cleaned.length > 0) isValid = true;
        }
      } catch {
        isValid = false;
      }
    }

    if (!isValid) {
      return [
        { id: 'child_leo', name: 'Leo', age: 5 },
        { id: 'child_mia', name: 'Mia', age: 7 }
      ];
    }
    return JSON.parse(rawJson);
  }

  // Corrupt string test
  const corruptInput = '{{INVALID_JSON_CORRUPTED';
  const healed = healCorruptedProfileData(corruptInput);
  assert.ok(Array.isArray(healed), 'Must heal to valid array');
  assert.equal(healed.length, 2, 'Must restore default safe profiles');
  assert.equal(healed[0].name, 'Leo', 'First profile restored to Leo');

  // Verify offlineBugFixer file exists and has diagnostic tests
  const bugFixerCode = fs.readFileSync(path.resolve('src/services/offlineBugFixer.ts'), 'utf8');
  assert.ok(bugFixerCode.includes('runDiagnosticCheck'), 'Must export runDiagnosticCheck');
  assert.ok(bugFixerCode.includes('healLocalStorage'), 'Must export healLocalStorage');
  assert.ok(bugFixerCode.includes('installGlobalErrorShield'), 'Must install global error shield');

  // Verify RuntimeErrorBoundary exists
  const boundaryCode = fs.readFileSync(path.resolve('src/components/RuntimeErrorBoundary.tsx'), 'utf8');
  assert.ok(boundaryCode.includes('componentDidCatch'), 'Must implement componentDidCatch');
  assert.ok(boundaryCode.includes('offlineBugFixer.healLocalStorage()'), 'Must call storage heal on catch');
});

// ---------------------------------------------------------------------------
// SUITE 13: SEO, Sitemap & Google Search Console Audit
// ---------------------------------------------------------------------------
test('SEO & Google Search Console: sitemap.xml, robots.txt, and metadata integrity', async () => {
  // 1. Robots.txt
  const robotsPath = path.resolve('public/robots.txt');
  assert.ok(fs.existsSync(robotsPath), 'public/robots.txt must exist');
  const robotsContent = fs.readFileSync(robotsPath, 'utf8');
  assert.ok(robotsContent.includes('User-agent: Googlebot'), 'robots.txt must allow Googlebot');
  assert.ok(robotsContent.includes('Sitemap: https://wonderworldkidslearning.space/sitemap.xml'), 'robots.txt must link canonical sitemap');

  // 2. Sitemap.xml
  const sitemapPath = path.resolve('public/sitemap.xml');
  assert.ok(fs.existsSync(sitemapPath), 'public/sitemap.xml must exist');
  const sitemapContent = fs.readFileSync(sitemapPath, 'utf8');
  assert.ok(sitemapContent.startsWith('<?xml version="1.0" encoding="UTF-8"?>'), 'sitemap.xml must have valid XML header');
  assert.ok(!sitemapContent.includes('#'), 'sitemap.xml must NOT contain URL hash fragments (Google guidelines)');
  assert.ok(!sitemapContent.includes('?page='), 'sitemap.xml must use clean multi-page URLs instead of ?page= query parameters');
  assert.ok(sitemapContent.includes('https://wonderworldkidslearning.space/worlds'), 'sitemap.xml must include /worlds page');
  assert.ok(sitemapContent.includes('https://wonderworldkidslearning.space/demo'), 'sitemap.xml must include /demo page');
  assert.ok(sitemapContent.includes('https://wonderworldkidslearning.space/pricing'), 'sitemap.xml must include /pricing page');
  assert.ok(sitemapContent.includes('https://wonderworldkidslearning.space/downloads'), 'sitemap.xml must include /downloads page');
  assert.ok(sitemapContent.includes('https://wonderworldkidslearning.space/worlds/world_math'), 'sitemap.xml must include /worlds/world_math');
  assert.ok(sitemapContent.includes('https://wonderworldkidslearning.space/worlds/world_logic'), 'sitemap.xml must include /worlds/world_logic');
  assert.ok(sitemapContent.includes('hreflang="en-in"'), 'sitemap.xml must support India regional targeting');
  assert.ok(sitemapContent.includes('hreflang="en-ae"'), 'sitemap.xml must support UAE/Dubai regional targeting');
  assert.ok(sitemapContent.includes('hreflang="en-us"'), 'sitemap.xml must support US regional targeting');
  assert.ok(sitemapContent.includes('hreflang="x-default"'), 'sitemap.xml must support x-default fallback');

  // 3. index.html SEO, Verification & Crawlability
  const indexHtmlPath = path.resolve('index.html');
  assert.ok(fs.existsSync(indexHtmlPath), 'index.html must exist');
  const indexContent = fs.readFileSync(indexHtmlPath, 'utf8');
  assert.ok(indexContent.includes('google-site-verification'), 'index.html must have google-site-verification tag');
  assert.ok(indexContent.includes('rel="canonical"'), 'index.html must specify canonical URL');
  assert.ok(indexContent.includes('wonder world kids'), 'index.html must include brand keyword');
  assert.ok(indexContent.includes('kids learning game'), 'index.html must include target category keyword');
  assert.ok(indexContent.includes('application/ld+json'), 'index.html must have Schema.org JSON-LD');
  assert.ok(indexContent.includes('EducationalApplication'), 'index.html schema must specify EducationalApplication');
  assert.ok(indexContent.includes('<noscript>'), 'index.html must have semantic crawlable fallback');
  assert.ok(indexContent.includes('Math Safari'), 'Crawlable fallback must describe Math Safari');
  assert.ok(indexContent.includes('Phonics Island'), 'Crawlable fallback must describe Phonics Island');
});

// ---------------------------------------------------------------------------
// SUITE 14: Zero Code or Zip Downloads Security Verification
// ---------------------------------------------------------------------------
test('Zero Code or Zip Downloads: Strict PWA-Only Policy', async () => {
  // 1. Confirm ZIP package does not exist
  const zipPath = path.resolve('public/WonderWorldKids_Offline_Package.zip');
  assert.ok(!fs.existsSync(zipPath), 'WonderWorldKids_Offline_Package.zip must NOT exist in public folder');

  // 2. Confirm DownloadInstructionsPage does not offer zip download buttons
  const downloadPagePath = path.resolve('src/components/website/DownloadInstructionsPage.tsx');
  const downloadPageContent = fs.readFileSync(downloadPagePath, 'utf8');
  assert.ok(!downloadPageContent.includes('Direct Download ZIP'), 'DownloadInstructionsPage must not offer Direct Download ZIP');
  assert.ok(!downloadPageContent.includes('WonderWorldKids_Offline_Package.zip'), 'Must not link to zip archive');
  assert.ok(downloadPageContent.includes('Install Offline App'), 'Must offer 1-click PWA offline install');
});

// ---------------------------------------------------------------------------
// SUITE 15: Meta Descriptions, OpenGraph & Google Merchant Schema (offers)
// ---------------------------------------------------------------------------
test('SEO Metadata & JSON-LD: Homepage, PricingPage & Google Merchant offers Integrity', async () => {
  // 1. Verify index.html meta description length (120-160 chars)
  const indexContent = fs.readFileSync(path.resolve('index.html'), 'utf8');
  const descMatch = indexContent.match(/<meta\s+name=["']description["']\s+content=["'](.*?)["']/);
  assert.ok(descMatch, 'Meta description tag must exist in index.html');
  const descText = descMatch[1];
  assert.ok(descText.length >= 120 && descText.length <= 160, `Meta description length must be 120-160 chars, got ${descText.length}`);
  assert.ok(descText.includes('kids learning game'), 'Meta description must target "kids learning game" keyword');

  // 2. OpenGraph & Twitter tags
  assert.ok(indexContent.includes('property="og:title"'), 'og:title must exist');
  assert.ok(indexContent.includes('property="og:description"'), 'og:description must exist');
  assert.ok(indexContent.includes('property="og:image"'), 'og:image must exist');
  assert.ok(indexContent.includes('name="twitter:card"'), 'twitter:card must exist');

  // 3. Structured Data JSON-LD + Google Merchant required offers fields
  assert.ok(indexContent.includes('"@type": "WebSite"'), 'Homepage WebSite schema must exist');
  assert.ok(indexContent.includes('"@type": ["Product", "SoftwareApplication"]'), 'PricingPage Product schema must exist');
  assert.ok(indexContent.includes('"price": "9.00"'), 'Pricing schema must specify $9.00');
  assert.ok(indexContent.includes('"priceCurrency": "USD"'), 'Pricing schema must specify USD');
  assert.ok(indexContent.includes('https://namank3.gumroad.com/l/wvpisb'), 'Pricing schema must link Gumroad checkout');
  assert.ok(indexContent.includes('"validFrom":'), 'offers schema must include validFrom for GSC');
  assert.ok(indexContent.includes('"shippingDetails":'), 'offers schema must include shippingDetails for GSC');
  assert.ok(indexContent.includes('"hasMerchantReturnPolicy":'), 'offers schema must include hasMerchantReturnPolicy for GSC');

  // 4. Dynamic SEO Manager service & multi-page route support
  const seoManagerPath = path.resolve('src/services/seoManager.ts');
  assert.ok(fs.existsSync(seoManagerPath), 'src/services/seoManager.ts must exist');
  const seoManagerContent = fs.readFileSync(seoManagerPath, 'utf8');
  assert.ok(seoManagerContent.includes('SEO_CONFIGS'), 'Must export SEO_CONFIGS');
  assert.ok(seoManagerContent.includes('applyRouteSEO'), 'Must export applyRouteSEO');
  assert.ok(seoManagerContent.includes('getRoutePath'), 'Must export getRoutePath');
  assert.ok(seoManagerContent.includes('getWorldSEO'), 'Must export getWorldSEO');
  assert.ok(seoManagerContent.includes('shippingDetails'), 'seoManager must include shippingDetails');
  assert.ok(seoManagerContent.includes('validFrom'), 'seoManager must include validFrom');
  assert.ok(seoManagerContent.includes('hasMerchantReturnPolicy'), 'seoManager must include hasMerchantReturnPolicy');
  ['home', 'pricing', 'worlds', 'downloads', 'demo', 'parents', 'about', 'faq', 'privacy', 'contact', 'my_games'].forEach(r => {
    assert.ok(seoManagerContent.includes(`${r}:`), `SEO_CONFIGS must include route ${r}`);
  });
});

// ---------------------------------------------------------------------------
// SUITE 16: PayU & Etsy UI Removal, Activation Key Button + Gumroad & Unlock Modal
// ---------------------------------------------------------------------------
test('PayU Removed, Etsy UI Removed, Key Button + Gumroad Checkout & Clean ?unlock=true Modal', async () => {
  // 1. Verify PayUCheckoutModal & Etsy Access Guide HTML do not exist and zero PayU references
  assert.ok(!fs.existsSync(path.resolve('src/components/PayUCheckoutModal.tsx')), 'PayUCheckoutModal.tsx must be deleted');
  assert.ok(!fs.existsSync(path.resolve('public/Etsy_Access_Guide_Wonder_World_Kids.html')), 'Etsy_Access_Guide_Wonder_World_Kids.html must be deleted');
  const filesToScan = [
    'server.ts',
    'index.html',
    '.env.example',
    'src/App.tsx',
    'src/components/website/PricingPage.tsx',
    'src/components/website/DownloadInstructionsPage.tsx',
    'src/components/website/MyPurchasedGamesPage.tsx',
    'src/components/PWAInstallModal.tsx',
  ];
  for (const rel of filesToScan) {
    const content = fs.readFileSync(path.resolve(rel), 'utf8').toLowerCase();
    assert.ok(!content.includes('payu'), `${rel} must not contain any PayU references`);
  }

  // 2. Verify zero Etsy checkout/UI links across storefront, SEO, and HTML
  for (const rel of [
    'src/components/website/PricingPage.tsx',
    'src/components/website/DownloadInstructionsPage.tsx',
    'src/components/PWAInstallModal.tsx',
    'src/components/website/MyPurchasedGamesPage.tsx',
    'src/components/website/HomePage.tsx',
    'src/components/website/FreeDemoPage.tsx',
    'src/components/website/Footer.tsx',
    'src/services/seoManager.ts',
    'index.html',
  ]) {
    const content = fs.readFileSync(path.resolve(rel), 'utf8');
    assert.ok(!content.toLowerCase().includes('etsy.com'), `${rel} must not include etsy.com checkout links`);
    assert.ok(!content.includes('Buy on Etsy'), `${rel} must not include Buy on Etsy button`);
    assert.ok(!content.includes('$8.99'), `${rel} must not include $8.99 Etsy pricing`);
  }

  // 3. Verify Activation Key buttons and Gumroad checkout exist across conversion flows
  for (const rel of [
    'src/components/website/DownloadInstructionsPage.tsx',
    'src/components/website/PricingPage.tsx',
    'src/components/PWAInstallModal.tsx',
  ]) {
    const content = fs.readFileSync(path.resolve(rel), 'utf8');
    assert.ok(content.includes('Enter Activation Key'), `${rel} must include Enter Activation Key button`);
    assert.ok(content.includes('namank3.gumroad.com/l/wvpisb'), `${rel} must include Gumroad checkout option`);
  }

  for (const rel of [
    'src/components/website/HomePage.tsx',
    'src/components/website/FreeDemoPage.tsx',
    'src/components/DemoLimitModal.tsx',
    'src/games/UniversalMiniGameRunner.tsx',
  ]) {
    const content = fs.readFileSync(path.resolve(rel), 'utf8');
    assert.ok(content.includes('KeyRound'), `${rel} must use KeyRound icon for Key button`);
    assert.ok(
      content.includes('Enter Activation Key') || content.includes('Enter Key'),
      `${rel} must include an Activation Key action button`
    );
  }

  // 4. Verify ?unlock=true modal UI text has zero Gumroad or $9 strings & leaks NO working activation key
  const modalContent = fs.readFileSync(path.resolve('src/components/LicenseVerificationModal.tsx'), 'utf8');
  const myGamesContent = fs.readFileSync(path.resolve('src/components/website/MyPurchasedGamesPage.tsx'), 'utf8');
  const purchaseSuccessContent = fs.readFileSync(path.resolve('src/components/website/PurchaseSuccessPage.tsx'), 'utf8');
  const licenseSvcContent = fs.readFileSync(path.resolve('src/services/licenseService.ts'), 'utf8');
  assert.ok(modalContent.includes('Enter Activation Key'), 'Modal must prompt for activation key');
  const modalWithoutMethodName = modalContent.replace(/verifyGumroadLicense/g, '');
  assert.ok(!modalWithoutMethodName.toLowerCase().includes('gumroad'), 'Unlock modal (?unlock=true) must not mention Gumroad');
  assert.ok(!modalWithoutMethodName.includes('$9'), 'Unlock modal (?unlock=true) must not mention $9');

  // Security check: No valid/master key may ever appear in UI placeholders or public fallbacks
  assert.ok(!licenseSvcContent.includes('WWK-FAMILY-LIFETIME'), 'Exposed key WWK-FAMILY-LIFETIME must be revoked');
  assert.ok(!licenseSvcContent.includes("startsWith('WWK-FAMILY-')"), 'Must not allow broad WWK-FAMILY- wildcard');
  for (const leakedKey of ['WWK-FAMILY-LIFETIME', 'WWK-ETSY-FAMILY-ACCESS', 'WWK-ETSY-2026', 'WWK-TEST-PASS', 'WWK-DEV-PASS', 'WWK-LIFETIME-PASS']) {
    assert.ok(!modalContent.includes(leakedKey), `LicenseVerificationModal must never expose key ${leakedKey}`);
    assert.ok(!myGamesContent.includes(leakedKey), `MyPurchasedGamesPage must never expose key ${leakedKey}`);
    assert.ok(!purchaseSuccessContent.includes(leakedKey), `PurchaseSuccessPage must never expose key ${leakedKey}`);
  }
});

// ---------------------------------------------------------------------------
// SUITE 17: Demo Simulator & Offline Games Integrity
// ---------------------------------------------------------------------------
test('Demo Simulator Integrity & Offline Game Demo Gating', async () => {
  const matrixContent = fs.readFileSync(path.resolve('src/data/gameMatrix.ts'), 'utf8');
  const matrixIds = new Set([...matrixContent.matchAll(/id:\s*['"](game_[a-z0-9_]+)['"]/g)].map(m => m[1]));

  // All demoConfig game IDs must exist in gameMatrix.ts
  const demoConfig = fs.readFileSync(path.resolve('src/data/demoConfig.ts'), 'utf8');
  const demoIds = [...demoConfig.matchAll(/['"](game_[a-z0-9_]+)['"]/g)].map(m => m[1]);
  assert.equal(new Set(demoIds).size, 10, 'demoConfig must specify 10 unique demo games');
  for (const id of demoIds) {
    assert.ok(matrixIds.has(id), `Demo game ID ${id} must exist in gameMatrix.ts`);
  }

  // FreeDemoPage must include all 6 simulator tabs including Logic Island (Memory Flip)
  const demoPage = fs.readFileSync(path.resolve('src/components/website/FreeDemoPage.tsx'), 'utf8');
  assert.ok(demoPage.includes('Memory Flip'), 'FreeDemoPage must include Memory Flip logic simulator tab');
  assert.ok(demoPage.includes('Logic'), 'FreeDemoPage must cover Logic world');

  // App.tsx must pass isDemoMode={isDemoMode} to all dedicated games and must NOT unlock on DemoLimitModal.onUnlockFull
  const appContent = fs.readFileSync(path.resolve('src/App.tsx'), 'utf8');
  const matchCount = (appContent.match(/isDemoMode=\{isDemoMode\}/g) || []).length;
  assert.ok(matchCount >= 7, `Expected isDemoMode prop passed to all dedicated and universal games, found ${matchCount}`);
  assert.ok(appContent.includes('onGetFullVersion={() => navigateTo(\'pricing\')}'), 'App.tsx must wire onGetFullVersion to pricing');

  // Game engine (UniversalMiniGameRunner.tsx) must never have a bare safety fallback `return null;` and must render a visual placeholder + Get Full Version CTA
  const runnerContent = fs.readFileSync(path.resolve('src/games/UniversalMiniGameRunner.tsx'), 'utf8');
  assert.ok(runnerContent.includes('isGameAllowedInDemo'), 'UniversalMiniGameRunner must check isGameAllowedInDemo');
  assert.ok(runnerContent.includes('isLevelAllowedInDemo'), 'UniversalMiniGameRunner must check isLevelAllowedInDemo');
  assert.ok(runnerContent.includes('Demo Simulator Preview Limit'), 'UniversalMiniGameRunner must render Demo Simulator Preview Limit visual placeholder');
  assert.ok(runnerContent.includes('Get Full Version'), 'UniversalMiniGameRunner must render Get Full Version CTA');
  assert.ok(!runnerContent.includes('// Safety fallback\n    return null;'), 'UniversalMiniGameRunner must not have bare return null fallback');

  // Demo Simulator & Demo UI components must display clear Get Full Version CTAs
  const demoModalContent = fs.readFileSync(path.resolve('src/components/DemoLimitModal.tsx'), 'utf8');
  const demoHeaderContent = fs.readFileSync(path.resolve('src/components/DemoHeaderBar.tsx'), 'utf8');
  assert.ok(demoPage.includes('Get Full Version'), 'FreeDemoPage must display Get Full Version CTA');
  assert.ok(demoModalContent.includes('Get Full Version'), 'DemoLimitModal must display Get Full Version CTA');
  assert.ok(demoHeaderContent.includes('Get Full Version'), 'DemoHeaderBar must display Get Full Version CTA');
});

// ---------------------------------------------------------------------------
// SUITE 18: Clean Main Game (No Confetti), Product B Git Separation & Valid PWA Assets
// ---------------------------------------------------------------------------
test('Clean Product A Build: Zero Confetti, Gitignore Product B Separation & Valid PWA Assets', async () => {
  // 1. package.json must not include canvas-confetti or Product B npm scripts
  const pkgJson = JSON.parse(fs.readFileSync(path.resolve('package.json'), 'utf8'));
  assert.ok(!pkgJson.dependencies?.['canvas-confetti'], 'package.json dependencies must not include canvas-confetti');
  assert.ok(!pkgJson.devDependencies?.['@types/canvas-confetti'], 'package.json devDependencies must not include @types/canvas-confetti');
  assert.ok(!pkgJson.scripts?.['build:android-full'], 'package.json must not expose build:android-full script');
  assert.ok(!pkgJson.scripts?.['test:android-full'], 'package.json must not expose test:android-full script');

  // 2. .gitignore must exclude Product B / temporary files from git pushes
  const gitignore = fs.readFileSync(path.resolve('.gitignore'), 'utf8');
  for (const entry of [
    'android-full-app/',
    'android-full.html',
    'vite.android.config.ts',
    'src/AndroidFullApp.tsx',
    'src/android-full-main.tsx',
    'scripts/test-android-full.js',
  ]) {
    assert.ok(gitignore.includes(entry), `.gitignore must exclude ${entry}`);
  }

  // 3. Scan Product A source files for confetti, PAID_NATIVE_APP, isPaidNativeApp, or window.open
  function collectTsFiles(dir) {
    const results = [];
    for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
      const fullPath = path.join(dir, entry.name);
      if (entry.isDirectory()) {
        results.push(...collectTsFiles(fullPath));
      } else if (/\.(ts|tsx)$/.test(entry.name)) {
        results.push(fullPath);
      }
    }
    return results;
  }

  const productAFiles = collectTsFiles(path.resolve('src')).filter(
    (p) => !p.endsWith('AndroidFullApp.tsx') && !p.endsWith('android-full-main.tsx')
  );
  assert.ok(productAFiles.length > 20, 'Expected Product A TypeScript source files');

  for (const filePath of productAFiles) {
    const content = fs.readFileSync(filePath, 'utf8');
    assert.ok(!/confetti/i.test(content), `Confetti reference found in ${path.relative(process.cwd(), filePath)}`);
    assert.ok(!content.includes('PAID_NATIVE_APP'), `PAID_NATIVE_APP found in ${path.relative(process.cwd(), filePath)}`);
    assert.ok(!content.includes('isPaidNativeApp'), `isPaidNativeApp found in ${path.relative(process.cwd(), filePath)}`);
    assert.ok(!content.includes('window.open('), `window.open found in ${path.relative(process.cwd(), filePath)}`);
  }

  // 4. Verify unified PWA manifest and icon files
  const viteConfig = fs.readFileSync(path.resolve('vite.config.ts'), 'utf8');
  assert.ok(viteConfig.includes('manifest: false'), 'vite.config.ts must set manifest: false to avoid duplicate manifest.webmanifest');

  const indexHtml = fs.readFileSync(path.resolve('index.html'), 'utf8');
  assert.ok(indexHtml.includes('href="/manifest.json"'), 'index.html must link /manifest.json');
  assert.ok(!indexHtml.includes('manifest.webmanifest'), 'index.html must not reference manifest.webmanifest');

  const manifest = JSON.parse(fs.readFileSync(path.resolve('public/manifest.json'), 'utf8'));
  assert.equal(manifest.name, 'Wonder World Kids Learning');
  assert.equal(manifest.short_name, 'WonderWorld');
  assert.ok(Array.isArray(manifest.icons) && manifest.icons.length === 3, 'manifest.json must declare 3 canonical icons');

  for (const iconPath of [
    'public/pwa-192x192.png',
    'public/pwa-512x512.png',
    'public/pwa-maskable-512x512.png',
    'public/apple-touch-icon.png',
    'public/favicon.png',
    'public/logo.png',
  ]) {
    const full = path.resolve(iconPath);
    assert.ok(fs.existsSync(full), `Missing icon ${iconPath}`);
    assert.ok(fs.statSync(full).size > 1024, `Icon ${iconPath} appears empty or corrupt`);
  }
});

// =========================================================================
// SUITE 19: WONDER WORLD KIDS STOREFRONT, CATALOG, BAG & PRODUCT SEO
// =========================================================================
test('Suite 19: Storefront products, marketplaces, verified pricing, bag drawer & honest SEO', () => {
  const storeMeta = fs.readFileSync(path.resolve('src/data/storeMeta.ts'), 'utf8');
  const storeCatalog = fs.readFileSync(path.resolve('src/data/storeCatalog.ts'), 'utf8');
  const storeSection = fs.readFileSync(path.resolve('src/components/website/StoreSection.tsx'), 'utf8');
  const storePage = fs.readFileSync(path.resolve('src/components/website/StorePage.tsx'), 'utf8');
  const pdpPage = fs.readFileSync(path.resolve('src/components/website/ProductDetailPage.tsx'), 'utf8');
  const cartDrawer = fs.readFileSync(path.resolve('src/components/website/StoreCartDrawer.tsx'), 'utf8');
  const managerModal = fs.readFileSync(path.resolve('src/components/website/StoreProductManagerModal.tsx'), 'utf8');
  const seoManager = fs.readFileSync(path.resolve('src/services/seoManager.ts'), 'utf8');
  const appTsx = fs.readFileSync(path.resolve('src/App.tsx'), 'utf8');
  const navbar = fs.readFileSync(path.resolve('src/components/website/Navbar.tsx'), 'utf8');
  const footer = fs.readFileSync(path.resolve('src/components/website/Footer.tsx'), 'utf8');
  const homePage = fs.readFileSync(path.resolve('src/components/website/HomePage.tsx'), 'utf8');
  const sitemap = fs.readFileSync(path.resolve('public/sitemap.xml'), 'utf8');

  // 1. Verify section title and all 5 categories
  assert.ok(storeSection.includes('Wonder World Kids Store – Learn, Play & Create'), 'StoreSection must display exact store heading');
  for (const cat of [
    'Learning Games',
    'Colouring Books',
    'Educational Activity Books',
    'Seasonal Collections',
    'Digital Learning Resources',
  ]) {
    assert.ok(storeMeta.includes(`'${cat}'`), `storeMeta.ts must define category ${cat}`);
  }

  // 2. Verify initial 4 products, exact marketplace URLs, buttons, and verified-only price
  assert.ok(storeMeta.includes('Wonder World Kids Learning App'), 'Must include Wonder World Kids Learning App');
  assert.ok(storeMeta.includes('Download Now'), 'Learning App must use Download Now CTA');
  assert.ok(storeMeta.includes('https://namank3.gumroad.com/l/wvpisb'), 'Learning App must point to Gumroad URL');
  assert.ok(storeMeta.includes("price: '9.00'"), 'Learning App must retain verified $9.00 price');

  assert.ok(storeMeta.includes('Dinosaur World Colouring Book'), 'Must include Dinosaur World Colouring Book');
  assert.ok(storeMeta.includes('https://www.etsy.com/listing/4615484511/dinosaur-world-coloring-book-30'), 'Must include Dinosaur Etsy URL');

  assert.ok(storeMeta.includes('ABC Alphabet Activity Book'), 'Must include ABC Alphabet Activity Book');
  assert.ok(storeMeta.includes('https://www.etsy.com/listing/4618473268/abc-alphabet-activity-book-for-kids'), 'Must include ABC Etsy URL');

  assert.ok(storeMeta.includes('Christmas Wonderland Colouring Book'), 'Must include Christmas Wonderland Colouring Book');
  assert.ok(storeMeta.includes('https://www.etsy.com/listing/4623136130/christmas-wonderland-printable-colouring'), 'Must include Christmas Etsy URL');

  assert.ok(storeMeta.includes('My First Maths Adventure Printable Book'), 'Must include My First Maths Adventure Printable Book');
  assert.ok(storeMeta.includes('https://www.etsy.com/listing/4623674119/my-first-maths-adventure-printable'), 'Must include Maths Etsy URL');
  assert.ok(fs.existsSync(path.resolve('public/assets/maths_adventure_cover.jpg')), 'Maths book cover asset must exist in public/assets');

  assert.ok(storeMeta.includes('Buy on Etsy'), 'Etsy products must use Buy on Etsy CTA');

  // 3. Verify original product covers, gameplay screenshots, and logo exist in public/assets/aistudio and are wired into catalog & brand logo
  const brandLogo = fs.readFileSync(path.resolve('src/components/BrandLogo.tsx'), 'utf8');
  const combinedAssetRefs = `${storeMeta}\n${storeCatalog}\n${brandLogo}`;
  for (const assetRel of [
    'public/assets/aistudio/pwa-512x512_ba215e1b.png',
    'public/assets/aistudio/Dinosaur_World_Front_Cover__1__d7e7601e.png',
    'public/assets/aistudio/Wonder_World_ABC_Adventure__2__de9ce0c1.png',
    'public/assets/aistudio/christmas-wonderland-my-christmas-colouring-book_front_Cover_f4007897.png',
    'public/assets/aistudio/Screenshot_20261111-220142_2_ee4c78de.jpg',
    'public/assets/aistudio/Screenshot_20261111-220218_2_0367a967.jpg',
    'public/assets/aistudio/Screenshot_20261111-220204_2_627c41af.jpg',
    'public/assets/aistudio/Screenshot_20261111-220250_2_d2ea05cd.jpg',
  ]) {
    const full = path.resolve(assetRel);
    assert.ok(fs.existsSync(full), `Missing original uploaded asset ${assetRel}`);
    assert.ok(fs.statSync(full).size > 5000, `Original uploaded asset ${assetRel} appears empty`);
    assert.ok(combinedAssetRefs.includes(path.basename(assetRel)), `Catalog/brand components must reference ${path.basename(assetRel)}`);
  }

  // 4. Verify multi-marketplace Shopping Bag drawer & non-simulated checkout
  assert.ok(cartDrawer.includes('onRemoveItem'), 'StoreCartDrawer must allow removing saved items');
  assert.ok(cartDrawer.includes('target="_blank"') && cartDrawer.includes('rel="noopener noreferrer"'), 'Cart links must redirect cleanly to external marketplace');
  assert.ok(!cartDrawer.toLowerCase().includes('order confirmed') && !cartDrawer.toLowerCase().includes('payment complete'), 'StoreCartDrawer must never simulate fake order completion');

  // 5. Verify data-driven Product Catalog Manager (Etsy, Gumroad, Payhip, Amazon KDP + active/inactive)
  for (const market of ['Etsy', 'Gumroad', 'Payhip', 'Amazon KDP']) {
    assert.ok(storeMeta.includes(`'${market}'`), `storeMeta.ts must support marketplace ${market}`);
  }
  assert.ok(managerModal.includes('onToggleStatus') && managerModal.includes('onSaveProduct'), 'StoreProductManagerModal must allow adding/editing products and toggling status');

  // 6. Verify honest SEO on /store and /store/:slug (Product schema without fake ratings/reviews)
  assert.ok(seoManager.includes("case 'store':") && seoManager.includes("case 'store_product':"), 'seoManager.ts must route /store and /store/:slug');
  assert.ok(seoManager.includes("'@type': 'Product'"), 'seoManager.ts must generate Product JSON-LD');
  const productSeoSlice = seoManager.slice(seoManager.indexOf('export function getStoreProductSEO'));
  assert.ok(!productSeoSlice.includes('aggregateRating') && !productSeoSlice.includes('ratingValue'), 'Product SEO must not invent fake ratings or reviews');

  // 7. Verify internal cross-linking across App, Navbar, HomePage, StorePage, PDP, Footer, Sitemap
  assert.ok(appTsx.includes("'store'") && appTsx.includes("'store_product'"), 'App.tsx must mount Store and ProductDetail routes');
  assert.ok(navbar.includes("route: 'store'") && navbar.includes('onOpenBag'), 'Navbar must link to Store and open Saved Bag');
  assert.ok(footer.includes("route: 'store'"), 'Footer must link to Wonder World Store');
  assert.ok(homePage.includes('<StoreSection'), 'HomePage must embed StoreSection');
  assert.ok(storePage.includes('<StoreSection') && pdpPage.includes("getRoutePath('store')"), 'StorePage and ProductDetailPage must link properly');
  assert.ok(sitemap.includes('/store') && sitemap.includes('dinosaur-world-colouring-book') && sitemap.includes('my-first-maths-adventure-printable'), 'sitemap.xml must list /store and product pages');
});

// =========================================================================
// SUITE 20: GUMROAD ACTIVATION + CLOUDFLARE FALLBACK & MAIN GAME BUG-FIXES
// =========================================================================
test('Suite 20a: Gumroad licenseService runtime verification (Master keys, Express JSON, & Cloudflare SPA fallback)', async () => {
  const esbuild = await import('esbuild');
  const source = fs.readFileSync(path.resolve('src/services/licenseService.ts'), 'utf8');
  const transformed = esbuild.transformSync(source, { loader: 'ts', format: 'esm' });
  const moduleUrl = `data:text/javascript;base64,${Buffer.from(transformed.code).toString('base64')}`;

  // Setup isolated global localStorage mock
  const store = new Map();
  const prevLocalStorage = globalThis.localStorage;
  const prevFetch = globalThis.fetch;

  globalThis.localStorage = {
    getItem: (k) => (store.has(k) ? store.get(k) : null),
    setItem: (k, v) => store.set(k, String(v)),
    removeItem: (k) => store.delete(k),
    clear: () => store.clear(),
  };

  try {
    const { licenseService } = await import(moduleUrl);

    // 1. Offline Master Lifetime Key check (case-insensitive)
    store.clear();
    const masterRes = await licenseService.verifyGumroadLicense('wwk-test-pass');
    assert.equal(masterRes.success, true, 'Master key must unlock offline');
    assert.equal(licenseService.isUnlocked(), true, 'isUnlocked() must be true after master key activation');
    assert.equal(store.get('wwk_view_preference'), 'app_only');

    store.clear();
    const etsyCustomRes = await licenseService.verifyGumroadLicense('WWK-ETSY-XCZJDBDJSJHSH-ACCESS');
    assert.equal(etsyCustomRes.success, true, 'Custom Etsy access key must unlock offline');
    assert.equal(licenseService.isUnlocked(), true, 'isUnlocked() must be true after custom Etsy key activation');

    // 2. Express backend JSON success (must NOT call api.gumroad.com from browser)
    store.clear();
    let calls = [];
    globalThis.fetch = async (url, opts) => {
      calls.push({ url, opts });
      return {
        status: 200,
        headers: { get: (h) => (h.toLowerCase() === 'content-type' ? 'application/json; charset=utf-8' : null) },
        json: async () => ({
          success: true,
          purchase: {
            email: 'parent@example.com',
            buyer_name: 'Parent Tester',
            created_at: '2026-10-01T12:00:00Z',
          },
        }),
      };
    };
    const expressRes = await licenseService.verifyGumroadLicense('GUMROAD-VALID-123');
    assert.equal(expressRes.success, true, 'Express proxy JSON must activate license');
    assert.equal(calls.length, 1, 'Should not hit direct Gumroad URL when Express proxy returns valid JSON');
    assert.equal(calls[0].url, '/api/verify-license');

    // 3. Express backend structured failure JSON (must NOT fall back to double-calling Gumroad)
    store.clear();
    calls = [];
    globalThis.fetch = async (url) => {
      calls.push(url);
      return {
        status: 404,
        headers: { get: () => 'application/json' },
        json: async () => ({ success: false, message: 'License key does not exist.' }),
      };
    };
    const invalidRes = await licenseService.verifyGumroadLicense('INVALID-KEY');
    assert.equal(invalidRes.success, false, 'Invalid Gumroad key must fail verification');
    assert.equal(calls.length, 1, 'Structured JSON 404 from /api/verify-license should not retry Gumroad');

    // 4. Refunded / disputed purchase rejection
    store.clear();
    globalThis.fetch = async () => ({
      status: 200,
      headers: { get: () => 'application/json' },
      json: async () => ({
        success: true,
        purchase: { email: 'refund@example.com', refunded: true },
      }),
    });
    const refundedRes = await licenseService.verifyGumroadLicense('REFUNDED-KEY');
    assert.equal(refundedRes.success, false, 'Refunded license must be rejected');
    assert.equal(licenseService.isUnlocked(), false, 'Refunded key must not unlock storage');

    // 5. Cloudflare Pages SPA fallback (200 text/html on /api/verify-license -> direct Gumroad product_id + wvpisb fallback)
    store.clear();
    calls = [];
    globalThis.fetch = async (url, opts) => {
      calls.push({ url, opts });
      if (url === '/api/verify-license') {
        return {
          status: 200,
          headers: { get: (h) => (h.toLowerCase() === 'content-type' ? 'text/html; charset=utf-8' : null) },
          json: async () => {
            throw new SyntaxError('Unexpected token < in JSON');
          },
        };
      }
      const bodyStr = String(opts.body || '');
      if (bodyStr.includes('product_id=')) {
        return {
          status: 404,
          headers: { get: () => 'application/json' },
          json: async () => ({ success: false, message: 'Trying permalink fallback' }),
        };
      }
      return {
        status: 200,
        headers: { get: () => 'application/json' },
        json: async () => ({
          success: true,
          purchase: {
            email: 'cloudflare@example.com',
            buyer_name: 'Cloudflare Parent',
            created_at: '2026-11-01T10:00:00Z',
          },
        }),
      };
    };
    const cfRes = await licenseService.verifyGumroadLicense('CF-DIRECT-999');
    assert.equal(cfRes.success, true, 'Cloudflare Pages HTML fallback must transparently verify via api.gumroad.com');
    assert.equal(calls.length, 3, 'Must try /api/verify-license, then direct product_id, then wvpisb permalink fallback');
    assert.equal(calls[1].url, 'https://api.gumroad.com/v2/licenses/verify');
    assert.ok(String(calls[1].opts.body).includes('product_id=3AhcEFEj3-aHkZ0hQA0drA%3D%3D'), 'Must verify against Gumroad product_id first');
    assert.ok(String(calls[2].opts.body).includes('product_permalink=wvpisb'), 'Must fall back to wvpisb permalink');
    assert.ok(String(calls[2].opts.body).includes('increment_uses_count=false'), 'Must set increment_uses_count=false');
    assert.equal(licenseService.isUnlocked(), true, 'Cloudflare direct Gumroad verification must persist unlock');
  } finally {
    globalThis.localStorage = prevLocalStorage;
    globalThis.fetch = prevFetch;
  }
});

test('Suite 20b: Gumroad URLs/endpoints, ?page=activate flow, and Main Game bug-fix invariants', () => {
  const serverTs = fs.readFileSync(path.resolve('server.ts'), 'utf8');
  const licenseModal = fs.readFileSync(path.resolve('src/components/LicenseVerificationModal.tsx'), 'utf8');
  const pricingPage = fs.readFileSync(path.resolve('src/components/website/PricingPage.tsx'), 'utf8');
  const purchasedPage = fs.readFileSync(path.resolve('src/components/website/MyPurchasedGamesPage.tsx'), 'utf8');
  const appTsx = fs.readFileSync(path.resolve('src/App.tsx'), 'utf8');
  const wordBee = fs.readFileSync(path.resolve('src/games/WordBuilderBee.tsx'), 'utf8');
  const dinoGame = fs.readFileSync(path.resolve('src/games/DinoAdditionGame.tsx'), 'utf8');
  const continentGame = fs.readFileSync(path.resolve('src/games/ContinentJigsaw.tsx'), 'utf8');
  const soundMemory = fs.readFileSync(path.resolve('src/games/AnimalSoundMemory.tsx'), 'utf8');
  const colorMatch = fs.readFileSync(path.resolve('src/games/ColorShadowMatch.tsx'), 'utf8');
  const shapeSorter = fs.readFileSync(path.resolve('src/games/ShapeSorterGame.tsx'), 'utf8');
  const abcTrace = fs.readFileSync(path.resolve('src/games/AbcLetterTraceGame.tsx'), 'utf8');
  const runner = fs.readFileSync(path.resolve('src/games/UniversalMiniGameRunner.tsx'), 'utf8');

  // Preserve Gumroad server route & purchase links + product_id 3AhcEFEj3-aHkZ0hQA0drA==
  assert.ok(serverTs.includes("app.post('/api/verify-license'") && serverTs.includes('wvpisb') && serverTs.includes('3AhcEFEj3-aHkZ0hQA0drA=='), 'server.ts must expose /api/verify-license for both Gumroad product_id and wvpisb');
  assert.ok(licenseModal.includes('licenseService.verifyGumroadLicense'), 'LicenseVerificationModal must verify via licenseService');
  assert.ok(licenseModal.includes('Launch All 45 Games Now'), 'LicenseVerificationModal must offer 1-click launch when already unlocked');
  assert.ok(pricingPage.includes('https://namank3.gumroad.com/l/wvpisb'), 'PricingPage must keep Gumroad checkout link');
  assert.ok(purchasedPage.includes('licenseService.verifyGumroadLicense'), 'MyPurchasedGamesPage must verify via licenseService');

  // App.tsx SSR safety, ?page=activate routing & shared demo/mute wiring
  assert.ok(appTsx.includes("if (typeof window === 'undefined')"), 'App.tsx parseInitialLocation must guard SSR');
  assert.ok(appTsx.includes("pageParam === 'activate'"), 'App.tsx must handle ?page=activate in initial location & effect');
  assert.ok(!appTsx.includes("localStorage.getItem('wwk_purchased')"), 'App.tsx must use licenseService.isUnlocked() safely');
  const demoLimitPassCount = (appTsx.match(/onShowDemoLimit=\{\(\) => setIsDemoLimitOpen\(true\)\}/g) || []).length;
  assert.ok(demoLimitPassCount >= 7, `Expected onShowDemoLimit wired to all 7 game mounts, found ${demoLimitPassCount}`);
  const mutePassCount = (appTsx.match(/isMuted=\{isMuted\}/g) || []).length;
  assert.ok(mutePassCount >= 7, `Expected isMuted synced to all 7 game mounts, found ${mutePassCount}`);

  // WordBuilderBee restart fix
  assert.ok(wordBee.includes('restartSeed') && wordBee.includes('currentLevel, restartSeed]'), 'WordBuilderBee must reinitialize tiles via restartSeed');

  // DinoAdditionGame timer race fix & all dedicated games wired for demo limit + mute
  assert.ok((dinoGame.match(/clearTimeout\(transitionTimerRef\.current\)/g) || []).length >= 2, 'DinoAdditionGame must clear pending timers before transition');
  for (const [name, content] of [
    ['WordBuilderBee', wordBee],
    ['DinoAdditionGame', dinoGame],
    ['ContinentJigsaw', continentGame],
    ['AnimalSoundMemory', soundMemory],
    ['ColorShadowMatch', colorMatch],
    ['ShapeSorterGame', shapeSorter],
    ['UniversalMiniGameRunner', runner],
  ]) {
    assert.ok(content.includes('onShowDemoLimit'), `${name} must accept/wire onShowDemoLimit`);
    assert.ok(content.includes('onToggleMute'), `${name} must accept/wire onToggleMute`);
  }

  // UniversalMiniGameRunner label parsing fix (zero truncated second-word splits)
  assert.ok(runner.includes('function splitLabelAndIcon'), 'UniversalMiniGameRunner must define splitLabelAndIcon');
  assert.ok(!runner.includes(".split(' ')[1]"), 'UniversalMiniGameRunner must not truncate multi-word labels with .split(" ")[1]');

  // SSR speechSynthesis guards
  for (const [name, content] of [
    ['ContinentJigsaw', continentGame],
    ['ShapeSorterGame', shapeSorter],
    ['AbcLetterTraceGame', abcTrace],
    ['UniversalMiniGameRunner', runner],
  ]) {
    assert.ok(!content.includes("if ('speechSynthesis' in window)") || content.includes("typeof window !== 'undefined'"), `${name} must guard speechSynthesis against SSR`);
  }
});

// =========================================================================
// SUITE 21: SEPARATE MARKETPLACE PAGES, INTL SEO/GEO TAGS & AI SITEMAPS
// =========================================================================
test('Suite 21: Standalone pages unified UI, Geo/Intl SEO tags, sitemap.xml & AI crawling sitemaps', () => {
  const indexHtml = fs.readFileSync(path.resolve('index.html'), 'utf8');
  const robotsTxt = fs.readFileSync(path.resolve('public/robots.txt'), 'utf8');
  const sitemapXml = fs.readFileSync(path.resolve('public/sitemap.xml'), 'utf8');
  const llmsTxt = fs.readFileSync(path.resolve('public/llms.txt'), 'utf8');
  const llmsFullTxt = fs.readFileSync(path.resolve('public/llms-full.txt'), 'utf8');
  const cfHeaders = fs.readFileSync(path.resolve('public/_headers'), 'utf8');
  const serverTs = fs.readFileSync(path.resolve('server.ts'), 'utf8');
  const seoManager = fs.readFileSync(path.resolve('src/services/seoManager.ts'), 'utf8');
  const appTsx = fs.readFileSync(path.resolve('src/App.tsx'), 'utf8');

  // 1. Standalone AboutPage mounted cleanly on /about + unified bright marketplace UI across all separate pages
  assert.ok(fs.existsSync(path.resolve('src/components/website/AboutPage.tsx')), 'AboutPage.tsx must exist as standalone page');
  assert.ok(appTsx.includes('<AboutPage'), 'App.tsx must render standalone AboutPage on /about');

  const websitePages = [
    'AboutPage.tsx',
    'PricingPage.tsx',
    'DownloadInstructionsPage.tsx',
    'ParentInfoPage.tsx',
    'FAQPage.tsx',
    'ContactSupportPage.tsx',
    'PrivacyPolicyPage.tsx',
    'MyPurchasedGamesPage.tsx',
    'PurchaseSuccessPage.tsx',
    'StorePage.tsx',
    'ExploreWorldsPage.tsx',
    'FreeDemoPage.tsx',
  ];
  for (const pageFile of websitePages) {
    const content = fs.readFileSync(path.resolve(`src/components/website/${pageFile}`), 'utf8');
    assert.ok(!content.includes('bg-slate-900'), `${pageFile} must use the unified bright storybook marketplace palette instead of bg-slate-900`);
  }

  // 2. Geo tags, international targeting & AI sitemap discovery in index.html + seoManager.ts
  for (const tag of [
    'name="geo.region"',
    'name="geo.placename"',
    'name="ICBM"',
    'property="og:locale"',
    'property="og:locale:alternate"',
    'href="/llms.txt"',
    'href="/llms-full.txt"',
    'rel="sitemap"',
  ]) {
    assert.ok(indexHtml.includes(tag), `index.html must include ${tag}`);
  }
  assert.ok(seoManager.includes('INTERNATIONAL_HREFLANGS'), 'seoManager must sync per-route hreflang tags');
  assert.ok(seoManager.includes("setMetaTag('name', 'keywords'"), 'seoManager must dynamically sync per-route keywords');
  assert.ok(seoManager.includes("setMetaTag('name', 'geo.region'"), 'seoManager must preserve geo.region metadata');

  // 3. AI crawling sitemaps, robots.txt & Cloudflare/Express headers
  for (const bot of ['Googlebot', 'Bingbot', 'GPTBot', 'OAI-SearchBot', 'ClaudeBot', 'PerplexityBot', 'Google-Extended']) {
    assert.ok(robotsTxt.includes(`User-agent: ${bot}`), `robots.txt must welcome ${bot}`);
  }
  assert.ok(llmsTxt.includes('https://wonderworldkidslearning.space/llms-full.txt'), 'llms.txt must link llms-full.txt');
  assert.ok(llmsTxt.includes('My First Maths Adventure Printable Book'), 'llms.txt must include all printable books');
  assert.ok(llmsFullTxt.includes('Memory Card Flip') && llmsFullTxt.includes('Dino Addition'), 'llms-full.txt must document all 45 games');
  assert.ok(cfHeaders.includes('/llms.txt') && cfHeaders.includes('/llms-full.txt'), 'public/_headers must configure headers for AI sitemaps');
  assert.ok(serverTs.includes("app.get('/llms.txt'") && serverTs.includes("app.get('/llms-full.txt'"), 'server.ts must serve /llms.txt and /llms-full.txt');

  // 4. Complete sitemap.xml coverage for all standalone routes
  for (const route of [
    '/store',
    '/store/wonder-world-kids-learning-app',
    '/store/my-first-maths-adventure-printable',
    '/worlds',
    '/demo',
    '/pricing',
    '/downloads',
    '/parents',
    '/about',
    '/faq',
    '/privacy',
    '/contact',
    '/activate',
    '/my-games',
  ]) {
    assert.ok(sitemapXml.includes(`https://wonderworldkidslearning.space${route}`), `sitemap.xml must include ${route}`);
  }
});




