import { useState, useEffect } from 'react'
import MagneticText from './MagneticText'

export default function BuyMeCoffee({ isOpen, onOpen, onClose }) {
  const [internalOpen, setInternalOpen] = useState(false)
  const [copied, setCopied] = useState(false)
  const [selectedAmount, setSelectedAmount] = useState('custom')
  const [sparks, setSparks] = useState([])

  const openModal = isOpen !== undefined ? isOpen : internalOpen
  const handleOpen = onOpen || (() => setInternalOpen(true))
  const handleClose = onClose || (() => setInternalOpen(false))

  const AMOUNT_PRESETS = [
    { label: '☕ Cutting Chai', value: '30' },
    { label: '🥤 Cold Coffee', value: '100' },
    { label: '⚡ Energy Drink', value: '250' },
    { label: '✨ Any Amount', value: 'custom' },
  ]

  const triggerCelebration = (e) => {
    const newSparks = Array.from({ length: 12 }, (_, i) => ({
      id: Date.now() + i,
      x: (Math.random() - 0.5) * 160,
      y: -Math.random() * 100 - 20,
      scale: Math.random() * 0.8 + 0.6,
      rot: (Math.random() - 0.5) * 60,
    }))
    setSparks(newSparks)
    setTimeout(() => setSparks([]), 1200)
  }

  const copyToClipboard = async (text) => {
    // Primary: Modern Async Clipboard API
    if (navigator?.clipboard?.writeText) {
      try {
        await navigator.clipboard.writeText(text)
        return true
      } catch (err) {
        console.warn('Clipboard API blocked/failed, trying fallback...', err)
      }
    }

    // Fallback: document.execCommand for older browsers / insecure contexts / mobile webviews
    try {
      const textArea = document.createElement('textarea')
      textArea.value = text
      textArea.setAttribute('readonly', '')
      textArea.style.position = 'fixed'
      textArea.style.top = '-9999px'
      textArea.style.left = '-9999px'
      textArea.style.opacity = '0'
      document.body.appendChild(textArea)
      textArea.focus()
      textArea.select()
      textArea.setSelectionRange(0, 99999) // Mobile Safari support
      const successful = document.execCommand('copy')
      document.body.removeChild(textArea)
      return successful
    } catch (err) {
      console.error('Failed to copy text: ', err)
      return false
    }
  }

  const handleCopyUPI = async (e) => {
    if (e) {
      e.preventDefault()
      e.stopPropagation()
    }
    triggerCelebration(e)
    await copyToClipboard('7976502062.wallet@phonepe')
    setCopied(true)
    setTimeout(() => setCopied(false), 2500)
  }

  // Handle ESC key to close modal
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && openModal) {
        handleClose()
      }
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [openModal, handleClose])

  return (
    <>
      {/* Floating Interactive Pill Button */}
      <aside aria-label="Coffee Support" className="coffee-floating-container">
        <MagneticText
          strength={0.3}
          as="button"
          onClick={handleOpen}
          className="coffee-floating-btn"
          aria-label="Buy Me a Coffee"
        >
          <span className="coffee-icon-wrap">
            <span className="coffee-steam">♨</span>
            <span className="coffee-cup">☕</span>
          </span>
          <span className="coffee-btn-label">BUY ME A COFFEE</span>
          <span className="coffee-pulse-ring" />
        </MagneticText>
      </aside>

      {/* Interactive QR Payment Modal */}
      {openModal && (
        <div className="video-modal-backdrop coffee-modal-backdrop" onClick={handleClose}>
          <div className="coffee-modal-content qr-modal-content" onClick={(e) => e.stopPropagation()}>
            <button className="video-modal-close" onClick={handleClose} aria-label="Close modal">
              ✕
            </button>

            <div className="coffee-modal-header text-center">
              <div className="coffee-badge-pill">
                <span className="coffee-mini-steam">♨</span> DIRECT UPI / PHONEPE PAYMENT
              </div>
              <h3 className="coffee-modal-title">BUY A COFFEE FOR MANAS</h3>
              <p className="coffee-modal-subtitle">
                Scan the QR code with any UPI app (PhonePe, GPay, Paytm) or tap below to open your payment app directly.
              </p>
            </div>

            {/* Futuristic QR Code Showcase */}
            <div className="qr-showcase-container">
              <div className="qr-frame-wrapper">
                <div className="qr-corner top-left" />
                <div className="qr-corner top-right" />
                <div className="qr-corner bottom-left" />
                <div className="qr-corner bottom-right" />

                <div className="qr-scanner-laser" />

                <img
                  src="/phonepe-qr.png"
                  alt="PhonePe UPI QR Code for Manas Bandhu"
                  className="phonepe-qr-image"
                />

                <div className="qr-brand-tag">
                  <span className="qr-dot-live" /> PHONEPE UPI ACCEPTED
                </div>
              </div>
            </div>

            {/* Quick Amount Selector */}
            <div className="qr-amount-chips">
              {AMOUNT_PRESETS.map((p) => (
                <button
                  key={p.value}
                  type="button"
                  onClick={() => setSelectedAmount(p.value)}
                  className={`qr-amount-chip ${selectedAmount === p.value ? 'is-active' : ''}`}
                >
                  {p.label} {p.value !== 'custom' && `(₹${p.value})`}
                </button>
              ))}
            </div>

            {/* Action Buttons */}
            <div className="coffee-action-box">
              <div className="sparks-container">
                {sparks.map((s) => (
                  <span
                    key={s.id}
                    className="sparkle-particle"
                    style={{
                      transform: `translate(${s.x}px, ${s.y}px) rotate(${s.rot}deg) scale(${s.scale})`,
                    }}
                  >
                    ☕✨
                  </span>
                ))}
              </div>

              <div className="coffee-button-row">
                <button
                  type="button"
                  onClick={handleCopyUPI}
                  className="btn-coffee-primary btn-coffee-copy-only"
                >
                  <span>{copied ? '✓ UPI ID COPIED (7976502062.wallet@phonepe)' : '📋 COPY UPI ID'}</span>
                </button>
              </div>
            </div>

            <div className="coffee-modal-note">
              <span>Pay whatever amount you feel like. Every bit of support fuels more edits & creative content! ❤️</span>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
