import { useTexture } from '@react-three/drei';
import { useLoader } from '@react-three/fiber';
import { TextureLoader } from 'three';
import { GALLERY_PROJECTS, STUDIO_CONTENT, AWARDS } from '../data/content';

/**
 * useData — Local content data (replaces the old Sanity CMS backend).
 *
 * All content lives in `src/data/content.js` and is bundled at build time.
 * The cache is populated synchronously at module load, so the hooks below
 * simply return the data — no fetching, no state, no effects.
 *
 * The API matches the old `useSanityData` (useGalleryProjects, useStudioContent,
 * useAwards) so rooms and UI components work unchanged.
 */

// Only load the heavier "painted" colour variants on hover-capable (desktop) devices
const supportsHover = typeof window !== 'undefined' && window.matchMedia('(hover: hover)').matches;

// Preloader for ordinary HTML <img> sources (e.g. award thumbnails)
const preloadBrowserImage = (path) => {
    if (typeof window === 'undefined' || !path) return;
    const img = new Image();
    img.src = path;
};

const cache = {
    projects: GALLERY_PROJECTS.map(p => ({ ...p })),
    content: STUDIO_CONTENT.map((item, index) => ({ ...item, id: `${item.platform}-${index}` })),
    awards: AWARDS,
    loaded: true,
};

// ---- Warm the texture / image caches eagerly ----
// Gallery project cards (clothesline wall)
cache.projects.forEach(p => {
    if (p.front) {
        useTexture.preload(p.front);
        preloadBrowserImage(p.front);
    }
    // Painted versions only on desktop (hover devices)
    if (p.painted && supportsHover) {
        useTexture.preload(p.painted);
        preloadBrowserImage(p.painted);
    }
});

// Studio monitors
cache.content.forEach(c => {
    if (c.frontTexture) {
        useLoader.preload(TextureLoader, c.frontTexture);
        preloadBrowserImage(c.frontTexture);
    }
    if (c.paintedFrontTexture && supportsHover) {
        useLoader.preload(TextureLoader, c.paintedFrontTexture);
        preloadBrowserImage(c.paintedFrontTexture);
    }
});

// Awards (rendered in browser <img> tags)
['featured', 'sotd', 'sotm', 'other'].forEach(category => {
    cache.awards[category]?.items?.forEach(item => {
        if (item.image) preloadBrowserImage(item.image);
    });
});

// Kept for API compatibility (previously kicked off the fetch).
export function loadContentData() {
    return Promise.resolve(cache);
}

export function isContentDataLoaded() {
    return cache.loaded;
}

export function useGalleryProjects() {
    return cache.projects;
}

export function useStudioContent() {
    return cache.content;
}

export function useAwards() {
    return cache.awards;
}
