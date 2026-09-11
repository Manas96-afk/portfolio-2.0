import { useEffect, useRef, useState } from 'react'

export default function CustomCursor() {
  const dotRef = useRef(null)
  const ringRef = useRef(null)
  const [isHovered, setIsHovered] = useState(false)
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    if (window.matchMedia('(pointer: coarse)').matches) return

    let mouseX = -100
    let mouseY = -100
    let ringX = -100
    let ringY = -100
    let isVisibleLocal = false
    let rafId = null

    const animate = () => {
      // Smooth spring lerp for cursor ring
      ringX += (mouseX - ringX) * 0.18
      ringY += (mouseY - ringY) * 0.18

      if (dotRef.current) {
        dotRef.current.style.transform = `translate3d(${mouseX}px, ${mouseY}px, 0)`
      }
      if (ringRef.current) {
        ringRef.current.style.transform = `translate3d(${ringX.toFixed(2)}px, ${ringY.toFixed(2)}px, 0)`
      }

      rafId = requestAnimationFrame(animate)
    }

    const onMouseMove = (e) => {
      mouseX = e.clientX
      mouseY = e.clientY

      if (!isVisibleLocal) {
        isVisibleLocal = true
        setIsVisible(true)
        ringX = mouseX
        ringY = mouseY
      }

      const target = e.target
      const isInteractive = target && target.closest(
        'a, button, [role="button"], .interactive, .magnetic-wrap, .proximity-text, .project-editorial-card, .exp-card, .btn-editorial, input, textarea'
      )
      setIsHovered(Boolean(isInteractive))
    }

    const onMouseLeave = () => {
      isVisibleLocal = false
      setIsVisible(false)
    }

    window.addEventListener('mousemove', onMouseMove, { passive: true })
    document.addEventListener('mouseleave', onMouseLeave)
    rafId = requestAnimationFrame(animate)

    return () => {
      window.removeEventListener('mousemove', onMouseMove)
      document.removeEventListener('mouseleave', onMouseLeave)
      if (rafId) cancelAnimationFrame(rafId)
    }
  }, [])

  return (
    <div
      className={`custom-cursor-layer ${isVisible ? 'is-visible' : ''} ${isHovered ? 'is-hovered' : ''}`}
      aria-hidden="true"
    >
      <div ref={dotRef} className="cursor-dot-spring" />
      <div ref={ringRef} className="cursor-ring-spring" />
    </div>
  )
}
