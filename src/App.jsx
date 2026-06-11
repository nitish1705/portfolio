import { useState, useRef, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  LineChart, Line, ResponsiveContainer, Tooltip as ChartTooltip, 
  PieChart, Pie, Cell, XAxis, YAxis, AreaChart, Area
} from 'recharts';
import emailjs from '@emailjs/browser';
import heroImage from './assets/Nitish.png';
import './index.css';

// --- ICONS (SVG) ---
const Icons = {
  Code: () => <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="16 18 22 12 16 6"></polyline><polyline points="8 6 2 12 8 18"></polyline></svg>,
  Activity: () => <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="22 12 18 12 15 21 9 3 6 12 2 12"></polyline></svg>,
  Globe: () => <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"></circle><line x1="2" y1="12" x2="22" y2="12"></line><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"></path></svg>,
  Github: () => <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22"></path></svg>,
  Zap: () => <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"></polygon></svg>,
  Trophy: () => <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M6 9H4.5a2.5 2.5 0 0 1 0-5H6"></path><path d="M18 9h1.5a2.5 2.5 0 0 0 0-5H18"></path><path d="M4 22h16"></path><path d="M10 14.66V17c0 .55-.47.98-.97 1.21C7.85 18.75 7 20.24 7 22"></path><path d="M14 14.66V17c0 .55.47.98.97 1.21C16.15 18.75 17 20.24 17 22"></path><path d="M18 2H6v7a6 6 0 0 0 12 0V2z"></path></svg>,
  External: () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"></path><polyline points="15 3 22 3 22 10"></polyline><line x1="14" y1="11" x2="22" y2="3"></line></svg>
};

// --- CACHING & FETCHING ---
const CACHE_KEY = 'portfolio_analytics_cache_v3';
const CACHE_DURATION = 12 * 60 * 60 * 1000;

const fetchAnalyticsData = async () => {
  const cached = localStorage.getItem(CACHE_KEY);
  if (cached) {
    const { data, timestamp } = JSON.parse(cached);
    if (Date.now() - timestamp < CACHE_DURATION) return data;
  }

  const results = { leetcode: null, codeforces: null, atcoder: null, github: null };
  try {
    const [lc, cf, ac, gh] = await Promise.all([
      fetch('https://alfa-leetcode-api.onrender.com/Nitish_17_M/solved').then(res => res.json()).catch(() => null),
      fetch('https://codeforces.com/api/user.rating?handle=Ninja_1705').then(res => res.json()).catch(() => null),
      fetch('https://kenkoooo.com/atcoder/atcoder-api/v3/user/user_rank?user=Nitish_M').then(res => res.json()).catch(() => null),
      fetch('https://api.github.com/users/nitish1705').then(res => res.json()).catch(() => null)
    ]);
    results.leetcode = lc;
    results.codeforces = cf?.status === "OK" ? cf.result : null;
    results.atcoder = ac;
    results.github = gh;
  } catch (err) { console.error(err); }

  localStorage.setItem(CACHE_KEY, JSON.stringify({ data: results, timestamp: Date.now() }));
  return results;
};

