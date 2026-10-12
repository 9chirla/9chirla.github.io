/**
 * Generates a cinematic WebP scroll sequence for the hero canvas.
 * Run: npm run generate:sequence
 */
import fs from "node:fs/promises";
import path from "node:path";
import sharp from "sharp";

const WIDTH = 1280;
const HEIGHT = 720;
const FRAME_COUNT = 90;
const OUT_DIR = path.resolve("public/sequence");

function lerp(a, b, t) {
  return a + (b - a) * t;
}

function easeInOut(t) {
  return t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2;
}

function frameSvg(i, total) {
  const t = easeInOut(i / (total - 1));
  const rot = lerp(-18, 42, t);
  const scale = lerp(0.72, 1.35, t);
  const cx = lerp(42, 58, Math.sin(t * Math.PI));
  const cy = lerp(55, 40, t);
  const glowX = lerp(20, 78, t);
  const glowY = lerp(70, 28, t);
  const ringR = lerp(90, 220, t);
  const orbA = lerp(140, 280, t);
  const orbB = lerp(220, 120, 1 - t);
  const accent = "#c3fa08";
  const ink = "#fafafa";

  return `<?xml version="1.0" encoding="UTF-8"?>
<svg width="${WIDTH}" height="${HEIGHT}" viewBox="0 0 ${WIDTH} ${HEIGHT}" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <radialGradient id="bg" cx="50%" cy="40%" r="75%">
      <stop offset="0%" stop-color="#141414"/>
      <stop offset="55%" stop-color="#0a0a0a"/>
      <stop offset="100%" stop-color="#000000"/>
    </radialGradient>
    <radialGradient id="g1" cx="50%" cy="50%" r="50%">
      <stop offset="0%" stop-color="${accent}" stop-opacity="0.55"/>
      <stop offset="55%" stop-color="${accent}" stop-opacity="0.12"/>
      <stop offset="100%" stop-color="${accent}" stop-opacity="0"/>
    </radialGradient>
    <radialGradient id="g2" cx="50%" cy="50%" r="50%">
      <stop offset="0%" stop-color="${ink}" stop-opacity="0.18"/>
      <stop offset="100%" stop-color="${ink}" stop-opacity="0"/>
    </radialGradient>
    <linearGradient id="beam" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="${accent}" stop-opacity="0"/>
      <stop offset="45%" stop-color="${accent}" stop-opacity="0.22"/>
      <stop offset="100%" stop-color="${accent}" stop-opacity="0"/>
    </linearGradient>
    <filter id="soft" x="-40%" y="-40%" width="180%" height="180%">
      <feGaussianBlur stdDeviation="28"/>
    </filter>
  </defs>

  <rect width="100%" height="100%" fill="url(#bg)"/>

  <!-- atmosphere orbs -->
  <circle cx="${glowX}%" cy="${glowY}%" r="${orbA}" fill="url(#g1)" filter="url(#soft)"/>
  <circle cx="${100 - glowX}%" cy="${100 - glowY * 0.8}%" r="${orbB}" fill="url(#g2)" filter="url(#soft)"/>

  <!-- rotating lattice -->
  <g transform="translate(${WIDTH / 2}, ${HEIGHT / 2}) rotate(${rot}) scale(${scale})">
    <rect x="-420" y="-2" width="840" height="4" fill="${ink}" opacity="0.08"/>
    <rect x="-2" y="-260" width="4" height="520" fill="${ink}" opacity="0.08"/>
    <circle r="${ringR}" fill="none" stroke="${accent}" stroke-opacity="0.35" stroke-width="2"/>
    <circle r="${ringR * 0.62}" fill="none" stroke="${ink}" stroke-opacity="0.14" stroke-width="1.5" stroke-dasharray="8 14"/>
    <circle r="${ringR * 0.28}" fill="${accent}" fill-opacity="0.12"/>
    <circle r="6" fill="${accent}"/>
    ${Array.from({ length: 8 }, (_, k) => {
      const a = (k / 8) * Math.PI * 2 + t * Math.PI;
      const x = Math.cos(a) * ringR * 0.85;
      const y = Math.sin(a) * ringR * 0.85;
      return `<circle cx="${x}" cy="${y}" r="3.5" fill="${ink}" opacity="${0.25 + 0.45 * ((k % 3) / 2)}"/>`;
    }).join("")}
  </g>

  <!-- light beam sweep -->
  <g opacity="${0.35 + 0.35 * Math.sin(t * Math.PI)}">
    <polygon points="${lerp(0, 400, t)},0 ${lerp(180, 620, t)},0 ${lerp(900, 1280, t)},${HEIGHT} ${lerp(700, 980, t)},${HEIGHT}" fill="url(#beam)"/>
  </g>

  <!-- horizon line -->
  <rect x="0" y="${cy}%" width="100%" height="1" fill="${ink}" opacity="0.08"/>
  <circle cx="${cx}%" cy="${cy}%" r="4" fill="${accent}" opacity="0.9"/>

  <!-- vignette -->
  <rect width="100%" height="100%" fill="url(#bg)" opacity="0.15"/>
  <rect width="100%" height="100%" fill="black" opacity="${0.12 + 0.18 * (1 - Math.sin(t * Math.PI))}"/>
</svg>`;
}

async function main() {
  await fs.mkdir(OUT_DIR, { recursive: true });
  const existing = await fs.readdir(OUT_DIR).catch(() => []);
  await Promise.all(
    existing
      .filter((f) => f.endsWith(".webp"))
      .map((f) => fs.unlink(path.join(OUT_DIR, f))),
  );

  console.log(`Generating ${FRAME_COUNT} frames → ${OUT_DIR}`);

  for (let i = 1; i <= FRAME_COUNT; i++) {
    const name = `frame_${String(i).padStart(3, "0")}.webp`;
    const svg = Buffer.from(frameSvg(i - 1, FRAME_COUNT));
    await sharp(svg)
      .webp({ quality: 72, effort: 4 })
      .toFile(path.join(OUT_DIR, name));

    if (i % 15 === 0 || i === FRAME_COUNT) {
      console.log(`  ${i}/${FRAME_COUNT}`);
    }
  }

  // Write a tiny manifest the app can import for frameCount
  await fs.writeFile(
    path.join(OUT_DIR, "manifest.json"),
    JSON.stringify({ frameCount: FRAME_COUNT, pattern: "frame_###.webp" }, null, 2),
  );

  console.log("Done.");
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
