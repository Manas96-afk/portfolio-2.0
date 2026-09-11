import Reveal from './Reveal'

const PROJECTS = [
  {
    id: 1,
    title: 'Rasmalai AI Assistant',
    subtitle: 'Local-First Multimodal AI Desktop Companion',
    desc: 'A lightweight personal AI desktop companion for gamers and creators with automatic mode detection (Gaming/Editing), Alt+V Push-to-Talk, Gemini Flash screen analysis, and Hinglish voice interaction.',
    stack: ['Python', 'Gemini Flash API', 'Screen Vision', 'Audio Processing'],
    featured: true,
    metrics: 'Low Latency • Multimodal Vision & Voice',
    demoUrl: 'https://github.com/Manas96-afk/Rasmalai_windows-assistant-',
    githubUrl: 'https://github.com/Manas96-afk/Rasmalai_windows-assistant-',
  },
  {
    id: 2,
    title: 'Manas Personal Website',
    subtitle: '240-Frame 2K Canvas Portfolio',
    desc: 'Personal portfolio and digital checkpoint engineered with a 240-frame 2K canvas scroll engine, dark editorial typography, velocity-reactive micro-interactions, and instant Vercel edge deployment.',
    stack: ['React 19', 'TypeScript', 'Vite', 'HTML5 Canvas', 'CSS3'],
    featured: true,
    metrics: 'Live on Vercel • 60fps Canvas Sync',
    demoUrl: 'https://manas-bandhu.vercel.app',
    githubUrl: 'https://github.com/Manas96-afk/manas-personal-website',
  },
  {
    id: 3,
    title: 'DrugDex Healthcare Platform',
    subtitle: 'Medicine Search & Intelligence Web App',
    desc: 'Comprehensive healthcare and medicine intelligence platform equipped with high-accuracy fuzzy search algorithms, real-time debounced autocomplete, JWT security authentication, and 11 RESTful endpoints.',
    stack: ['Node.js', 'Express.js', 'JavaScript', 'JWT Auth', 'REST API'],
    featured: true,
    metrics: '11 REST Endpoints • Fuzzy Search Engine',
    demoUrl: 'https://github.com/Manas96-afk/DrugDex',
    githubUrl: 'https://github.com/Manas96-afk/DrugDex',
  },
  {
    id: 4,
    title: 'MATELBUILD',
    subtitle: 'COMING SOON',
    desc: 'COMING SOON',
    stack: ['COMING SOON'],
    featured: false,
    metrics: null,
    demoUrl: null,
    githubUrl: null,
  },
]

export default function Projects() {
  return (
    <section id="projects" className="section">
      <div className="container">
        <Reveal>
          <p className="kicker">Development & Web Apps</p>
          <h2 className="section-title">Featured Projects & Software Tools</h2>
        </Reveal>

        <div className="project-grid">
          {PROJECTS.map((p, i) => (
            <Reveal as="article" key={p.id} delay={i * 100} className={`project-card ${p.featured ? 'is-featured' : ''}`}>
              {p.featured && <span className="project-featured-badge">★ Featured Project</span>}
              <div className="project-header">
                <h3>{p.title}</h3>
                <span className="project-subtitle">{p.subtitle}</span>
              </div>
              <p className="project-desc">{p.desc}</p>

              <div className="project-metrics">
                <span className="metrics-icon">⚡</span>
                <span>{p.metrics}</span>
              </div>

              <div className="project-stack">
                {p.stack.map((s) => (
                  <span key={s} className="chip">
                    {s}
                  </span>
                ))}
              </div>

              <div className="project-actions">
                <a href={p.demoUrl} className="project-btn project-btn-primary">
                  View Project
                </a>
                <a href={p.githubUrl} target="_blank" rel="noreferrer" className="project-btn project-btn-ghost">
                  GitHub
                </a>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  )
}