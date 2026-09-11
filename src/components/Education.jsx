import Reveal from './Reveal'

const EDUCATION = [
  {
    period: '2024 — 2027 (Expected)',
    degree: 'BCA (Bachelor of Computer Applications)',
    school: 'University of Engineering & Management (UEM) • Jaipur, Rajasthan',
    note: 'Building core software logic, computer programming foundations, data analysis, and web engineering frameworks.',
    badge: 'Degree',
  },
  {
    period: 'Passed Out 2024',
    degree: 'Senior Secondary Education',
    school: 'Mehta Public Sr. Sec. School • Jaipur, Rajasthan',
    note: 'Completed secondary education with focus on analytical thinking and academic foundation.',
    badge: 'Senior Secondary',
  },
]

export default function Education() {
  return (
    <section id="education" className="section section-alt">
      <div className="container">
        <Reveal>
          <p className="kicker">Education & Academic Timeline</p>
          <h2 className="section-title">My Learning & Skill Journey</h2>
        </Reveal>

        <div className="timeline">
          {EDUCATION.map((item, i) => (
            <Reveal as="article" key={item.degree} delay={i * 100} className="timeline-item">
              <div className="timeline-dot" aria-hidden="true" />
              <div className="timeline-card">
                <div className="timeline-header">
                  <span className="timeline-period">{item.period}</span>
                  <span className="timeline-type-badge">{item.badge}</span>
                </div>
                <h3>{item.degree}</h3>
                <p className="timeline-school">{item.school}</p>
                <p className="timeline-note">{item.note}</p>
              </div>
            </Reveal>
          ))}
        </div>

        <Reveal delay={200} className="education-quote-box">
          <p className="education-quote">
            "Education for him is not a finish line — it’s a framework."
          </p>
        </Reveal>
      </div>
    </section>
  )
}