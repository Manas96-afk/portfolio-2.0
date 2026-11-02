/**
 * MANAS BANDHU — Local Content Data
 *
 * Single source of truth for all portfolio content.
 * Replaces the Sanity CMS backend (see hooks/useData.js).
 * Edit this file to update projects, studio videos, awards, and socials.
 */

export const PERSONAL = {
    name: 'MANAS BANDHU',
    brand: '(cnomo_editz)',
    tagline: 'video editor / motion designer / web developer',
    motto1: 'Crafting high-impact cinematic',
    motto2: 'visual stories & digital experiences',
    email: 'mgamer6900@gmail.com',
    location: 'Jaipur, Rajasthan, India',
    availability: 'AVAILABLE FOR SELECTIVE CREATIVE DIRECTING & DEVELOPMENT',
};

// ============================================
// GALLERY — Selected Work (shown as hanging cards)
// front  = black & white "sketch" version
// painted = full colour version (revealed on hover)
// ============================================
export const GALLERY_PROJECTS = [
    {
        id: 'rasmalai',
        title: 'RASMALAI AI ASSISTANT',
        url: 'https://github.com/Manas96-afk',
        description:
            'An AI desktop assistant built with Python and Gemini Flash. It handles voice and vision commands, runs in the system tray, and acts as a lightweight everyday companion on your computer.',
        front: '/projects/rasmalai.webp',
        painted: '/projects/rasmalai_painted.webp',
        techStack: ['/textures/gallery/reactlogo.webp', '/textures/gallery/jslogo.webp'],
    },
    {
        id: 'manas-personal-website',
        title: 'MANAS — PERSONAL WEBSITE',
        url: 'https://manas-bandhu.vercel.app',
        description:
            'My personal portfolio site built with TypeScript and React, styled with hand-tuned CSS and deployed on Vercel. A clean, fast home for my work and writing.',
        front: '/projects/manas-personal-website.webp',
        painted: '/projects/manas-personal-website_painted.webp',
        techStack: ['/textures/gallery/reactlogo.webp', '/textures/gallery/jslogo.webp', '/textures/gallery/csslogo.webp'],
    },
    {
        id: 'drugdex',
        title: 'DRUGDEX',
        url: 'https://github.com/Manas96-afk',
        description:
            'A healthcare platform with a Node and Express REST API. Ships 11 REST endpoints and a fuzzy search engine for fast, forgiving drug lookups.',
        front: '/projects/drugdex.webp',
        painted: '/projects/drugdex_painted.webp',
        techStack: ['/textures/gallery/jslogo.webp', '/textures/gallery/htmllogo.webp', '/textures/gallery/csslogo.webp', '/textures/gallery/firebaselogo.webp'],
    },
    {
        id: 'matelbuild',
        title: 'MATELBUILD',
        url: 'https://github.com/Manas96-afk',
        description:
            'An upcoming build — currently in the workshop. Drop by the studio or check back soon for the release.',
        front: '/projects/matelbuild.webp',
        painted: '/projects/matelbuild_painted.webp',
        techStack: ['/textures/gallery/jslogo.webp', '/textures/gallery/reactlogo.webp'],
    },
];

// ============================================
// STUDIO — YouTube content (shown on monitor tower)
// ============================================
export const STUDIO_CONTENT = [
    {
        id: 'yt-001',
        platform: 'youtube',
        device: 'tv', // Old chunky CRT TV
        title: 'G.O.A.T. Cars — Cinematic Edit',
        description: 'A high-octane cinematic car edit. Beat-synced cuts, screen shakes and impact FX.',
        frontTexture: '/projects/gta-cars.webp',
        paintedFrontTexture: '/projects/gta-cars_painted.webp',
        thumbnail: null,
        url: 'https://www.youtube.com/@cnomo_editz',
        date: '2025-11-02',
        views: '22.4K',
        duration: '0:48',
    },
    {
        id: 'yt-002',
        platform: 'youtube',
        device: 'monitor', // Desktop editing monitor
        title: 'Cooked a MacBook — VFX Breakdown',
        description: 'A comedic VFX short. Practical comedy meets motion graphics and custom sound design.',
        frontTexture: '/projects/macbook.webp',
        paintedFrontTexture: '/projects/macbook_painted.webp',
        thumbnail: null,
        url: 'https://www.youtube.com/@cnomo_editz',
        date: '2025-09-18',
        views: '7K',
        duration: '1:12',
    },
    {
        id: 'yt-003',
        platform: 'youtube',
        device: 'phone', // Vertical phone (portrait crop fits the reel format)
        title: 'Pink Kitty BMW — Reel',
        description: 'Colour-graded automotive reel with 10-bit log footage and a custom LUT.',
        frontTexture: '/projects/pink-bmw-phone.webp',
        paintedFrontTexture: '/projects/pink-bmw-phone_painted.webp',
        thumbnail: null,
        url: 'https://www.youtube.com/@cnomo_editz',
        date: '2025-07-21',
        views: '5.2K',
        duration: '0:39',
    },
    {
        id: 'yt-004',
        platform: 'youtube',
        device: 'slimtv', // Slim flat TV (custom shape)
        title: 'Say The Word — On Beat Edit',
        description: 'Frame-accurate beat sync edit. Every cut lands exactly on the transient.',
        frontTexture: '/projects/on-beat.webp',
        paintedFrontTexture: '/projects/on-beat_painted.webp',
        thumbnail: null,
        url: 'https://www.youtube.com/@cnomo_editz',
        date: '2025-06-05',
        views: '4.4K',
        duration: '0:31',
    },
];

