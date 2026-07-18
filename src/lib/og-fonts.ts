/**
 * Fonts for Open Graph image generation (next/og runs on satori).
 *
 * Satori cannot render Arabic through its dynamic font fallback — the
 * Google-hosted Noto Arabic subset it fetches uses a GSUB feature
 * (lookupType 5, substFormat 3) that satori's opentype parser rejects,
 * which kills the whole image response. Embedding Tajawal (the site's
 * Arabic UI font, Latin included) avoids the dynamic lookup entirely.
 */

interface OgFont {
  name: string;
  data: ArrayBuffer;
  weight: 400 | 700;
  style: 'normal';
}

export async function loadArabicOgFonts(): Promise<OgFont[]> {
  const [regular, bold] = await Promise.all([
    fetch(new URL('../assets/fonts/Tajawal-Regular.ttf', import.meta.url)).then((res) =>
      res.arrayBuffer()
    ),
    fetch(new URL('../assets/fonts/Tajawal-Bold.ttf', import.meta.url)).then((res) =>
      res.arrayBuffer()
    ),
  ]);

  return [
    { name: 'Tajawal', data: regular, weight: 400, style: 'normal' },
    { name: 'Tajawal', data: bold, weight: 700, style: 'normal' },
  ];
}
