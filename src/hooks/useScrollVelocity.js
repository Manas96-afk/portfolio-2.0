import { useEffect } from 'react'

/**
 * High-performance kinetic scroll velocity tracker.
 * Directly drives CSS variables on requestAnimationFrame without causing React component re-renders.
 */
export function useScrollVelocity() {
  useEffect(() => {
    // Only run velocity stretch on desktop screens (>= 992px)
    if (typeof window === 'undefined' || window.innerWidth < 992) return

    let lastScrollY = window.scrollY
    let lastTime = performance.now()
    let currentVel = 0
    let smoothVel = 0
    let rafId = null
    let isTicking = false
    let lastAppliedStretch = 1
    let lastAppliedCompress = 1

    const tick = (now) => {
      const dt = Math.max(1, now - lastTime)
      const currentScrollY = window.scrollY
      const dy = currentScrollY - lastScrollY

      const instantVel = dy / dt
      // Exponential smoothing of raw velocity
      currentVel = currentVel * 0.65 + instantVel * 0.35
      // Silky spring lerp toward current velocity
      smoothVel += (currentVel - smoothVel) * 0.18

      // Kinetic friction decay
      currentVel *= 0.86

      const absVel = Math.min(Math.abs(smoothVel) * 0.05, 0.08)
      const stretchY = 1 + absVel
      const compressX = 1 - absVel * 0.22

      // Only update DOM styles if value changed significantly
      if (Math.abs(stretchY - lastAppliedStretch) > 0.001 || Math.abs(compressX - lastAppliedCompress) > 0.001) {
        lastAppliedStretch = stretchY
        lastAppliedCompress = compressX
        document.documentElement.style.setProperty('--scroll-stretch-y', stretchY.toFixed(4))
        document.documentElement.style.setProperty('--scroll-compress-x', compressX.toFixed(4))
      }

      lastScrollY = currentScrollY
      lastTime = now

      if (Math.abs(smoothVel) > 0.0008 || Math.abs(currentVel) > 0.0008) {
        rafId = requestAnimationFrame(tick)
      } else {
        if (lastAppliedStretch !== 1 || lastAppliedCompress !== 1) {
          document.documentElement.style.setProperty('--scroll-stretch-y', '1')
          document.documentElement.style.setProperty('--scroll-compress-x', '1')
          lastAppliedStretch = 1
          lastAppliedCompress = 1
        }
        isTicking = false
        rafId = null
      }
    }

    const onScroll = () => {
      if (!isTicking) {
        isTicking = true
        lastTime = performance.now()
        lastScrollY = window.scrollY
        rafId = requestAnimationFrame(tick)
      }
    }

    window.addEventListener('scroll', onScroll, { passive: true })
    return () => {
      window.removeEventListener('scroll', onScroll)
      if (rafId) cancelAnimationFrame(rafId)
      document.documentElement.style.setProperty('--scroll-stretch-y', '1')
      document.documentElement.style.setProperty('--scroll-compress-x', '1')
    }
  }, [])
}
