import { stat } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import { media } from '../src/media.js';

export const deploymentMedia = [
  ...Object.keys(media).map((id) => `public/media/${id}.webp`),
  'song/Avenged_Sevenfold_-_Gunslinger.mp3',
];

const missing = [];
for (const file of deploymentMedia) {
  const info = await stat(fileURLToPath(new URL(`../${file}`, import.meta.url))).catch(() => null);
  if (!info?.isFile() || info.size === 0) missing.push(file);
}

if (missing.length) {
  console.error(`Missing publication media:\n${missing.join('\n')}\nPrepare the images and restore the local music before building the live site.`);
  process.exitCode = 1;
} else {
  console.log(`Publication media verified: ${Object.keys(media).length} images and the soundtrack.`);
}
