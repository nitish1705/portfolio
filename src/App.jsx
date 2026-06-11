import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  LineChart, Line, ResponsiveContainer, Tooltip as ChartTooltip, 
  PieChart, Pie, Cell, XAxis, YAxis
} from 'recharts';
import emailjs from '@emailjs/browser';
import heroImage from './assets/hero.png';
import './index.css';

const fadeIn = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] }
};

const stagger = {
  animate: { transition: { staggerChildren: 0.05 } }
};

function App() {
  const [copied, setCopied] = useState(false);
  const [isSending, setIsSending] = useState(false);
  const [status, setStatus] = useState('');
  const [leetcodeData, setLeetcodeData] = useState(null);
  const [cfData, setCfData] = useState(null);
  
  const form = useRef();
  const emailAddress = "mnitish1705@gmail.com";
  const resumeUrl = "/Nitish_Resume.pdf";

  useEffect(() => {
    // Fetch LeetCode Data
    fetch('https://alfa-leetcode-api.onrender.com/Nitish_17_M/solved')
      .then(res => res.json())
      .then(data => setLeetcodeData(data))
      .catch(err => console.error("LeetCode Fetch Error:", err));

    // Fetch Codeforces Data
    fetch('https://codeforces.com/api/user.rating?handle=Ninja_1705')
      .then(res => res.json())
      .then(data => {
        if (data.status === "OK") {
          setCfData(data.result);
        }
      })
      .catch(err => console.error("Codeforces Fetch Error:", err));
  }, []);

  const copyToClipboard = () => {
    navigator.clipboard.writeText(emailAddress);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const sendEmail = (e) => {
    e.preventDefault();
    setIsSending(true);
    setStatus('Sending...');

    // Note: You need to set up your EmailJS service ID, template ID, and public key in your EmailJS dashboard.
    // Replace these placeholders with your actual keys when you have them.
    emailjs.sendForm('YOUR_SERVICE_ID', 'YOUR_TEMPLATE_ID', form.current, 'YOUR_PUBLIC_KEY')
      .then(() => {
          setStatus('Message Sent!');
          setIsSending(false);
          form.current.reset();
          setTimeout(() => setStatus(''), 3000);
      }, (error) => {
          // If you haven't set up EmailJS yet, this will fail. 
          // I've added a fallback message so you know it's working but needs keys.
          setStatus('Config needed!'); 
          setIsSending(false);
          console.log('EmailJS Error:', error.text);
      });
  };

  const data = {
    name: "Nitish M",
    role: "iOS & Mobile Engineer",
    headline: "I build polished mobile and web experiences with a focus on clean systems and thoughtful UI.",
    tagline: "Final Year Student @ SJIT",
    location: "Chennai, India",
    about: "I am a final year Computer Science student at St. Joseph’s Institute of Technology who enjoys building apps and learning new frameworks as I go. My focus is on turning ideas into clean, useful products with strong fundamentals in programming, mobile development, web development, and product thinking.",
    education: {
      degree: "B.E. Computer Science Engineering",
      org: "St. Joseph’s Institute of Technology",
      date: "2023 – 2027",
      cgpa: "8.55 / 10"
    },
    arsenal: [
      { id: "01", category: "Languages", items: "Python / Java / Swift / C / SQL" },
      { id: "02", category: "Frontend", items: "React / HTML5 / CSS3 / Tailwind / NativeWind" },
      { id: "03", category: "Backend", items: "Node.js / Express / MySQL / REST APIs / PHP" },
      { id: "04", category: "Mobile Dev", items: "SwiftUI / SwiftData / React Native / Android SDK" },
      { id: "05", category: "Tools & Frameworks", items: "Git / VS Code / Xcode / Android Studio / Figma" }
    ],
    marquee: ["SwiftUI", "SwiftData", "Xcode", "Git", "Python", "Java", "React Native", "SwiftUI", "SwiftData", "Xcode", "Git", "Python", "Java", "React Native"],
    experience: [
      { role: "Internship Experience", org: "Supraja Technologies", date: "Jul 2025" }
    ],
    projects: [
      {
        name: "MultiClips",
        desc: "Native macOS clipboard manager utilizing Swift and SwiftUI to monitor, capture, and organize system-wide clipboard events with SwiftData persistence.",
        tech: ["Swift", "SwiftUI", "SwiftData"],
        link: "https://github.com/nitish1705"
      },
      {
        name: "GPACALC",
        desc: "Dynamic academic utility for iOS to compute and track semester-wise GPA/CGPA with real-time recalculations and modular component architecture.",
        tech: ["SwiftUI", "SwiftData", "iOS"],
        link: "https://github.com/nitish1705"
      }
    ],
    achievements: [
      { label: "LeetCode Solved", value: "500+", color: "var(--accent-1)", link: "https://leetcode.com/u/Nitish_17_M/" },
      { label: "SSN Winner", value: "1st Place", color: "var(--accent-2)", link: "https://github.com/nitish1705" },
      { label: "SkillRack", value: "1100+", color: "var(--accent-3)", link: "http://www.skillrack.com/faces/resume.xhtml?id=447801&key=nitish1705" },
      { label: "Codeforces", value: "1209", color: "#66ff66", link: "https://codeforces.com/profile/Ninja_1705" },
      { label: "AtCoder Rank", value: "679", color: "#ffcc00", link: "https://atcoder.jp/users/Nitish_M" }
    ],
    certifications: [
      "NPTEL: Python for Data Science",
      "Introduction to Programming in C",
      "Networking Basics"
    ],
    socials: [
      { name: "GitHub", url: "https://github.com/nitish1705" },
      { name: "LinkedIn", url: "https://www.linkedin.com/in/nitish--m/" },
      { name: "Email", url: "mailto:mnitish1705@gmail.com" },
      { name: "Leetcode", url: "https://leetcode.com/u/Nitish_17_M/" }
    ]
  };

  return (
    <div className="container">
      <div className="bg-glow"></div>

      {/* EDITORIAL HEADER */}
      <header className="editorial-header">
        <div className="top-bar">
          <div className="portfolio-tag">PORTFOLIO / {new Date().getFullYear()}</div>
          <a href={resumeUrl} download="Nitish_Resume.pdf" className="ui-button ui-button--ghost top-download">
            Download CV
          </a>
        </div>
        <div className="header-divider"></div>
        <div className="role-bar">
          <span className="location-tag">{data.location}</span>
          <div className="role-dot"></div>
          <span>iOS Engineer • FULL STACK DEVELOPER • SOFTWARE ENGINEER</span>
        </div>
      </header>

      {/* HERO SECTION */}
      <section id="hero" style={{ paddingTop: '20px' }}>
        <motion.div initial="initial" animate="animate" variants={stagger} className="hero-layout">
          <motion.h1 variants={fadeIn} className="hero-name">{data.name}</motion.h1>
          <motion.p variants={fadeIn} className="accent-text" style={{ fontSize: '32px', marginBottom: '24px', maxWidth: '800px', lineHeight: '1.2' }}>
            {data.tagline}
          </motion.p>
          <motion.p variants={fadeIn} className="hero-headline">
            {data.headline}
          </motion.p>
          
          <motion.div variants={fadeIn} className="side-info-list">
            <div className="side-info-item">
              <span className="side-label">CURRENTLY</span>
              <span className="side-value">Final Year Student @ SJIT</span>
            </div>
            <div className="side-info-item">
              <span className="side-label">FOCUS</span>
              <span className="side-value">iOS & Mobile Engineering</span>
            </div>
            <div className="side-info-item">
              <span className="side-label">LOCATION</span>
              <span className="side-value">{data.location}</span>
            </div>
          </motion.div>
        </motion.div>
      </section>

      {/* ABOUT SECTION */}
      <section id="about">
        <div className="section-label">About Me</div>
        <motion.div 
          className="about-layout"
          initial="initial"
          whileInView="animate"
          viewport={{ once: true }}
          variants={stagger}
        >
          <motion.div variants={fadeIn} className="about-photo-card">
            <div className="about-photo-frame">
              <img src={heroImage} alt={data.name} className="about-photo" />
            </div>
          </motion.div>
          
          <motion.div variants={fadeIn} className="about-description">
            <h3>The Story</h3>
            <p style={{ fontSize: '18px', lineHeight: '1.8', color: 'var(--gray-medium)' }}>
              {data.about}
            </p>
            
            <div className="bento-grid" style={{ marginTop: '20px' }}>
              <div className="bento-item col-12" style={{ padding: '24px' }}>
                <span className="side-label" style={{ marginBottom: '8px', display: 'block' }}>Current GPA</span>
                <div className="stat-val" style={{ fontSize: '36px' }}>{data.education.cgpa}</div>
                <p style={{ color: 'var(--gray-medium)', fontSize: '14px', marginTop: '4px' }}>Maintaining excellence at SJIT</p>
              </div>
            </div>
          </motion.div>
        </motion.div>
      </section>

      {/* PROJECTS SECTION */}
      <section id="projects">
        <div className="section-label">Selected Works</div>
        <motion.div className="bento-grid" initial="initial" whileInView="animate" variants={stagger} viewport={{ once: true }}>
          {data.projects.map((p, i) => (
            <motion.div key={i} className="bento-item col-6" variants={fadeIn}>
              <div style={{ display: 'flex', gap: '10px', marginBottom: '15px' }}>
                {p.tech.map(t => <span key={t} className="tag">{t}</span>)}
              </div>
              <h3>{p.name}</h3>
              <p style={{ marginBottom: '20px' }}>{p.desc}</p>
               <a href={p.link} target="_blank" rel="noreferrer" className="ui-button ui-button--ghost project-link">Explore Code ↗</a>
            </motion.div>
          ))}
        </motion.div>
      </section>

      {/* EXPERIENCE & CERTIFICATIONS */}
      <section id="experience">
        <div className="section-label">Professional Journey</div>
        <motion.div className="bento-grid" initial="initial" whileInView="animate" variants={stagger} viewport={{ once: true }}>
          <motion.div className="bento-item col-8" variants={fadeIn}>
            <h3>Experience</h3>
            {data.experience.map((exp, i) => (
              <div key={i} className="exp-row">
                <div>
                  <div style={{ fontWeight: 700, fontSize: '18px' }}>{exp.role}</div>
                  <div style={{ color: 'var(--gray-medium)' }}>{exp.org}</div>
                </div>
                <div className="accent-text">{exp.date}</div>
              </div>
            ))}
          </motion.div>
          <motion.div className="bento-item col-4" variants={fadeIn}>
            <h3>Certifications</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginTop: '15px' }}>
              {data.certifications.map(c => (
                <div key={c} style={{ fontSize: '14px', borderLeft: '2px solid var(--accent-3)', paddingLeft: '12px' }}>{c}</div>
              ))}
            </div>
          </motion.div>
        </motion.div>
      </section>

      {/* ACHIEVEMENTS / MILESTONES */}
      <section id="achievements">
        <div className="section-label">Milestones & Metrics</div>
        <motion.div className="bento-grid" initial="initial" whileInView="animate" variants={stagger} viewport={{ once: true }}>
          
          {/* LEETCODE CARD */}
          <motion.a 
            href="https://leetcode.com/u/Nitish_17_M/" 
            target="_blank" 
            rel="noreferrer" 
            className="bento-item col-6" 
            variants={fadeIn}
            style={{ textDecoration: 'none', display: 'flex', flexDirection: 'column', height: '320px' }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
              <div>
                <h3 style={{ margin: 0 }}>LeetCode</h3>
                <p style={{ color: 'var(--gray-medium)', fontSize: '14px' }}>Problem Solving Metrics</p>
              </div>
              <div className="stat-val" style={{ color: 'var(--accent-1)' }}>
                {leetcodeData?.solvedProblem || "570+"}
              </div>
            </div>
            
            <div style={{ flex: 1, display: 'flex', alignItems: 'center', gap: '20px' }}>
              <div style={{ width: '150px', height: '150px' }}>
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={[
                        { name: 'Easy', value: leetcodeData?.easySolved || 314 },
                        { name: 'Medium', value: leetcodeData?.mediumSolved || 234 },
                        { name: 'Hard', value: leetcodeData?.hardSolved || 25 },
                      ]}
                      innerRadius={50}
                      outerRadius={70}
                      paddingAngle={5}
                      dataKey="value"
                    >
                      <Cell fill="#00ffcc" />
                      <Cell fill="#ffcc00" />
                      <Cell fill="#ff3366" />
                    </Pie>
                  </PieChart>
                </ResponsiveContainer>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', flex: 1 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px' }}>
                  <span style={{ color: '#00ffcc', fontWeight: 700 }}>EASY</span>
                  <span>{leetcodeData?.easySolved || 314}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px' }}>
                  <span style={{ color: '#ffcc00', fontWeight: 700 }}>MEDIUM</span>
                  <span>{leetcodeData?.mediumSolved || 234}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px' }}>
                  <span style={{ color: '#ff3366', fontWeight: 700 }}>HARD</span>
                  <span>{leetcodeData?.hardSolved || 25}</span>
                </div>
              </div>
            </div>
          </motion.a>

          {/* CODEFORCES CARD */}
          <motion.a 
            href="https://codeforces.com/profile/Ninja_1705" 
            target="_blank" 
            rel="noreferrer" 
            className="bento-item col-6" 
            variants={fadeIn}
            style={{ textDecoration: 'none', display: 'flex', flexDirection: 'column', height: '320px' }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
              <div>
                <h3 style={{ margin: 0 }}>Codeforces</h3>
                <p style={{ color: 'var(--gray-medium)', fontSize: '14px' }}>Rating Progression</p>
              </div>
              <div className="stat-val" style={{ color: '#4fc1ff' }}>
                {cfData ? cfData[cfData.length - 1]?.newRating : "1209"}
              </div>
            </div>
            
            <div style={{ flex: 1, width: '100%', marginTop: '10px' }}>
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={cfData || [
                  { newRating: 400 }, { newRating: 600 }, { newRating: 800 }, 
                  { newRating: 950 }, { newRating: 1209 }, { newRating: 1163 }
                ]}>
                  <XAxis dataKey="contestId" hide />
                  <YAxis hide domain={['dataMin - 100', 'dataMax + 100']} />
                  <ChartTooltip 
                    contentStyle={{ background: '#252526', border: '1px solid var(--glass-border)', borderRadius: '8px', fontSize: '12px' }}
                    itemStyle={{ color: '#4fc1ff' }}
                    labelStyle={{ display: 'none' }}
                  />
                  <Line 
                    type="monotone" 
                    dataKey="newRating" 
                    stroke="#4fc1ff" 
                    strokeWidth={3} 
                    dot={false}
                    activeDot={{ r: 6, fill: '#ffffff' }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </motion.a>

          {/* OTHER MILESTONES */}
          <motion.div className="bento-item col-4" variants={fadeIn} style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', textAlign: 'center' }}>
            <div className="stat-val" style={{ color: 'var(--accent-2)', marginBottom: '8px' }}>1st Place</div>
            <div style={{ fontSize: '12px', fontWeight: 700, textTransform: 'uppercase', color: 'var(--gray-medium)' }}>SSN Winner</div>
          </motion.div>

          <motion.div className="bento-item col-4" variants={fadeIn} style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', textAlign: 'center' }}>
            <div className="stat-val" style={{ color: 'var(--accent-3)', marginBottom: '8px' }}>1100+</div>
            <div style={{ fontSize: '12px', fontWeight: 700, textTransform: 'uppercase', color: 'var(--gray-medium)' }}>SkillRack Solved</div>
          </motion.div>

          <motion.div className="bento-item col-4" variants={fadeIn} style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', textAlign: 'center' }}>
            <div className="stat-val" style={{ color: '#ffcc00', marginBottom: '8px' }}>679</div>
            <div style={{ fontSize: '12px', fontWeight: 700, textTransform: 'uppercase', color: 'var(--gray-medium)' }}>AtCoder Rank</div>
          </motion.div>

        </motion.div>
      </section>

      {/* CONTACT */}
      <div className="contact-section-wrapper">
        <section id="contact" style={{ paddingTop: 0 }}>
          <div className="contact-container">
            <motion.div 
              className="contact-left"
              initial="initial"
              whileInView="animate"
              viewport={{ once: true }}
              variants={fadeIn}
            >
              <h2 className="contact-quote">
                Have a thoughtful idea in mind? <br />
                <span style={{ color: 'var(--accent-1)' }}>Let's bring it to life.</span>
              </h2>
              
              <div className="contact-links-grid">
                <a href={`mailto:${emailAddress}`} className="contact-link-item">
                  <div className="contact-link-header">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path><polyline points="22,6 12,13 2,6"></polyline></svg>
                    <span>EMAIL</span>
                  </div>
                  <span className="contact-link-value">{emailAddress}</span>
                </a>

                <a href="tel:+919363065096" className="contact-link-item">
                  <div className="contact-link-header">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path></svg>
                    <span>PHONE</span>
                  </div>
                  <span className="contact-link-value">+91 93630 65096</span>
                </a>

                {data.socials.filter(s => s.name !== "Email").map(s => (
                  <a key={s.name} href={s.url} target="_blank" rel="noreferrer" className="contact-link-item">
                    <div className="contact-link-header">
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        {s.name === "GitHub" && <path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22"></path>}
                        {s.name === "LinkedIn" && <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6zM2 9h4v12H2z"></path>}
                        {s.name === "Leetcode" && <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"></path>}
                      </svg>
                      <span>{s.name}</span>
                    </div>
                    <span className="contact-link-value">
                      {s.name === "GitHub" && "github.com/nitish1705"}
                      {s.name === "LinkedIn" && "linkedin.com/in/nitish--m"}
                      {s.name === "Leetcode" && "leetcode.com/Nitish_17_M"}
                    </span>
                  </a>
                ))}
              </div>
            </motion.div>

            <motion.div 
              initial="initial" 
              whileInView="animate" 
              variants={fadeIn} 
              viewport={{ once: true }}
            >
              <form ref={form} onSubmit={sendEmail} className="contact-form">
                <div className="form-group">
                  <label>Name</label>
                  <input type="text" name="user_name" className="form-input" placeholder="Your Name" required />
                </div>
                <div className="form-group">
                  <label>Email</label>
                  <input type="email" name="user_email" className="form-input" placeholder="Your Email" required />
                </div>
                <div className="form-group">
                  <label>Message</label>
                  <textarea name="message" className="form-input" rows="4" placeholder="How can I help you?" required style={{ resize: 'none' }}></textarea>
                </div>
                <button type="submit" disabled={isSending} className="send-btn ui-button" style={{ width: '100%', marginTop: '20px' }}>
                  {status || "Send Message"}
                </button>
              </form>
            </motion.div>
          </div>
        </section>
      </div>

      <AnimatePresence>
        {copied && (
          <motion.div 
            className="copy-toast"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
          >
            Address added to clipboard
          </motion.div>
        )}
      </AnimatePresence>

      <footer className="page-footer">
        <div className="footer-brand">
          <div className="portfolio-tag">PORTFOLIO / {new Date().getFullYear()}</div>
          <div style={{ color: 'white', fontSize: '18px', fontWeight: 700 }}>{data.name}</div>
        </div>

        <div className="footer-links">
          {data.socials.map((s) => (
            <a key={s.name} href={s.url} target="_blank" rel="noreferrer" className="footer-link ui-button ui-button--ghost">
              {s.name}
            </a>
          ))}
          <a href={resumeUrl} download="Nitish_Resume.pdf" className="footer-link ui-button">
            Download CV
          </a>
        </div>

        <div style={{ color: 'var(--gray-medium)', fontSize: '14px' }}>
          © {new Date().getFullYear()} {data.name} • Designed for Impact
        </div>
      </footer>
    </div>
  );
}

export default App;
