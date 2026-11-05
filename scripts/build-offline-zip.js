import fs from 'fs';
import path from 'path';
import JSZip from 'jszip';

async function buildOfflineZip() {
  const distDir = path.resolve('dist');
  if (!fs.existsSync(distDir)) {
    console.error('dist directory does not exist! Run npm run build first.');
    process.exit(1);
  }

  const zip = new JSZip();

  function addFolderToZip(folderPath, zipFolder) {
    const items = fs.readdirSync(folderPath);
    for (const item of items) {
      const fullPath = path.join(folderPath, item);
      const stat = fs.statSync(fullPath);
      if (stat.isDirectory()) {
        const subZip = zipFolder.folder(item);
        addFolderToZip(fullPath, subZip);
      } else {
        // Skip existing zip files inside dist to prevent recursive bloat
        if (item.endsWith('.zip')) continue;
        const fileData = fs.readFileSync(fullPath);
        zipFolder.file(item, fileData);
      }
    }
  }

  addFolderToZip(distDir, zip);

  // 1. Standalone Zero-Dependency Node.js Server (launcher.cjs)
  const nodeLauncher = `/**
 * Wonder World Kids - Standalone Local Server Launcher
 * Uses built-in Node.js modules only. Zero external dependencies.
 * Serves files with correct MIME types for ES Modules and Web Workers.
 */
const http = require('http');
const fs = require('fs');
const path = require('path');
const { exec } = require('child_process');

const PORT = process.env.PORT || 8080;
const ROOT = __dirname;

const MIME_TYPES = {
  '.html': 'text/html; charset=utf-8',
  '.js': 'application/javascript; charset=utf-8',
  '.mjs': 'application/javascript; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.webmanifest': 'application/manifest+json; charset=utf-8',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.gif': 'image/gif',
  '.svg': 'image/svg+xml',
  '.ico': 'image/x-icon',
  '.woff': 'font/woff',
  '.woff2': 'font/woff2',
  '.ttf': 'font/ttf',
  '.mp3': 'audio/mpeg',
  '.wav': 'audio/wav',
  '.ogg': 'audio/ogg'
};

const server = http.createServer((req, res) => {
  // Strip query strings and decode URL
  let reqPath = decodeURI(req.url.split('?')[0]);
  if (reqPath === '/' || reqPath === '') reqPath = '/index.html';

  let filePath = path.join(ROOT, reqPath);

  // Prevent path traversal outside ROOT
  if (!filePath.startsWith(ROOT)) {
    res.writeHead(403, { 'Content-Type': 'text/plain' });
    return res.end('403 Forbidden');
  }

  fs.stat(filePath, (err, stats) => {
    if (err || !stats.isFile()) {
      // SPA Fallback to index.html for client-side routing
      filePath = path.join(ROOT, 'index.html');
    }

    const ext = path.extname(filePath).toLowerCase();
    const contentType = MIME_TYPES[ext] || 'application/octet-stream';

    fs.readFile(filePath, (readErr, content) => {
      if (readErr) {
        res.writeHead(500, { 'Content-Type': 'text/plain' });
        return res.end('500 Internal Server Error');
      }

      res.writeHead(200, {
        'Content-Type': contentType,
        'Cache-Control': 'no-cache',
        'Access-Control-Allow-Origin': '*'
      });
      res.end(content);
    });
  });
});

server.listen(PORT, '127.0.0.1', () => {
  const url = \`http://localhost:\${PORT}/\`;
  console.log('========================================================');
  console.log('  Wonder World Kids - Super Quest');
  console.log('  100% Offline Educational Suite');
  console.log('========================================================');
  console.log(\`  Local Server is RUNNING at: \${url}\`);
  console.log('  Keep this window open while playing.');
  console.log('  Press Ctrl+C to close the game when finished.');
  console.log('========================================================');

  // Open default browser
  const openCmd = process.platform === 'win32'
    ? \`start "" "\${url}"\`
    : process.platform === 'darwin'
    ? \`open "\${url}"\`
    : \`xdg-open "\${url}"\`;

  exec(openCmd, (error) => {
    if (error) {
      console.log(\`  Please open your browser manually and visit: \${url}\`);
    }
  });
});
`;
  zip.file('launcher.cjs', nodeLauncher);

  // 2. Windows PowerShell Server (start-server.ps1) - Zero-install for 100% of Windows PCs
  const powershellServer = `# Wonder World Kids - Built-in Windows PowerShell Web Server
# Uses .NET HttpListener. Requires no Node.js or Python installation!
$ErrorActionPreference = 'SilentlyContinue'
$Port = 8080
$Root = $PSScriptRoot

# Try to find an available port
for ($i = 0; $i -lt 10; $i++) {
    $TestPort = $Port + $i
    try {
        $Listener = New-Object System.Net.HttpListener
        $Listener.Prefixes.Add("http://localhost:$TestPort/")
        $Listener.Start()
        $Port = $TestPort
        break
    } catch {
        $Listener = $null
    }
}

if (-not $Listener -or -not $Listener.IsListening) {
    Write-Host "Error: Unable to bind to local HTTP port." -ForegroundColor Red
    Write-Host "Please close other applications and try again."
    pause
    exit 1
}

$Url = "http://localhost:$Port/"
Write-Host "========================================================" -ForegroundColor Cyan
Write-Host "  Wonder World Kids - Super Quest (Offline Suite)" -ForegroundColor Yellow
Write-Host "========================================================" -ForegroundColor Cyan
Write-Host "  Starting local server at $Url" -ForegroundColor Green
Write-Host "  Keep this window open while playing!" -ForegroundColor White
Write-Host "  Close this window when finished." -ForegroundColor Gray
Write-Host "========================================================" -ForegroundColor Cyan

# Open default browser
Start-Process $Url

# Mime types hashtable
$Mimes = @{
    ".html" = "text/html; charset=utf-8";
    ".js"   = "application/javascript; charset=utf-8";
    ".mjs"  = "application/javascript; charset=utf-8";
    ".css"  = "text/css; charset=utf-8";
    ".json" = "application/json; charset=utf-8";
    ".png"  = "image/png";
    ".svg"  = "image/svg+xml";
    ".ico"  = "image/x-icon";
    ".woff2"= "font/woff2";
    ".woff" = "font/woff";
    ".ttf"  = "font/ttf"
}

try {
    while ($Listener.IsListening) {
        $Context = $Listener.GetContext()
        $Request = $Context.Request
        $Response = $Context.Response

        $ReqPath = $Request.Url.LocalPath.TrimStart('/')
        if ([string]::IsNullOrEmpty($ReqPath) -or $ReqPath -eq '/') {
            $ReqPath = 'index.html'
        }

        $FilePath = Join-Path $Root $ReqPath
        if (-not (Test-Path $FilePath -PathType Leaf)) {
            $FilePath = Join-Path $Root 'index.html'
        }

        $Ext = [System.IO.Path]::GetExtension($FilePath).ToLower()
        $ContentType = "application/octet-stream"
        if ($Mimes.ContainsKey($Ext)) {
            $ContentType = $Mimes[$Ext]
        }

        try {
            $Bytes = [System.IO.File]::ReadAllBytes($FilePath)
            $Response.ContentType = $ContentType
            $Response.ContentLength64 = $Bytes.Length
            $Response.AddHeader("Cache-Control", "no-cache")
            $Response.OutputStream.Write($Bytes, 0, $Bytes.Length)
        } catch {
            $Response.StatusCode = 500
        } finally {
            $Response.Close()
        }
    }
} finally {
    if ($Listener) { $Listener.Stop(); $Listener.Close() }
}
`;
  zip.file('start-server.ps1', powershellServer);

  // 3. 1-Click Windows Launcher (.bat)
  const windowsBat = `@echo off
setlocal
cd /d "%~dp0"
title Wonder World Kids - Super Quest Launcher

echo ========================================================
echo   Wonder World Kids - Super Quest (Offline Mode)
echo ========================================================
echo   Checking local runtime components...

:: 1. Check if Node.js is installed
where node >nul 2>&1
if %ERRORLEVEL% equ 0 (
    echo   Found Node.js runtime. Launching server...
    node launcher.cjs
    goto :end
)

:: 2. Fall back to Windows built-in PowerShell server (zero extra installs needed)
where powershell.exe >nul 2>&1
if %ERRORLEVEL% equ 0 (
    echo   Using Windows native PowerShell launcher...
    powershell.exe -ExecutionPolicy Bypass -NoProfile -File "%~dp0start-server.ps1"
    goto :end
)

echo.
echo ========================================================
echo   ERROR: Neither Node.js nor PowerShell was detected!
echo   To play Wonder World Kids on Windows:
echo   1. Make sure Windows PowerShell is enabled, OR
echo   2. Install Node.js from https://nodejs.org
echo ========================================================
pause

:end
`;
  zip.file('Play on Windows.bat', windowsBat);

  // 4. Python Server Fallback (launcher.py) for Mac/Linux users
  const pythonLauncher = `#!/usr/bin/env python3
"""
Wonder World Kids - Local Python Server Launcher
Compatible with Python 3.x
"""
import os
import sys
import webbrowser
from http.server import HTTPServer, SimpleHTTPRequestHandler

PORT = 8080
os.chdir(os.path.dirname(os.path.abspath(__file__)))

class KidsHandler(SimpleHTTPRequestHandler):
    def end_headers(self):
        self.send_header('Cache-Control', 'no-cache, no-store, must-revalidate')
        self.send_header('Access-Control-Allow-Origin', '*')
        super().end_headers()

    def guess_type(self, path):
        if path.endswith('.js') or path.endswith('.mjs'):
            return 'application/javascript; charset=utf-8'
        if path.endswith('.woff2'):
            return 'font/woff2'
        return super().guess_type(path)

    def do_GET(self):
        # Fallback to index.html for SPA routes
        path = self.translate_path(self.path)
        if not os.path.exists(path) or os.path.isdir(path):
            self.path = '/index.html'
        return super().do_GET()

for test_port in range(PORT, PORT + 20):
    try:
        httpd = HTTPServer(('127.0.0.1', test_port), KidsHandler)
        PORT = test_port
        break
    except OSError:
        continue

url = f"http://localhost:{PORT}/"
print("========================================================")
print("  Wonder World Kids - Super Quest (Offline Mode)")
print("========================================================")
print(f"  Local Server RUNNING at: {url}")
print("  Keep this terminal window open while playing.")
print("  Press Ctrl+C to close the game when finished.")
print("========================================================")

webbrowser.open(url)
try:
    httpd.serve_forever()
except KeyboardInterrupt:
    print("\\nShutting down server. Goodbye!")
    httpd.server_close()
`;
  zip.file('launcher.py', pythonLauncher);

  // 5. 1-Click Mac Launcher (.command)
  const macCommand = `#!/bin/bash
cd "$(dirname "$0")"
echo "========================================================"
echo "  Wonder World Kids - Super Quest (Offline Mode)"
echo "========================================================"
echo "  Checking Mac runtime components..."

# 1. Try Node.js if available
if command -v node >/dev/null 2>&1; then
    echo "  Starting via Node.js runtime..."
    node launcher.cjs
    exit 0
fi

# 2. Try Python 3 (standard on macOS)
if command -v python3 >/dev/null 2>&1; then
    echo "  Starting via macOS Python 3..."
    python3 launcher.py
    exit 0
fi

# 3. Try legacy Python 2
if command -v python >/dev/null 2>&1; then
    echo "  Starting via macOS Python..."
    python launcher.py
    exit 0
fi

echo ""
echo "========================================================"
echo "  Neither Node.js nor Python3 was found on your Mac."
echo "  To play Wonder World Kids:"
echo "  1. Install Node.js (https://nodejs.org) OR"
echo "  2. Open Terminal and run 'xcode-select --install' for Python."
echo "========================================================"
read -p "Press Enter to exit..."
`;
  zip.file('Play on Mac.command', macCommand);

  // 6. Comprehensive Installation & User Guide
  const installGuide = `================================================================================
  WONDER WORLD KIDS: SUPER QUEST — 100% OFFLINE FAMILY EDITION
================================================================================
Commercial Model: One-Time Purchase ($9 USD)
Privacy: Zero Ads • Zero Tracking • Zero Cloud Accounts Required
Offline: 100% Offline Procedural Sound • Local Device Storage
Age Group: 3–10 Years (Adaptive Curriculum Across 5 Worlds)

================================================================================
1. WINDOWS PC SETUP (Windows 10, 11, 8, 7)
================================================================================
Step 1: Extract this ZIP file completely into a folder on your computer
        (e.g., C:\\Games\\WonderWorldKids). Do not run directly from inside the ZIP!
Step 2: Double-click "Play on Windows.bat".
Step 3: A friendly command window will start the local game server and
        automatically open your default web browser (Edge, Chrome, or Firefox).
Step 4: Keep the command window open while your child plays. When they are
        finished, simply close the window to shut down the game.

Notice on ES Modules: Modern educational web games use JavaScript ES Modules.
Running via "Play on Windows.bat" ensures the game loads with proper security
headers without browser file:// protocol restrictions.

================================================================================
2. MAC SETUP (macOS Sonoma, Ventura, Monterey, Big Sur)
================================================================================
Step 1: Extract this ZIP file into your Applications or Documents folder.
Step 2: Double-click "Play on Mac.command".
        (Tip: The first time you run it, macOS Gatekeeper may ask for permission.
        Right-click "Play on Mac.command" and select "Open", then click "Open").
Step 3: Safari or your default browser will launch at http://localhost:8080.
Step 4: Keep the Terminal window open while playing, and close it when done.

================================================================================
3. IPAD & IPHONE SETUP (Progressive Web App - PWA)
================================================================================
Wonder World Kids runs as an installable Progressive Web App (PWA) on iOS:
Step 1: Open the Wonder World Kids web address in Safari on your iPad or iPhone.
Step 2: Tap the "Share" button in Safari (the square with an arrow pointing up).
Step 3: Scroll down the share menu and tap "Add to Home Screen".
Step 4: Tap "Add" in the top-right corner.
Step 5: Tap the Wonder World Kids icon on your home screen!
        It opens in full-screen standalone mode with all 45 games precached
        for offline play. You can disconnect Wi-Fi or turn on Airplane Mode
        and play anytime!

Notice: A Progressive Web App (PWA) runs locally in standalone display mode
using cached assets. It is not an App Store native binary.

================================================================================
4. ANDROID TABLET & PHONE SETUP (Progressive Web App - PWA)
================================================================================
Step 1: Open the Wonder World Kids web address in Chrome or Edge on your device.
Step 2: Tap the in-app "Install App" button in the header, OR tap the browser's
        three-dot menu (⋮) in the top-right corner.
Step 3: Select "Install app" or "Add to Home screen".
Step 4: Confirm installation. The Wonder World Kids icon will appear on your
        home screen and app drawer.
Step 5: Launch the app from your home screen. All assets and sound synthesizers
        are cached locally for offline play!

================================================================================
5. FAMILY PRIVACY & COPPA GUARANTEE
================================================================================
- Zero Analytics: No Google Analytics, Facebook Pixel, or tracking SDKs.
- Zero Advertising: No banner ads, interstitial videos, or sponsored content.
- Zero Cloud Logins: No email addresses, phone numbers, or passwords collected.
- Local Storage: Player profiles, stars, and sticker albums remain strictly on
  this device.
- Backup & Transfer: Parents can export a family backup JSON file in the Parent
  Dashboard to transfer progress to another family tablet or computer.

Thank you for supporting independent, ad-free educational software for kids!
`;
  zip.file('INSTALLATION & PLAY GUIDE.txt', installGuide);
  zip.file('README.txt', installGuide);

  const outDir = path.resolve('public');
  if (!fs.existsSync(outDir)) {
    fs.mkdirSync(outDir, { recursive: true });
  }

  const zipPath = path.join(outDir, 'WonderWorldKids_Offline_Package.zip');
  console.log('Generating WonderWorldKids_Offline_Package.zip...');
  const content = await zip.generateAsync({
    type: 'nodebuffer',
    compression: 'DEFLATE',
    compressionOptions: { level: 6 }
  });

  fs.writeFileSync(zipPath, content);
  console.log(`Success! Package created at ${zipPath} (${(content.length / 1024 / 1024).toFixed(2)} MB)`);

  // Also copy to dist if dist exists so preview serves latest zip
  const distZipPath = path.join(distDir, 'WonderWorldKids_Offline_Package.zip');
  fs.writeFileSync(distZipPath, content);
}

buildOfflineZip().catch(err => {
  console.error('Error creating offline zip:', err);
  process.exit(1);
});
