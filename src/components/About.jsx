import Reveal from './Reveal'

const FACTS = [
  { value: '4+', label: 'Years Editing & Design' },
  { value: '150+', label: 'Videos Produced' },
  { value: '25+', label: 'Projects Shipped' },
  { value: '10M+', label: 'Views Generated' },
]

const HIGHLIGHTS = [
  {
    icon: '🎬',
    title: 'Cinematic Storytelling',
    desc: 'Crafting high-octane cuts, precise sound design, color grading, and seamless motion transition effects.',
  },
  {
    icon: '💻',
    title: 'Modern Web Design',
    desc: 'Building responsive, ultra-fast web apps using React, HTML/CSS, glassmorphic UI, and smooth animations.',
  },
  {
    icon: '⚡',
    title: 'Visual Effects & Motion',
    desc: 'Custom logo reveals, lower thirds, kinetic typography, kinetic title animation, and eye-catching thumbnails.',
  },
  {
    icon: '🎮',
    title: 'Esports & Gaming Edits',
    desc: 'Fast-paced Valorant, GTA V, and FPS highlight montages synced perfectly with beat drops.',
  },
]

export default function About() {
  return (
    <section id="about" className="section">
      <div className="container">
        <Reveal>
          <p className="kicker">About Me</p>
          <h2 className="section-title">Driven By Passion, Storytelling & Digital Innovation</h2>
        </Reveal>

        <div className="about-grid">
          <Reveal delay={100} className="about-text">
            <p>
              Hello! I'm <strong>Manas Bandhu</strong>, a multi-disciplinary creator based in India. I specialize in <strong>cinematic video editing</strong>, <strong>motion graphics design</strong>, and <strong>web development</strong>.
            </p>
            <p>
              Whether it’s transforming hours of raw footage into a compelling video narrative or coding clean, interactive web experiences, I bring high energy, visual precision, and dedication to every project.
            </p>
            <p>
              My workflow bridges creative post-production with technical design — ensuring every frame and line of code serves a purpose.
            </p>

            <div className="about-tags">
              <span className="about-tag">#VideoEditor</span>
              <span className="about-tag">#ContentCreator</span>
              <span className="about-tag">#WebDeveloper</span>
              <span className="about-tag">#MotionGraphics</span>
            </div>
          </Reveal>

          <Reveal delay={200} className="about-stats">
            {FACTS.map((f) => (
              <div key={f.label} className="stat-card">
                <span className="stat-value">{f.value}</span>
                <span className="stat-label">{f.label}</span>
              </div>
            ))}
          </Reveal>
        </div>

        <div className="about-highlights-grid">
          {HIGHLIGHTS.map((item, i) => (
            <Reveal key={item.title} delay={150 + i * 80} className="highlight-card">
              <span className="highlight-icon">{item.icon}</span>
              <h3>{item.title}</h3>
              <p>{item.desc}</p>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  )
}