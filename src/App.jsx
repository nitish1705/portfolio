import './App.css'

function App() {
  const projects = [
    {
      title: "MultiClips",
      description: "A native macOS clipboard manager utilizing Swift and SwiftUI to efficiently monitor, capture, and organize system-wide clipboard events.",
      tags: ["Swift", "SwiftUI", "SwiftData", "macOS"],
      link: "#"
    },
    {
      title: "GPACALC",
      description: "Dynamic academic utility application built with SwiftUI to accurately compute and track semester-wise GPA and CGPA with local persistence.",
      tags: ["SwiftUI", "SwiftData", "iOS"],
      link: "#"
    }
  ]

  const skills = [
    { category: "Languages", items: ["Swift", "Python", "Java", "MySQL"] },
    { category: "Frameworks", items: ["SwiftUI", "React Native", "SwiftData", "Android SDK"] },
    { category: "Tools", items: ["Xcode", "Figma", "Android Studio", "Git"] }
  ]

  return (
    <div className="app">
      <header className="glass">
        <nav>
          <a href="#projects">Projects</a>
          <a href="#skills">Skills</a>
          <a href="#experience">Experience</a>
          <a href="#contact">Contact</a>
        </nav>
      </header>

      <main className="container">
        <section className="hero">
          <h1>Nitish M</h1>
          <p>iOS Developer & Computer Science Engineer. Crafting high-performance mobile experiences with Swift & SwiftUI.</p>
        </section>

        <section id="projects" className="projects">
          <h2 className="section-title">Projects</h2>
          <div className="grid">
            {projects.map((project, i) => (
              <div key={i} className="card glass project-card">
                <h3>{project.title}</h3>
                <p style={{ color: 'var(--ios-secondary-text)', marginBottom: '20px' }}>{project.description}</p>
                <div style={{ marginBottom: '20px' }}>
                  {project.tags.map(tag => <span key={tag} className="tag">{tag}</span>)}
                </div>
                <a href={project.link} className="blue-link">View Repository →</a>
              </div>
            ))}
          </div>
        </section>

        <section id="skills" className="skills">
          <h2 className="section-title">Skills & Technologies</h2>
          {skills.map((skillGroup, i) => (
            <div key={i} style={{ marginBottom: '40px' }}>
              <h3 style={{ fontSize: '14px', textTransform: 'uppercase', color: 'var(--ios-secondary-text)', marginBottom: '16px', letterSpacing: '0.1em' }}>
                {skillGroup.category}
              </h3>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '12px' }}>
                {skillGroup.items.map(skill => (
                  <div key={skill} className="skill-pill">
                    <span>{skill}</span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </section>

        <section id="experience" className="experience" style={{ marginBottom: '100px' }}>
          <h2 className="section-title">Experience</h2>
          <div className="card glass" style={{ marginBottom: '20px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: '8px' }}>
              <h3 style={{ fontSize: '20px' }}>Supraja Technologies</h3>
              <span style={{ color: 'var(--ios-secondary-text)', fontSize: '14px' }}>Jul 2025</span>
            </div>
            <p style={{ color: 'var(--ios-blue)', fontWeight: '500', marginBottom: '12px' }}>Vulnerability Assessment & Penetration Testing</p>
            <p style={{ color: 'var(--ios-secondary-text)' }}>Conducted Web Application VAPT and developed encryption utilities across 12 practical tasks.</p>
          </div>
          <div className="card glass">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: '8px' }}>
              <h3 style={{ fontSize: '20px' }}>Prodigy Infotech</h3>
              <span style={{ color: 'var(--ios-secondary-text)', fontSize: '14px' }}>Aug 2024</span>
            </div>
            <p style={{ color: 'var(--ios-blue)', fontWeight: '500', marginBottom: '12px' }}>Cyber Security Intern</p>
            <p style={{ color: 'var(--ios-secondary-text)' }}>Implemented cryptographic algorithms and built a packet analyzer for network traffic inspection.</p>
          </div>
        </section>

        <section id="achievements" style={{ marginBottom: '100px' }}>
          <h2 className="section-title">Achievements</h2>
          <div className="grid">
            <div className="card glass">
              <h3 style={{ color: 'var(--ios-blue)', fontSize: '32px', marginBottom: '8px' }}>500+</h3>
              <p style={{ fontWeight: '600' }}>LeetCode Problems Solved</p>
            </div>
            <div className="card glass">
              <h3 style={{ color: 'var(--ios-blue)', fontSize: '32px', marginBottom: '8px' }}>Winner</h3>
              <p style={{ fontWeight: '600' }}>CTRL+ESCAPE (SSN College)</p>
            </div>
            <div className="card glass">
              <h3 style={{ color: 'var(--ios-blue)', fontSize: '32px', marginBottom: '8px' }}>1100+</h3>
              <p style={{ fontWeight: '600' }}>SkillRack Problems</p>
            </div>
          </div>
        </section>
      </main>

      <footer style={{ padding: '80px 0', borderTop: '1px solid #e8e8ed', textAlign: 'center' }}>
        <p style={{ color: 'var(--ios-secondary-text)', fontSize: '14px' }}>
          Designed by Nitish M. Built with React & SwiftUI inspiration.
        </p>
      </footer>
    </div>
  )
}

export default App
