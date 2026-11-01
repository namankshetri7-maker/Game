import fs from 'fs';
import zlib from 'zlib';

// Standard CRC32 table implementation
const crcTable = new Uint32Array(256);
for (let n = 0; n < 256; n++) {
  let c = n;
  for (let k = 0; k < 8; k++) {
    if (c & 1) {
      c = 0xedb88320 ^ (c >>> 1);
    } else {
      c = c >>> 1;
    }
  }
  crcTable[n] = c;
}

function crc32(buf) {
  let crc = 0xffffffff;
  for (let i = 0; i < buf.length; i++) {
    crc = crcTable[(crc ^ buf[i]) & 0xff] ^ (crc >>> 8);
  }
  return (crc ^ 0xffffffff) >>> 0;
}

function makeChunk(type, data) {
  const typeBuf = Buffer.from(type, 'ascii');
  const lenBuf = Buffer.alloc(4);
  lenBuf.writeUInt32BE(data.length, 0);

  const toCrc = Buffer.concat([typeBuf, data]);
  const crc = crc32(toCrc);
  const crcBuf = Buffer.alloc(4);
  crcBuf.writeUInt32BE(crc, 0);

  return Buffer.concat([lenBuf, typeBuf, data, crcBuf]);
}

function createPng(width, height, getPixel) {
  const header = Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]);

  const ihdrData = Buffer.alloc(13);
  ihdrData.writeUInt32BE(width, 0);
  ihdrData.writeUInt32BE(height, 4);
  ihdrData[8] = 8; // 8 bits per channel
  ihdrData[9] = 6; // RGBA
  ihdrData[10] = 0; // compression
  ihdrData[11] = 0; // filter
  ihdrData[12] = 0; // interlace

  const ihdrChunk = makeChunk('IHDR', ihdrData);

  // Raw image data with 0 filter byte per scanline
  const scanlineLength = 1 + width * 4;
  const rawData = Buffer.alloc(height * scanlineLength);

  for (let y = 0; y < height; y++) {
    const rowOffset = y * scanlineLength;
    rawData[rowOffset] = 0; // None filter
    for (let x = 0; x < width; x++) {
      const pixelOffset = rowOffset + 1 + x * 4;
      const [r, g, b, a] = getPixel(x, y, width, height);
      rawData[pixelOffset] = r;
      rawData[pixelOffset + 1] = g;
      rawData[pixelOffset + 2] = b;
      rawData[pixelOffset + 3] = a;
    }
  }

  const compressedData = zlib.deflateSync(rawData);
  const idatChunk = makeChunk('IDAT', compressedData);
  const iendChunk = makeChunk('IEND', Buffer.alloc(0));

  return Buffer.concat([header, ihdrChunk, idatChunk, iendChunk]);
}

// Math helper for drawing a star polygon
function isInsideStar(px, py, cx, cy, spikes, outerRadius, innerRadius) {
  const dx = px - cx;
  const dy = py - cy;
  const dist = Math.hypot(dx, dy);
  if (dist > outerRadius) return false;
  if (dist < innerRadius * 0.5) return true;

  let angle = Math.atan2(dy, dx) - Math.PI / 2;
  while (angle < 0) angle += Math.PI * 2;
  const step = Math.PI / spikes;
  const mod = angle % (step * 2);
  const relAngle = mod > step ? (step * 2 - mod) : mod;
  
  // Interpolated radius boundary at this angle
  const t = relAngle / step;
  const r = innerRadius + (outerRadius - innerRadius) * (1 - t);
  return dist <= r;
}

