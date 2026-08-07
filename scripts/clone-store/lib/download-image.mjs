/**
 * Shared image download helpers for clone-store tools.
 */
import fs from 'node:fs';
import path from 'node:path';

export function fileSlug(value) {
  const slug = String(value)
    .trim()
    .replace(/[^\p{L}\p{N}]+/gu, '-')
    .replace(/^-+|-+$/g, '')
    .toLowerCase();
  return slug || 'item';
}

export function ensureDir(dir) {
  fs.mkdirSync(dir, { recursive: true });
}

export function mimeForPath(filePath) {
  const ext = path.extname(filePath).toLowerCase();
  if (ext === '.png') return 'image/png';
  if (ext === '.webp') return 'image/webp';
  if (ext === '.gif') return 'image/gif';
  return 'image/jpeg';
}

export async function downloadImage(url, destPath) {
  const res = await fetch(url, {
    headers: {
      'User-Agent': 'CashvioCloneStore/1.0 (+https://cash-vio.com)',
      Accept: 'image/*',
    },
    redirect: 'follow',
  });
  if (!res.ok) throw new Error(`download HTTP ${res.status}`);
  const contentType = res.headers.get('content-type') || '';
  if (!contentType.startsWith('image/')) {
    throw new Error(`not an image (${contentType})`);
  }
  const buf = Buffer.from(await res.arrayBuffer());
  if (buf.length < 500) throw new Error(`too small (${buf.length} bytes)`);
  fs.writeFileSync(destPath, buf);
  const ext = contentType.includes('png')
    ? 'png'
    : contentType.includes('webp')
      ? 'webp'
      : contentType.includes('gif')
        ? 'gif'
        : 'jpg';
  return {
    bytes: buf,
    mime: contentType.split(';')[0],
    ext,
    size: buf.length,
  };
}

/**
 * Try primary then fallback URLs; write `{destBase}.{ext}`.
 */
export async function downloadWithFallback(primaryUrl, fallbackUrl, destBase) {
  const tryUrls = [primaryUrl, fallbackUrl].filter(Boolean);
  let lastErr;
  for (const url of tryUrls) {
    try {
      const tmp = `${destBase}.tmp`;
      const meta = await downloadImage(url, tmp);
      const finalPath = `${destBase}.${meta.ext}`;
      if (fs.existsSync(finalPath)) fs.unlinkSync(finalPath);
      fs.renameSync(tmp, finalPath);
      for (const e of ['jpg', 'jpeg', 'png', 'webp', 'gif']) {
        const p = `${destBase}.${e}`;
        if (p !== finalPath && fs.existsSync(p)) fs.unlinkSync(p);
      }
      return { path: finalPath, url, ...meta };
    } catch (e) {
      lastErr = e;
    }
  }
  throw lastErr || new Error('download failed');
}

export function findLocalImage(dir, baseName) {
  for (const e of ['jpg', 'jpeg', 'png', 'webp', 'gif']) {
    const p = path.join(dir, `${baseName}.${e}`);
    if (fs.existsSync(p)) return p;
  }
  return null;
}
