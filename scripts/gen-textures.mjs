/**
 * Texture generation for Manas Bandhu's portfolio.
 *
 * Generates the hand-drawn "door" cards used by the Gallery room and the
 * studio monitor fronts. For every source image we produce two variants:
 *   - <name>.webp          -> black & white "sketch" (default / mobile)
 *   - <name>_painted.webp  -> full colour (revealed on hover, desktop only)
 *
 * Run:  node scripts/gen-textures.mjs
 * Requires the `sharp` package (already a devDependency).
 */

import sharp from 'sharp';
import { mkdir } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const PUB = path.join(__dirname, '..', 'public');

const PAPER = { r: 250, g: 250, b: 248 };
const INK = '#1a1a1a';

// Kernel that approximates a pencil-sketch edge look.
const EDGE_KERNEL = {
    width: 3,
    height: 3,
    kernel: [-1, -1, -1, -1, 8, -1, -1, -1, -1],
};

const toBuffer = (img) => img.png().toBuffer();

/** Draw a slightly wobbly double-rectangle "hand drawn" frame onto an SVG. */
function frameSvg(w, h, inset, strokeW, color) {
    const j = () => (Math.random() - 0.5) * 6; // tiny jitter for hand-drawn feel
    const r = (x, y, ww, hh) =>
        `<rect x="${x + j()}" y="${y + j()}" width="${ww + j()}" height="${hh + j()}" fill="none" stroke="${color}" stroke-width="${strokeW}" stroke-linejoin="round"/>`;
    const x = inset, y = inset, ww = w - inset * 2, hh = h - inset * 2;
    return Buffer.from(
        `<svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="${h}">
            ${r(x, y, ww, hh)}
            ${r(x + strokeW * 1.5, y + strokeW * 1.5, ww - strokeW * 3, hh - strokeW * 3)}
        </svg>`
    );
}

/**
 * Build a portrait "door" card (1024x2048) for the Gallery.
 * Top header box holds the project title; the lower window shows the screenshot.
 */
async function galleryCard(srcPath, outName, painted, title) {
    const W = 1024, H = 2048;
    const contentX = 90;
    const contentW = W - contentX * 2;           // 844

    // Title header box.
    const headerH = 520;
    const headerY = 150;
    const headerSvg = Buffer.from(
        `<svg xmlns="http://www.w3.org/2000/svg" width="${contentW}" height="${headerH}">
            <rect x="8" y="8" width="${contentW - 16}" height="${headerH - 16}" fill="none" stroke="${INK}" stroke-width="6"/>
            <rect x="24" y="24" width="${contentW - 48}" height="${headerH - 48}" fill="none" stroke="${INK}" stroke-width="3"/>
            <text x="50%" y="54%" text-anchor="middle" font-family="Verdana, Arial, sans-serif" font-weight="bold" font-size="62" fill="${INK}">${title}</text>
        </svg>`
    );

    // Screenshot window (contain-fit so the whole site stays visible, centred).
    const shotH = 1040;
    const shotY = headerY + headerH + 90;
    const fitted = await sharp(srcPath)
        .resize(contentW - 40, shotH - 40, { fit: 'contain', background: { r: 245, g: 245, b: 242 } })
        .toBuffer();
    const shotFrame = Buffer.from(
        `<svg xmlns="http://www.w3.org/2000/svg" width="${contentW}" height="${shotH}">
            <rect x="6" y="6" width="${contentW - 12}" height="${shotH - 12}" fill="none" stroke="${INK}" stroke-width="6"/>
        </svg>`
    );

    let composed = sharp({ create: { width: W, height: H, channels: 3, background: PAPER } })
        .composite([
            { input: headerSvg, left: contentX, top: headerY },
            { input: fitted, left: contentX + 20, top: shotY + 20 },
            { input: shotFrame, left: contentX, top: shotY },
            { input: frameSvg(W, H, 40, 5, INK), left: 0, top: 0 },
        ]);

    let buf = await toBuffer(composed);

    if (painted) {
        // Colour: gentle saturation + warmth boost.
        buf = await sharp(buf)
            .modulate({ saturation: 1.15, brightness: 1.02 })
            .toBuffer();
    } else {
        // Sketch: grayscale + high contrast + subtle edge overlay.
        const gray = await sharp(buf).grayscale().linear(1.35, -28).toBuffer();
        const edges = await sharp(buf).grayscale().convolve(EDGE_KERNEL).toBuffer();
        buf = await sharp(gray)
            .composite([{ input: edges, blend: 'multiply' }])
            .png()
            .toBuffer();
    }

    const ext = painted ? '_painted.webp' : '.webp';
    await sharp(buf).webp({ quality: 82 }).toFile(path.join(PUB, 'projects', outName + ext));
    console.log('  ✓ gallery', outName + ext);
}

/**
 * Build a landscape studio monitor front (1474x737) — full-bleed screenshot
 * inside a thin bezel. Same sketch/painted pairing.
 */
