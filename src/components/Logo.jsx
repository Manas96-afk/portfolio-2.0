export default function Logo({ className = '', showText = true, size = 'default' }) {
  const isCompact = size === 'compact'
  const isLarge = size === 'large'

  const emblemSize = isLarge ? 48 : isCompact ? 32 : 40

  return (
    <div className={`manas-logo-container ${isCompact ? 'is-compact' : ''} ${className}`}>
      {/* MB Geometric Emblem SVG */}
      <svg
        className="manas-logo-emblem"
        viewBox="0 0 60 60"
        width={emblemSize}
        height={emblemSize}
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <linearGradient id="reactMbGrad1" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#ff3b00" />
            <stop offset="45%" stopColor="#ff7700" />
            <stop offset="100%" stopColor="#d4af37" />
          </linearGradient>

          <linearGradient id="reactMbGrad2" x1="100%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#ffffff" />
            <stop offset="50%" stopColor="#ff8800" />
            <stop offset="100%" stopColor="#ff2a00" />
          </linearGradient>

          <filter id="reactMbGlow" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="2" result="blur" />
            <feComposite in="SourceGraphic" in2="blur" operator="over" />
          </filter>
        </defs>

        {/* Outer Tech Hexagon Contour */}
        <path
          d="M30,3 L54,16 L54,44 L30,57 L6,44 L6,16 Z"
          fill="rgba(255, 59, 0, 0.05)"
          stroke="url(#reactMbGrad1)"
          strokeWidth="1.2"
          strokeOpacity="0.4"
          className="emblem-hex"
        />

        {/* Geometric 'M' Vector */}
        <path
          d="M14,44 L14,15 L26,29 L34,19 L34,44"
          fill="none"
          stroke="url(#reactMbGrad1)"
          strokeWidth="4"
          strokeLinecap="round"
          strokeLinejoin="round"
          filter="url(#reactMbGlow)"
          className="emblem-path-m"
        />

        {/* Interconnected 'B' Vector */}
        <path
          d="M34,19 C41,19 47,22 47,29 C47,34 42,36 34,36 C44,36 48,39 48,45 C48,51 40,52 34,52 L28,52"
          fill="none"
          stroke="url(#reactMbGrad2)"
          strokeWidth="3.6"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="emblem-path-b"
        />

        {/* Micro Tech Accents */}
        <circle cx="30" cy="3" r="1.8" fill="#ff3b00" />
        <circle cx="54" cy="16" r="1.8" fill="#d4af37" />
        <circle cx="6" cy="44" r="1.8" fill="#ff7700" />
        <circle cx="26" cy="29" r="1.5" fill="#ffffff" />
      </svg>

      {/* Accompanying Typography */}
      {showText && (
        <div className="manas-logo-text-group">
          <div className="manas-logo-name">
            <span className="name-first">MANAS</span>
            <span className="name-last">BANDHU</span>
          </div>
          <div className="manas-logo-sub">
            <span className="sub-tag">MOTION &amp; CODE</span>
            <span className="sub-dot" />
          </div>
        </div>
      )}
    </div>
  )
}
