/**
 * SEO Vite Plugin — Manas Bandhu Portfolio
 *
 * Builds JSON-LD structured data (schema.org) and an llms.txt file at build
 * time from the local content in src/data/content.js. It also swaps the
 * static #seo-content block in index.html for a richer, data-driven one.
 *
 * This replaces the previous Sanity-backed version — no network calls, no CMS.
 */

import {
    PERSONAL,
    GALLERY_PROJECTS,
    STUDIO_CONTENT,
    AWARDS,
} from './src/data/content.js';

const SITE_URL = 'https://manas-bandhu.vercel.app';

// Flatten the awards object into a single list for SEO.
function allAwards() {
    if (!AWARDS) return [];
    return Object.values(AWARDS).flatMap(group =>
        (group.items || []).map(item => ({
            ...item,
            category: group.title,
        }))
    );
}

/**
 * Build dynamic JSON-LD structured data (schema.org @graph).
 */
function buildJsonLd() {
    const graph = [];

    const person = {
        '@type': 'Person',
        '@id': `${SITE_URL}/#person`,
        name: PERSONAL.name,
        alternateName: ['Manas Bandhu', 'cnomo_editz', 'Manas'],
        url: SITE_URL,
        jobTitle: 'Video Editor, Motion Designer & Web Developer',
        description: 'Creative professional producing cinematic video edits, motion graphics, and modern web experiences.',
        knowsAbout: [
            'Video Editing', 'Motion Graphics', 'Colour Grading', 'VFX',
            'React', 'Three.js', 'JavaScript', 'TypeScript', 'GSAP', 'Web Development',
        ],
        sameAs: [
            'https://www.youtube.com/@cnomo_editz',
            'https://github.com/Manas96-afk',
            'https://www.instagram.com/cnomo_editz',
            'https://x.com/manas_1303x',
            'https://www.linkedin.com/in/manasbandhu',
        ],
    };
    graph.push(person);

    graph.push({
        '@type': 'WebSite',
        '@id': `${SITE_URL}/#website`,
        url: SITE_URL,
        name: 'Manas Bandhu Portfolio',
        description: 'Interactive 3D portfolio by Manas Bandhu (@cnomo_editz).',
        publisher: { '@id': `${SITE_URL}/#person` },
    });

    graph.push({
        '@type': 'ProfilePage',
        '@id': `${SITE_URL}/#profilepage`,
        url: SITE_URL,
        mainEntity: { '@id': `${SITE_URL}/#person` },
        about: { '@id': `${SITE_URL}/#person` },
    });

    // Projects
    if (GALLERY_PROJECTS?.length) {
        graph.push({
            '@type': 'ItemList',
            '@id': `${SITE_URL}/#projectslist`,
            name: 'Portfolio Projects by Manas Bandhu',
            description: 'Selected projects spanning AI, healthcare, and web development.',
            numberOfItems: GALLERY_PROJECTS.length,
            itemListElement: GALLERY_PROJECTS.map((p, i) => ({
                '@type': 'ListItem',
                position: i + 1,
                item: {
                    '@type': 'CreativeWork',
                    name: p.title,
                    description: p.description || '',
                    url: p.url || undefined,
                    creator: { '@id': `${SITE_URL}/#person` },
                },
            })),
        });

        GALLERY_PROJECTS.forEach(p => {
            const slug = p.title.toLowerCase().replace(/[^a-z0-9]+/g, '-');
            graph.push({
                '@type': 'CreativeWork',
                '@id': `${SITE_URL}/#project-${slug}`,
                name: p.title,
                description: p.description || '',
                url: p.url || undefined,
                creator: { '@id': `${SITE_URL}/#person` },
            });
        });
    }

    // Studio / video content
    if (STUDIO_CONTENT?.length) {
        STUDIO_CONTENT.forEach(s => {
            graph.push({
                '@type': 'VideoObject',
                name: s.title,
                description: s.description || '',
                uploadDate: s.date || undefined,
                creator: { '@id': `${SITE_URL}/#person` },
                ...(s.url ? { contentUrl: s.url } : {}),
            });
        });
    }

    // Awards / milestones
    const awards = allAwards();
    if (awards.length) {
        graph.push({
            '@type': 'ItemList',
            '@id': `${SITE_URL}/#awards`,
            name: 'Milestones & Highlights — Manas Bandhu',
            numberOfItems: awards.length,
            itemListElement: awards.map((a, i) => ({
                '@type': 'ListItem',
                position: i + 1,
                item: {
                    '@type': 'CreativeWork',
                    name: a.label,
                    description: a.category || '',
                },
            })),
        });
    }

    return { '@context': 'https://schema.org', '@graph': graph };
}

/**
 * Build an llms.txt markdown summary for AI/search engines.
 */
