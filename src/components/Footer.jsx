import MagneticText from './MagneticText'
import Logo from './Logo'

const SOCIAL_LINKS = [
  { name: 'GitHub', url: 'https://github.com/Manas96-afk?tab=repositories' },
  { name: 'Instagram', url: 'https://www.instagram.com/cnomo_editz/' },
  { name: 'LinkedIn', url: 'https://linkedin.com/in/manasbandhu' },
  { name: 'X (Twitter)', url: 'https://x.com/manas_1303x' },
  { name: 'YouTube', url: 'https://www.youtube.com/@cnomo_editz' },
  { name: 'Email', url: 'mailto:mgamer6900@gmail.com' },
]

export default function Footer() {
  return (
    <footer id="footer" className="minimal-footer">
      <div className="container footer-content-wrap">
        <div className="footer-brand-mark">
          <Logo size="large" showText={false} />
        </div>
        <h2 className="footer-title">MANAS BANDHU</h2>

        <p className="footer-quote">
          "This website is not just a showcase — it's a checkpoint. A place where my name lives online while I continue building the extraordinary."
        </p>

        <div className="footer-social-row">
          {SOCIAL_LINKS.map((social) => (
            <MagneticText
              key={social.name}
              strength={0.25}
              as="a"
              href={social.url}
              target="_blank"
              rel="noreferrer"
              className="footer-social-chip"
            >
              <span>{social.name}</span>
            </MagneticText>
          ))}
        </div>

        <p className="footer-copyright">
          © {new Date().getFullYear()} MANAS BANDHU — ALL RIGHTS RESERVED.
        </p>
      </div>
    </footer>
  )
}