import { useState, useEffect, useRef } from 'react'
import MagneticText from './MagneticText'
import Reveal from './Reveal'

const DEFAULT_EXPERIMENTS = [
  {
    id: 'exp-1',
    title: 'CYBERPUNK MOTION REEL',
    tag: '3D VFX & KINETIC',
    duration: 'YOUTUBE',
    thumb: '/intro/ezgif-frame-040.jpg',
    views: '120K+ Views',
    software: 'After Effects, Premiere Pro, Cinema 4D',
    style: 'High-Energy 3D Camera Motion & Beat Sync',
    desc: 'Futuristic showreel blending fast-paced motion graphics, neon color grading, and heavy sound design.',
    watchUrl: 'https://www.youtube.com/@cnomo_editz',
    offset: 'offset-left',
  },
  {
    id: 'exp-2',
    title: 'CINEMATIC TRAVEL DOC',
    tag: 'SHORT FILM',
    duration: 'YOUTUBE',
    thumb: '/intro/ezgif-frame-090.jpg',
    views: '45K+ Views',
    software: 'DaVinci Resolve, Premiere Pro',
    style: 'Film Emulation, Match Cuts, Ambient Audio',
    desc: 'Immersive visual story featuring natural color grading, organic speed ramps, and spatial audio soundscapes.',
    watchUrl: 'https://www.youtube.com/@cnomo_editz',
    offset: 'offset-right',
  },
  {
    id: 'exp-3',
    title: 'ESPORTS VELOCITY MONTAGE',
    tag: 'FPS GAMING EDIT',
    duration: 'YOUTUBE',
    thumb: '/intro/ezgif-frame-140.jpg',
    views: '200K+ Views',
    software: 'After Effects, Premiere Pro',
    style: 'Velocity Ramping, Impact SFX, Screen Shakes',
    desc: 'Fast-paced gaming highlight edit with custom velocity curves, syncopated beat drops, and sharp gun sound effects.',
    watchUrl: 'https://www.youtube.com/@cnomo_editz',
    offset: 'offset-center',
  },
  {
    id: 'exp-4',
    title: 'MOTIONVAULT PRESET PACK',
    tag: 'ASSET VAULT',
    duration: 'YOUTUBE',
    thumb: '/intro/ezgif-frame-170.jpg',
    views: '1,000+ Downloads',
    software: 'Lightroom LUTs, Premiere Pro FX',
    style: 'Color Grading & Sound FX Library',
    desc: 'Curated digital asset pack featuring custom LUTs, transitions, sound effects, and After Effects presets.',
    watchUrl: 'https://www.youtube.com/@cnomo_editz',
    offset: 'offset-left',
  },
]

