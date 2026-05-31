import './App.css'

function App() {
  const projects = [
    {
      title: "MultiClips",
      role: "macOS Engineer",
      details: [
        "Engineered a native macOS clipboard manager utilizing Swift and SwiftUI to efficiently monitor, capture, and organize system-wide clipboard events.",
        "Architected a responsive, adaptive interface with custom SwiftUI animations, ensuring seamless background execution and user interaction.",
        "Integrated SwiftData for robust local data persistence, optimizing the storage, retrieval, and state management of extensive clipboard history."
      ],
      tags: ["Swift", "SwiftUI", "SwiftData", "macOS"],
      link: "https://github.com/nitish1705"
    },
    {
      title: "GPACALC",
      role: "iOS Developer",
      details: [
        "Developed a dynamic academic utility application using SwiftUI to accurately compute and track semester-wise GPA and CGPA.",
        "Implemented efficient local data storage utilizing SwiftData to maintain persistent academic records, enabling real-time edits and state recalculations.",
        "Designed a modular component architecture to optimize rendering performance and ensure a highly responsive, student-friendly user experience."
      ],
      tags: ["SwiftUI", "SwiftData", "iOS"],
      link: "https://github.com/nitish1705"
    }
  ]

  const experiences = [
    {
      company: "Supraja Technologies",
      role: "Web Application VAPT Intern",
      date: "Jul 2025",
      points: [
        "Conducted Web Application Vulnerability Assessment & Penetration Testing to identify and mitigate critical security flaws.",
        "Developed encryption utilities and packet analyzers across 12 practical security tasks."
      ]
    },
    {
      company: "Prodigy Infotech",
      role: "Cyber Security Intern",
      date: "Aug 2024",
      points: [
        "Implemented cryptographic algorithms and system-level security utilities.",
        "Built a packet analyzer for network traffic inspection and security testing."
      ]
    }
  ]

  const skills = [
    { category: "Programming", items: "Python, Java, Swift, MySQL" },
    { category: "Mobile Frameworks", items: "SwiftUI, React Native, SwiftData, Android SDK, NativeWind (CSS)" },
    { category: "Developer Tools", items: "Xcode, Figma, VS Code, Android Studio, Git, MySQL Workbench" }
  ]

  const achievements = [
    { value: "500+", label: "LeetCode Solved" },
    { value: "1st", label: "SSN CTRL+ESCAPE" },
    { value: "1100+", label: "SkillRack Problems" },
    { value: "1209", label: "Codeforces (Pupil)" },
    { value: "Winner", label: "Iron Code Relay" },
    { value: "679", label: "AtCoder Rank" }
  ]

  return (
    <div className="app">
      <header className="glass">
        <nav>
          <a href="#projects">Projects</a>
          <a href="#experience">Experience</a>
          <a href="#skills">Skills</a>
          <a href="#achievements">Achievements</a>
        </nav>
      </header>

      <main className="container">
        <section className="hero">
          <h1>Nitish M</h1>
          <p>iOS Engineer & Computer Science Student at St. Joseph’s Institute of Technology. Specializing in high-performance SwiftUI applications.</p>
          <div style={{ marginTop: '30px', display: 'flex', gap: '20px', justifyContent: 'center' }}>
            <a href="mailto:mnitish1705@gmail.com" className="blue-link" style={{ fontSize: '18px' }}>Email</a>
            <a href="https://linkedin.com/in/nitish-m" className="blue-link" style={{ fontSize: '18px' }}>LinkedIn</a>
            <a href="https://github.com/nitish1705" className="blue-link" style={{ fontSize: '18px' }}>GitHub</a>
          </div>
        </section>

        <section id="projects">
          <h2 className="section-title">Projects</h2>
          <div className="bento-grid">
            {projects.map((project, i) => (
              <div key={i} className="bento-card glass">
                <div>
                  <span style={{ fontSize: '14px', fontWeight: '600', color: 'var(--ios-blue)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>{project.role}</span>
                  <h3>{project.title}</h3>
                  <ul>
                    {project.details.map((detail, j) => (
                      <li key={j}>{detail}</li>
                    ))}
                  </ul>
                </div>
                <div>
                  <div style={{ marginBottom: '20px' }}>
                    {project.tags.map(tag => <span key={tag} className="tag">{tag}</span>)}
                  </div>
                  <a href={project.link} className="blue-link">Explore Code →</a>
                </div>
              </div>
            ))}
          </div>
        </section>

        <section id="experience">
          <h2 className="section-title">Professional Experience</h2>
          <div className="glass" style={{ borderRadius: '30px', padding: '0 40px' }}>
            {experiences.map((exp, i) => (
              <div key={i} className="exp-item">
                <div className="exp-header">
                  <h3>{exp.company}</h3>
                  <span className="exp-date">{exp.date}</span>
                </div>
                <p className="exp-role">{exp.role}</p>
                <ul style={{ listStyle: 'none' }}>
                  {exp.points.map((point, j) => (
                    <li key={j} style={{ fontSize: '17px', color: 'var(--ios-secondary-text)', marginBottom: '8px', position: 'relative', paddingLeft: '20px' }}>
                      <span style={{ position: 'absolute', left: 0, color: '#d2d2d7' }}>•</span>
                      {point}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </section>

        <section id="skills">
          <h2 className="section-title">Skills & Tech Stack</h2>
          <div className="skill-section glass">
            {skills.map((group, i) => (
              <div key={i} className="skill-row">
                <div className="skill-category">{group.category}</div>
                <div className="skill-list">{group.items}</div>
              </div>
            ))}
          </div>
        </section>

        <section id="achievements" style={{ paddingBottom: '150px' }}>
          <h2 className="section-title">Achievements</h2>
          <div className="achieve-grid">
            {achievements.map((ach, i) => (
              <div key={i} className="achieve-card glass">
                <div className="achieve-value">{ach.value}</div>
                <div className="achieve-label">{ach.label}</div>
              </div>
            ))}
          </div>
        </section>
      </main>

      <footer style={{ padding: '60px 0', textAlign: 'center', borderTop: '1px solid #d2d2d7' }}>
        <p style={{ color: 'var(--ios-secondary-text)', fontSize: '14px' }}>
          © {new Date().getFullYear()} Nitish M. Designed with Apple Design Guidelines in mind.
        </p>
      </footer>
    </div>
  )
}

export default App
