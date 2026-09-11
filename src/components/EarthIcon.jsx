export default function EarthIcon({ size = 20, className = '' }) {
  return (
    <span className={`earth-icon-wrap ${className}`} style={{ width: size, height: size }}>
      <svg
        viewBox="0 0 64 64"
        width={size}
        height={size}
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="earth-svg-elem"
      >
        <defs>
          <radialGradient id="globeAtmosphere" cx="40%" cy="35%" r="65%">
            <stop offset="0%" stopColor="#38bdf8" stopOpacity="0.4" />
            <stop offset="70%" stopColor="#0284c7" stopOpacity="0.1" />
            <stop offset="100%" stopColor="#001827" stopOpacity="0" />
          </radialGradient>

          <radialGradient id="globeBody" cx="35%" cy="30%" r="70%">
            <stop offset="0%" stopColor="#0ea5e9" />
            <stop offset="50%" stopColor="#0369a1" />
            <stop offset="90%" stopColor="#082f49" />
            <stop offset="100%" stopColor="#021626" />
          </radialGradient>

          <linearGradient id="globeLand" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#4ade80" />
            <stop offset="60%" stopColor="#22c55e" />
            <stop offset="100%" stopColor="#15803d" />
          </linearGradient>

          <clipPath id="earthClip">
            <circle cx="32" cy="32" r="24" />
          </clipPath>
        </defs>

        {/* Atmosphere Halo */}
        <circle cx="32" cy="32" r="29" fill="url(#globeAtmosphere)" />
        <circle cx="32" cy="32" r="24.5" stroke="#38bdf8" strokeWidth="1" strokeOpacity="0.5" />

        {/* Globe Base Ocean */}
        <circle cx="32" cy="32" r="24" fill="url(#globeBody)" />

        {/* Continents clipped inside sphere */}
        <g clipPath="url(#earthClip)">
          {/* Coordinates grid */}
          <ellipse cx="32" cy="32" rx="24" ry="12" stroke="#7dd3fc" strokeWidth="0.75" strokeOpacity="0.3" strokeDasharray="2 2" />
          <ellipse cx="32" cy="32" rx="12" ry="24" stroke="#7dd3fc" strokeWidth="0.75" strokeOpacity="0.3" strokeDasharray="2 2" />
          <line x1="8" y1="32" x2="56" y2="32" stroke="#7dd3fc" strokeWidth="0.8" strokeOpacity="0.35" />
          <line x1="32" y1="8" x2="32" y2="56" stroke="#7dd3fc" strokeWidth="0.8" strokeOpacity="0.35" />

          {/* Continents */}
          <path d="M16,21 Q21,17 24,22 Q26,26 21,29 Q19,33 21,37 Q17,35 16,30 Z" fill="url(#globeLand)" />
          <path d="M22,37 Q28,38 27,43 Q25,50 22,51 Q20,47 21,41 Z" fill="url(#globeLand)" />
          <path d="M32,18 Q36,16 38,20 Q35,24 39,26 Q38,31 40,36 Q36,44 33,47 Q32,38 31,32 Z" fill="url(#globeLand)" />
          <path d="M40,20 Q48,18 51,23 Q53,29 48,32 Q44,30 43,25 Z" fill="url(#globeLand)" />
          <circle cx="49" cy="46" r="3" fill="url(#globeLand)" />

          {/* Sunlit specular gloss */}
          <path d="M12,18 C16,12 25,10 34,12 C25,15 17,23 15,32 C12,27 11,23 12,18 Z" fill="#ffffff" fillOpacity="0.4" />
        </g>

        {/* Orbit Ring */}
        <ellipse cx="32" cy="32" rx="28" ry="10" stroke="#ff3b00" strokeWidth="1.5" strokeOpacity="0.8" transform="rotate(-25 32 32)" strokeDasharray="30 8 6 8" />
        <circle cx="54" cy="22" r="2" fill="#ff3b00" />
      </svg>
    </span>
  )
}
