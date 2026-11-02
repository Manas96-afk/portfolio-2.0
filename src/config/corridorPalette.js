/**
 * corridorPalette — Soft pastel tints for the hand-drawn corridor.
 *
 * The corridor textures are black-and-white sketches on white paper.
 * `meshBasicMaterial` color MULTIPLIES the map, so a pastel tint colors
 * the paper while the sketch lines stay dark — no texture re-export needed.
 *
 * Tweak these hex values to restyle the whole corridor in one place.
 */
export const CORRIDOR_PALETTE = {
    // Surfaces
    floor: '#f3e2c3',        // warm cream wood planks
    wall: '#e3e9fa',         // soft periwinkle paper walls (pastel, distinct from sky)
    wallDoor: '#d8e0f6',     // deeper periwinkle around doors (reads as depth)
    ceiling: '#f4f5fd',      // lavender-white ceiling
    baseboard: '#f7c9a8',    // peach trim — the corridor's accent color
    threshold: '#f7c9a8',    // matches baseboards at doorways

    // Paper props (doodles, signs, decorations) get pastel tints from the
    // accents below so the whole corridor reads as a soft pastel mix.

    // Atmosphere (background in App.jsx) = the sky
    atmosphere: '#bfe4f7',   // light sky blue — pale, not saturated
    // Fog (App.jsx) is deliberately SEPARATE from the sky: a warm paper haze
    // so the corridor fades to cream in the distance instead of blue haze.
    fog: '#f8f4ec',

    // Pastel accents for doors / props / paper items
    door: '#f9ddc6',         // peach doors
    propPeach: '#f9ddc6',    // warm props (table, coffee)
    propMint: '#d8f2e7',     // fresh mint props
    propLavender: '#e7e3fa', // lilac props
    propPink: '#fadfeb',     // soft pink props
    propCream: '#f8f1e4',    // warm paper — lamps, signs, entrance walls
};
