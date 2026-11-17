/**
 * Bake the studio "device front" textures.
 *
 * The monitor tower draws a hand-drawn device (TV with dials, monitor,
 * phone) on the front face of every box, and the project photo belongs inside
 * that device's screen. This composites the two so the bezel stays visible:
 *
 *   /textures/studio/<device>_front.webp   -> stretched to the box face aspect
 *   /projects/<photo>.webp                 -> cover-fit into the screen area
 *   => /textures/studio/<device>front_<name>.webp  (+ _painted)
 *
 * Screen areas are fractions of the front face, measured from the artwork.
 * Swap a photo in src/data/content.js, then re-run:
 *
 *   node scripts/gen-device-fronts.mjs
 *
 * Requires the `sharp` package (already a devDependency).
 */

import sharp from 'sharp';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const PUB = path.join(__dirname, '..', 'public');

// [x0, y0, x1, y1] = device screen inside the front artwork, as fractions of
// the face. w/h = output size, chosen to match the box face aspect exactly
// (see the device switch in StudioRoom.jsx) so the texture is never stretched.
// Rects are the largest box containing no artwork ink (bezels stay visible):
// verified by scanning the resized artwork for dark pixels inside each rect.
const DEVICES = {
    tv: { art: 'tv_front', w: 1600, h: 1187, screen: [0.140, 0.156, 0.688, 0.732] },
    monitor: { art: 'monitor_front', w: 1600, h: 1000, screen: [0.048, 0.081, 0.953, 0.880] },
    phone: { art: 'phone_front', w: 512, h: 972, screen: [0.057, 0.101, 0.939, 0.898] },
    slimtv: { art: 'slimtv_front', w: 1600, h: 910, screen: [0.038, 0.058, 0.963, 0.915] },
};

// device, source photo in /projects, output name suffix
const ITEMS = [
    ['tv', 'gta-cars', 'gtacars'],
    ['monitor', 'macbook', 'macbook'],
    ['phone', 'pink-bmw-phone', 'pinkbmw'],
    ['slimtv', 'on-beat', 'onbeat'],
];

for (const [device, photo, name] of ITEMS) {
    const d = DEVICES[device];
    const [x0, y0, x1, y1] = d.screen;
    const left = Math.round(x0 * d.w);
    const top = Math.round(y0 * d.h);
    const sw = Math.round((x1 - x0) * d.w);
    const sh = Math.round((y1 - y0) * d.h);

    for (const variant of ['', '_painted']) {
        // fit:'fill' — the shell textures are stretched onto the box face by its
        // UVs, so the baked front must stretch too. sharp's default fit:'cover'
        // would centre-crop the device (cutting off the TV dials / phone bezels).
        const art = await sharp(path.join(PUB, 'textures', 'studio', d.art + variant + '.webp'))
            .resize(d.w, d.h, { fit: 'fill' })
            .toBuffer();

        const shot = await sharp(path.join(PUB, 'projects', photo + variant + '.webp'))
            .resize(sw, sh, { fit: 'cover', position: 'attention' })
            .toBuffer();

        const out = `${d.art.replace('_front', '')}front_${name}${variant}.webp`;
        await sharp(art)
            .composite([{ input: shot, left, top }])
            .webp({ quality: 82 })
            .toFile(path.join(PUB, 'textures', 'studio', out));
        console.log('  ✓', out, `${d.w}x${d.h}`);
    }
}

console.log('Done.');
