import { useEffect, useRef } from 'react';
import { useScene } from '../context/SceneContext';

/**
 * useDocumentMeta — Dynamic Meta Tags & Virtual Routing (History API)
 * 
 * Updates the browser URL, page title, and meta description
 * whenever the user enters/exits a 3D room. Also handles the
 * browser back/forward buttons for seamless navigation.
 */

const SITE_URL = 'https://manas-bandhu.vercel.app';

const ROOM_META = {
    null: {
        path: '/',
        title: 'Manas Bandhu — Video Editor, Motion Designer & Web Developer',
        description: 'Interactive 3D portfolio by Manas Bandhu (@cnomo_editz). Explore cinematic video edits, motion graphics, and web projects in a hand-drawn gallery.',
    },
    about: {
        path: '/workshop',
        title: 'The Workshop — Skills & Journey | Manas Bandhu',
        description: 'Step into The Workshop — Manas Bandhu\'s dev world: skills, tools, story milestones and the journey of a web developer based in Jaipur, India.',
    },
    gallery: {
        path: '/gallery',
        title: 'Gallery & Projects — Manas Bandhu Portfolio',
        description: 'Browse the interactive 3D gallery of projects by Manas Bandhu — Rasmalai AI Assistant, DrugDex, and more, each on a hand-drawn card you can flip and explore.',
    },
    studio: {
        path: '/edited-videos',
        title: 'Edited Videos — Manas Bandhu Portfolio',
        description: 'Watch Manas Bandhu\'s edited videos — cinematic video edits and motion graphics displayed on floating monitors in an immersive 3D space.',
    },
    contact: {
        path: '/contact',
        title: 'Contact — Manas Bandhu Portfolio',
        description: 'Get in touch with Manas Bandhu. Find social media links and contact information in this interactive 3D contact room.',
    },
};

// Map URL paths back to room IDs for deep linking
const PATH_TO_ROOM = {
    '/': null,
    '/about': 'about',      // legacy path (the room is now "The Workshop")
    '/workshop': 'about',
    '/gallery': 'gallery',
    '/edited-videos': 'studio',
    '/studio': 'studio',    // legacy path (the room is now "Edited Videos")
    '/contact': 'contact',
};

/**
 * Returns the room ID that the initial URL points to (for deep linking).
 * Call this once at app startup to determine if we need to auto-teleport.
 */
export function getInitialRoomFromUrl() {
    const path = window.location.pathname.replace(/\/+$/, '') || '/';
    return PATH_TO_ROOM[path] !== undefined ? PATH_TO_ROOM[path] : null;
}

export function useDocumentMeta() {
    const { currentRoom, teleportTo, hasEntered } = useScene();
    const isHandlingPopState = useRef(false);
    const lastPushedRoom = useRef(undefined); // Track what we last pushed to avoid duplicates

    // Update document meta and URL when room changes
    useEffect(() => {
        const roomKey = currentRoom === null ? 'null' : currentRoom;
        const meta = { ...(ROOM_META[roomKey] || ROOM_META['null']) };

        // Update the page title
        document.title = meta.title;

        // Update meta description
        const descTag = document.querySelector('meta[name="description"]');
        if (descTag) {
            descTag.setAttribute('content', meta.description);
        }

        // Update OG meta tags
        const ogTitle = document.querySelector('meta[property="og:title"]');
        if (ogTitle) ogTitle.setAttribute('content', meta.title);

        const ogDesc = document.querySelector('meta[property="og:description"]');
        if (ogDesc) ogDesc.setAttribute('content', meta.description);

        const ogUrl = document.querySelector('meta[property="og:url"]');
        if (ogUrl) ogUrl.setAttribute('content', `${SITE_URL}${meta.path}`);

        // Update canonical link to ensure virtual routes are correctly indexable as separate pages
        const canonicalTag = document.querySelector('link[rel="canonical"]');
        if (canonicalTag) {
            canonicalTag.setAttribute('href', `${SITE_URL}${meta.path}`);
        }

        // Push to browser history (only if not handling a popstate event and room actually changed)
        if (!isHandlingPopState.current && lastPushedRoom.current !== currentRoom) {
            // Use replaceState for the very first load, pushState for subsequent navigations
            if (lastPushedRoom.current === undefined) {
                window.history.replaceState({ room: currentRoom }, '', meta.path);
            } else {
                window.history.pushState({ room: currentRoom }, '', meta.path);
            }
            lastPushedRoom.current = currentRoom;
        }

        isHandlingPopState.current = false;
    }, [currentRoom]);

    // Handle browser back/forward buttons
    useEffect(() => {
        const handlePopState = (event) => {
            isHandlingPopState.current = true;
            const targetRoom = event.state?.room ?? null;
            lastPushedRoom.current = targetRoom;

            if (targetRoom === null) {
                // Going back to corridor — we don't teleport, just need to trigger exit
                // The SceneContext requestExit will handle the animation
                // For now, we update meta immediately
                const meta = ROOM_META['null'];
                document.title = meta.title;
            } else if (hasEntered) {
                // Teleport to the target room
                teleportTo(targetRoom);
            }
        };

        window.addEventListener('popstate', handlePopState);
        return () => window.removeEventListener('popstate', handlePopState);
    }, [teleportTo, hasEntered]);
}
