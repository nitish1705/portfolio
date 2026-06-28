import { useState, useRef, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

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
const CACHE_KEY = 'portfolio_analytics_cache_v5';
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
      fetch('https://leetcode-api-pied.vercel.app/user/Nitish_17_M').then(res => res.json()).catch(() => null),
      fetch('https://codeforces.com/api/user.rating?handle=Ninja_1705').then(res => res.json()).catch(() => null),
      fetch('https://api.allorigins.win/raw?url=https://atcoder.jp/users/Nitish_M/history/json').then(res => res.json()).catch(() => null),
      fetch('https://api.github.com/users/nitish1705').then(res => res.json()).catch(() => null)
    ]);
    
    results.leetcode = lc?.submitStats?.acSubmissionNum ? {
      totalSolved: lc.submitStats.acSubmissionNum[0].count,
      easySolved: lc.submitStats.acSubmissionNum[1].count,
      mediumSolved: lc.submitStats.acSubmissionNum[2].count,
      hardSolved: lc.submitStats.acSubmissionNum[3].count,
      ranking: lc.profile?.ranking ? `#${Math.round(lc.profile.ranking / 1000)}k` : "#140k"
    } : null;

    results.codeforces = cf?.status === "OK" ? {
      current: cf.result.length ? cf.result[cf.result.length - 1].newRating : 1163,
      peak: cf.result.length ? Math.max(...cf.result.map(r => r.newRating)) : 1209,
      contests: cf.result.length || 21
    } : null;

    results.atcoder = (ac && ac.length) ? {
      current: ac[ac.length - 1].NewRating,
      peak: Math.max(...ac.map(c => c.NewRating)),
      contests: ac.length
    } : null;

    results.github = gh ? {
      public_repos: gh.public_repos,
      followers: gh.followers
    } : null;
  } catch (err) { console.error(err); }

  localStorage.setItem(CACHE_KEY, JSON.stringify({ data: results, timestamp: Date.now() }));
  return results;
};

