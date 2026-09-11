import { useState, useEffect } from 'react'
import MagneticText from './MagneticText'
import Logo from './Logo'
import EarthIcon from './EarthIcon'

const EDITORIAL_NAV_LINKS = [
  { label: 'WHO', id: 'who' },
  { label: 'WORK', id: 'work' },
  { label: 'WHAT', id: 'what' },
  { label: 'EXPERIMENTS', id: 'experiments' },
  { label: 'CONTACT', id: 'contact' },
]

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 40)
    }

    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const scrollToSection = (id) => {
    setMenuOpen(false)
    const element = document.getElementById(id)
    if (element) {
      const offset = 70
      const bodyRect = document.body.getBoundingClientRect().top
      const elementRect = element.getBoundingClientRect().top
      const elementPosition = elementRect - bodyRect
      const offsetPosition = elementPosition - offset

      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth',
      })
    }
  }

  return (
    <header className={`editorial-nav ${scrolled ? 'is-scrolled' : ''}`}>
      <div className="container nav-inner">
        {/* Brand Name Logo */}
        <MagneticText
          strength={0.2}
          as="a"
          href="#home"
          className="nav-brand-anchor"
          onClick={(e) => {
            e.preventDefault()
            scrollToSection('home')
          }}
        >
          <Logo size="compact" showText={true} />
        </MagneticText>

        {/* Top Tab Earth Indicator */}
        <div className="nav-top-earth-tab" title="Worldwide Creative Operations">
          <EarthIcon size={18} />
          <span className="earth-tab-label">GLOBAL // 24.8°N</span>
          <span className="earth-status-ping" />
        </div>

        <div className="nav-right-cluster">
          <button
            className={`nav-menu-toggle ${menuOpen ? 'is-active' : ''}`}
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label="Toggle Navigation"
          >
            <span className="toggle-line" />
            <span className="toggle-line" />
          </button>
        </div>

        <nav className={`nav-links-wrap ${menuOpen ? 'is-open' : ''}`}>
          {EDITORIAL_NAV_LINKS.map((link) => (
            <MagneticText
              key={link.id}
              strength={0.2}
              as="button"
              className="nav-link-btn"
              onClick={() => scrollToSection(link.id)}
            >
              {link.label}
            </MagneticText>
          ))}
          <MagneticText
            strength={0.3}
            as="button"
            className="nav-cta-btn"
            onClick={() => scrollToSection('contact')}
          >
            LET'S TALK
          </MagneticText>
        </nav>
      </div>
    </header>
  )
}
