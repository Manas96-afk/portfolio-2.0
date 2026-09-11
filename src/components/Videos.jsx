import { useState } from 'react'
import Reveal from './Reveal'
import VideoModal from './VideoModal'

const VIDEO_CATEGORIES = ['All', 'Showreel', 'Short Film', 'Gaming Edit', 'Commercial', 'AMV / Music']

const VIDEOS = [
  {
    id: 1,
    title: 'Cyberpunk VFX Motion Reel',
    tag: 'Showreel',
    category: 'Showreel',
    views: '120K+ Views',
    duration: '02:45',
    thumb: '/intro/ezgif-frame-040.jpg',
    software: 'After Effects, Premiere Pro, Cinema 4D',
    style: 'High-Energy 3D Camera Motion & Beat Sync',
    desc: 'A futuristic showreel blending fast-paced motion graphics, neon color grading, and heavy sound design.',
  },
  {
    id: 2,
    title: 'Cinematic Travel Documentary',
    tag: 'Short Film',
    category: 'Short Film',
    views: '45K+ Views',
    duration: '04:12',
    thumb: '/intro/ezgif-frame-090.jpg',
    software: 'DaVinci Resolve, Premiere Pro',
    style: 'Film Emulation, Seamless Match Cuts, Ambient Audio',
    desc: 'An immersive visual story featuring natural color grading, organic speed ramps, and spatial audio soundscapes.',
  },
  {
    id: 3,
    title: 'High-Energy Esports Montage',
    tag: 'Gaming Edit',
    category: 'Gaming Edit',
    views: '200K+ Views',
    duration: '03:10',
    thumb: '/intro/ezgif-frame-140.jpg',
    software: 'After Effects, Premiere Pro',
    style: 'Velocity Ramping, Impact SFX, Screen Shakes',
    desc: 'Fast-paced gaming highlight edit with custom velocity curves, syncopated beat drops, and sharp gun sound effects.',
  },
  {
    id: 4,
    title: 'Minimalist Brand Commercial Ad',
    tag: 'Commercial',
    category: 'Commercial',
    views: '35K+ Views',
    duration: '01:00',
    thumb: '/intro/ezgif-frame-200.jpg',
    software: 'Premiere Pro, Illustrator',
    style: 'Sleek Product Framing, Typography Overlays',
    desc: 'A commercial advertisement cut for a premium tech brand with clean typography and smooth transitions.',
  },
  {
    id: 5,
    title: 'Rythm & Flow Music Video Edit',
    tag: 'AMV / Music',
    category: 'AMV / Music',
    views: '180K+ Views',
    duration: '03:30',
    thumb: '/intro/ezgif-frame-110.jpg',
    software: 'After Effects, Audition',
    style: 'Masking, Frame Blending, Color Flashes',
    desc: 'Synchronized visual edit tailored to heavy bass drops, featuring complex rotoscoping and color pulses.',
  },
  {
    id: 6,
    title: 'Creative Cinematic Showcase',
    tag: 'Showreel',
    category: 'Showreel',
    views: '90K+ Views',
    duration: '02:15',
    thumb: '/intro/ezgif-frame-170.jpg',
    software: 'Premiere Pro, DaVinci Resolve',
    style: 'Anamorphic Letterboxing & Story Pacing',
    desc: 'A reel showcasing dynamic camera work, narrative pacing, and emotional audio storytelling.',
  },
]

export default function Videos() {
  const [activeCategory, setActiveCategory] = useState('All')
  const [selectedVideo, setSelectedVideo] = useState(null)

  const filteredVideos = activeCategory === 'All'
    ? VIDEOS
    : VIDEOS.filter(v => v.category === activeCategory)

  return (
    <section id="videos" className="section section-alt">
      <div className="container">
        <Reveal>
          <p className="kicker">Portfolio Highlights</p>
          <h2 className="section-title">Featured Video Edits & Visual Works</h2>
        </Reveal>

        <div className="video-filter-bar">
          {VIDEO_CATEGORIES.map((cat) => (
            <button
              key={cat}
              className={`video-filter-btn ${activeCategory === cat ? 'is-active' : ''}`}
              onClick={() => setActiveCategory(cat)}
            >
              {cat}
            </button>
          ))}
        </div>

        <div className="video-grid">
          {filteredVideos.map((video, i) => (
            <Reveal
              as="article"
              key={video.id}
              delay={i * 80}
              className="video-card"
              onClick={() => setSelectedVideo(video)}
              style={{ cursor: 'pointer' }}
            >
              <div className="video-thumb">
                <img src={video.thumb} alt={video.title} loading="lazy" />
                <div className="video-duration-badge">{video.duration}</div>
                <span className="video-play" aria-hidden="true">
                  ▶
                </span>
              </div>
              <div className="video-card-body">
                <div className="video-meta-row">
                  <span className="video-tag">{video.tag}</span>
                  <span className="video-views">{video.views}</span>
                </div>
                <h3>{video.title}</h3>
                <p className="video-desc-snippet">{video.desc}</p>
                <div className="video-card-footer">
                  <span className="video-watch-link">Watch Preview →</span>
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </div>

      {selectedVideo && (
        <VideoModal video={selectedVideo} onClose={() => setSelectedVideo(null)} />
      )}
    </section>
  )
}