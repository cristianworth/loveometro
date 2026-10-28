import { mkdir, stat } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import sharp from 'sharp';
import { media } from '../src/media.js';

const root = fileURLToPath(new URL('../', import.meta.url));
const output = path.join(root, 'public', 'media');
await mkdir(output, { recursive: true });
let originalBytes = 0;
let preparedBytes = 0;

// Limit concurrency so preparing high-resolution photos does not exhaust memory.
for (const [id, asset] of Object.entries(media)) {
  const input = path.join(root, 'imagens', asset.source);
  const target = path.join(output, `${id}.webp`);
  const original = await stat(input);
  originalBytes += original.size;
  const previous = await stat(target).catch(() => null);
  if (!previous || previous.mtimeMs < original.mtimeMs) {
    await sharp(input).rotate().resize({ width: 1600, height: 1600, fit: 'inside', withoutEnlargement: true }).webp({ quality: asset.kind ? 94 : 86 }).toFile(target);
  }
  preparedBytes += (await stat(target)).size;
}

console.log(`Prepared ${Object.keys(media).length} images: ${(originalBytes / 1e6).toFixed(1)} MB → ${(preparedBytes / 1e6).toFixed(1)} MB. Originals were not modified.`);