function generateIcon(size, isMaskable = false) {
  return createPng(size, size, (x, y, w, h) => {
    const nx = x / w;
    const ny = y / h;
    const cx = w / 2;
    const cy = h / 2;

    // Corner radius for standard icons, flat for maskable
    const cornerRadius = isMaskable ? 0 : w * 0.22;
    if (!isMaskable) {
      // Rounded rect check
      const dx = Math.max(0, Math.abs(x - cx) - (cx - cornerRadius));
      const dy = Math.max(0, Math.abs(y - cy) - (cy - cornerRadius));
      if (Math.hypot(dx, dy) > cornerRadius) {
        return [0, 0, 0, 0]; // Transparent outside rounded corner
      }
    }

    // Gradient background: indigo (#4f46e5) to violet (#7c3aed) to blue (#2563eb)
    const t = (nx + ny) / 2;
    let r = Math.round(79 * (1 - t) + 124 * t);
    let g = Math.round(70 * (1 - t) + 58 * t);
    let b = Math.round(229 * (1 - t) + 237 * t);

    // Cosmic orbit ring
    const scale = isMaskable ? 0.65 : 0.85;
    const ringDx = (x - cx);
    const ringDy = (y - cy) * 2.2 + ringDx * 0.4;
    const ringDist = Math.hypot(ringDx, ringDy);
    const ringTarget = w * 0.38 * scale;
    if (Math.abs(ringDist - ringTarget) < w * 0.035 * scale) {
      r = Math.min(255, r + 90);
      g = Math.min(255, g + 130);
      b = Math.min(255, b + 150);
    }

    // Outer and Inner star radius
    const starOuter = (w * 0.35) * scale;
    const starInner = starOuter * 0.45;
    const inStar = isInsideStar(x, y, cx, cy, 5, starOuter, starInner);

    if (inStar) {
      // Star fill: Golden yellow (#fbbf24 to #f59e0b)
      const st = (y - (cy - starOuter)) / (starOuter * 2);
      r = Math.round(254 * (1 - st) + 245 * st);
      g = Math.round(240 * (1 - st) + 158 * st);
      b = Math.round(138 * (1 - st) + 11 * st);

      // Star border check
      const edgeOuter = isInsideStar(x, y, cx, cy, 5, starOuter - w * 0.015, starInner - w * 0.01);
      if (!edgeOuter) {
        r = 180;
        g = 83;
        b = 9;
      }

      // Cute eyes (two dark dots)
      const eyeY = cy - starOuter * 0.05;
      const leftEyeX = cx - starOuter * 0.22;
      const rightEyeX = cx + starOuter * 0.22;
      const eyeR = starOuter * 0.12;
      
      const dL = Math.hypot(x - leftEyeX, y - eyeY);
      const dR = Math.hypot(x - rightEyeX, y - eyeY);
      if (dL < eyeR || dR < eyeR) {
        // Eye shine (white dot)
        const shineL = Math.hypot(x - (leftEyeX + eyeR * 0.3), y - (eyeY - eyeR * 0.3));
        const shineR = Math.hypot(x - (rightEyeX + eyeR * 0.3), y - (eyeY - eyeR * 0.3));
        if (shineL < eyeR * 0.35 || shineR < eyeR * 0.35) {
          return [255, 255, 255, 255];
        }
        return [30, 41, 59, 255];
      }

      // Rosy cheeks
      const cheekY = cy + starOuter * 0.15;
      const leftCheekX = cx - starOuter * 0.35;
      const rightCheekX = cx + starOuter * 0.35;
      const cheekR = starOuter * 0.12;
      if (Math.hypot(x - leftCheekX, y - cheekY) < cheekR || Math.hypot(x - rightCheekX, y - cheekY) < cheekR) {
        r = Math.min(255, r + 40);
        g = Math.max(0, g - 60);
        b = Math.max(0, b - 40);
      }

      // Smiling mouth
      const mouthY = cy + starOuter * 0.22;
      const mouthDx = Math.abs(x - cx);
      const mouthTargetY = mouthY + (mouthDx * mouthDx) / (starOuter * 0.5);
      if (mouthDx < starOuter * 0.22 && Math.abs(y - mouthTargetY) < w * 0.018) {
        return [30, 41, 59, 255];
      }
    }

    return [r, g, b, 255];
  });
}

// Generate files
const icons = [
  { name: 'pwa-192x192.png', size: 192, maskable: false },
  { name: 'pwa-512x512.png', size: 512, maskable: false },
  { name: 'pwa-maskable-512x512.png', size: 512, maskable: true },
  { name: 'apple-touch-icon.png', size: 180, maskable: false },
];

for (const icon of icons) {
  const buf = generateIcon(icon.size, icon.maskable);
  fs.writeFileSync(`./public/${icon.name}`, buf);
  console.log(`Generated ./public/${icon.name} (${icon.size}x${icon.size}, bytes=${buf.length})`);
}
