import { useEffect, useRef } from 'react'

export default function ProximityText({
  text,
  className = '',
  radius = 140,
  maxShift = 10,
}) {
  const containerRef = useRef(null)
  const letters = text.split('')

  useEffect(() => {
    const container = containerRef.current
    if (!container) return

    const spans = container.querySelectorAll('.proximity-letter')
    let letterCenters = []
    let targets = Array.from({ length: spans.length }, () => ({ x: 0, y: 0 }))
    let currents = Array.from({ length: spans.length }, () => ({ x: 0, y: 0 }))
    let rafId = null
    let isHovering = false

    const measureCenters = () => {
      letterCenters = Array.from(spans).map((span) => {
        const rect = span.getBoundingClientRect()
        return {
          x: rect.left + rect.width / 2,
          y: rect.top + rect.height / 2,
        }
      })
    }

    const animate = () => {
      let hasMotion = false
      const factor = isHovering ? 0.22 : 0.12

      for (let i = 0; i < spans.length; i++) {
        currents[i].x += (targets[i].x - currents[i].x) * factor
        currents[i].y += (targets[i].y - currents[i].y) * factor

        spans[i].style.transform = `translate3d(${currents[i].x.toFixed(2)}px, ${currents[i].y.toFixed(2)}px, 0)`

        if (
          Math.abs(targets[i].x - currents[i].x) > 0.03 ||
          Math.abs(targets[i].y - currents[i].y) > 0.03
        ) {
          hasMotion = true
        }
      }

      if (hasMotion || isHovering) {
        rafId = requestAnimationFrame(animate)
      } else {
        for (let i = 0; i < spans.length; i++) {
          spans[i].style.transform = 'translate3d(0, 0, 0)'
          currents[i].x = 0
          currents[i].y = 0
        }
        rafId = null
      }
    }

    const onMouseEnter = () => {
      measureCenters()
      isHovering = true
    }

    const onMouseMove = (e) => {
      if (letterCenters.length === 0) measureCenters()
      const mouseX = e.clientX
      const mouseY = e.clientY

      for (let i = 0; i < spans.length; i++) {
        const center = letterCenters[i]
        if (!center) continue
        const dx = mouseX - center.x
        const dy = mouseY - center.y
        const dist = Math.hypot(dx, dy)

        if (dist < radius && dist > 0) {
          const factor = (1 - dist / radius) * maxShift
          targets[i].x = (dx / dist) * factor
          targets[i].y = (dy / dist) * factor
        } else {
          targets[i].x = 0
          targets[i].y = 0
        }
      }

      if (!rafId) {
        rafId = requestAnimationFrame(animate)
      }
    }

    const onMouseLeave = () => {
      isHovering = false
      for (let i = 0; i < targets.length; i++) {
        targets[i].x = 0
        targets[i].y = 0
      }
      if (!rafId) {
        rafId = requestAnimationFrame(animate)
      }
    }

    container.addEventListener('mouseenter', onMouseEnter, { passive: true })
    container.addEventListener('mousemove', onMouseMove, { passive: true })
    container.addEventListener('mouseleave', onMouseLeave)
    window.addEventListener('resize', measureCenters, { passive: true })

    return () => {
      container.removeEventListener('mouseenter', onMouseEnter)
      container.removeEventListener('mousemove', onMouseMove)
      container.removeEventListener('mouseleave', onMouseLeave)
      window.removeEventListener('resize', measureCenters)
      if (rafId) cancelAnimationFrame(rafId)
    }
  }, [radius, maxShift])

  return (
    <span
      ref={containerRef}
      className={`proximity-text ${className}`}
      style={{ display: 'inline-block', whiteSpace: 'nowrap' }}
    >
      {letters.map((char, i) => (
        <span
          key={i}
          className="proximity-letter"
          style={{
            display: 'inline-block',
            whiteSpace: char === ' ' ? 'pre' : 'normal',
            willChange: 'transform',
          }}
        >
          {char}
        </span>
      ))}
    </span>
  )
}
