export default function VideoModal({ video, onClose }) {
  if (!video) return null

  const isYouTube = Boolean(video.id && !video.id.startsWith('exp-'))

  return (
    <div className="video-modal-backdrop" onClick={onClose}>
      <div className="video-modal-content" onClick={(e) => e.stopPropagation()}>
        <button className="video-modal-close" onClick={onClose} aria-label="Close video modal">
          ✕
        </button>
        <div className="video-modal-header">
          <span className="video-tag">{video.tag}</span>
          <h3>{video.title}</h3>
          <p className="video-modal-meta">{video.views} • {video.duration}</p>
        </div>
        <div className="video-modal-player">
          <div className="preview-player-box">
            {isYouTube ? (
              <iframe
                src={`https://www.youtube-nocookie.com/embed/${video.id}?autoplay=1`}
                title={video.title}
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                className="modal-iframe-player"
                style={{ width: '100%', height: '100%', border: 'none', position: 'absolute', inset: 0 }}
              />
            ) : (
              <>
                <img src={video.thumb} alt={video.title} className="modal-thumb-img" />
                <div className="modal-player-overlay">
                  <span className="play-pulse-icon">▶</span>
                  <p className="player-notice">Video Preview Active</p>
                  <p className="player-sub">{video.desc}</p>
                </div>
              </>
            )}
          </div>
        </div>
        <div className="video-modal-footer">
          <div className="video-details-list">
            <span><strong>Software Used:</strong> {video.software}</span>
            <span><strong>Style:</strong> {video.style}</span>
          </div>
          {video.watchUrl && (
            <a
              href={video.watchUrl}
              target="_blank"
              rel="noreferrer"
              className="btn-modal-watch"
            >
              WATCH ON YOUTUBE ↗
            </a>
          )}
        </div>
      </div>
    </div>
  )
}
