import { useState, useEffect, useRef } from 'react'
import MagneticText from './MagneticText'
import Reveal from './Reveal'

export default function MostWatched() {
  const [videos, setVideos] = useState([])
  const [loading, setLoading] = useState(true)
  const [fallback, setFallback] = useState(false)
  const [configured, setConfigured] = useState(true)

  useEffect(() => {
    let isMounted = true

    async function fetchMostWatched() {
      try {
        const res = await fetch('/api/most-watched')
        if (!res.ok) throw new Error('Network error')
        const data = await res.json()

        if (!isMounted) return

        if (data.configured === false) {
          setConfigured(false)
        }

        if (Array.isArray(data.videos) && data.videos.length > 0) {
          setVideos(data.videos.slice(0, 4))
          setFallback(false)
        } else {
          setFallback(true)
        }
      } catch {
        if (isMounted) {
          setFallback(true)
        }
      } finally {
        if (isMounted) {
          setLoading(false)
        }
      }
    }

    fetchMostWatched()

    return () => {
      isMounted = false
    }
  }, [])

  return (
    <section id="most-watched" className="section section-watched">
      <div className="container">
        <Reveal className="watched-header">
          <span className="editorial-kicker">03 // MOST WATCHED</span>
          <div className="watched-header-row">
            <h2 className="watched-title-main">TOP TRANSMISSIONS</h2>
            <span className="watched-sub-stat">RANKED BY LIVE YOUTUBE VIEWS</span>
          </div>
        </Reveal>

        {loading ? (
          <div className="watched-editorial-list is-loading-list" aria-label="Loading most watched videos">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="watched-row watched-skeleton-row">
                <div className="watched-row-top">
                  <span className="watched-num">{String(i).padStart(2, '0')}</span>
                  <span className="watched-rule" aria-hidden="true" />
                  <span className="watched-category-skeleton" />
                </div>
                <div className="watched-row-content">
                  <div className="watched-info">
                    <div className="skeleton-line skeleton-title" />
                    <div className="skeleton-line skeleton-metric" />
                    <div className="skeleton-line skeleton-btn" />
                  </div>
                  <div className="watched-media-wrapper skeleton-media" />
                </div>
              </div>
            ))}
          </div>
        ) : fallback || videos.length === 0 ? (
          <Reveal className="watched-fallback-card">
            <div className="watched-fallback-inner">
              <span className="fallback-tag">
                {configured ? '[ TRANSMISSION ARCHIVE OFFLINE ]' : '[ YOUTUBE API KEY PENDING ]'}
              </span>
              <h3 className="fallback-heading">
                {configured ? 'LIVE FEED CURRENTLY RECALIBRATING' : 'READY FOR YOUTUBE DATA API V3'}
              </h3>
              <p className="fallback-note">
                {configured
                  ? 'The automated view tracker is refreshing or awaiting YouTube quota renewal.'
                  : 'Add your YOUTUBE_API_KEY in .env to dynamically stream the top 4 most-viewed videos directly from @cnomo_editz.'}
              </p>
              <MagneticText
                strength={0.25}
                as="a"
                href="https://www.youtube.com/@cnomo_editz"
                target="_blank"
                rel="noreferrer"
                className="btn-work-link"
              >
                OPEN YOUTUBE CHANNEL <span className="arrow">↗</span>
              </MagneticText>
            </div>
          </Reveal>
        ) : (
          <div className="watched-editorial-list">
            {videos.map((video, index) => (
              <WatchedVideoRow key={video.id} video={video} index={index} />
            ))}
          </div>
        )}
      </div>
    </section>
  )
}

function WatchedVideoRow({ video, index }) {
  const rowRef = useRef(null)
  const [mouseOffset, setMouseOffset] = useState({ x: 0, y: 0 })

  const handleMouseMove = (e) => {
    if (!rowRef.current) return
    const rect = rowRef.current.getBoundingClientRect()
    const normX = (e.clientX - rect.left) / rect.width - 0.5
    const normY = (e.clientY - rect.top) / rect.height - 0.5
    setMouseOffset({ x: normX, y: normY })
  }

  const handleMouseLeave = () => {
    setMouseOffset({ x: 0, y: 0 })
  }

  const numStr = String(index + 1).padStart(2, '0')

  return (
    <Reveal delay={index * 120} className="watched-row">
      <div
        ref={rowRef}
        className="watched-row-interactive"
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
      >
        <div className="watched-row-top">
          <span className="watched-num">{numStr}</span>
          <span className="watched-rule" aria-hidden="true" />
          <span className="watched-rank-tag">RANK #{index + 1} MOST VIEWED</span>
        </div>

        <div className="watched-row-content">
          <div className="watched-info">
            <h3 className="watched-item-title">
              <MagneticText strength={0.15} as="span">
                {video.title}
              </MagneticText>
            </h3>

            <div className="watched-meta-row">
              <span className="watched-views-badge">
                <span className="views-dot" />
                {video.formattedViews}
              </span>
            </div>

            <div className="watched-actions">
              <a
                href={video.watchUrl}
                target="_blank"
                rel="noreferrer"
                className="btn-watch-link"
                style={{
                  transform: `translate(${mouseOffset.x * 6}px, ${mouseOffset.y * 6}px)`,
                }}
              >
                <span>WATCH ON YOUTUBE</span>
                <span
                  className="watch-arrow"
                  style={{
                    transform: `translate(${mouseOffset.x * 4}px, ${mouseOffset.y * 4}px)`,
                  }}
                >
                  ↗
                </span>
              </a>
            </div>
          </div>

          <div className="watched-media-wrapper">
            <a
              href={video.watchUrl}
              target="_blank"
              rel="noreferrer"
              className="watched-media-link"
              aria-label={`Watch ${video.title} on YouTube`}
            >
              <div
                className="watched-image-mask"
                style={{
                  transform: `translate(${mouseOffset.x * 10}px, ${mouseOffset.y * 8}px) scale(1.02)`,
                }}
              >
                <img
                  src={video.thumbnail}
                  alt={video.title}
                  loading="lazy"
                  className="watched-thumb-img"
                />
                <div className="watched-image-overlay" />
                <div className="watched-play-indicator">
                  <span className="play-triangle">▶</span>
                  <span className="play-label">WATCH</span>
                </div>
              </div>
            </a>
          </div>
        </div>
      </div>
    </Reveal>
  )
}