export default function Experiments() {
  const [experiments, setExperiments] = useState(DEFAULT_EXPERIMENTS)
  const [channelStats, setChannelStats] = useState({
    title: 'cnomo editz',
    handle: '@cnomo_editz',
    subscriberCount: 186,
    formattedSubscribers: '186',
    totalViews: 110803,
    formattedTotalViews: '110.8K VIEWS',
    videoCount: 79,
    avatar: 'https://yt3.ggpht.com/xmBZgt2FAtRfaVShVldBHbBwvRq0iVzYve0rrlSkQxaVFc1EXf9RVNow7ptJHPtDqwfbRHiNHQ=s240-c-k-c0x00ffffff-no-rj',
    channelUrl: 'https://www.youtube.com/@cnomo_editz',
  })
  const gridRef = useRef(null)
  const cardRefs = useRef([])
  const [points, setPoints] = useState([])
  const [pathData, setPathData] = useState('')

  const updatePath = () => {
    if (!gridRef.current) return
    const gridRect = gridRef.current.getBoundingClientRect()
    if (gridRect.width === 0 || gridRect.height === 0) return

    const newPoints = []
    cardRefs.current.forEach((cardEl) => {
      if (!cardEl) return
      const mediaEl = cardEl.querySelector('.exp-media-container') || cardEl
      const rect = mediaEl.getBoundingClientRect()

      const x = rect.left - gridRect.left + rect.width / 2
      const y = rect.top - gridRect.top + rect.height / 2
      newPoints.push({ x, y })
    })

    if (newPoints.length > 1) {
      setPoints(newPoints)
      let d = `M ${newPoints[0].x.toFixed(1)} ${newPoints[0].y.toFixed(1)}`
      for (let i = 0; i < newPoints.length - 1; i++) {
        const p0 = newPoints[i]
        const p1 = newPoints[i + 1]
        const dy = p1.y - p0.y
        const cp1x = p0.x
        const cp1y = p0.y + dy * 0.5
        const cp2x = p1.x
        const cp2y = p1.y - dy * 0.5
        d += ` C ${cp1x.toFixed(1)} ${cp1y.toFixed(1)}, ${cp2x.toFixed(1)} ${cp2y.toFixed(1)}, ${p1.x.toFixed(1)} ${p1.y.toFixed(1)}`
      }
      setPathData(d)
    }
  }

  useEffect(() => {
    let isMounted = true

    async function loadTopVideos() {
      try {
        const res = await fetch('/api/most-watched')
        if (!res.ok) return
        const data = await res.json()

        if (!isMounted) return

        if (data.channelStats) {
          setChannelStats(data.channelStats)
        }

        if (Array.isArray(data.videos) && data.videos.length > 0) {
          const offsets = ['offset-left', 'offset-right', 'offset-center', 'offset-left']
          const dynamicList = data.videos.slice(0, 4).map((v, i) => ({
            id: v.id,
            title: v.title,
            tag: `YOUTUBE EDIT // #0${i + 1}`,
            duration: 'YOUTUBE',
            thumb: v.thumbnail || DEFAULT_EXPERIMENTS[i]?.thumb,
            views: v.formattedViews,
            software: 'After Effects, Premiere Pro, DaVinci Resolve',
            style: 'Frame-Accurate Velocity & Rhythm Cuts',
            desc: v.title,
            watchUrl: v.watchUrl,
            offset: offsets[i] || 'offset-left',
          }))

          setExperiments(dynamicList)
        }
      } catch {
        // Fallback gracefully on default items
      }
    }

    loadTopVideos()

    return () => {
      isMounted = false
    }
  }, [])

  useEffect(() => {
    const timer1 = setTimeout(updatePath, 80)
    const timer2 = setTimeout(updatePath, 400)

    const handleResize = () => updatePath()
    window.addEventListener('resize', handleResize)

    let ro = null
    if (gridRef.current && typeof ResizeObserver !== 'undefined') {
      ro = new ResizeObserver(() => updatePath())
      ro.observe(gridRef.current)
    }

    return () => {
      clearTimeout(timer1)
      clearTimeout(timer2)
      window.removeEventListener('resize', handleResize)
      if (ro) ro.disconnect()
    }
  }, [experiments])

  return (
    <section id="experiments" className="section section-experiments">
      <div className="container">
        <div className="exp-header-flex">
          <Reveal className="exp-header">
            <span className="editorial-kicker">04 // EXPERIMENTS & EDITS</span>
            <h2 className="exp-title-main">UNUSUAL CREATIONS</h2>
          </Reveal>

          {/* Sleek Compact Live YouTube Telemetry Pill */}
          <div className="exp-yt-compact-pill">
            <div className="exp-yt-pill-left">
              <div className="exp-yt-avatar-wrap">
                <img
                  src={channelStats?.avatar || 'https://yt3.ggpht.com/xmBZgt2FAtRfaVShVldBHbBwvRq0iVzYve0rrlSkQxaVFc1EXf9RVNow7ptJHPtDqwfbRHiNHQ=s240-c-k-c0x00ffffff-no-rj'}
                  alt="cnomo editz avatar"
                  className="exp-yt-avatar-sm"
                />
                <span className="exp-yt-dot-live" />
              </div>

              <div className="exp-yt-meta-sm">
                <span className="exp-yt-name-sm">{channelStats?.handle || '@cnomo_editz'}</span>
                <div className="exp-yt-metrics-row">
                  <span className="exp-yt-sub-count">
                    <strong>{channelStats?.formattedSubscribers || '186'}</strong> SUBSCRIBERS
                  </span>
                  <span className="exp-yt-metric-sep">•</span>
                  <span className="exp-yt-views-count">{channelStats?.formattedTotalViews?.replace(' VIEWS', '') || '110.8K'} VIEWS</span>
                </div>
              </div>
            </div>

            <a
              href="https://www.youtube.com/@cnomo_editz?sub_confirmation=1"
              target="_blank"
              rel="noreferrer"
              className="btn-exp-yt-pill"
              aria-label="Subscribe on YouTube"
            >
              <span>SUBSCRIBE</span>
              <span className="yt-arrow">↗</span>
            </a>
          </div>
        </div>

        <div className="exp-asymmetric-grid" ref={gridRef}>
          {pathData && (
            <svg className="exp-connector-svg" aria-hidden="true">
              <defs>
                <linearGradient id="exp-line-grad" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#ff3b00" stopOpacity="0.9" />
                  <stop offset="35%" stopColor="#ff7b00" stopOpacity="1" />
                  <stop offset="70%" stopColor="#ff2200" stopOpacity="0.9" />
                  <stop offset="100%" stopColor="#ffaa00" stopOpacity="1" />
                </linearGradient>

                <radialGradient id="exp-glow-radial" cx="50%" cy="50%" r="50%">
                  <stop offset="0%" stopColor="#ff5500" stopOpacity="0.85" />
                  <stop offset="50%" stopColor="#ff2200" stopOpacity="0.3" />
                  <stop offset="100%" stopColor="#ff2200" stopOpacity="0" />
                </radialGradient>

                <filter id="exp-glow-filter" x="-50%" y="-50%" width="200%" height="200%">
                  <feGaussianBlur stdDeviation="3.5" result="blur" />
                  <feComposite in="SourceGraphic" in2="blur" operator="over" />
                </filter>
              </defs>

              {/* Base guide track */}
              <path d={pathData} className="exp-path-base" />

              {/* Animated secondary circuit dash */}
              <path d={pathData} className="exp-path-circuit" />

              {/* Animated laser walking beam */}
              <path d={pathData} className="exp-path-laser" />

              {/* Primary walking energy orb */}
              <g className="exp-energy-walker">
                <animateMotion
                  path={pathData}
                  dur="5.2s"
                  repeatCount="indefinite"
                  rotate="auto"
                />
                <circle r="18" fill="url(#exp-glow-radial)" />
                <circle r="7" fill="var(--accent)" filter="url(#exp-glow-filter)" />
                <circle r="3" fill="#ffffff" />
              </g>

              {/* Secondary trailing spark */}
              <g className="exp-energy-spark">
                <animateMotion
                  path={pathData}
                  dur="5.2s"
                  begin="-2.6s"
                  repeatCount="indefinite"
                  rotate="auto"
                />
                <circle r="5" fill="#ffaa00" filter="url(#exp-glow-filter)" opacity="0.9" />
                <circle r="2" fill="#ffffff" />
              </g>

              {/* Connection nodes at each video center */}
              {points.map((pt, i) => (
                <g
                  key={i}
                  transform={`translate(${pt.x}, ${pt.y})`}
                  className="exp-video-node"
                >
                  <circle r="22" className="exp-node-ping" style={{ animationDelay: `${i * 1.3}s` }} />
                  <circle r="8" className="exp-node-ring" />
                  <circle r="3.5" className="exp-node-core" />
                </g>
              ))}
            </svg>
          )}

          {experiments.map((exp, index) => (
            <Reveal
              key={exp.id}
              delay={index * 120}
              className={`exp-item ${exp.offset}`}
            >
              <a
                ref={(el) => (cardRefs.current[index] = el)}
                href={exp.watchUrl || 'https://www.youtube.com/@cnomo_editz'}
                target="_blank"
                rel="noreferrer"
                className="exp-card-inner exp-card-link"
                aria-label={`Watch ${exp.title} on YouTube`}
              >
                <div className="exp-media-container">
                  <img
                    src={exp.thumb}
                    alt={exp.title}
                    loading="lazy"
                    className="exp-img"
                    onLoad={updatePath}
                  />
                  <div className="exp-play-badge">▶ WATCH ON YOUTUBE ↗</div>
                  <div className="exp-duration">{exp.duration}</div>
                </div>

                <div className="exp-info-block">
                  <div className="exp-tag-row">
                    <span className="editorial-tag-sm">{exp.tag}</span>
                    <span className="exp-views">{exp.views}</span>
                  </div>
                  <h3 className="exp-item-title">
                    <MagneticText strength={0.12} as="span">
                      {exp.title}
                    </MagneticText>
                  </h3>
                  <p className="exp-desc-snippet">{exp.desc}</p>
                </div>
              </a>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  )
}
