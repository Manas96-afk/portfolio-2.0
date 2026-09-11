import { useState, useEffect } from 'react'
import MagneticText from './MagneticText'
import ProximityText from './ProximityText'
import Reveal from './Reveal'

const PILLARS = [
  {
    id: 'BUILD',
    num: '01',
    title: 'BUILD',
    subtitle: 'WEB & DIGITAL PRODUCTS',
    focus: 'Full-Stack Architecture & Reactive UIs',
    desc: 'Crafting ultra-fast, responsive web applications, interactive canvas intros, and modern React architectures engineered with clean, modular code.',
    image: '/what/build.jpg',
    metric: 'React 19 • Canvas API • Sub-second TTFB',
    tags: ['React 19', 'Vite', 'HTML5 Canvas', 'CSS Architecture', 'TypeScript'],
  },
  {
    id: 'EDIT',
    num: '02',
    title: 'EDIT',
    subtitle: 'CINEMATIC VIDEO & MOTION',
    focus: 'Dynamic Velocity Ramping & Film Color Grading',
    desc: 'Transforming raw footage into high-octane visual stories with rhythmic velocity cuts, spatial sound design, and custom motion transition effects.',
    image: '/what/edit.jpg',
    metric: '4K 60fps • 10-Bit Log • Custom LUT Grading',
    tags: ['Premiere Pro', 'After Effects', 'DaVinci Resolve', 'Sound Design', 'Color Grading'],
  },
  {
    id: 'EXPERIMENT',
    num: '03',
    title: 'EXPERIMENT',
    subtitle: 'AUDIO, VFX & UTILITIES',
    focus: 'Kinetic Motion & Audio-Reactive Tools',
    desc: 'Pushing creative boundaries with audio peak marker generators, custom LUT presets, kinetic typography engines, and procedural 3D visual FX.',
    image: '/what/experiment.jpg',
    metric: 'Web Audio API • 3D Shaders • Preset Vault',
    tags: ['Web Audio API', 'Kinetic Motion', 'Color Grading', 'Preset Vault', 'VFX Nodes'],
  },
  {
    id: 'PLAY',
    num: '04',
    title: 'PLAY',
    subtitle: 'ESPORTS & GAMING CULTURE',
    focus: 'High-Energy FPS Montages & Beat Synchronization',
    desc: 'Cutting fast-paced Valorant and FPS highlight montages synced seamlessly to heavy beat drops, screen impacts, and gaming community moments.',
    image: '/what/play.jpg',
    metric: 'Frame-Accurate Beat Sync • Screen Shakes • Impact FX',
    tags: ['FPS Highlights', 'Beat Sync', 'Velocity Ramping', 'Esports Edits', 'SFX Mastering'],
  },
]

export default function WhatIDo() {
  const [activeIndex, setActiveIndex] = useState(0)

  useEffect(() => {
    const timer = setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % PILLARS.length)
    }, 3200)

    return () => clearInterval(timer)
  }, [])

  const activePillar = PILLARS[activeIndex]

  return (
    <section id="what" className="section section-what">
      <div className="container">
        <Reveal className="what-header">
          <span className="editorial-kicker">03 // WHAT I DO</span>
          <h2 className="what-title-main">CORE DISCIPLINES</h2>
        </Reveal>

        <div className="what-layout">
          <div className="what-words-list">
            {PILLARS.map((pillar, idx) => {
              const isActive = activeIndex === idx
              const isLong = pillar.title.length > 6
              return (
                <div
                  key={pillar.id}
                  className={`what-word-item ${isActive ? 'is-active' : ''} ${isLong ? 'is-long-word' : ''}`}
                  data-pillar={pillar.id}
                  onClick={() => setActiveIndex(idx)}
                >
                  <MagneticText strength={0.15} className={`what-word-text ${isLong ? 'what-word-text-long' : ''}`}>
                    <ProximityText text={pillar.title} radius={140} maxShift={14} />
                  </MagneticText>
                  <span className="what-word-sub">{pillar.subtitle}</span>
                </div>
              )
            })}
          </div>

          <div className="what-preview-panel">
            <div className="what-preview-media">
              <img src={activePillar.image} alt={activePillar.title} key={activePillar.image} className="what-preview-img" />
              <div className="what-media-scrim" />
            </div>

            <div className="what-preview-details">
              <div className="what-detail-header">
                <span className="what-detail-badge">{activePillar.title}</span>
                <span className="what-detail-metric">{activePillar.metric}</span>
              </div>
              <p className="what-detail-desc">{activePillar.desc}</p>
              <div className="what-detail-tags">
                {activePillar.tags.map((tag) => (
                  <span key={tag} className="editorial-tag-sm">
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
