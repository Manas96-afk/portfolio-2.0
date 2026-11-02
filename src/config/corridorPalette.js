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
    wall: '#dfeaf2',         // soft sky-blue paper walls
    wallDoor: '#d9e7ee',     // slightly deeper blue around doors (reads as depth)
    ceiling: '#eef4f8',      // very light sky ceiling
    baseboard: '#f2c9a4',    // peach trim — the corridor's accent color
    threshold: '#f2c9a4',    // matches baseboards at doorways

    // Paper props (doodles, signs, decorations) keep their white paper look
    // so they pop against the tinted walls.

    // Atmosphere (background + fog in App.jsx) = the sky
    atmosphere: '#87CEEB',   // sky blue — visible as sky behind/above everything
};
