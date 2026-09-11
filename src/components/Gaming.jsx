import { useState, useEffect } from 'react'
import Reveal from './Reveal'

const ACTIVE_GAMES = [
  {
    game: 'Valorant',
    id: 'Crometa sql',
    role: 'Competitive Duelist / Initiator',
    rank: 'Ascendant II',
    status: 'Active',
    icon: '🎯',
  },
  {
    game: 'Minecraft',
    id: 'Crometa_69',
    role: 'Creative Builder & Survival',
    rank: 'Veteran',
    status: 'Active',
    icon: '🧱',
  },
  {
    game: 'BGMI (Battlegrounds)',
    id: '55636717616',
    role: 'Squad ICL & Assaulter',
    rank: 'Conqueror',
    status: 'Active',
    icon: '🔫',
  },
  {
    game: 'Roblox',
    id: 'crometa_96',
    role: 'Casual & Minigames',
    rank: 'Player',
    status: 'Chilling',
    icon: '🎮',
  },
  {
    game: 'GTA V Online',
    id: 'Crometa_RP',
    role: 'Roleplay & Heists Driver',
    rank: 'Level 240+',
    status: 'Casual',
    icon: '🚗',
  },
]

const ALL_PLAYED_GAMES = [
  {
    name: 'Valorant',
    genre: 'Tactical Hero Shooter FPS',
    tagline: '5v5 Competitive Duelist & Initiator',
    color: '#FF4655',
    logo: (
      <svg width="40" height="40" viewBox="0 0 100 100" fill="none">
        <rect width="100" height="100" rx="18" fill="#0F1923" />
        <path d="M60 25L80 25L50 75L30 75L60 25Z" fill="#FF4655" />
        <path d="M20 25L36 25L20 50L20 25Z" fill="#FFFFFF" />
      </svg>
    ),
  },
  {
    name: 'Minecraft',
    genre: 'Sandbox / Survival / Creative',
    tagline: 'Infinite World Exploration & Redstone Build',
    color: '#55AA55',
    logo: (
      <svg width="40" height="40" viewBox="0 0 100 100" fill="none">
        <rect width="100" height="100" rx="18" fill="#1C2818" />
        <path d="M20 20H80V42H20V20Z" fill="#55AA55" />
        <path d="M20 42H80V80H20V42Z" fill="#795548" />
        <path d="M30 42V52H42V42H30ZM58 42V52H70V42H58Z" fill="#388E3C" />
      </svg>
    ),
  },
  {
    name: 'BGMI (Battlegrounds Mobile India)',
    genre: 'Battle Royale / Squad Ops',
    tagline: 'Winner Winner Chicken Dinner Squad Leader',
    color: '#FF9900',
    logo: (
      <svg width="40" height="40" viewBox="0 0 100 100" fill="none">
        <rect width="100" height="100" rx="18" fill="#1A1100" />
        <path d="M50 20L75 35V65L50 80L25 65V35L50 20Z" fill="#FF9900" />
        <circle cx="50" cy="50" r="14" fill="#000000" />
        <path d="M50 40V60M40 50H60" stroke="#FF9900" strokeWidth="4" />
      </svg>
    ),
  },
  {
    name: 'Roblox',
    genre: 'Multiplayer Gaming Platform',
    tagline: 'Obstacle Courses, Minigames & Community',
    color: '#E74C3C',
    logo: (
      <svg width="40" height="40" viewBox="0 0 100 100" fill="none">
        <rect width="100" height="100" rx="18" fill="#1E0A08" />
        <rect x="28" y="28" width="44" height="44" rx="8" transform="rotate(-12 50 50)" fill="#E74C3C" />
        <rect x="42" y="42" width="16" height="16" rx="3" transform="rotate(-12 50 50)" fill="#1E0A08" />
      </svg>
    ),
  },
  {
    name: 'GTA V Online',
    genre: 'Open World Action & Heists',
    tagline: 'Los Santos Roleplay & Custom Heists',
    color: '#22C55E',
    logo: (
      <svg width="40" height="40" viewBox="0 0 100 100" fill="none">
        <rect width="100" height="100" rx="18" fill="#051C0C" />
        <path d="M30 25L50 75L70 25H55L50 55L45 25H30Z" fill="#22C55E" />
        <text x="50" y="85" textAnchor="middle" fill="#EAB308" fontSize="12" fontWeight="bold" fontFamily="monospace">FIVE</text>
      </svg>
    ),
  },
  {
    name: 'Apex Legends',
    genre: 'Fast-Paced Hero BR Shooter',
    tagline: 'High-Velocity Movement & Squad Synergies',
    color: '#EF4444',
    logo: (
      <svg width="40" height="40" viewBox="0 0 100 100" fill="none">
        <rect width="100" height="100" rx="18" fill="#1F0808" />
        <path d="M50 20L80 75H65L50 48L35 75H20L50 20Z" fill="#EF4444" />
        <path d="M38 60H62L50 38L38 60Z" fill="#FFFFFF" />
      </svg>
    ),
  },
  {
    name: 'Call of Duty: Warzone',
    genre: 'Military Battle Royale',
    tagline: 'Resurgence Operations & Long-Range Sniping',
    color: '#10B981',
    logo: (
      <svg width="40" height="40" viewBox="0 0 100 100" fill="none">
        <rect width="100" height="100" rx="18" fill="#061F17" />
        <circle cx="50" cy="50" r="28" stroke="#10B981" strokeWidth="6" fill="none" />
        <path d="M50 15V85M15 50H85" stroke="#10B981" strokeWidth="4" />
      </svg>
    ),
  },
  {
    name: 'Fortnite',
    genre: 'Build & Battle Royale',
    tagline: 'Zero Build & Competitive Arena Battles',
    color: '#A855F7',
    logo: (
      <svg width="40" height="40" viewBox="0 0 100 100" fill="none">
        <rect width="100" height="100" rx="18" fill="#190924" />
        <path d="M30 20H70V35H45V48H65V62H45V80H30V20Z" fill="#A855F7" />
      </svg>
    ),
  },
  {
    name: 'Counter-Strike 2 (CS:GO)',
    genre: 'Tactical 5v5 Bomb Defusal',
    tagline: 'Precision Crosshair Placement & Clutch Plays',
    color: '#F59E0B',
    logo: (
      <svg width="40" height="40" viewBox="0 0 100 100" fill="none">
        <rect width="100" height="100" rx="18" fill="#241603" />
        <circle cx="50" cy="50" r="24" stroke="#F59E0B" strokeWidth="5" fill="none" />
        <polygon points="50,30 65,65 35,65" fill="#F59E0B" />
      </svg>
    ),
  },
  {
    name: 'Cyberpunk 2077',
    genre: 'Sci-Fi Action RPG',
    tagline: 'Night City Mercenary & Cyberware Combat',
    color: '#FACC15',
    logo: (
      <svg width="40" height="40" viewBox="0 0 100 100" fill="none">
        <rect width="100" height="100" rx="18" fill="#242003" />
        <path d="M25 30H75L65 70H25V30Z" fill="#FACC15" />
        <path d="M35 40H60L55 60H35V40Z" fill="#000000" />
      </svg>
    ),
  },
]

