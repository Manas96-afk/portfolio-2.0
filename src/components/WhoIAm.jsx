import MagneticText from './MagneticText'
import Reveal from './Reveal'

const STATS = [
  { value: '04+', label: 'Years Experience' },
  { value: '150+', label: 'Videos Produced' },
  { value: '10M+', label: 'Views Generated' },
  { value: '25+', label: 'Projects Shipped' },
]

export default function WhoIAm() {
  return (
    <section id="who" className="section section-who">
      <div className="container">
        <Reveal className="who-header">
          <span className="editorial-kicker">01 // WHO I AM</span>
          <h2 className="who-statement" data-velocity-stretch>
            "I operate at the intersection of <span className="text-highlight">rhythm</span>, <span className="text-highlight">motion</span>, and <span className="text-highlight">clean code</span>."
          </h2>
        </Reveal>

        <div className="who-content-grid">
          <Reveal delay={100} className="who-body">
            <p className="who-lead">
              I am <strong>Manas Bandhu</strong> — a video editor, motion designer, and frontend web developer based in India. I construct visual experiences that command attention.
            </p>
            <p className="who-text">
              My work rejects generic templates in favor of bespoke craftsmanship. Whether syncing frame-accurate velocity cuts to bass drops or building interactive 60fps canvas web interfaces, every line of code and cut of video serves a deliberate narrative purpose.
            </p>
          </Reveal>

          <Reveal delay={200} className="who-stats-column">
            {STATS.map((stat) => (
              <MagneticText key={stat.label} strength={0.15} className="stat-editorial-item">
                <span className="stat-num">{stat.value}</span>
                <span className="stat-lbl">{stat.label}</span>
              </MagneticText>
            ))}
          </Reveal>
        </div>
      </div>
    </section>
  )
}
