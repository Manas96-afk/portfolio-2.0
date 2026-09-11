import { useState } from 'react'
import Reveal from './Reveal'

const CATEGORIES = [
  { id: 'all', label: 'All Skills' },
  { id: 'video', label: 'Video & Editing' },
  { id: 'design', label: 'Motion & Design' },
  { id: 'web', label: 'Web Development' },
]

const SKILLS = [
  { name: 'Video Editing', level: 95, category: 'video', note: 'Premiere Pro, DaVinci Resolve, Multicam & Sound Sync' },
  { name: 'Motion Graphics', level: 90, category: 'design', note: 'After Effects, Kinetic Typography, Lower Thirds' },
  { name: 'Color Grading', level: 85, category: 'video', note: 'Cinematic LUTs, Skin Tone Correction, DaVinci Scope' },
  { name: 'Sound Engineering & SFX', level: 88, category: 'video', note: 'Audition, Noise Reduction, Beat Matching, Mixing' },
  { name: 'Web Development (Frontend)', level: 88, category: 'web', note: 'HTML5, CSS3, JavaScript ES6+, React.js, Vite' },
  { name: 'UI/UX & Layout Design', level: 82, category: 'design', note: 'Figma, Visual Hierarchy, Dark Themes & Glassmorphism' },
  { name: 'Thumbnail & Graphic Art', level: 85, category: 'design', note: 'Photoshop, High CTR Composites, Color Manipulation' },
  { name: 'Responsive Web Design', level: 90, category: 'web', note: 'Mobile-first, CSS Grid, Flexbox, Cross-browser compatibility' },
]

const TOOLS = [
  { name: 'Adobe Premiere Pro', category: 'Video Editing' },
  { name: 'Adobe After Effects', category: 'VFX & Motion' },
  { name: 'DaVinci Resolve', category: 'Color Grading' },
  { name: 'Adobe Photoshop', category: 'Graphics' },
  { name: 'Figma', category: 'UI Design' },
  { name: 'React.js', category: 'Frontend' },
  { name: 'JavaScript', category: 'Coding' },
  { name: 'HTML5 / CSS3', category: 'Web Standards' },
  { name: 'Vite', category: 'Build Tools' },
  { name: 'Git / GitHub', category: 'Version Control' },
  { name: 'OBS Studio', category: 'Streaming / Capture' },
  { name: 'Audacity / Audition', category: 'Audio Editing' },
]

export default function Skills() {
  const [activeTab, setActiveTab] = useState('all')

  const filteredSkills = activeTab === 'all'
    ? SKILLS
    : SKILLS.filter(s => s.category === activeTab)

  return (
    <section id="skills" className="section">
      <div className="container">
        <Reveal>
          <p className="kicker">Capabilities & Tech Stack</p>
          <h2 className="section-title">What I Bring To The Table</h2>
        </Reveal>

        <div className="skills-tabs">
          {CATEGORIES.map(cat => (
            <button
              key={cat.id}
              className={`skills-tab ${activeTab === cat.id ? 'is-active' : ''}`}
              onClick={() => setActiveTab(cat.id)}
            >
              {cat.label}
            </button>
          ))}
        </div>

        <div className="skills-grid">
          {filteredSkills.map((skill, i) => (
            <Reveal as="div" key={skill.name} delay={i * 60} className="skill-card">
              <div className="skill-head">
                <span className="skill-name">{skill.name}</span>
                <span className="skill-level">{skill.level}%</span>
              </div>
              <div className="skill-bar">
                <span
                  className="skill-bar-fill"
                  style={{ width: `${skill.level}%` }}
                />
              </div>
              <p className="skill-note">{skill.note}</p>
            </Reveal>
          ))}
        </div>

        <Reveal delay={200} className="tools-section">
          <h3 className="tools-heading">Software & Tools Stack</h3>
          <div className="tools-grid">
            {TOOLS.map((tool) => (
              <div key={tool.name} className="tool-chip">
                <span className="tool-name">{tool.name}</span>
                <span className="tool-cat">{tool.category}</span>
              </div>
            ))}
          </div>
        </Reveal>
      </div>
    </section>
  )
}