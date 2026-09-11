import { useEffect, useRef, useState } from 'react'

const MORPH_WORDS = ['CREATOR', 'EDITOR', 'DEVELOPER', 'MANAS BANDHU']

export default function Loader({ onDone }) {
  const [count, setCount] = useState(0)
  const [wordIndex, setWordIndex] = useState(0)
  const [scene, setScene] = useState('primary') // 'primary' (coral red) | 'secondary' (deep blue) | 'zooming'
  const doneRef = useRef(false)

  useEffect(() => {
    const duration = 2200 // total loader time in ms
    const start = performance.now()
    let raf

    function tick(now) {
      const elapsed = now - start
      const p = Math.min(1, elapsed / duration)
      // Exponential curve for rapid initial tick then snap
      const eased = Math.pow(p, 0.8)
      const currentCount = Math.round(eased * 100)
      setCount(currentCount)

      // Word morphing timing based on progress
      if (currentCount < 25) setWordIndex(0) // CREATOR
      else if (currentCount < 50) setWordIndex(1) // EDITOR
      else if (currentCount < 75) setWordIndex(2) // DEVELOPER
      else setWordIndex(3) // MANAS BANDHU

      // Scene Color Transition Snap at 70%
      if (currentCount >= 70 && scene === 'primary') {
        setScene('secondary')
      }

      // Whip Zoom Pop at 92%
      if (currentCount >= 92 && scene !== 'zooming') {
        setScene('zooming')
      }

      if (p >= 1 && !doneRef.current) {
        doneRef.current = true
        setTimeout(onDone, 900)
      } else {
        raf = requestAnimationFrame(tick)
      }
    }

    raf = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(raf)
  }, [onDone, scene])

  const currentWord = MORPH_WORDS[wordIndex]

  return (
    <div className={`kinetic-loader-wrapper scene-${scene}`}>
      <div className="kinetic-bg-layer" />
      
      <div className="kinetic-loader-container">
        {/* Dynamic Accent Bar Top */}
        <div className="accent-bar-track bar-top">
          <div className="accent-bar-rect rect-1" />
          <div className="accent-bar-rect rect-2" />
          <div className="accent-bar-rect rect-3" />
        </div>

        {/* Dual Layered Kinetic Typography */}
        <div className="kinetic-text-stage" data-word={currentWord}>
          {/* Layer 1: Hollow Outlined Stroke Text (Behind) */}
          <div className="text-layer layer-stroke" aria-hidden="true">
            {currentWord.split('').map((char, i) => (
              <span 
                key={`stroke-${i}-${char}`} 
                className={`char-stroke ${i % 2 === 0 ? 'flicker-a' : 'flicker-b'}`}
              >
                {char === ' ' ? '\u00A0' : char}
              </span>
            ))}
          </div>

          {/* Layer 2: Solid Filled Kinetic Inversion Text (Front) */}
          <div className="text-layer layer-solid">
            {currentWord.split('').map((char, i) => (
              <span 
                key={`solid-${i}-${char}`} 
                className={`char-solid char-pos-${i} ${i % 3 === 0 ? 'invert-black' : i % 3 === 1 ? 'invert-white' : 'invert-accent'}`}
              >
                {char === ' ' ? '\u00A0' : char}
              </span>
            ))}
          </div>
        </div>

        {/* Dynamic Accent Bar Bottom */}
        <div className="accent-bar-track bar-bottom">
          <div className="accent-bar-rect rect-4" />
          <div className="accent-bar-rect rect-5" />
        </div>

        {/* Percentage Counter & Status */}
        <div className="kinetic-meta-footer">
          <span className="kinetic-status-tag">
            {scene === 'primary' ? '[ PHASE 01 // KINETIC MORPH ]' : scene === 'secondary' ? '[ PHASE 02 // SCENE SNAP ]' : '[ WHIP ZOOM ENTER ]'}
          </span>
          <span className="kinetic-counter">{String(count).padStart(3, '0')}</span>
        </div>
      </div>
    </div>
  )
}