function buildLlmsTxt() {
    let content = `# Manas Bandhu\n`;
    content += `> Video Editor, Motion Designer & Web Developer (@cnomo_editz). Based in Jaipur, India. 150+ videos, 10M+ views, 25+ shipped projects.\n\n`;
    content += `URL: ${SITE_URL}\n\n`;

    if (GALLERY_PROJECTS?.length) {
        content += `## Projects\n`;
        GALLERY_PROJECTS.forEach(p => {
            content += `- **${p.title}**: ${p.description || ''}${p.url ? ` (${p.url})` : ''}\n`;
        });
        content += `\n`;
    }

    if (STUDIO_CONTENT?.length) {
        content += `## Studio (Video Work)\n`;
        STUDIO_CONTENT.forEach(s => {
            content += `- **${s.title}**: ${s.description || ''}${s.url ? ` (${s.url})` : ''}\n`;
        });
        content += `\n`;
    }

    const awards = allAwards();
    if (awards.length) {
        content += `## Milestones\n`;
        awards.forEach(a => {
            content += `- ${a.label} — ${a.category}\n`;
        });
        content += `\n`;
    }

    content += `## Socials\n`;
    content += `- YouTube: https://www.youtube.com/@cnomo_editz\n`;
    content += `- GitHub: https://github.com/Manas96-afk\n`;
    content += `- Instagram: https://www.instagram.com/cnomo_editz\n`;
    content += `- X: https://x.com/manas_1303x\n`;
    content += `- LinkedIn: https://www.linkedin.com/in/manasbandhu\n`;
    content += `- Email: ${PERSONAL.email}\n`;

    return content;
}

/**
 * Escape text for safe insertion into HTML.
 */
function esc(str) {
    return String(str ?? '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
}

export function generateSeoHtml() {
    return {
        name: 'local-seo-plugin',

        // Serve llms.txt during local development
        configureServer(server) {
            server.middlewares.use((req, res, next) => {
                if (req.url === '/llms.txt') {
                    res.setHeader('Content-Type', 'text/plain; charset=utf-8');
                    res.end(buildLlmsTxt());
                } else {
                    next();
                }
            });
        },

        async transformIndexHtml(html) {
            // Build the semantic (screen-reader/SEO) HTML block.
            let seoHtml = `\n<div id="seo-content" class="sr-only-seo">\n`;
            seoHtml += `  <header>\n    <h1>Manas Bandhu (@cnomo_editz) | Video Editor, Motion Designer & Web Developer</h1>\n    <p>Interactive 3D portfolio showcasing cinematic video edits, motion graphics, and modern web projects.</p>\n  </header>\n`;

            seoHtml += `  <section id="projects">\n    <h2>Projects</h2>\n    <ul>\n`;
            (GALLERY_PROJECTS || []).forEach(p => {
                seoHtml += `      <li>\n        <h3>${esc(p.title)}</h3>\n        <p>${esc(p.description)}</p>\n${p.url ? `        <a href="${esc(p.url)}">Visit ${esc(p.title)}</a>\n` : ''}      </li>\n`;
            });
            seoHtml += `    </ul>\n  </section>\n`;

            seoHtml += `  <section id="studio">\n    <h2>The Studio (Video Work)</h2>\n    <ul>\n`;
            (STUDIO_CONTENT || []).forEach(s => {
                seoHtml += `      <li>\n        <h3>${esc(s.title)}</h3>\n        <p>${esc(s.description)}</p>\n${s.url ? `        <a href="${esc(s.url)}">Watch</a>\n` : ''}      </li>\n`;
            });
            seoHtml += `    </ul>\n  </section>\n`;

            const awards = allAwards();
            if (awards.length) {
                seoHtml += `  <section id="milestones">\n    <h2>Milestones</h2>\n    <ul>\n`;
                awards.forEach(a => {
                    seoHtml += `      <li>${esc(a.label)} — ${esc(a.category)}</li>\n`;
                });
                seoHtml += `    </ul>\n  </section>\n`;
            }

            seoHtml += `</div>\n`;

            // JSON-LD structured data.
            const jsonLd = JSON.stringify(buildJsonLd(), null, 2);
            const jsonLdScript = `\n  <!-- Dynamic Structured Data (JSON-LD) — generated at build time -->\n  <script type="application/ld+json">\n${jsonLd}\n  </script>\n`;

            // Inject JSON-LD before </head>.
            let out = html.replace('</head>', `${jsonLdScript}</head>`);

            // Replace the static #seo-content block with the dynamic one (prevents duplicate h1s).
            if (out.includes('id="seo-content"')) {
                out = out.replace(/<div id="seo-content" class="sr-only-seo">[\s\S]*?<\/div>/, seoHtml);
            }

            return out;
        },

        generateBundle() {
            this.emitFile({
                type: 'asset',
                fileName: 'llms.txt',
                source: buildLlmsTxt(),
            });
        },
    };
}
