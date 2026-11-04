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
        // Skip any existing nested zip files inside dist/public
        if (item.endsWith('.zip')) continue;
        const fileData = fs.readFileSync(fullPath);
        zipFolder.file(item, fileData);
      }
    }
  }

  addFolderToZip(distDir, zip);

  // 1-Click Windows Launcher (.bat)
  const windowsBat = `@echo off
title WonderWorld Kids Learning - Offline Suite
echo ========================================================
echo   WonderWorld Kids Learning Suite - Offline Mode
echo   Starting 100%% offline browser launcher...
echo ========================================================
start "" "%~dp0index.html"
`;
  zip.file('Play on Windows.bat', windowsBat);

  // 1-Click Mac Launcher (.command)
  const macCommand = `#!/bin/bash
cd "$(dirname "$0")"
echo "========================================================"
echo "  WonderWorld Kids Learning Suite - Offline Mode"
echo "  Launching WonderWorld Kids in your default browser..."
echo "========================================================"
open index.html
`;
  zip.file('Play on Mac.command', macCommand);

  // How to play guide
  const howToPlay = `========================================================
  WONDERWORLD KIDS LEARNING SUITE - 100% OFFLINE EDITION
========================================================

How to Play on Any Device (Zero Internet Required!):

1. Windows PC:
   Double-click "Play on Windows.bat" or double-click "index.html".

2. Mac:
   Double-click "Play on Mac.command" or double-click "index.html".

3. iPad / iPhone / Android Tablet:
   Open WonderWorld in Safari or Chrome, tap "Share" or "Menu" (⋮),
   and tap "Add to Home Screen". The app installs as a 100% offline
   native app with full procedural audio and saves child progress locally!

Features:
- 45 Mini-Games across 5 Thematic Worlds (Math, Phonics, Geography, Science, Logic)
- 100% Offline Procedural Web Audio Engine (No external sound files or wifi needed)
- 4 Persistent Child Profiles & Star/Sticker Album
- Offline Friends & Board Game Playbooks (Junior Ludo, Junior Chess, Snakes & Ladders)
- Interactive Digital Dice Roller, Turn Spinner, and Challenge Timer!
`;
  zip.file('HOW TO PLAY.txt', howToPlay);

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