// --- COMPONENTS ---
const PlatformCard = ({ title, accent, children, link }) => (
  <motion.div 
    initial={{ opacity: 0, y: 30 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true }}
    className="premium-platform-card"
  >
    <div className="premium-card-header">
      <div className="premium-platform-info">
        <div>
          <h3 style={{ margin: 0, fontSize: '24px' }}>{title}</h3>
        </div>
      </div>
      <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
        <a href={link} target="_blank" rel="noreferrer" style={{ color: 'var(--gray-medium)' }}>
          <Icons.External />
        </a>
      </div>
    </div>
    {children}
  </motion.div>
);

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
  const [analytics, setAnalytics] = useState({ leetcode: null, codeforces: null, atcoder: null, github: null });
  
  const form = useRef();
  const emailAddress = "mnitish1705@gmail.com";
  const resumeUrl = "/Nitish_Resume.pdf";

  useEffect(() => {
    fetchAnalyticsData().then(data => setAnalytics(data));
  }, []);

  const totalImpact = useMemo(() => ({
    solved: (analytics.leetcode?.totalSolved || 573) + (analytics.codeforces?.length ? 210 : 0) + 1100,
    contests: 85
  }), [analytics]);


  const copyToClipboard = () => {
    navigator.clipboard.writeText(emailAddress);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const sendEmail = (e) => {
    e.preventDefault();
    setIsSending(true);
    setStatus('Sending...');

    emailjs.sendForm('service_5v1vpor', 'template_vfxvv8f', form.current, 'Q90yjPY0QapVFjvO_')
      .then(() => {
          setStatus('Message Sent!');
          setIsSending(false);
          form.current.reset();
          setTimeout(() => setStatus(''), 3000);
      }, (error) => {
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
          <span>APPLE PLATFORM ENGINEER • SOFTWARE ENGINEER • COMPETITIVE PROGRAMMER</span>
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

      {/* MILESTONES & METRICS - PREMIUM VERTICAL DASHBOARD */}
      <section id="achievements">
        <div className="section-label">Milestones & Metrics</div>
        
        <div className="analytics-dashboard-vertical">
          
          {/* 1. LEETCODE */}
          <PlatformCard 
            title="LeetCode" 
            accent="#00e5ff"
            link="https://leetcode.com/u/Nitish_17_M/"
          >
            <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', gap: '60px', flexWrap: 'wrap', marginTop: '32px' }}>
              <div style={{ width: '180px', height: '180px', position: 'relative' }}>
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={[
                        { name: 'Easy', value: analytics.leetcode?.easySolved || 314 },
                        { name: 'Medium', value: analytics.leetcode?.mediumSolved || 234 },
                        { name: 'Hard', value: analytics.leetcode?.hardSolved || 25 },
                      ]}
                      innerRadius={70}
                      outerRadius={90}
                      paddingAngle={8}
                      dataKey="value"
                      stroke="none"
                    >
                      <Cell fill="#00e5ff" />
                      <Cell fill="#f59e0b" />
                      <Cell fill="#ec4899" />
                    </Pie>
                  </PieChart>
                </ResponsiveContainer>
                <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', textAlign: 'center' }}>
                  <div style={{ fontSize: '32px', fontWeight: 900, color: 'white' }}>{analytics.leetcode?.totalSolved || 573}</div>
                  <div style={{ fontSize: '10px', fontWeight: 700, color: 'var(--gray-medium)', letterSpacing: '0.1em' }}>SOLVED</div>
                </div>
              </div>
              <div className="premium-stat-row" style={{ flex: 1 }}>
                <div className="premium-stat-item">
                  <div className="premium-stat-label">ACCEPTANCE</div>
                  <div className="premium-stat-value">72.4%</div>
                </div>
                <div className="premium-stat-item">
                  <div className="premium-stat-label">RANKING</div>
                  <div className="premium-stat-value">#144k</div>
                </div>
                <div className="premium-stat-item">
                  <div className="premium-stat-label">TOTAL ACTIVE DAYS</div>
                  <div className="premium-stat-value">191 DAYS</div>
                </div>
              </div>
            </div>
          </PlatformCard>

          {/* 2. CODEFORCES */}
          <PlatformCard 
            title="Codeforces" 
            accent="#3b82f6"
            link="https://codeforces.com/profile/Ninja_1705"
          >
            <div style={{ marginTop: '32px' }}>
              <div className="premium-stat-row">
                <div className="premium-stat-item">
                  <div className="premium-stat-label">CURRENT</div>
                  <div className="premium-stat-value">1163</div>
                </div>
                <div className="premium-stat-item">
                  <div className="premium-stat-label">PEAK</div>
                  <div className="premium-stat-value">1209</div>
                </div>
                <div className="premium-stat-item">
                  <div className="premium-stat-label">CONTESTS</div>
                  <div className="premium-stat-value">21 Played</div>
                </div>
                <div className="premium-stat-item">
                  <div className="premium-stat-label">GLOBAL RANK</div>
                  <div className="premium-stat-value">Top 15%</div>
                </div>
              </div>
            </div>
          </PlatformCard>

          {/* 3. ATCODER */}
          <PlatformCard 
            title="AtCoder" 
            accent="#f59e0b"
            link="https://atcoder.jp/users/Nitish_M"
          >
            <div className="premium-stat-row" style={{ marginTop: '32px' }}>
              <div className="premium-stat-item">
                <div className="premium-stat-label">RATING</div>
                <div className="premium-stat-value" style={{ fontSize: '32px' }}>679</div>
                <div style={{ fontSize: '11px', color: 'var(--accent-4)', fontWeight: 700, marginTop: '4px' }}>Rank: #4205</div>
              </div>
              <div className="premium-stat-item">
                <div className="premium-stat-label">PEAK RATING</div>
                <div className="premium-stat-value" style={{ fontSize: '32px' }}>757</div>
                <div style={{ fontSize: '11px', color: 'var(--gray-medium)', fontWeight: 700, marginTop: '4px' }}>Top 12% Active</div>
              </div>
            </div>
          </PlatformCard>

          {/* 4. GITHUB */}
          <PlatformCard 
            title="GitHub" 
            accent="#a855f7"
            link="https://github.com/nitish1705"
          >
            <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', gap: '40px', flexWrap: 'wrap', marginTop: '32px' }}>
              <div className="premium-stat-row" style={{ flex: 1.5 }}>
                <div className="premium-stat-item">
                  <div className="premium-stat-label">REPOS</div>
                  <div className="premium-stat-value">{analytics.github?.public_repos || 42}</div>
                </div>
                <div className="premium-stat-item">
                  <div className="premium-stat-label">COMMITS</div>
                  <div className="premium-stat-value">850+</div>
                </div>
                <div className="premium-stat-item">
                  <div className="premium-stat-label">FOLLOWERS</div>
                  <div className="premium-stat-value">{analytics.github?.followers || 12}</div>
                </div>
              </div>
              <div style={{ flex: 1, display: 'flex', flexWrap: 'wrap', gap: '10px' }}>
                {['Java', 'Swift', 'Python', 'Dart', 'React', 'Native'].map(tech => (
                  <span key={tech} className="skill-pill" style={{ fontSize: '12px', padding: '8px 16px', background: 'rgba(255,255,255,0.03)' }}>{tech}</span>
                ))}
              </div>
            </div>
          </PlatformCard>

          {/* 5. SKILLRACK */}
          <PlatformCard 
            title="Skillrack" 
            accent="#10b981"
            link="http://www.skillrack.com/faces/resume.xhtml?id=447801&key=nitish1705"
          >
            <div style={{ marginTop: '32px', padding: '32px', borderRadius: '24px', background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.05)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '32px' }}>
                <div>
                  <div style={{ fontSize: '48px', fontWeight: 900, color: 'white' }}>1100+</div>
                  <div style={{ fontSize: '11px', fontWeight: 800, color: 'var(--accent-3)', letterSpacing: '0.2em' }}>CHALLENGES MASTERED</div>
                </div>
                <div style={{ display: 'flex', gap: '40px' }}>
                   <div style={{ textAlign: 'right' }}>
                      <div style={{ fontSize: '24px', fontWeight: 800, color: 'white' }}>12+</div>
                      <div style={{ fontSize: '10px', color: 'var(--gray-medium)', fontWeight: 700 }}>BADGES EARNED</div>
                   </div>
                </div>
              </div>
            </div>
          </PlatformCard>

          {/* 6. ACHIEVEMENTS */}
          <PlatformCard 
            title="Achievements" 
            accent="#fcd34d"
            link="#"
          >
            <div style={{ marginTop: '32px', display: 'flex', flexDirection: 'column', gap: '20px' }}>
              <div className="premium-stat-item" style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
                 <div style={{ fontSize: '24px' }}>🏆</div>
                 <div>
                    <div style={{ fontWeight: 800, color: 'white' }}>1st Place — SSN Coding Contest</div>
                    <div style={{ fontSize: '12px', color: 'var(--gray-medium)' }}>University Level Algorithms Championship</div>
                 </div>
              </div>
              <div className="premium-stat-item" style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
                 <div style={{ fontSize: '24px' }}>🏆</div>
                 <div>
                    <div style={{ fontWeight: 800, color: 'white' }}>1st Place — Loyola Coding Contest</div>
                    <div style={{ fontSize: '12px', color: 'var(--gray-medium)' }}>State Level Programming Excellence</div>
                 </div>
              </div>
            </div>
          </PlatformCard>

        </div>

        {/* SUMMARY STRIP */}
        <div className="premium-summary-strip">
          <span className="summary-value">{totalImpact.solved}</span> PROBLEMS SOLVED
          <span className="summary-dot">•</span>
          <span className="summary-value">{totalImpact.contests}</span> CONTESTS
          <span className="summary-dot">•</span>
          <span className="summary-value">2</span> CHAMPIONSHIPS
        </div>
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
                  <input type="text" name="name" className="form-input" placeholder="Your Name" required />
                </div>
                <div className="form-group">
                  <label>Email</label>
                  <input type="email" name="email" className="form-input" placeholder="Your Email" required />
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
