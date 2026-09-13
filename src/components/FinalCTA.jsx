import MagneticText from './MagneticText'
import ProximityText from './ProximityText'
import Reveal from './Reveal'

const SOCIALS = [
  { name: 'YOUTUBE', url: 'https://www.youtube.com/@cnomo_editz' },
  { name: 'GITHUB', url: 'https://github.com/Manas96-afk?tab=repositories' },
  { name: 'X / TWITTER', url: 'https://x.com/manas_1303x' },
  { name: 'INSTAGRAM', url: 'https://www.instagram.com/cnomo_editz/' },
  { name: 'EMAIL', url: 'mailto:mgamer6900@gmail.com' },
]

export default function FinalCTA({ onOpenCoffee }) {
  return (
    <section id="contact" className="section section-cta">
      <div className="container">
        <Reveal className="cta-header">
          <span className="editorial-kicker">05 // START A PROJECT</span>
          <h2 className="cta-headline" data-velocity-stretch>
            <MagneticText strength={0.12} className="cta-headline-line">
              <ProximityText text="GOT AN" radius={140} maxShift={10} />
            </MagneticText>
            <MagneticText strength={0.12} className="cta-headline-line">
              <ProximityText text="IDEA?" radius={140} maxShift={10} />
            </MagneticText>
            <MagneticText strength={0.12} className="cta-headline-line text-highlight">
              <ProximityText text="LET'S BUILD" radius={140} maxShift={10} />
            </MagneticText>
            <MagneticText strength={0.12} className="cta-headline-line text-highlight">
              <ProximityText text="IT." radius={140} maxShift={10} />
            </MagneticText>
          </h2>
        </Reveal>

        <Reveal delay={150} className="cta-body">
          <p className="cta-lead">
            Available for select video production, visual directing, and digital product development contracts.
          </p>

          <div className="cta-action-row">
            <MagneticText strength={0.25} as="a" href="mailto:mgamer6900@gmail.com" className="btn-cta-giant">
              INITIATE CONVERSATION <span className="btn-arrow">→</span>
            </MagneticText>

            <MagneticText strength={0.25} as="button" type="button" onClick={onOpenCoffee} className="btn-cta-coffee">
              <span className="coffee-btn-spark">☕</span> BUY ME A COFFEE <span className="coffee-steam-mini">♨</span>
            </MagneticText>
          </div>
        </Reveal>

        <Reveal delay={250} className="cta-socials-row">
          {SOCIALS.map((soc) => (
            <MagneticText key={soc.name} strength={0.2} as="a" href={soc.url} target="_blank" rel="noreferrer" className="social-link-item">
              <span>{soc.name}</span>
              <span className="social-arrow">↗</span>
            </MagneticText>
          ))}
        </Reveal>

        <p className="cta-copyright">
          © {new Date().getFullYear()} MANAS BANDHU — ALL RIGHTS RESERVED.
        </p>
      </div>
    </section>
  )
}
