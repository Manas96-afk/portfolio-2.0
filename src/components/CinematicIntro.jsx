import { useEffect, useRef } from 'react'

const TOTAL = 240
const MAX_CACHE = 120

function pad(n) {
  return String(n).padStart(3, '0')
}

function src(i) {
  return `/intro/ezgif-frame-${pad(i + 1)}.jpg`
}

function coverRect(iw, ih, w, h) {
  const s = Math.max(w / iw, h / ih)
  return { dw: iw * s, dh: ih * s }
}

export default function CinematicIntro() {
  const bgRef = useRef(null)
  const darkCanvasRef = useRef(null)
  const lightCanvasRef = useRef(null)
  const desktopLightVideoRef = useRef(null)
  const mobileDarkVideoRef = useRef(null)
  const mobileLightVideoRef = useRef(null)
  const barRef = useRef(null)
  const overlayRef = useRef(null)
  const scrimHeroRef = useRef(null)

  useEffect(() => {
    const darkCanvas = darkCanvasRef.current
    const lightCanvas = lightCanvasRef.current
    const darkCtx = darkCanvas ? darkCanvas.getContext('2d') : null
    const lightCtx = lightCanvas ? lightCanvas.getContext('2d') : null

    const cache = new Map()
    const inflight = new Set()

    let smoothedProgress = 0
    let lastDrawn = -1
    let raf
    let currentOverlayOpacity = 0.05
    let currentHeroShift = 1
    let targetHeroShift = 1

    const SECTION_TARGETS = [
      { id: 'home', opacity: 0.04 },
      { id: 'who', opacity: 0.18 },
      { id: 'work', opacity: 0.14 },
      { id: 'what', opacity: 0.18 },
      { id: 'experiments', opacity: 0.16 },
      { id: 'contact', opacity: 0.08 },
    ]

    function getScrollTargetOpacity() {
      const scrollCenter = window.scrollY + window.innerHeight * 0.45
      const points = []

      for (const sec of SECTION_TARGETS) {
        let el = document.getElementById(sec.id)
        if (!el && sec.id === 'contact') {
          el = document.querySelector('footer')
        }
        if (el) {
          const rect = el.getBoundingClientRect()
          const top = rect.top + window.scrollY
          const center = top + rect.height / 2
          points.push({ center, opacity: sec.opacity })
        }
      }

      if (points.length === 0) return 0.05
      if (scrollCenter <= points[0].center) return points[0].opacity
      if (scrollCenter >= points[points.length - 1].center) return points[points.length - 1].opacity

      for (let i = 0; i < points.length - 1; i++) {
        const p1 = points[i]
        const p2 = points[i + 1]
        if (scrollCenter >= p1.center && scrollCenter <= p2.center) {
          const ratio = (scrollCenter - p1.center) / (p2.center - p1.center)
          return p1.opacity + ratio * (p2.opacity - p1.opacity)
        }
      }

      return 0.05
    }

    function resize() {
      if (window.innerWidth < 768) return // Mobile uses video elements
      const dpr = Math.max(window.devicePixelRatio || 1, 2)
      const w = Math.round(window.innerWidth * dpr)
      const h = Math.round(window.innerHeight * dpr)

      if (darkCanvas && darkCtx) {
        darkCanvas.width = w
        darkCanvas.height = h
        darkCtx.imageSmoothingEnabled = true
        darkCtx.imageSmoothingQuality = 'high'
      }

      if (lightCanvas && lightCtx) {
        lightCanvas.width = w
        lightCanvas.height = h
        lightCtx.imageSmoothingEnabled = true
        lightCtx.imageSmoothingQuality = 'high'
      }

      render(smoothedProgress)
    }
    resize()

    function load(index) {
      if (window.innerWidth < 768) return
      if (index < 0 || index >= TOTAL) return
      if (cache.has(index) || inflight.has(index)) return
      inflight.add(index)
      const img = new Image()
      img.decoding = 'async'
      img.onload = () => {
        inflight.delete(index)
        cache.set(index, img)
        const keys = [...cache.keys()]
        if (keys.length > MAX_CACHE) {
          const currentFrame = Math.round(smoothedProgress * (TOTAL - 1))
          keys.sort((a, b) => Math.abs(a - currentFrame) - Math.abs(b - currentFrame))
          for (let i = MAX_CACHE; i < keys.length; i++) cache.delete(keys[i])
        }
        const currentFrame = Math.round(smoothedProgress * (TOTAL - 1))
        if (index === currentFrame) render(smoothedProgress)
      }
      img.onerror = () => inflight.delete(index)
      img.src = src(index)
    }

    // Unified 1:1 Rendering Engine for both Dark Mode and Light Mode
    function render(prog) {
      if (window.innerWidth < 768) return

      const canvasWidth = darkCanvas ? darkCanvas.width : (lightCanvas ? lightCanvas.width : window.innerWidth * 2)
      const canvasHeight = darkCanvas ? darkCanvas.height : (lightCanvas ? lightCanvas.height : window.innerHeight * 2)

      const iw = 2560
      const ih = 1440

      const r = coverRect(iw, ih, canvasWidth, canvasHeight)
      const dw = r.dw
      const dh = r.dh
      const midOffsetX = (canvasWidth - dw) / 2
      const offsetY = (canvasHeight - dh) / 2

      // EXACT right-to-center face shift calculation for BOTH Dark and Light Mode
      const maxRightShift = window.innerWidth >= 992
        ? Math.min(canvasWidth * 0.22, dw * 0.19)
        : 0
      const currentRightShift = maxRightShift * currentHeroShift
      const offsetX = midOffsetX + currentRightShift

      // 1. Render Dark Mode Canvas (240-frame sequence)
      if (darkCanvas && darkCtx) {
        const idx = Math.round(prog * (TOTAL - 1))
        const img = cache.get(idx)
        if (img) {
          darkCtx.imageSmoothingEnabled = true
          darkCtx.imageSmoothingQuality = 'high'
          darkCtx.clearRect(0, 0, canvasWidth, canvasHeight)
          darkCtx.drawImage(img, offsetX, offsetY, dw, dh)
          lastDrawn = idx
        }
      }

      // 2. Render Light Mode Canvas (synchronized Light Video with exact same offset & dimensions)
      if (lightCanvas && lightCtx) {
        const lightVideo = desktopLightVideoRef.current
        if (lightVideo && lightVideo.readyState >= 2) {
          lightCtx.imageSmoothingEnabled = true
          lightCtx.imageSmoothingQuality = 'high'
          lightCtx.clearRect(0, 0, canvasWidth, canvasHeight)
          lightCtx.drawImage(lightVideo, offsetX, offsetY, dw, dh)
        }
      }
    }

    function primeWindow(center) {
      if (window.innerWidth < 768) return
      for (let d = 0; d <= 14; d++) {
        load(center + d)
        load(center - d)
      }
    }

    // High-performance video scrub controller
    const videoScrubState = new Map()

    const syncVideoTime = (v, targetTime) => {
      if (!v || !v.duration || isNaN(v.duration)) return
      const safeTarget = Math.max(0.001, Math.min(v.duration - 0.04, targetTime))

      let state = videoScrubState.get(v)
      if (!state) {
        state = { seeking: false, nextTime: safeTarget }
        videoScrubState.set(v, state)
        v.addEventListener('seeked', () => {
          state.seeking = false
          render(smoothedProgress)
          if (state.nextTime !== null && Math.abs(v.currentTime - state.nextTime) > 0.02) {
            const t = state.nextTime
            state.nextTime = null
            state.seeking = true
            if (v.fastSeek) {
              v.fastSeek(t)
            } else {
              v.currentTime = t
            }
          }
        })
      }

      if (state.seeking) {
        state.nextTime = safeTarget
      } else if (Math.abs(v.currentTime - safeTarget) > 0.02) {
        state.seeking = true
        state.nextTime = null
        if (v.fastSeek) {
          v.fastSeek(safeTarget)
        } else {
          v.currentTime = safeTarget
        }
      }
    }

    const primeVideo = (v) => {
      if (!v) return
      v.muted = true
      v.playsInline = true
      const maxScroll = Math.max(1, document.documentElement.scrollHeight - window.innerHeight)
      const p = Math.max(0, Math.min(1, window.scrollY / maxScroll))
      const targetTime = v.duration ? Math.max(0.001, p * v.duration) : 0.001
      v.currentTime = targetTime
      const promise = v.play()
      if (promise !== undefined) {
        promise.then(() => {
          v.pause()
          v.currentTime = targetTime
          render(smoothedProgress)
        }).catch(() => {})
      }
    }

    const vids = [
      mobileDarkVideoRef.current,
      mobileLightVideoRef.current,
      desktopLightVideoRef.current,
    ]

    vids.forEach((v) => {
      if (v) {
        primeVideo(v)
        v.addEventListener('loadeddata', () => {
          primeVideo(v)
          render(smoothedProgress)
        }, { once: true })
        v.addEventListener('loadedmetadata', () => {
          const maxScroll = Math.max(1, document.documentElement.scrollHeight - window.innerHeight)
          const p = Math.max(0, Math.min(1, window.scrollY / maxScroll))
          if (v.duration) v.currentTime = Math.max(0.001, p * v.duration)
          render(smoothedProgress)
        }, { once: true })
      }
    })

    const unlockVideos = () => {
      vids.forEach((v) => {
        if (v && v.paused) {
          v.play().then(() => {
            v.pause()
            render(smoothedProgress)
          }).catch(() => {})
        }
      })
      window.removeEventListener('touchstart', unlockVideos)
      window.removeEventListener('scroll', unlockVideos)
      window.removeEventListener('click', unlockVideos)
    }
    window.addEventListener('touchstart', unlockVideos, { passive: true })
    window.addEventListener('scroll', unlockVideos, { passive: true })
    window.addEventListener('click', unlockVideos, { passive: true })

    // Unified 60-120 FPS Master Animation & Scroll Sync Loop
    function loop() {
      const maxScroll = Math.max(1, document.documentElement.scrollHeight - window.innerHeight)
      const rawP = Math.max(0, Math.min(1, window.scrollY / maxScroll))

      // UNIFIED LERP: Both dark & light media follow the exact same physics curve
      smoothedProgress += (rawP - smoothedProgress) * 0.12
      if (Math.abs(rawP - smoothedProgress) < 0.0005) {
        smoothedProgress = rawP
      }

      // Calculate hero scroll progress for right-to-center shifting
      const heroEl = document.getElementById('home')
      const heroHeight = heroEl ? heroEl.offsetHeight : window.innerHeight
      const scrollY = window.scrollY || window.pageYOffset || 0
      const heroTransitionRange = Math.max(200, heroHeight * 0.75)
      const heroScrollProgress = Math.min(1, Math.max(0, scrollY / heroTransitionRange))

      targetHeroShift = 1 - heroScrollProgress
      currentHeroShift += (targetHeroShift - currentHeroShift) * 0.1
      if (Math.abs(targetHeroShift - currentHeroShift) < 0.001) {
        currentHeroShift = targetHeroShift
      }

      const isMobile = window.innerWidth < 768

      if (isMobile) {
        // Mobile Sync: Both dark and light video scrub with exact same time index
        if (mobileDarkVideoRef.current && mobileDarkVideoRef.current.duration) {
          syncVideoTime(mobileDarkVideoRef.current, smoothedProgress * mobileDarkVideoRef.current.duration)
        }
        if (mobileLightVideoRef.current && mobileLightVideoRef.current.duration) {
          syncVideoTime(mobileLightVideoRef.current, smoothedProgress * mobileLightVideoRef.current.duration)
        }
      } else {
        // Desktop Sync: Both Dark Canvas and Light Canvas render synchronously with identical right-to-center shifting!
        const currentFrame = Math.round(smoothedProgress * (TOTAL - 1))
        if (currentFrame !== lastDrawn) primeWindow(currentFrame)

        if (desktopLightVideoRef.current && desktopLightVideoRef.current.duration) {
          syncVideoTime(desktopLightVideoRef.current, smoothedProgress * desktopLightVideoRef.current.duration)
        }

        render(smoothedProgress)
      }

      if (scrimHeroRef.current) {
        scrimHeroRef.current.style.opacity = currentHeroShift.toFixed(3)
      }

      // Smooth dynamic overlay interpolation
      const targetOverlayOpacity = getScrollTargetOpacity()
      currentOverlayOpacity += (targetOverlayOpacity - currentOverlayOpacity) * 0.08
      if (overlayRef.current) {
        overlayRef.current.style.opacity = currentOverlayOpacity.toFixed(4)
      }

      if (barRef.current) barRef.current.style.transform = `scaleX(${smoothedProgress})`
      raf = requestAnimationFrame(loop)
    }

    const initHeroEl = document.getElementById('home')
    const initHeroHeight = initHeroEl ? initHeroEl.offsetHeight : window.innerHeight
    const initScrollY = window.scrollY || window.pageYOffset || 0
    const initRange = Math.max(200, initHeroHeight * 0.75)
    const initProgress = Math.min(1, Math.max(0, initScrollY / initRange))
    currentHeroShift = 1 - initProgress
    targetHeroShift = 1 - initProgress

    if (window.innerWidth >= 768) {
      primeWindow(0)
      render(0)
    }

    raf = requestAnimationFrame(loop)
    window.addEventListener('resize', resize)

    return () => {
      cancelAnimationFrame(raf)
      window.removeEventListener('resize', resize)
      window.removeEventListener('touchstart', unlockVideos)
      window.removeEventListener('scroll', unlockVideos)
      window.removeEventListener('click', unlockVideos)
    }
  }, [])

  return (
    <>
      <div ref={bgRef} className="intro-bg" aria-hidden="true">
        {/* Desktop / Laptop Media: Dual Dark & Light Canvases for 100% Identical Right-to-Center Shifting */}
        <canvas
          ref={darkCanvasRef}
          className="intro-canvas intro-dark-media"
          aria-hidden="true"
        />
        <canvas
          ref={lightCanvasRef}
          className="intro-canvas intro-light-media"
          aria-hidden="true"
        />

        {/* Hidden Source Video for Light Canvas Rendering */}
        <video
          ref={desktopLightVideoRef}
          src="/intro_master_light.mp4"
          style={{ position: 'fixed', top: -9999, left: -9999, opacity: 0, pointerEvents: 'none', visibility: 'hidden' }}
          muted
          playsInline
          webkit-playsinline="true"
          preload="auto"
          aria-hidden="true"
        />

        {/* Mobile / Phone Media: Dark Video & Light Video */}
        <video
          ref={mobileDarkVideoRef}
          src="/into_phone.mp4"
          className="intro-mobile-video intro-dark-media"
          muted
          playsInline
          webkit-playsinline="true"
          preload="auto"
          aria-hidden="true"
        />
        <video
          ref={mobileLightVideoRef}
          src="/intro_phone_light.mp4"
          className="intro-mobile-video intro-light-media"
          muted
          playsInline
          webkit-playsinline="true"
          preload="auto"
          aria-hidden="true"
        />

        {/* Scrims, Vignettes & Atmospheric Lighting Layers */}
        <div className="intro-scrim-base" />
        <div ref={scrimHeroRef} className="intro-scrim-hero" />
        <div className="intro-vignette" />
        <div ref={overlayRef} className="intro-dynamic-overlay" />
        <div className="intro-bar" aria-hidden="true">
          <span ref={barRef} className="intro-bar-fill" />
        </div>
      </div>
    </>
  )
}