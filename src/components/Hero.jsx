import MagneticText from './MagneticText'
import ProximityText from './ProximityText'
import Reveal from './Reveal'
import EarthIcon from './EarthIcon'

export default function Hero() {
  const scrollTo = (id) => {
    const el = document.getElementById(id)
    if (el) {
      const offset = 80
      const bodyRect = document.body.getBoundingClientRect().top
      const elementRect = el.getBoundingClientRect().top
      const elementPosition = elementRect - bodyRect
      const offsetPosition = elementPosition - offset
      window.scrollTo({ top: offsetPosition, behavior: 'smooth' })
    }
  }

  return (
    <section id="home" className="hero-section">
      <div className="container hero-inner">
        <div className="hero-top-status">
          <EarthIcon size={14} className="hero-status-earth" />
          <span className="status-dot" />
          <span className="status-text">AVAILABLE FOR SELECTIVE CREATIVE DIRECTING &amp; DEVELOPMENT</span>
        </div>

        <Reveal className="hero-content">
          <h1 className="hero-title" data-velocity-stretch>
            <MagneticText strength={0.12} className="hero-line hero-line-top">
              <ProximityText text="MANAS" radius={140} maxShift={10} />
            </MagneticText>
            <MagneticText strength={0.12} className="hero-line hero-line-bottom">
              <ProximityText text="BANDHU" radius={140} maxShift={10} />
            </MagneticText>
          </h1>

          <div className="hero-editorial-meta">
            <span className="editorial-role">VIDEO EDITOR</span>
            <span className="editorial-divider">/</span>
            <span className="editorial-role">MOTION DESIGNER</span>
            <span className="editorial-divider">/</span>
            <span className="editorial-role">WEB DEVELOPER</span>
          </div>

          <p className="hero-sub">
            Crafting high-impact cinematic visual stories, motion graphics, and experimental digital web experiences.
          </p>

          <div className="hero-actions">
            <MagneticText strength={0.4} as="button" className="btn-editorial btn-editorial-primary" onClick={() => scrollTo('work')}>
              SELECTED WORK <span className="btn-arrow">↓</span>
            </MagneticText>
            <MagneticText strength={0.3} as="button" className="btn-editorial btn-editorial-ghost" onClick={() => scrollTo('contact')}>
              GET IN TOUCH
            </MagneticText>
          </div>
        </Reveal>

        <div className="hero-scroll-cue" onClick={() => scrollTo('who')}>
          <span className="scroll-cue-text">SCROLL TO EXPLORE</span>
          <span className="scroll-cue-line" />
        </div>
      </div>
    </section>
  )
}