export default function Gaming() {
  const [copiedId, setCopiedId] = useState(null)
  const [showAllGamesModal, setShowAllGamesModal] = useState(false)

  useEffect(() => {
    if (showAllGamesModal) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
    }
    return () => {
      document.body.style.overflow = ''
    }
  }, [showAllGamesModal])

  const handleCopy = (id) => {
    navigator.clipboard.writeText(id)
    setCopiedId(id)
    setTimeout(() => setCopiedId(null), 2000)
  }

  return (
    <section id="gaming" className="section section-alt">
      <div className="container">
        <Reveal>
          <p className="kicker">Gaming & Community</p>
          <h2 className="section-title">Let's Team Up & Play Together</h2>
        </Reveal>

        {/* Active Game Cards Grid */}
        <div className="gaming-grid">
          {ACTIVE_GAMES.map((g, i) => (
            <Reveal as="div" key={g.game} delay={i * 70} className="gaming-card">
              <div className="gaming-card-head">
                <span className="gaming-icon">{g.icon}</span>
                <span className={`gaming-status-tag status-${g.status.toLowerCase()}`}>
                  ● {g.status}
                </span>
              </div>
              <h3>{g.game}</h3>
              <div className="gaming-id-box">
                <span className="gaming-id-text">{g.id}</span>
                <button
                  className="copy-btn"
                  onClick={() => handleCopy(g.id)}
                  title="Copy Gamer ID"
                >
                  {copiedId === g.id ? '✓ Copied' : 'Copy'}
                </button>
              </div>
              <div className="gaming-meta-row">
                <span className="gaming-rank">{g.rank}</span>
                <span className="gaming-role">{g.role}</span>
              </div>
            </Reveal>
          ))}
        </div>

        {/* Stylish Animated Button to Trigger All Games Played Modal */}
        <Reveal delay={250} className="gaming-action-wrap">
          <button
            type="button"
            className="btn-all-games-animated"
            onClick={() => setShowAllGamesModal(true)}
          >
            <span className="btn-glow-aura" />
            <span className="btn-content-inner">
              <span className="btn-animated-icon">🎮</span>
              <span className="btn-text-main">GAMES I'VE PLAYED IN MY LIFE</span>
              <span className="btn-badge-count">{ALL_PLAYED_GAMES.length} TITANS</span>
            </span>
          </button>
        </Reveal>
      </div>

      {/* Interactive Modal for All Games Played (No IDs, Official Logos Only) */}
      {showAllGamesModal && (
        <div className="all-games-modal-overlay" onClick={() => setShowAllGamesModal(false)}>
          <div className="all-games-modal-card" onClick={(e) => e.stopPropagation()}>
            <div className="all-games-modal-header">
              <div className="modal-title-box">
                <span className="modal-title-icon">👾</span>
                <div>
                  <h3>Games Played In My Lifetime</h3>
                  <span className="modal-subtitle-text">Official titles & franchises played across PC, Mobile & Console</span>
                </div>
              </div>
              <button
                type="button"
                className="modal-close-x"
                onClick={() => setShowAllGamesModal(false)}
                aria-label="Close modal"
              >
                ✕
              </button>
            </div>

            <div className="all-games-modal-body">
              <div className="played-games-list-grid">
                {ALL_PLAYED_GAMES.map((item) => (
                  <div
                    key={item.name}
                    className="played-game-card"
                    style={{ '--game-accent': item.color }}
                  >
                    <div className="game-card-logo">{item.logo}</div>
                    <div className="game-card-info">
                      <h4 className="game-card-title">{item.name}</h4>
                      <span className="game-card-genre">{item.genre}</span>
                      <p className="game-card-tagline">{item.tagline}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="all-games-modal-footer">
              <span className="modal-footer-count">Showing {ALL_PLAYED_GAMES.length} Featured Games</span>
              <button
                type="button"
                className="btn-modal-close-done"
                onClick={() => setShowAllGamesModal(false)}
              >
                Close List
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  )
}