async function studioCard(srcPath, outName, painted) {
    const W = 1474, H = 737;
    const bezel = 40;

    const shot = await sharp(srcPath)
        .resize(W - bezel * 2, H - bezel * 2, { fit: 'cover', position: 'attention' })
        .toBuffer();

    const bezelSvg = Buffer.from(
        `<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}">
            <rect x="10" y="10" width="${W - 20}" height="${H - 20}" fill="none" stroke="${INK}" stroke-width="8"/>
        </svg>`
    );

    let buf = await toBuffer(
        sharp({ create: { width: W, height: H, channels: 3, background: PAPER } }).composite([
            { input: shot, left: bezel, top: bezel },
            { input: bezelSvg, left: 0, top: 0 },
        ])
    );

    if (painted) {
        buf = await sharp(buf).modulate({ saturation: 1.15, brightness: 1.02 }).toBuffer();
    } else {
        const gray = await sharp(buf).grayscale().linear(1.35, -28).toBuffer();
        const edges = await sharp(buf).grayscale().convolve(EDGE_KERNEL).toBuffer();
        buf = await sharp(gray).composite([{ input: edges, blend: 'multiply' }]).png().toBuffer();
    }

    const ext = painted ? '_painted.webp' : '.webp';
    await sharp(buf).webp({ quality: 82 }).toFile(path.join(PUB, 'projects', outName + ext));
    console.log('  ✓ studio ', outName + ext);
}

/** Simple "coming soon" placeholder door card (no source image). */
async function placeholderCard(outName) {
    const W = 1024, H = 2048;
    const contentX = 90, contentW = W - contentX * 2;

    const headerSvg = Buffer.from(
        `<svg xmlns="http://www.w3.org/2000/svg" width="${contentW}" height="560">
            <rect x="8" y="8" width="${contentW - 16}" height="544" fill="none" stroke="${INK}" stroke-width="6"/>
            <rect x="24" y="24" width="${contentW - 48}" height="512" fill="none" stroke="${INK}" stroke-width="3"/>
        </svg>`
    );
    const dash = Buffer.from(
        `<svg xmlns="http://www.w3.org/2000/svg" width="${contentW}" height="${Math.round(contentW * 0.66)}">
            <rect x="8" y="8" width="${contentW - 16}" height="${Math.round(contentW * 0.66) - 16}" fill="none" stroke="${INK}" stroke-width="5" stroke-dasharray="26 20"/>
        </svg>`
    );
    const plusSvg = Buffer.from(
        `<svg xmlns="http://www.w3.org/2000/svg" width="${contentW}" height="${Math.round(contentW * 0.66)}">
            <text x="50%" y="52%" font-family="sans-serif" font-size="120" fill="${INK}" text-anchor="middle">+</text>
        </svg>`
    );

    const contentH = Math.round(contentW * 0.66);
    const buf = await toBuffer(
        sharp({ create: { width: W, height: H, channels: 3, background: PAPER } }).composite([
            { input: headerSvg, left: contentX, top: 120 },
            { input: dash, left: contentX, top: 780 },
            { input: plusSvg, left: contentX, top: 780 },
            { input: frameSvg(W, H, 40, 5, INK), left: 0, top: 0 },
        ])
    );

    for (const painted of [false, true]) {
        const ext = painted ? '_painted.webp' : '.webp';
        await sharp(buf).webp({ quality: 82 }).toFile(path.join(PUB, 'projects', outName + ext));
        console.log('  ✓ gallery', outName + ext);
    }
}

async function main() {
    await mkdir(path.join(PUB, 'projects'), { recursive: true });

    console.log('Gallery cards:');
    const gallery = [
        ['projects/rasmalai.png', 'rasmalai', 'RASMALAI'],
        ['projects/manas-personal-website.png', 'manas-personal-website', 'PORTFOLIO'],
        ['projects/drugdex.png', 'drugdex', 'DRUGDEX'],
    ];
    for (const [src, name, title] of gallery) {
        await galleryCard(path.join(PUB, src), name, false, title);
        await galleryCard(path.join(PUB, src), name, true, title);
    }
    await placeholderCard('matelbuild');

    console.log('Studio monitors:');
    const studio = [
        ['what/edit.jpg', 'gta-cars'],
        ['what/experiment.jpg', 'macbook'],
        ['what/build.jpg', 'pink-bmw'],
        ['what/play.jpg', 'on-beat'],
    ];
    for (const [src, name] of studio) {
        await studioCard(path.join(PUB, src), name, false);
        await studioCard(path.join(PUB, src), name, true);
    }

    // Editor world — THE REEL room (portrait cards, same as gallery)
    console.log('Reel cards:');
    const reels = [
        ['what/edit.jpg', 'gta-cars-reel', 'G.O.A.T. CARS'],
        ['what/experiment.jpg', 'macbook-reel', 'COOKED A MACBOOK'],
        ['what/build.jpg', 'pink-bmw-reel', 'PINK KITTY BMW'],
        ['what/play.jpg', 'on-beat-reel', 'SAY THE WORD'],
    ];
    for (const [src, name, title] of reels) {
        await galleryCard(path.join(PUB, src), name, false, title);
        await galleryCard(path.join(PUB, src), name, true, title);
    }

    console.log('Done.');
}

main().catch((e) => {
    console.error(e);
    process.exit(1);
});
