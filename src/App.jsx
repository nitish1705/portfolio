import { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import emailjs from '@emailjs/browser';
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
  const form = useRef();
  const emailAddress = "mnitish1705@gmail.com";

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
    tagline: "Final Year Student @ SJIT",
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
        </div>
        <div className="role-bar">
          <div className="role-dot"></div>
          <span>iOS Engineer • FULL STACK DEVELOPER • SOFTWARE ENGINEER</span>
        </div>
      </header>

      {/* HERO SECTION */}
      <section id="hero" style={{ paddingTop: '20px' }}>
        <motion.div initial="initial" animate="animate" variants={stagger} className="hero-layout">
          <div>
            <motion.h1 variants={fadeIn} className="hero-name">{data.name}</motion.h1>
            <motion.p variants={fadeIn} className="accent-text" style={{ fontSize: '24px', marginBottom: '18px', maxWidth: '640px', lineHeight: '1.2' }}>
              {data.tagline}
            </motion.p>
            <motion.p variants={fadeIn} style={{ fontSize: '18px', marginBottom: '40px', maxWidth: '640px', lineHeight: '1.7', color: 'var(--gray-medium)' }}>
              {data.about}
            </motion.p>
          </div>
          
          <motion.div variants={fadeIn} className="side-info-list">
            <div className="side-info-item">
              <span className="side-label">CURRENTLY</span>
              <span className="side-value">Final Year Student @ SJIT</span>
            </div>
            <div className="side-info-item">
              <span className="side-label">FOCUS</span>
              <span className="side-value">Building apps and learning new frameworks</span>
            </div>
            <div className="side-info-item">
              <span className="side-label">EDUCATION</span>
              <span className="side-value">B.E. Computer Science Engineering</span>
            </div>
          </motion.div>
        </motion.div>
      </section>

      {/* ARSENAL SECTION */}
      <section id="arsenal">
        <div className="arsenal-header">
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <h2 className="arsenal-title">My Arsenal</h2>
          </div>
          <div style={{ fontSize: '12px', letterSpacing: '0.2em', color: 'var(--gray-medium)' }}>STACK</div>
        </div>

        <div className="arsenal-marquee">
          <div className="marquee-content">
            {data.marquee.map((item, i) => (
              <span key={i} className="marquee-item">
                {item} {i < data.marquee.length - 1 && <span className="diamond"></span>}
              </span>
            ))}
          </div>
        </div>

        <div className="stack-list">
          {data.arsenal.map((row) => (
            <motion.div 
              key={row.id} 
              className="stack-row"
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
              <div className="stack-row-num">{row.id}</div>
              <div className="stack-category">{row.category}</div>
              <div className="stack-items">{row.items}</div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ABOUT & QUICK STATS */}
      <section id="about" style={{ paddingTop: '150px' }}>
        <div className="section-label">About & Overview</div>
        <motion.div className="bento-grid" initial="initial" whileInView="animate" variants={stagger} viewport={{ once: true }}>
          <motion.div className="bento-item col-8" variants={fadeIn}>
            <h3>The Story</h3>
            <p style={{ fontSize: '18px', lineHeight: '1.7' }}>{data.about}</p>
          </motion.div>
          <motion.div className="bento-item col-4" variants={fadeIn} style={{ background: 'var(--accent-gradient)', color: 'black' }}>
            <h3 style={{ color: 'rgba(0,0,0,0.6)' }}>Current GPA</h3>
            <div className="stat-val">{data.education.cgpa}</div>
            <p style={{ color: 'rgba(0,0,0,0.8)', marginTop: '10px' }}>Maintaining excellence at SJIT</p>
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
              <a href={p.link} target="_blank" rel="noreferrer" className="accent-text" style={{ textDecoration: 'none' }}>Explore Code ↗</a>
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

      {/* ACHIEVEMENTS */}
      <section id="achievements">
        <div className="section-label">Milestones</div>
        <motion.div className="bento-grid" initial="initial" whileInView="animate" variants={stagger} viewport={{ once: true }}>
          {data.achievements.map((ach, i) => (
            <motion.a 
              key={i} 
              href={ach.link} 
              target="_blank" 
              rel="noreferrer" 
              className="bento-item col-3" 
              variants={fadeIn} 
              style={{ textAlign: 'center', textDecoration: 'none', cursor: 'pointer' }}
            >
              <div className="stat-val" style={{ color: ach.color, marginBottom: '8px' }}>{ach.value}</div>
              <div style={{ fontSize: '12px', fontWeight: 700, textTransform: 'uppercase', color: 'var(--gray-medium)' }}>{ach.label}</div>
            </motion.a>
          ))}
        </motion.div>
      </section>

      {/* CONTACT */}
      <section id="contact">
        <motion.div 
          className="bento-item col-12" 
          initial="initial" 
          whileInView="animate" 
          variants={fadeIn} 
          style={{ textAlign: 'center', padding: '80px 40px', background: 'var(--purple-gradient)', color: 'white' }}
        >
          <h1 style={{ fontSize: '60px', background: 'none', WebkitTextFillColor: 'white' }}>Get In Touch</h1>
          <p style={{ color: 'rgba(255,255,255,0.8)', fontSize: '20px', marginBottom: '30px' }}>Feel free to reach out for collaborations or just a friendly hello!</p>
          
          <div className="email-ui-container">
            <button className="email-btn" onClick={copyToClipboard}>
              <span>{copied ? "Copied!" : "Copy Email"}</span>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path></svg>
            </button>
            <a href={`https://mail.google.com/mail/?view=cm&fs=1&to=${emailAddress}`} target="_blank" rel="noreferrer" className="email-btn secondary">
              <span>Draft in Gmail</span>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path><polyline points="22,6 12,13 2,6"></polyline></svg>
            </a>
          </div>

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
            <button type="submit" disabled={isSending} className="send-btn">
              {status || "Send Message"}
            </button>
          </form>

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
        </motion.div>
      </section>

      <footer className="page-footer">
        <div className="footer-brand">
          <div className="portfolio-tag">PORTFOLIO / {new Date().getFullYear()}</div>
          <div style={{ color: 'white', fontSize: '18px', fontWeight: 700 }}>{data.name}</div>
        </div>

        <div className="footer-links">
          {data.socials.map((s) => (
            <a key={s.name} href={s.url} target="_blank" rel="noreferrer" className="footer-link">
              {s.name}
            </a>
          ))}
          <a href="/Nitish_Resume.pdf" download="Nitish_Resume.pdf" className="footer-link">
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