// --- COMPONENTS ---
const PlatformCard = ({ title, accent, children, link }) => (
  <div className="premium-platform-card">
    <div className="premium-card-header">
      <div className="premium-platform-info">
        <div>
          <h3 style={{ margin: 0, fontSize: '24px', borderLeft: `3px solid ${accent}`, paddingLeft: '12px', lineHeight: '1.1' }}>{title}</h3>
        </div>
      </div>
      <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
        <a href={link} target="_blank" rel="noreferrer" style={{ color: 'var(--gray-medium)' }}>
          <Icons.External />
        </a>
      </div>
    </div>
    {children}
  </div>
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

  const [activeSection, setActiveSection] = useState(0);
  const sectionIds = useMemo(() => ['slide-hero', 'slide-about', 'slide-arsenal', 'slide-projects', 'slide-experience', 'slide-achievements', 'slide-contact'], []);

  useEffect(() => {
    const container = document.querySelector('.snap-container');
    if (!container) return;

    const handleScroll = () => {
      const containerRect = container.getBoundingClientRect();
      let maxVisibleHeight = 0;
      let activeIndex = 0;

      sectionIds.forEach((id, idx) => {
        const el = document.getElementById(id);
        if (el) {
          const rect = el.getBoundingClientRect();
          const visibleTop = Math.max(rect.top, containerRect.top);
          const visibleBottom = Math.min(rect.bottom, containerRect.bottom);
          const visibleHeight = Math.max(0, visibleBottom - visibleTop);
          if (visibleHeight > maxVisibleHeight) {
            maxVisibleHeight = visibleHeight;
            activeIndex = idx;
          }
        }
      });

      setActiveSection(activeIndex);
    };

    container.addEventListener('scroll', handleScroll);
    // Trigger initial calculation
    handleScroll();
    return () => container.removeEventListener('scroll', handleScroll);
  }, [sectionIds]);

  useEffect(() => {
    fetchAnalyticsData().then(data => setAnalytics(data));
  }, []);

  const totalImpact = useMemo(() => {
    const leetcodeSolved = analytics.leetcode?.totalSolved || 585;
    const codeforcesSolved = 210;
    const skillrackSolved = 1100;
    return {
      solved: leetcodeSolved + codeforcesSolved + skillrackSolved,
      contests: 85
    };
  }, [analytics]);


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
    tagline: "Final Year Student",
    location: "Chennai, India",
    about: "I am a final year Computer Science student at St. Joseph’s Institute of Technology who is deeply inspired by how Apple designs software. To me, a great app doesn't just look premium—it feels alive. I am obsessed with building fluid, responsive UIs and crafting seamless app navigation where everything works so naturally that users interact with it without even realizing there is an app in the way. Driven by my execution motto, 'Do now, rest later!', I carry this same high energy when the screen is closed. My life is constantly filled with connection and people—whether I'm chatting with my parents at home, spending time with my friends at college, or hitting the badminton court for a fast-paced game.",
    education: {
      degree: "B.E. Computer Science Engineering",
      org: "St. Joseph’s Institute of Technology",
      date: "2023 – 2027",
      cgpa: "8.55 / 10"
    },
    arsenal: [
      { id: "01", category: "Languages", items: "Swift / Java / Python / C / SQL", col: "col-4" },
      { id: "02", category: "Mobile Dev", items: "SwiftUI / UIKit / SwiftData / Core Data / React Native / Android SDK", col: "col-8" },
      { id: "03", category: "Architecture & Concurrency", items: "MVVM / Combine / Swift Concurrency (Async/Await) / REST APIs", col: "col-4" },
      { id: "04", category: "Frontend & Web", items: "React / HTML5 / CSS3 / Tailwind / Node.js", col: "col-4" },
      { id: "05", category: "Tools & Ecosystem", items: "Git / Xcode / VS Code / Android Studio / Figma", col: "col-4" }
    ],
    marquee: ["SwiftUI", "SwiftData", "Xcode", "Git", "Python", "Java", "React Native", "SwiftUI", "SwiftData", "Xcode", "Git", "Python", "Java", "React Native"],
    experience: [
      {
        role: "Software Engineering Intern",
        org: "Supraja Technologies",
        date: "Jul 2025",
        desc: "Completed an academic internship program focusing on software development fundamentals, full-stack application concepts, and secure programming workflows.",
        highlights: [
          "Gained hands-on exposure to software engineering lifecycles and structured collaboration using Git/GitHub",
          "Explored database architectures, API designs, and frontend rendering systems to build full-stack interfaces",
          "Implemented secure coding paradigms in aligning with modern system-level application requirements"
        ]
      }
    ],
    projects: [
      {
        name: "MultiClips",
        desc: "A native macOS clipboard manager built with Swift and SwiftUI to monitor, capture, and organize system-wide clipboard events with SwiftData persistence.",
        highlights: [
          "Integrated Cocoa Pasteboard APIs to monitor and capture system-wide clipboard events in the background",
          "Engineered high-performance local persistence using SwiftData with optimized querying and indexing",
          "Designed a modern native status bar menu and HUD interface following Apple Human Interface Guidelines"
        ],
        tech: ["Swift", "SwiftUI", "SwiftData", "AppKit", "macOS"],
        link: "https://github.com/nitish1705"
      },
      {
        name: "GPACALC",
        desc: "A dynamic and modular academic utility for iOS to compute and track semester-wise GPA/CGPA with real-time recalculations.",
        highlights: [
          "Implemented local persistence using SwiftData to store, update, and recalculate academic data dynamically",
          "Developed modular SwiftUI component structures with clean state propagation",
          "Polished the iOS layout with responsive grid layouts, system haptic feedbacks, and dark-mode optimization"
        ],
        tech: ["SwiftUI", "SwiftData", "Swift Concurrency", "iOS"],
        link: "https://github.com/nitish1705"
      }
    ],
    achievements: [
      { label: "LeetCode Solved", value: "585", color: "var(--accent-1)", link: "https://leetcode.com/u/Nitish_17_M/" },
      { label: "SSN Winner", value: "1st Place", color: "var(--accent-2)", link: "https://github.com/nitish1705" },
      { label: "SkillRack", value: "1100+", color: "var(--accent-3)", link: "http://www.skillrack.com/faces/resume.xhtml?id=447801&key=nitish1705" },
      { label: "Codeforces", value: "1209", color: "#66ff66", link: "https://codeforces.com/profile/Ninja_1705" },
      { label: "AtCoder Rating", value: "789", color: "#ffcc00", link: "https://atcoder.jp/users/Nitish_M" }
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
    <div className="snap-container">
      <div className="bg-glow"></div>

      {/* Dynamic Segmented Section Indicator Bar */}
      <div className="section-indicator-bar">
        {sectionIds.map((id, index) => (
          <div 
            key={id} 
            className={`indicator-segment ${index === activeSection ? 'active' : ''}`}
            onClick={() => {
              const element = document.getElementById(id);
              if (element) {
                element.scrollIntoView({ behavior: 'smooth' });
              }
            }}
            title={id.replace('slide-', '').toUpperCase()}
          />
        ))}
      </div>

      {/* Slide 1: Header + Hero */}
      <div id="slide-hero" className="snap-section hero-slide" style={{ justifyContent: 'space-between', paddingBottom: '40px' }}>
        <header className="editorial-header" style={{ paddingTop: '24px', width: '100%' }}>
          <div className="role-bar" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%', flexWrap: 'wrap', gap: '20px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '15px', flexWrap: 'wrap' }}>
              <span className="location-tag">{data.location}</span>
              <div className="role-dot"></div>
              <span style={{ fontSize: '11px', letterSpacing: '0.08em' }}>APPLE PLATFORM ENGINEER • SOFTWARE ENGINEER • COMPETITIVE PROGRAMMER</span>
            </div>
            <a href={resumeUrl} download="Nitish_Resume.pdf" className="ui-button ui-button--ghost" style={{ padding: '8px 16px', fontSize: '12px', borderRadius: '8px' }}>
              Download CV
            </a>
          </div>
        </header>

        <section id="hero" style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center', width: '100%' }}>
          <motion.div initial="initial" animate="animate" variants={stagger} className="hero-layout">
            <motion.h1 variants={fadeIn} className="hero-name">{data.name}</motion.h1>
            <motion.p variants={fadeIn} className="accent-text" style={{ fontSize: '32px', marginBottom: '24px', maxWidth: '800px', lineHeight: '1.2' }}>
              {data.tagline}
            </motion.p>
            <motion.p variants={fadeIn} className="hero-headline">
              {data.headline}
            </motion.p>
            
            <motion.div variants={fadeIn} className="side-info-list" style={{ marginTop: '20px' }}>
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
      </div>

      {/* Slide 2: About Me */}
      <div id="slide-about" className="snap-section">
        <section id="about" style={{ width: '100%' }}>
          <div className="section-label">About Me</div>
          <div className="about-layout">
            <div className="about-photo-card">
              <div className="about-photo-frame">
                <img src={heroImage} alt={data.name} className="about-photo" />
              </div>
            </div>
            
            <div className="about-description">
              <h3>The Story</h3>
              <p style={{ fontSize: '18px', lineHeight: '1.8', color: 'var(--gray-medium)' }}>
                {data.about}
              </p>
              
              <div className="bento-grid" style={{ marginTop: '20px' }}>
                {/* Academics Card */}
                <div className="bento-item col-12" style={{ padding: '24px' }}>
                  <span className="side-label" style={{ marginBottom: '8px', display: 'block', color: 'var(--accent-1)' }}>Academics</span>
                  <div className="stat-val" style={{ fontSize: '32px' }}>{data.education.cgpa}</div>
                  <p style={{ color: 'var(--gray-medium)', fontSize: '13px', marginTop: '4px' }}>Maintaining excellence @ SJIT</p>
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>

      {/* Slide 3: Technical Arsenal */}
      <div id="slide-arsenal" className="snap-section">
        <section id="arsenal" style={{ width: '100%' }}>
          <div className="section-label">Technical Arsenal</div>
          <div className="arsenal-list">
            {data.arsenal.map((skill) => (
              <div key={skill.id} className="arsenal-row">
                <span className="arsenal-category">{skill.category}</span>
                <div className="arsenal-items">
                  {skill.items.split(' / ').map((item) => (
                    <span key={item} className="tag" style={{ fontSize: '12px', padding: '6px 12px' }}>{item}</span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </section>
      </div>

      {/* Slide 4: Selected Works */}
      <div id="slide-projects" className="snap-section">
        <section id="projects" style={{ width: '100%' }}>
          <div className="section-label">Selected Works</div>
          <div className="bento-grid">
            {data.projects.map((p, i) => (
              <div key={i} className="bento-item col-6">
                <div style={{ display: 'flex', gap: '10px', marginBottom: '15px' }}>
                  {p.tech.map(t => <span key={t} className="tag">{t}</span>)}
                </div>
                <h3>{p.name}</h3>
                <p style={{ marginBottom: '15px' }}>{p.desc}</p>
                {p.highlights && (
                  <ul style={{ paddingLeft: '20px', marginBottom: '25px', color: 'var(--gray-medium)', fontSize: '14px', lineHeight: '1.6' }}>
                    {p.highlights.map((h, idx) => (
                      <li key={idx} style={{ marginBottom: '6px' }}>{h}</li>
                    ))}
                  </ul>
                )}
                 <a href={p.link} target="_blank" rel="noreferrer" className="ui-button ui-button--ghost project-link">Explore Code ↗</a>
              </div>
            ))}
          </div>
        </section>
      </div>

      {/* Slide 5: Experience */}
      <div id="slide-experience" className="snap-section">
        <section id="experience" style={{ width: '100%' }}>
          <div className="section-label">Professional Journey</div>
          <div className="bento-grid">
            <div className="bento-item col-8">
              <h3>Experience</h3>
              {data.experience.map((exp, i) => (
                <div key={i} style={{ marginBottom: '24px' }}>
                  <div className="exp-row" style={{ marginBottom: '8px' }}>
                    <div>
                      <div style={{ fontWeight: 700, fontSize: '18px' }}>{exp.role}</div>
                      <div style={{ color: 'var(--gray-medium)' }}>{exp.org}</div>
                    </div>
                    <div className="accent-text">{exp.date}</div>
                  </div>
                  {exp.desc && <p style={{ fontSize: '14px', color: 'var(--gray-medium)', marginBottom: '10px' }}>{exp.desc}</p>}
                  {exp.highlights && (
                    <ul style={{ paddingLeft: '20px', color: 'var(--gray-medium)', fontSize: '14px', lineHeight: '1.6' }}>
                      {exp.highlights.map((h, idx) => (
                        <li key={idx} style={{ marginBottom: '4px' }}>{h}</li>
                      ))}
                    </ul>
                  )}
                </div>
              ))}
            </div>
            <div className="bento-item col-4">
              <h3>Certifications</h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginTop: '15px' }}>
                {data.certifications.map(c => (
                  <div key={c} style={{ fontSize: '14px', borderLeft: '2px solid var(--accent-3)', paddingLeft: '12px' }}>{c}</div>
                ))}
              </div>
            </div>
          </div>
        </section>
      </div>

      {/* Slide 6: Achievements */}
      <div id="slide-achievements" className="snap-section achievements-slide" style={{ minHeight: 'auto', padding: '80px 24px' }}>
        <section id="achievements" style={{ width: '100%' }}>
          <div className="section-label">Milestones & Metrics</div>
          
          <div className="analytics-dashboard-vertical">
            {/* 1. LEETCODE */}
            <PlatformCard 
              title="LeetCode" 
              accent="#00e5ff"
              link="https://leetcode.com/u/Nitish_17_M/"
            >
              <div style={{ marginTop: '32px' }}>
                <div className="premium-stat-row">
                  <div className="premium-stat-item">
                    <div className="premium-stat-label">TOTAL SOLVED</div>
                    <div className="premium-stat-value" style={{ color: 'white' }}>{analytics.leetcode?.totalSolved || 585}</div>
                  </div>
                  <div className="premium-stat-item">
                    <div className="premium-stat-label">EASY</div>
                    <div className="premium-stat-value" style={{ color: '#00e5ff' }}>{analytics.leetcode?.easySolved || 317}</div>
                  </div>
                  <div className="premium-stat-item">
                    <div className="premium-stat-label">MEDIUM</div>
                    <div className="premium-stat-value" style={{ color: '#f59e0b' }}>{analytics.leetcode?.mediumSolved || 240}</div>
                  </div>
                  <div className="premium-stat-item">
                    <div className="premium-stat-label">HARD</div>
                    <div className="premium-stat-value" style={{ color: '#ec4899' }}>{analytics.leetcode?.hardSolved || 28}</div>
                  </div>
                </div>
                <div className="premium-stat-row" style={{ marginTop: '24px' }}>
                  <div className="premium-stat-item">
                    <div className="premium-stat-label">ACCEPTANCE</div>
                    <div className="premium-stat-value">72.4%</div>
                  </div>
                  <div className="premium-stat-item">
                    <div className="premium-stat-label">RANKING</div>
                    <div className="premium-stat-value">{analytics.leetcode?.ranking || "#141k"}</div>
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
                    <div className="premium-stat-value">{analytics.codeforces?.current || 1163}</div>
                  </div>
                  <div className="premium-stat-item">
                    <div className="premium-stat-label">PEAK</div>
                    <div className="premium-stat-value">{analytics.codeforces?.peak || 1209}</div>
                  </div>
                  <div className="premium-stat-item">
                    <div className="premium-stat-label">CONTESTS</div>
                    <div className="premium-stat-value">{analytics.codeforces?.contests || 21} Played</div>
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
                  <div className="premium-stat-value" style={{ fontSize: '32px' }}>{analytics.atcoder?.current || 789}</div>
                  <div style={{ fontSize: '11px', color: 'var(--accent-4)', fontWeight: 700, marginTop: '4px' }}>Rank: #3494</div>
                </div>
                <div className="premium-stat-item">
                  <div className="premium-stat-label">PEAK RATING</div>
                  <div className="premium-stat-value" style={{ fontSize: '32px' }}>{analytics.atcoder?.peak || 789}</div>
                  <div style={{ fontSize: '11px', color: 'var(--gray-medium)', fontWeight: 700, marginTop: '4px' }}>Top 10% Active</div>
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
                    <div className="premium-stat-value">{analytics.github?.public_repos || 24}</div>
                  </div>
                  <div className="premium-stat-item">
                    <div className="premium-stat-label">COMMITS</div>
                    <div className="premium-stat-value">850+</div>
                  </div>
                  <div className="premium-stat-item">
                    <div className="premium-stat-label">FOLLOWERS</div>
                    <div className="premium-stat-value">{analytics.github?.followers || 8}</div>
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
      </div>

      {/* Slide 7: Contact & Footer */}
      <div id="slide-contact" className="snap-section contact-footer-slide" style={{ justifyContent: 'space-between' }}>
        <div className="contact-section-wrapper" style={{ width: '100%' }}>
          <section id="contact" style={{ paddingTop: 0 }}>
            <div className="contact-container">
              <div className="contact-left">
                <h2 className="contact-quote">
                  Have a thoughtful idea in mind? <br />
                  <span style={{ color: 'var(--accent-1)' }}>Let's bring it to life.</span>
                </h2>
                
                <div className="contact-links-grid">
                  <a 
                    href={`mailto:${emailAddress}`} 
                    onClick={(e) => {
                      e.preventDefault();
                      copyToClipboard();
                    }}
                    className="contact-link-item"
                  >
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
              </div>

              <div>
                <form ref={form} onSubmit={sendEmail} className="contact-form">
                  <div className="form-group">
                    <label>Name</label>
                    <input type="text" name="name" className="form-input" placeholder="Your Name" required />
                  </div>
                  <div className="form-group">
                    <label>Your Email Address</label>
                    <input type="email" name="email" className="form-input" placeholder="email@example.com" required />
                  </div>
                  <div className="form-group">
                    <label>Message</label>
                    <textarea name="message" className="form-input" rows="4" placeholder="How can I help you?" required style={{ resize: 'vertical', minHeight: '100px' }}></textarea>
                  </div>
                  <button type="submit" disabled={isSending} className="send-btn ui-button" style={{ width: '100%', marginTop: '20px' }}>
                    {status || "Send Message"}
                  </button>
                </form>
              </div>
            </div>
          </section>
        </div>

        <footer className="page-footer" style={{ width: '100%', marginTop: '40px' }}>
          <div className="footer-brand">
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
            © {new Date().getFullYear()} {data.name}
          </div>
        </footer>
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
    </div>
  );
}

export default App;
