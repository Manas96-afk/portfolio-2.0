import { useState, useEffect } from 'react'
import MagneticText from './MagneticText'
import ThemeToggle from './ThemeToggle'

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
        <MagneticText strength={0.2} as="a" href="#home" className="nav-brand" onClick={(e) => { e.preventDefault(); scrollToSection('home') }}>
          <span className="brand-dot" />
          <span className="brand-text">MANAS BANDHU</span>
        </MagneticText>

        <div className="nav-right-cluster">
          <ThemeToggle className="theme-toggle-desktop" />

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
            <MagneticText key={link.id} strength={0.2} as="button" className="nav-link-btn" onClick={() => scrollToSection(link.id)}>
              {link.label}
            </MagneticText>
          ))}
          <MagneticText strength={0.3} as="button" className="nav-cta-btn" onClick={() => scrollToSection('contact')}>
            LET'S TALK
          </MagneticText>
          <div className="nav-mobile-theme-slot">
            <ThemeToggle />
          </div>
        </nav>
      </div>
    </header>
  )
}
