import { execFileSync } from 'node:child_process';
import { mkdir, stat } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import { deploymentMedia } from './check-media.mjs';

if (!process.exitCode) {
  const root = fileURLToPath(new URL('../', import.meta.url));
  await mkdir(new URL('../.local/', import.meta.url), { recursive: true });
  const output = '.local/site-media.tar.gz';
  execFileSync('tar', ['-czf', output, ...deploymentMedia], { cwd: root, stdio: 'inherit' });
  const bytes = (await stat(new URL(`../${output}`, import.meta.url))).size;
  console.log(`Created ${output} (${(bytes / 1e6).toFixed(1)} MB) with optimized photos and audio. Original photos are not included.`);
}
