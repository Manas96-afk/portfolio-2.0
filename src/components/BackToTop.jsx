import { useState, useEffect } from 'react'

export default function BackToTop() {
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    let currentVisible = false
    const handleScroll = () => {
      const isOver = window.scrollY > 400
      if (isOver !== currentVisible) {
        currentVisible = isOver
        setVisible(isOver)
      }
    }
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    })
  }

  if (!visible) return null

  return (
    <button 
      className="back-to-top-btn" 
      onClick={scrollToTop}
      aria-label="Back to top"
      title="Back to top"
    >
      ↑
    </button>
  )
}