// ============================================
// AWARDS / ACHIEVEMENTS (About room window overlays)
// ============================================
export const AWARDS = {
    featured: {
        id: 'award-featured',
        layout: 'certificate_grid',
        title: 'Milestones',
        items: [
            { label: '25+ Projects Shipped', date: 'Career', image: '/textures/about/SOTD.webp', url: 'https://github.com/Manas96-afk' },
            { label: '4+ Years Building for the Web', date: 'Career', image: '/textures/about/SOTD.webp', url: 'https://github.com/Manas96-afk' },
            { label: '10M+ Views Generated', date: 'Career', image: '/textures/about/SOTD.webp', url: 'https://www.youtube.com/@cnomo_editz' },
            { label: '150+ Videos Produced', date: 'Career', image: '/textures/about/SOTD.webp', url: 'https://www.youtube.com/@cnomo_editz' },
        ],
        platformConfig: { label: 'HONOR', color: '#1a1a1a', icon: '⭐' },
    },
    sotd: {
        id: 'award-sotd',
        layout: 'certificate_grid',
        title: 'Featured Projects',
        items: [
            { label: 'Rasmalai AI Assistant', date: 'React', image: '/textures/about/SOTD.webp', url: 'https://github.com/Manas96-afk' },
            { label: 'DrugDex — drug encyclopedia', date: 'Full-stack', image: '/textures/about/SOTD.webp', url: 'https://github.com/Manas96-afk' },
            { label: 'Manas Personal Website', date: 'R3F', image: '/textures/about/SOTD.webp', url: 'https://github.com/Manas96-afk' },
            { label: 'MATELBUILD', date: 'Web', image: '/textures/about/SOTD.webp', url: 'https://github.com/Manas96-afk' },
        ],
        platformConfig: { label: 'AWARD', color: '#1a1a1a', icon: '🏆' },
    },
    sotm: {
        id: 'award-sotm',
        layout: 'certificate_grid',
        title: 'Education & Tools',
        items: [
            { label: 'BCA — University of Engineering & Management, Jaipur', date: '2024 – 2027', image: '/textures/about/SOTD.webp', url: null },
            { label: 'After Effects & Premiere Pro — cinematic edits', date: 'Daily driver', image: '/textures/about/SOTD.webp', url: null },
            { label: 'CapCut — short-form edits', date: 'Daily driver', image: '/textures/about/SOTD.webp', url: null },
            { label: 'Python & Power BI — data storytelling', date: 'Daily driver', image: '/textures/about/SOTD.webp', url: null },
        ],
        platformConfig: { label: 'BACKGROUND', color: '#1a1a1a', icon: '🎓' },
    },
    other: {
        id: 'award-other',
        layout: 'certificate_grid',
        title: 'Toolbox',
        items: [
            { label: 'Video Editing — CapCut, After Effects, Premiere Pro', date: 'Craft', image: '/textures/about/SOTD.webp', url: 'https://www.youtube.com/@cnomo_editz' },
            { label: 'Python & SQL', date: 'Data', image: '/textures/about/SOTD.webp', url: 'https://github.com/Manas96-afk' },
            { label: 'Power BI & Excel', date: 'Data', image: '/textures/about/SOTD.webp', url: 'https://github.com/Manas96-afk' },
            { label: 'AI Tools — Antigravity, OpenCode, Claude Code', date: 'Workflow', image: '/textures/about/SOTD.webp', url: null },
        ],
        platformConfig: { label: 'CRAFT', color: '#1a1a1a', icon: '🛠️' },
    },
};

// ============================================
// SOCIALS — Contact room barrels
// ============================================
export const SOCIALS = [
    { id: 'linkedin', label: 'LINKEDIN', url: 'https://www.linkedin.com/in/manasbandhu' },
    { id: 'github', label: 'GITHUB', url: 'https://github.com/Manas96-afk' },
    { id: 'x', label: 'X / TWITTER', url: 'https://x.com/manas_1303x' },
    { id: 'instagram', label: 'INSTAGRAM', url: 'https://www.instagram.com/cnomo_editz' },
    { id: 'youtube', label: 'YOUTUBE', url: 'https://www.youtube.com/@cnomo_editz' },
];
