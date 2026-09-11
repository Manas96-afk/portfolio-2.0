import { useState, useEffect, useRef, useCallback } from 'react'

// Web Audio API realistic pull-chain mechanical acoustics
function playPullClickSound(isLightNow) {
  try {
    const AudioCtx = window.AudioContext || window.webkitAudioContext
    if (!AudioCtx) return
    const ctx = new AudioCtx()
    if (ctx.state === 'suspended') {
      ctx.resume()
    }
    const t = ctx.currentTime

    // 1. Heavy mechanical spring-loaded contact snap
    const osc = ctx.createOscillator()
    const gain = ctx.createGain()
    const filter = ctx.createBiquadFilter()

    filter.type = 'bandpass'
    filter.frequency.setValueAtTime(isLightNow ? 2700 : 2100, t)
    filter.Q.setValueAtTime(4.5, t)

    osc.type = 'triangle'
    osc.frequency.setValueAtTime(isLightNow ? 1700 : 1350, t)
    osc.frequency.exponentialRampToValueAtTime(120, t + 0.045)

    gain.gain.setValueAtTime(0.35, t)
    gain.gain.exponentialRampToValueAtTime(0.001, t + 0.05)

    osc.connect(filter)
    filter.connect(gain)
    gain.connect(ctx.destination)

    osc.start(t)
    osc.stop(t + 0.055)

    // 2. Brass body housing resonance
    const thudOsc = ctx.createOscillator()
    const thudGain = ctx.createGain()
    thudOsc.type = 'sine'
    thudOsc.frequency.setValueAtTime(isLightNow ? 320 : 260, t)
    thudOsc.frequency.exponentialRampToValueAtTime(60, t + 0.07)

    thudGain.gain.setValueAtTime(0.25, t)
    thudGain.gain.exponentialRampToValueAtTime(0.001, t + 0.075)

    thudOsc.connect(thudGain)
    thudGain.connect(ctx.destination)
    thudOsc.start(t)
    thudOsc.stop(t + 0.08)

    // 3. Secondary metallic chain rattle reverberation
    setTimeout(() => {
      try {
        const osc2 = ctx.createOscillator()
        const gain2 = ctx.createGain()
        osc2.type = 'triangle'
        osc2.frequency.setValueAtTime(isLightNow ? 980 : 820, ctx.currentTime)
        osc2.frequency.exponentialRampToValueAtTime(160, ctx.currentTime + 0.035)
        gain2.gain.setValueAtTime(0.15, ctx.currentTime)
        gain2.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.04)
        osc2.connect(gain2)
        gain2.connect(ctx.destination)
        osc2.start()
        osc2.stop(ctx.currentTime + 0.045)
      } catch (_) {}
    }, 28)
  } catch (_) {}
}

const NUM_BEADS = 11
const REST_TOTAL_LENGTH = 84
const PULL_THRESHOLD = 26
const MAX_PULL_DISTANCE = 56
const ANCHOR_X = 60
const ANCHOR_Y = 0

