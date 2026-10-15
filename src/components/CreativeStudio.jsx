import { useState } from 'react'

const TRACKS = [
  { label: 'V1 · FOOTAGE', tone: 'footage', width: '76%' },
  { label: 'V2 · OVERLAYS', tone: 'overlay', width: '54%' },
  { label: 'A1 · MUSIC / SFX', tone: 'audio', width: '88%' },
]

export default function CreativeStudio() {
  const [view, setView] = useState('timeline')

  return (
    <section className="studio-section" aria-labelledby="studio-heading">
      <div className="container">
        <div className="studio-heading-row">
          <div>
            <span className="studio-eyebrow"><span className="studio-live-dot" /> CREATIVE WORKSPACE / 001</span>
            <h2 id="studio-heading" className="studio-heading">FROM TIMELINE<br /><em>TO SCREEN.</em></h2>
          </div>
          <p className="studio-intro">A little peek inside the process — shaping raw footage, building digital experiences, and obsessing over the details between every frame.</p>
        </div>

        <div className="studio-console">
          <div className="studio-console-top">
            <div className="studio-window-controls" aria-hidden="true"><i /><i /><i /></div>
            <span className="studio-file-name">MANAS_STUDIO / SEQUENCE_001</span>
            <span className="studio-status"><span /> SESSION ACTIVE</span>
          </div>

          <div className="studio-console-body">
            <aside className="studio-tool-rail" aria-label="Workspace tools">
              <span className="studio-tool active" title="Media">▧</span>
              <span className="studio-tool" title="Effects">✳</span>
              <span className="studio-tool" title="Audio">♫</span>
              <span className="studio-tool" title="Code">⌘</span>
            </aside>

            <div className="studio-preview-column">
              <div className="studio-preview-toolbar">
                <span>PROGRAM MONITOR</span>
                <span>00:00:12:08 <b>● REC</b></span>
              </div>
              <div className={`studio-preview-screen ${view === 'preview' ? 'is-preview' : ''}`}>
                <div className="studio-preview-grain" />
                <div className="studio-preview-orbit orbit-one" />
                <div className="studio-preview-orbit orbit-two" />
                <div className="studio-preview-crosshair">+</div>
                <div className="studio-preview-copy">
                  <span>VISUAL STORYTELLING / 2026</span>
                  <strong>MAKE IT<br /><i>MOVE.</i></strong>
                  <small>EDIT · DESIGN · DEVELOP</small>
                </div>
                <div className="studio-preview-index">FRAME 0128 / 0240</div>
              </div>
              <div className="studio-preview-foot">
                <span>3840 × 2160</span><span>24 FPS</span><span>COLOR: FILMIC</span>
              </div>
            </div>

            <div className="studio-inspector">
              <span className="studio-inspector-title">PROJECT INFO</span>
              <div className="studio-inspector-art"><span>MB</span><i>↗</i></div>
              <span className="studio-inspector-name">Visual Identity 001</span>
              <span className="studio-inspector-sub">Personal / Experimental</span>
              <div className="studio-inspector-divider" />
              <div className="studio-stat"><span>DISCIPLINE</span><b>EDIT + CODE</b></div>
              <div className="studio-stat"><span>WORKFLOW</span><b>FRAME BY FRAME</b></div>
              <div className="studio-stat"><span>STATUS</span><b className="studio-stat-ready">IN PROGRESS</b></div>
            </div>
          </div>

          <div className="studio-timeline">
            <div className="studio-timeline-head">
              <div><span className="studio-timeline-label">SEQUENCE TIMELINE</span><span className="studio-timeline-duration">00:00:24:00</span></div>
              <div className="studio-view-switch" role="group" aria-label="Timeline view">
                <button type="button" className={view === 'timeline' ? 'active' : ''} onClick={() => setView('timeline')}>TIMELINE</button>
                <button type="button" className={view === 'preview' ? 'active' : ''} onClick={() => setView('preview')}>PREVIEW FX</button>
              </div>
            </div>
            <div className="studio-ruler"><span>00:00</span><span>00:04</span><span>00:08</span><span>00:12</span><span>00:16</span><span>00:20</span><span>00:24</span></div>
            <div className="studio-track-area">
              <div className="studio-playhead"><span /></div>
              {TRACKS.map((track) => (
                <div className="studio-track-row" key={track.label}>
                  <span className="studio-track-name">{track.label}</span>
                  <div className="studio-track-lane"><div className={`studio-clip ${track.tone}`} style={{ width: track.width }}><span>{track.label.split(' · ')[1]}</span></div></div>
                </div>
              ))}
            </div>
          </div>
          <div className="studio-console-footer"><span>● ALL SYSTEMS NOMINAL</span><span>CRAFTED WITH INTENTION <b>↗</b></span></div>
        </div>

        <div className="studio-bottom-row">
          <span>GOOD STORIES ARE BUILT<br />ONE FRAME AT A TIME.</span>
          <a href="#work" className="studio-work-link">EXPLORE SELECTED WORK <span>↘</span></a>
        </div>
      </div>
    </section>
  )
}
