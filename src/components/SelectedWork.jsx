import MagneticText from './MagneticText'
import Reveal from './Reveal'

const PROJECTS = [
  {
    num: '01',
    title: 'RASMALAI AI ASSISTANT',
    repository: 'Manas96-afk/Rasmalai_windows-assistant-',
    category: 'AI ASSISTANT / DESKTOP COMPANION',
    desc: 'A lightweight, local-first personal AI desktop companion for gamers and creators. Features automatic mode detection (Gaming/Editing), Alt+V Push-to-Talk, screen analysis using Gemini Flash, and Hinglish voice interaction from the system tray.',
    stack: ['Python', 'Gemini Flash', 'Voice & Vision', 'System Tray'],
    image: '/projects/rasmalai.png',
    metrics: 'Low Latency • Voice & Screen Multimodal',
    demoUrl: 'https://github.com/Manas96-afk/Rasmalai_windows-assistant-',
    githubUrl: 'https://github.com/Manas96-afk/Rasmalai_windows-assistant-',
    isComingSoon: false,
  },
  {
    num: '02',
    title: 'MANAS-PERSONAL-WEBSITE',
    repository: 'Manas96-afk/manas-personal-website',
    category: 'PERSONAL PORTFOLIO & SHOWCASE',
    desc: 'Personal developer portfolio and digital showcase website. Built with TypeScript and deployed on Vercel.',
    stack: ['TypeScript', 'React', 'CSS', 'Vercel'],
    image: '/projects/manas-personal-website.png',
    metrics: 'Live on Vercel • 60fps Canvas Sync',
    demoUrl: 'https://manas-bandhu.vercel.app',
    githubUrl: 'https://github.com/Manas96-afk/manas-personal-website',
    isComingSoon: false,
  },
  {
    num: '03',
    title: 'DRUGDEX',
    repository: 'Manas96-afk/DrugDex',
    category: 'HEALTHCARE PLATFORM',
    desc: 'A comprehensive healthcare platform with medicine search, doctor consultation, and health management features. Includes fuzzy matching search algorithms and a RESTful API.',
    stack: ['JavaScript', 'Node.js', 'Express', 'REST API'],
    image: '/projects/drugdex.png',
    metrics: '11 REST Endpoints • Fuzzy Search Engine',
    demoUrl: 'https://github.com/Manas96-afk/DrugDex',
    githubUrl: 'https://github.com/Manas96-afk/DrugDex',
    isComingSoon: false,
  },
  {
    num: '04',
    title: 'MATELBUILD',
    repository: null,
    category: 'COMING SOON',
    desc: 'COMING SOON',
    stack: ['COMING SOON'],
    image: null,
    metrics: null,
    demoUrl: null,
    githubUrl: null,
    isComingSoon: true,
  },
]

export default function SelectedWork() {
  return (
    <section id="work" className="section section-work">
      <div className="container">
        <Reveal className="work-header">
          <span className="editorial-kicker">02 // SELECTED WORK</span>
          <h2 className="work-title-main">ENGINEERED FOR IMPACT</h2>
        </Reveal>

        <div className="work-editorial-list">
          {PROJECTS.map((project, index) => (
            <Reveal key={project.num} delay={index * 120} className={`work-row ${project.isComingSoon ? 'is-coming-soon' : ''}`}>
              <div className="work-row-top">
                <span className="work-num">{project.num}</span>
                <span className="work-rule" aria-hidden="true" />
                <span className="work-category">{project.category}</span>
              </div>

              <div className="work-row-content">
                <div className="work-info">
                  <h3 className="work-item-title">
                    <MagneticText strength={0.15} as="span">
                      {project.title}
                    </MagneticText>
                  </h3>
                  <p className={`work-desc ${project.isComingSoon ? 'work-desc-coming-soon' : ''}`}>
                    {project.desc}
                  </p>

                  <div className="work-meta">
                    <div className="work-tags">
                      {project.stack.map((s) => (
                        <span key={s} className="editorial-tag">
                          {s}
                        </span>
                      ))}
                    </div>
                    {project.metrics && (
                      <span className="work-metric-badge">{project.metrics}</span>
                    )}
                  </div>

                  <div className="work-actions">
                    {project.isComingSoon ? (
                      <span className="btn-coming-soon-pill">
                        <span className="status-pulse-dot" /> COMING SOON
                      </span>
                    ) : (
                      <>
                        <MagneticText strength={0.3} as="a" href={project.demoUrl} target="_blank" rel="noreferrer" className="btn-work-link">
                          EXPLORE PROJECT <span className="arrow">↗</span>
                        </MagneticText>
                        <MagneticText strength={0.2} as="a" href={project.githubUrl} target="_blank" rel="noreferrer" className="btn-work-ghost">
                          GITHUB REPO
                        </MagneticText>
                      </>
                    )}
                  </div>
                </div>

                <div className="work-media-wrapper">
                  {project.isComingSoon ? (
                    <div className="work-empty-slot">
                      <div className="empty-slot-grid" aria-hidden="true" />
                      <div className="empty-corner top-left" aria-hidden="true">+</div>
                      <div className="empty-corner top-right" aria-hidden="true">+</div>
                      <div className="empty-corner bottom-left" aria-hidden="true">+</div>
                      <div className="empty-corner bottom-right" aria-hidden="true">+</div>
                      <div className="empty-slot-center">
                        <span className="empty-slot-kicker">[ PROJECT 04 // UNRELEASED ]</span>
                        <h4 className="empty-slot-name">MATELBUILD</h4>
                        <span className="empty-slot-badge">
                          <span className="status-pulse-dot" /> COMING SOON
                        </span>
                      </div>
                    </div>
                  ) : (
                    <div className="work-image-mask">
                      <img src={project.image} alt={project.title} loading="lazy" />
                      <div className="work-image-overlay" />
                    </div>
                  )}
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  )
}