export default function ThemeToggle({ className = '' }) {
  const [theme, setTheme] = useState(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('mb_theme')
      if (saved) return saved
      return window.matchMedia('(prefers-color-scheme: light)').matches ? 'light' : 'dark'
    }
    return 'dark'
  })

  const [isDragging, setIsDragging] = useState(false)
  const [isHovered, setIsHovered] = useState(false)
  const [showFlash, setShowFlash] = useState(false)
  const [, setFrameTick] = useState(0)

  // Rock-solid 2nd-order analytical spring & pendulum simulation
  const simRef = useRef({
    // Vertical spring state
    pullY: 0,
    vy: 0,
    targetY: 0,

    // Horizontal pendulum state
    swayX: 0,
    vx: 0,
    targetX: 0,

    // Transverse wave amplitude & phase along the chain
    waveAmp: 0,
    wavePhase: 0,

    isDragging: false,
    hasMoved: false,
    dragStartX: 0,
    dragStartY: 0
  })

  const containerRef = useRef(null)
  const animFrameId = useRef(null)

  // Sync theme with <html> attribute & storage
  useEffect(() => {
    const root = document.documentElement
    root.setAttribute('data-theme', theme)
    localStorage.setItem('mb_theme', theme)

    root.classList.add('theme-in-transition')
    const timer = setTimeout(() => {
      root.classList.remove('theme-in-transition')
    }, 450)

    return () => clearTimeout(timer)
  }, [theme])

  // Trigger theme toggle with sound, vibration, and flash
  const triggerToggle = useCallback(() => {
    const nextTheme = theme === 'dark' ? 'light' : 'dark'
    playPullClickSound(nextTheme === 'light')

    if (typeof navigator !== 'undefined' && navigator.vibrate) {
      navigator.vibrate([18, 30, 18])
    }

    setShowFlash(true)
    setTimeout(() => setShowFlash(false), 500)

    setTheme(nextTheme)
  }, [theme])

  // Continuous 60-120 FPS harmonic oscillator loop (Impossible to flip or invert)
  useEffect(() => {
    let lastTime = performance.now()

    const loop = (now) => {
      const rawDt = (now - lastTime) / 1000
      lastTime = now
      const dt = Math.min(0.02, Math.max(0.008, rawDt))
      const sim = simRef.current

      if (sim.isDragging) {
        // Smooth pointer tracking
        sim.pullY += (sim.targetY - sim.pullY) * Math.min(1, dt * 26)
        sim.swayX += (sim.targetX - sim.swayX) * Math.min(1, dt * 24)
        sim.vy = 0
        sim.vx = 0
        sim.waveAmp = (sim.swayX / 40) * 3
      } else {
        // 1. Vertical Hooke's Law Spring-Damper System
        const springK = 380
        const dampingC = 20
        const ay = -springK * sim.pullY - dampingC * sim.vy
        sim.vy += ay * dt
        sim.pullY += sim.vy * dt

        // 2. Horizontal Pendulum Sway Physics
        const pendulumK = 48
        const pendulumDamp = 3.6
        const ax = -pendulumK * sim.swayX - pendulumDamp * sim.vx
        sim.vx += ax * dt
        sim.swayX += sim.vx * dt

        // 3. Transverse Wave Dissipation
        sim.waveAmp *= Math.pow(0.92, dt * 60)
        sim.wavePhase += dt * 16

        // Stability clamping
        if (Math.abs(sim.pullY) < 0.05 && Math.abs(sim.vy) < 0.05) {
          sim.pullY = 0
          sim.vy = 0
        }
        if (Math.abs(sim.swayX) < 0.05 && Math.abs(sim.vx) < 0.05) {
          sim.swayX = 0
          sim.vx = 0
        }
      }

      setFrameTick((t) => (t + 1) % 1000000)
      animFrameId.current = requestAnimationFrame(loop)
    }

    animFrameId.current = requestAnimationFrame(loop)
    return () => cancelAnimationFrame(animFrameId.current)
  }, [])

  // Cursor Proximity Wind Impulse
  const handleContainerMouseMove = (e) => {
    if (simRef.current.isDragging) return
    if (!containerRef.current) return

    const rect = containerRef.current.getBoundingClientRect()
    const mouseX = e.clientX - (rect.left + rect.width / 2)

    if (Math.abs(mouseX) < 45) {
      // Transfer subtle wind impulse to pendulum velocity
      simRef.current.vx += (mouseX > 0 ? -1 : 1) * 1.5
      simRef.current.waveAmp = (mouseX > 0 ? 1 : -1) * 2.5
    }
  }

  // Programmatic quick pull-down with elastic bounce
  const triggerPullAnimation = () => {
    const sim = simRef.current
    sim.pullY = PULL_THRESHOLD + 12
    sim.vy = 35
    sim.swayX = (Math.random() > 0.5 ? 1 : -1) * 4

    setTimeout(() => {
      triggerToggle()
      // Powerful elastic recoil impulse
      sim.vy = -160
      sim.vx = -sim.swayX * 6
      sim.waveAmp = 5
    }, 130)
  }

  // Pointer drag interactions (works seamlessly on Mouse & Touch)
  const handlePointerDown = (e) => {
    e.currentTarget.setPointerCapture(e.pointerId)
    const sim = simRef.current
    sim.isDragging = true
    sim.hasMoved = false
    setIsDragging(true)

    sim.dragStartX = e.clientX
    sim.dragStartY = e.clientY
  }

  const handlePointerMove = (e) => {
    const sim = simRef.current
    if (!sim.isDragging) return

    const deltaX = e.clientX - sim.dragStartX
    const deltaY = e.clientY - sim.dragStartY

    if (Math.abs(deltaY) > 3 || Math.abs(deltaX) > 3) {
      sim.hasMoved = true
    }

    // Dynamic 2D pull target
    const rawPullY = Math.max(0, deltaY)
    const dampedY = Math.min(MAX_PULL_DISTANCE, Math.pow(rawPullY, 0.88) * 1.6)
    const clampedSwayX = Math.max(-35, Math.min(35, deltaX * 0.55))

    sim.targetY = dampedY
    sim.targetX = clampedSwayX
  }

  const handlePointerUp = (e) => {
    const sim = simRef.current
    if (!sim.isDragging) return
    sim.isDragging = false
    setIsDragging(false)

    try {
      e.currentTarget.releasePointerCapture(e.pointerId)
    } catch (_) {}

    // 1. Quick tap / click without drag
    if (!sim.hasMoved || sim.pullY < 5) {
      triggerPullAnimation()
      return
    }

    // 2. Pulled past threshold -> Switch mode & impart elastic recoil impulse
    if (sim.pullY >= PULL_THRESHOLD) {
      triggerToggle()
      // Upward snap velocity
      sim.vy = -150
      // Lateral pendulum whip velocity
      sim.vx = -sim.swayX * 5.5
      sim.waveAmp = 6
    } else {
      // Gentle release snap
      sim.vy = -60
      sim.vx = -sim.swayX * 2.5
    }
  }

  const handleKeyDown = (e) => {
    if (e.key === ' ' || e.key === 'Enter') {
      e.preventDefault()
      triggerPullAnimation()
    }
  }

  const sim = simRef.current
  const currentPull = Math.max(0, sim.pullY)
  const totalLength = REST_TOTAL_LENGTH + currentPull
  const isEngaged = currentPull >= PULL_THRESHOLD
  const isLight = theme === 'light'

  // Generate robust physical nodes guaranteed to hang downwards
  const nodes = Array.from({ length: NUM_BEADS + 1 }, (_, i) => {
    if (i === 0) return { x: ANCHOR_X, y: ANCHOR_Y }

    const t = i / NUM_BEADS
    // Natural catenary arc + transverse wave along the chain
    const arcX = ANCHOR_X + sim.swayX * Math.pow(t, 1.15) + Math.sin(t * Math.PI + sim.wavePhase) * sim.waveAmp * (1 - t)
    const arcY = ANCHOR_Y + totalLength * t

    return { x: arcX, y: arcY }
  })

  const handleNode = nodes[NUM_BEADS]
  const prevNode = nodes[NUM_BEADS - 1]
  const handleAngle = Math.atan2(handleNode.y - prevNode.y, handleNode.x - prevNode.x) * (180 / Math.PI) - 90

  // Smooth SVG path passing through all physical bead nodes
  const pathD = nodes.reduce((acc, n, idx) => {
    if (idx === 0) return `M ${n.x.toFixed(1)} ${n.y.toFixed(1)}`
    const prev = nodes[idx - 1]
    const midX = ((prev.x + n.x) / 2).toFixed(1)
    const midY = ((prev.y + n.y) / 2).toFixed(1)
    return `${acc} Q ${prev.x.toFixed(1)} ${prev.y.toFixed(1)}, ${midX} ${midY}`
  }, '') + ` L ${handleNode.x.toFixed(1)} ${handleNode.y.toFixed(1)}`

  return (
    <div
      ref={containerRef}
      className={`pull-string-widget ${className} ${isLight ? 'is-light' : 'is-dark'} ${
        isDragging ? 'is-dragging' : ''
      } ${isEngaged ? 'is-engaged' : ''}`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onMouseMove={handleContainerMouseMove}
    >
      {/* Ceiling Lamp Glow / Fixture Flash */}
      <div className={`ceiling-light-flare ${showFlash ? 'is-flashing' : ''} ${isLight ? 'mode-light' : 'mode-dark'}`} />

      {/* Ceiling Mount Socket Cap */}
      <div className="string-ceiling-fixture">
        <span className="fixture-mount" />
        <span className="fixture-grommet" />
      </div>

      {/* Interactive Hanging String Assembly with Glitch-Free Multi-Segment Chain Physics */}
      <div
        className="string-assembly"
        role="button"
        tabIndex={0}
        aria-label={`Light switch string. Currently in ${isLight ? 'Light' : 'Dark'} mode. Pull down to toggle.`}
        aria-pressed={isLight}
        title={isLight ? 'Pull down to switch to Dark Mode' : 'Pull down to switch to Light Mode'}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        onPointerCancel={handlePointerUp}
        onKeyDown={handleKeyDown}
        style={{
          position: 'relative',
          width: '120px',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'flex-start',
          cursor: isDragging ? 'grabbing' : 'grab'
        }}
      >
        {/* Unified SVG Physical Curved Beaded Chain & Handle (Thick & Never Stuck) */}
        <svg
          className="string-cord-svg"
          width="120"
          height="170"
          viewBox="0 0 120 170"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          style={{ overflow: 'visible' }}
        >
          <defs>
            {/* Metallic Bead 3D Specular Gradients */}
            <radialGradient id="beadGradDarkThick" cx="32%" cy="28%" r="72%">
              <stop offset="0%" stopColor="#ffffff" stopOpacity="0.95" />
              <stop offset="28%" stopColor="#cbd5e1" />
              <stop offset="65%" stopColor="#475569" />
              <stop offset="100%" stopColor="#0f172a" />
            </radialGradient>
            <radialGradient id="beadGradLightThick" cx="32%" cy="28%" r="72%">
              <stop offset="0%" stopColor="#ffffff" />
              <stop offset="30%" stopColor="#fde047" />
              <stop offset="68%" stopColor="#d97706" />
              <stop offset="100%" stopColor="#78350f" />
            </radialGradient>

            {/* Acorn Pendant Body Gradients */}
            <radialGradient id="handleBodyDarkThick" cx="35%" cy="25%" r="75%">
              <stop offset="0%" stopColor="#64748b" />
              <stop offset="35%" stopColor="#334155" />
              <stop offset="75%" stopColor="#1e293b" />
              <stop offset="100%" stopColor="#090d16" />
            </radialGradient>
            <radialGradient id="handleBodyLightThick" cx="35%" cy="25%" r="75%">
              <stop offset="0%" stopColor="#fef3c7" />
              <stop offset="35%" stopColor="#f59e0b" />
              <stop offset="75%" stopColor="#b45309" />
              <stop offset="100%" stopColor="#78350f" />
            </radialGradient>
          </defs>

          {/* Central Thick Braided Cord Wire */}
          <path
            d={pathD}
            stroke={isLight ? 'rgba(180, 83, 9, 0.65)' : 'rgba(148, 163, 184, 0.65)'}
            strokeWidth="2.4"
            strokeLinecap="round"
          />

          {/* Individual Thick Metallic Chain Beads along Physics Curve */}
          {nodes.slice(1, NUM_BEADS).map((node, idx) => {
            const isAlt = idx % 2 === 0
            const radius = isAlt ? 3.6 : 3.1
            return (
              <g key={idx}>
                {/* Bead Shadow */}
                <circle
                  cx={node.x + 0.8}
                  cy={node.y + 1.2}
                  r={radius}
                  fill="rgba(0,0,0,0.3)"
                />
                {/* 3D Metallic Bead */}
                <circle
                  cx={node.x}
                  cy={node.y}
                  r={radius}
                  fill={isLight ? 'url(#beadGradLightThick)' : 'url(#beadGradDarkThick)'}
                  stroke={isLight ? '#78350f' : '#0f172a'}
                  strokeWidth="0.5"
                />
              </g>
            )
          })}

          {/* Seamless Tactile Pendant Handle locked at the bottom tip */}
          <g
            transform={`translate(${handleNode.x}, ${handleNode.y}) rotate(${handleAngle.toFixed(1)})`}
            style={{ transformOrigin: '0 0' }}
          >
            {/* Connector Ferrule Collar */}
            <rect
              x="-4.5"
              y="-1"
              width="9"
              height="5"
              rx="1.5"
              fill={isLight ? '#f59e0b' : '#475569'}
              stroke={isLight ? '#b45309' : '#1e293b'}
              strokeWidth="0.6"
            />

            {/* Bell / Acorn Handle Body */}
            <path
              d="M -8.5 4 Q -10 14, -6 22 Q -3 25, 0 25 Q 3 25, 6 22 Q 10 14, 8.5 4 Z"
              fill={isLight ? 'url(#handleBodyLightThick)' : 'url(#handleBodyDarkThick)'}
              stroke={isLight ? 'rgba(255, 255, 255, 0.5)' : 'rgba(255, 255, 255, 0.22)'}
              strokeWidth="0.8"
            />

            {/* Knurling Grip Lines */}
            <line x1="-6.5" y1="9" x2="6.5" y2="9" stroke={isLight ? 'rgba(0,0,0,0.15)' : 'rgba(255,255,255,0.22)'} strokeWidth="0.8" />
            <line x1="-7" y1="13" x2="7" y2="13" stroke={isLight ? 'rgba(0,0,0,0.15)' : 'rgba(255,255,255,0.22)'} strokeWidth="0.8" />
            <line x1="-6.5" y1="17" x2="6.5" y2="17" stroke={isLight ? 'rgba(0,0,0,0.15)' : 'rgba(255,255,255,0.22)'} strokeWidth="0.8" />

            {/* Luminous Glowing Jewel Core Tip */}
            <circle
              cx="0"
              cy="23"
              r="2.8"
              fill={isLight ? '#ffffff' : '#ff7700'}
              stroke={isLight ? '#f59e0b' : '#ff4400'}
              strokeWidth="0.6"
              style={{
                filter: isEngaged
                  ? 'drop-shadow(0 0 8px var(--accent))'
                  : 'drop-shadow(0 0 4px rgba(255, 120, 0, 0.6))'
              }}
            />

            {/* Bottom Teardrop Grip Ring */}
            <circle
              cx="0"
              cy="28"
              r="4.2"
              fill="none"
              stroke={isLight ? '#b45309' : '#475569'}
              strokeWidth="1.8"
            />
          </g>
        </svg>
      </div>
    </div>
  )
}
