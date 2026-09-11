import { useEffect } from 'react'

/**
 * High-performance kinetic scroll velocity tracker.
 * Directly drives CSS variables on requestAnimationFrame without causing React component re-renders.
 */
export function useScrollVelocity() {
  useEffect(() => {
    let lastScrollY = window.scrollY
    let lastTime = performance.now()
    let currentVel = 0
    let smoothVel = 0
    let rafId = null
    let isTicking = false

    const tick = (now) => {
      const dt = Math.max(1, now - lastTime)
      const currentScrollY = window.scrollY
      const dy = currentScrollY - lastScrollY

      const instantVel = dy / dt
      // Exponential smoothing of raw velocity
      currentVel = currentVel * 0.65 + instantVel * 0.35
      // Silky spring lerp toward current velocity
      smoothVel += (currentVel - smoothVel) * 0.18

      // Kinetic friction decay when user pauses scrolling
      currentVel *= 0.86

      const absVel = Math.min(Math.abs(smoothVel) * 0.055, 0.09)
      const stretchY = 1 + absVel
      const compressX = 1 - absVel * 0.25

      document.documentElement.style.setProperty('--scroll-stretch-y', stretchY.toFixed(4))
      document.documentElement.style.setProperty('--scroll-compress-x', compressX.toFixed(4))

      lastScrollY = currentScrollY
      lastTime = now

      if (Math.abs(smoothVel) > 0.0008 || Math.abs(currentVel) > 0.0008) {
        rafId = requestAnimationFrame(tick)
      } else {
        document.documentElement.style.setProperty('--scroll-stretch-y', '1')
        document.documentElement.style.setProperty('--scroll-compress-x', '1')
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
    }
  }, [])
}
