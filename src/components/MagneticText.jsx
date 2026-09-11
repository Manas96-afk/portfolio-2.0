import { useEffect, useRef } from 'react'

export default function MagneticText({
  children,
  className = '',
  strength = 0.35,
  as: Component = 'div',
  ...props
}) {
  const ref = useRef(null)

  useEffect(() => {
    const el = ref.current
    if (!el) return

    let targetX = 0
    let targetY = 0
    let currentX = 0
    let currentY = 0
    let rafId = null
    let isHovering = false

    const animate = () => {
      // Silky smooth physical lerp
      const factor = isHovering ? 0.18 : 0.12
      currentX += (targetX - currentX) * factor
      currentY += (targetY - currentY) * factor

      el.style.transform = `translate3d(${currentX.toFixed(2)}px, ${currentY.toFixed(2)}px, 0)`

      if (isHovering || Math.abs(targetX - currentX) > 0.04 || Math.abs(targetY - currentY) > 0.04) {
        rafId = requestAnimationFrame(animate)
      } else {
        el.style.transform = 'translate3d(0, 0, 0)'
        currentX = 0
        currentY = 0
        rafId = null
      }
    }

    const onMouseMove = (e) => {
      const rect = el.getBoundingClientRect()
      const centerX = rect.left + rect.width / 2
      const centerY = rect.top + rect.height / 2
      targetX = (e.clientX - centerX) * strength
      targetY = (e.clientY - centerY) * strength
      isHovering = true

      if (!rafId) {
        rafId = requestAnimationFrame(animate)
      }
    }

    const onMouseLeave = () => {
      targetX = 0
      targetY = 0
      isHovering = false
      if (!rafId) {
        rafId = requestAnimationFrame(animate)
      }
    }

    el.addEventListener('mousemove', onMouseMove, { passive: true })
    el.addEventListener('mouseleave', onMouseLeave)

    return () => {
      el.removeEventListener('mousemove', onMouseMove)
      el.removeEventListener('mouseleave', onMouseLeave)
      if (rafId) cancelAnimationFrame(rafId)
    }
  }, [strength])

  return (
    <Component
      ref={ref}
      className={`magnetic-wrap ${className}`}
      style={{ display: 'inline-block', willChange: 'transform' }}
      {...props}
    >
      {children}
    </Component>
  )
}
