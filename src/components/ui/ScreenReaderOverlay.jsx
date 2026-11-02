import { useScene } from '../../context/SceneContext';
import { useGalleryProjects, useStudioContent, useAwards } from '../../hooks/useData';
import '../../styles/ScreenReaderOverlay.scss';

const NAV_ROOMS = [
    { id: 'about', label: 'The Workshop — My story, skills, and dev journey' },
    { id: 'gallery', label: 'The Gallery — My projects and work' },
    { id: 'studio', label: 'Edited Videos — Video edits and motion work' },
    { id: 'contact', label: "Let's Connect — Contact me" },
];

const ROOM_NAMES = {
    about: 'The Workshop',
    gallery: 'The Gallery',
    studio: 'Edited Videos',
    contact: "Let's Connect",
};

/**
 * ScreenReaderOverlay — A7 Accessibility
 * 
 * Invisible HTML layer providing screen reader access to 3D canvas content.
 * Contains buttons/links matching interactive 3D elements (doors, rooms).
 * Visually hidden via .sr-only but fully accessible to assistive tech.
 */
const ScreenReaderOverlay = () => {
    const { hasEntered, isInRoom, currentRoom, teleportTo, requestExit } = useScene();
    
    // Pobieranie danych do wygenerowania niewidocznego HTML-a dla SEO / robotów
    const projects = useGalleryProjects();
    const studio = useStudioContent();
    const awards = useAwards();

    const navRooms = NAV_ROOMS;

    return (
        <div className="sr-overlay" role="complementary" aria-label="Accessible navigation for 3D portfolio">
            {/* Skip to content link */}
            <a href="#sr-main-nav" className="sr-only sr-focusable">
                Skip to accessible navigation
            </a>

            {/* Main accessible navigation */}
            <nav id="sr-main-nav" className="sr-only" aria-label="Portfolio rooms">
                <h1>Manas Bandhu — Creative Portfolio</h1>
                <h2>Portfolio Navigation</h2>

                {!hasEntered && (
                    <p>Welcome to Manas Bandhu's interactive 3D portfolio. Click or press Enter on the doors to enter.</p>
                )}

                {hasEntered && !isInRoom && (
                    <>
                        <p>Choose a room to explore:</p>
                        <ul>
                            {navRooms.map((room) => (
                                <li key={room.id}>
                                    <button onClick={() => teleportTo(room.id)} type="button">
                                        {room.label}
                                    </button>
                                </li>
                            ))}
                        </ul>
                    </>
                )}

                {hasEntered && isInRoom && (
                    <>
                        <p>
                            You are in the {ROOM_NAMES[currentRoom] || currentRoom} room.
                        </p>
                        <button onClick={requestExit} type="button">
                            Go back to corridor
                        </button>

                        {/* Room-specific content descriptions */}
                        {currentRoom === 'about' && (
                            <div aria-label="The Workshop room content">
                                <h3>The Workshop</h3>
                                <p>This room contains my personal story, awards, journey milestones, and technology skills displayed as interactive balloons.</p>
                                
                                {awards && (
                                    <section>
                                        <h4>My Awards</h4>
                                        <ul>
                                            {awards.sotd && awards.sotd.items && awards.sotd.items.map((a, i) => (
                                                <li key={i}>{a.label} - {a.date} {a.url && <a href={a.url}>View</a>}</li>
                                            ))}
                                            {awards.sotm && awards.sotm.items && awards.sotm.items.map((a, i) => (
                                                <li key={i}>{a.label} - {a.date} {a.url && <a href={a.url}>View</a>}</li>
                                            ))}
                                            {awards.other && awards.other.items && awards.other.items.map((a, i) => (
                                                <li key={i}>{a.label} - {a.date} {a.url && <a href={a.url}>View</a>}</li>
                                            ))}
                                        </ul>
                                    </section>
                                )}
                            </div>
                        )}
                        {currentRoom === 'gallery' && (
                            <div aria-label="Gallery room content">
                                <h3>My Projects</h3>
                                <p>Browse through my portfolio projects displayed on paper cards. Click on a project card to see details and visit the live site.</p>
                                
                                {projects && projects.length > 0 && (
                                    <ul>
                                        {projects.map((p, i) => (
                                            <li key={i}>
                                                <h4>{p.title}</h4>
                                                <p>{p.description}</p>
                                                {p.url && <a href={p.url}>Visit {p.title}</a>}
                                            </li>
                                        ))}
                                    </ul>
                                )}
                            </div>
                        )}
                        {currentRoom === 'contact' && (
                            <div aria-label="Contact room content">
                                <h3>Contact Me</h3>
                                <p>Find my social media links displayed as floating barrels. Click to visit my profiles on LinkedIn, GitHub, and other platforms.</p>
                            </div>
                        )}
                        {currentRoom === 'studio' && (
                            <div aria-label="Edited Videos room content">
                                <h3>Edited Videos</h3>
                                <p>Watch my video edits and motion work displayed on floating monitors. Click a monitor to open the video.</p>

                                {studio && studio.length > 0 && (
                                    <ul>
                                        {studio.map((s, i) => (
                                            <li key={i}>
                                                <h4>{s.title} ({s.platform})</h4>
                                                <p>{s.description}</p>
                                                {s.url && <a href={s.url}>View content</a>}
                                            </li>
                                        ))}
                                    </ul>
                                )}
                            </div>
                        )}

                        {/* Quick navigation to other rooms */}
                        <h3>Quick Navigation</h3>
                        <ul>
                            {navRooms.map((room) => (
                                currentRoom !== room.id ? (
                                    <li key={room.id}>
                                        <button onClick={() => teleportTo(room.id)} type="button">Go to {ROOM_NAMES[room.id]}</button>
                                    </li>
                                ) : null
                            ))}
                        </ul>
                    </>
                )}
            </nav>

            {/* Live region for state changes */}
            <div aria-live="polite" aria-atomic="true" className="sr-only">
                {isInRoom && `Entered ${currentRoom} room`}
            </div>
        </div>
    );
};

export default ScreenReaderOverlay;
