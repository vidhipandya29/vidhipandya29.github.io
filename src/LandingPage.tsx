import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

// ── styles (injected once) ─────────────────────────────────────────────────
const STYLES = `
  @import url('https://fonts.googleapis.com/css2?family=DM+Serif+Display:ital@0;1&family=DM+Sans:wght@300;400;500&display=swap');

  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

  :root {
    --purple-core: #7B5EA7;
    --purple-mid:  #A98BD4;
    --purple-light:#C8B3E8;
    --off-white:   #F7F5FF;
    --text-dark:   #1a1625;
    --text-mid:    #3d3557;
    --nav-inactive:#6B6B8A;
    --nav-active:  #2d1f6e;
  }

  body {
    font-family: 'DM Sans', sans-serif;
    background: var(--off-white);
    color: var(--text-dark);
    overflow-x: hidden;
  }

  /* ── Hero ─────────────────────────────────────────────────────────────── */
  .hero {
    min-height: 100vh;
    display: flex;
    align-items: center;
    justify-content: center;
    position: relative;
    overflow: hidden;
    padding: 7rem 2rem 3rem;
  }

  .hero::before {
    content: '';
    position: absolute;
    inset: 0;
    background:
      radial-gradient(ellipse 70% 65% at 75% 45%, rgba(138, 100, 210, 0.55) 0%, transparent 70%),
      radial-gradient(ellipse 55% 55% at 20% 70%, rgba(163, 130, 220, 0.35) 0%, transparent 65%),
      radial-gradient(ellipse 40% 40% at 60% 85%, rgba(180, 155, 230, 0.20) 0%, transparent 60%);
    pointer-events: none;
  }

  .hero::after {
    content: '';
    position: absolute;
    inset: 0;
    background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)' opacity='0.04'/%3E%3C/svg%3E");
    pointer-events: none;
    opacity: 0.45;
  }

  .hero-inner {
    position: relative;
    z-index: 1;
    display: flex;
    align-items: center;
    gap: clamp(2.5rem, 6vw, 5.5rem);
    max-width: 900px;
    width: 100%;
  }

  /* ── Photo ────────────────────────────────────────────────────────────── */
  .photo-wrap {
    flex-shrink: 0;
    width: clamp(220px, 28vw, 295px);
    aspect-ratio: 3 / 4;
    border-radius: 18px;
    overflow: hidden;
    box-shadow:
      0 4px 24px rgba(100, 60, 180, 0.18),
      0 1px 4px rgba(0,0,0,0.08);
    opacity: 0;
    transform: translateY(28px);
    transition: opacity 0.7s ease 0.15s, transform 0.7s cubic-bezier(0.22,1,0.36,1) 0.15s;
  }

  .photo-wrap.visible { opacity: 1; transform: translateY(0); }

  .photo-wrap img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    object-position: top center;
    display: block;
  }

  /* ── Copy ─────────────────────────────────────────────────────────────── */
  .hero-copy {
    display: flex;
    flex-direction: column;
    gap: 1.1rem;
  }

  .hero-heading {
    font-family: 'DM Serif Display', serif;
    font-size: clamp(2.4rem, 5vw, 3.6rem);
    font-weight: 400;
    line-height: 1.12;
    color: var(--text-dark);
    opacity: 0;
    transform: translateY(22px);
    transition: opacity 0.65s ease 0.35s, transform 0.65s cubic-bezier(0.22,1,0.36,1) 0.35s;
  }

  .hero-heading.visible { opacity: 1; transform: translateY(0); }

  .hero-sub {
    font-size: clamp(0.95rem, 1.8vw, 1.1rem);
    font-weight: 300;
    color: var(--text-mid);
    line-height: 1.6;
    max-width: 38ch;
    opacity: 0;
    transform: translateY(18px);
    transition: opacity 0.6s ease 0.5s, transform 0.6s cubic-bezier(0.22,1,0.36,1) 0.5s;
  }

  .hero-sub.visible { opacity: 1; transform: translateY(0); }

  /* ── Social Links ─────────────────────────────────────────────────────── */
  .social-links {
    display: flex;
    gap: 0.75rem;
    flex-wrap: wrap;
    opacity: 0;
    transform: translateY(18px);
    transition: opacity 0.6s ease 0.72s, transform 0.6s cubic-bezier(0.22,1,0.36,1) 0.72s;
  }

  .social-links.visible { opacity: 1; transform: translateY(0); }

  .social-btn {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    width: 2.2rem;
    height: 2.2rem;
    border-radius: 50%;
    color: var(--nav-inactive);
    text-decoration: none;
    transition: color 0.2s ease, transform 0.2s ease;
  }

  .social-btn:hover {
    color: var(--nav-active);
    transform: translateY(-2px);
  }

  /* ── Scroll Arrow ─────────────────────────────────────────────────────── */
  .scroll-arrow {
    position: absolute;
    bottom: 2rem;
    left: 50%;
    transform: translateX(-50%);
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 0.3rem;
    color: var(--nav-inactive);
    opacity: 0;
    animation: fadeInArrow 0.6s ease 1.1s forwards, bounce 2s ease-in-out 1.7s infinite;
    z-index: 1;
  }

  .scroll-arrow span {
    font-family: 'DM Sans', sans-serif;
    font-size: 0.7rem;
    font-weight: 400;
    letter-spacing: 0.08em;
    text-transform: uppercase;
  }

  @keyframes fadeInArrow {
    to { opacity: 1; }
  }

  @keyframes bounce {
    0%, 100% { transform: translateX(-50%) translateY(0); }
    50%       { transform: translateX(-50%) translateY(6px); }
  }

  /* ── Responsive ───────────────────────────────────────────────────────── */
  @media (max-width: 640px) {
    .hero-inner {
      flex-direction: column;
      align-items: center;
      text-align: center;
      gap: 2rem;
    }
    .photo-wrap { width: clamp(180px, 60vw, 240px); }
    .hero-sub { max-width: 100%; }
  }
`;

// ── component ──────────────────────────────────────────────────────────────
export default function LandingPage() {
  const [visible, setVisible] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const id = "vidhi-styles";
    if (!document.getElementById(id)) {
      const tag = document.createElement("style");
      tag.id = id;
      tag.textContent = STYLES;
      document.head.appendChild(tag);
    }
    const t = setTimeout(() => setVisible(true), 60);
    return () => clearTimeout(t);
  }, []);

  return (
    <>
      <main className="hero" aria-label="Hero section">
        <div className="hero-inner">
          {/* Photo */}
          <div className={`photo-wrap${visible ? " visible" : ""}`}>
            <img src="/profile.png" alt="Vidhi smiling at graduation" />
          </div>

          {/* Copy */}
          <div className="hero-copy">
            <h1 className={`hero-heading${visible ? " visible" : ""}`}>
              Hi, I'm Vidhi!&nbsp;👋🏽
            </h1>
            <p className={`hero-sub${visible ? " visible" : ""}`}>
              Software &amp; Data Engineer passionate about transforming data chaos into clarity. Computer Science Graduate &amp; Shopify Dev Degree Alumni.
            </p>
            <div className={`social-links${visible ? " visible" : ""}`}>
              <a href="https://www.linkedin.com/in/vidhipandya29/" target="_blank" rel="noopener noreferrer" className="social-btn" aria-label="LinkedIn">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 0 1-2.063-2.065 2.064 2.064 0 1 1 2.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/></svg>
              </a>
              <a href="https://github.com/vidhipandya29" target="_blank" rel="noopener noreferrer" className="social-btn" aria-label="GitHub">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.2 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12"/></svg>
              </a>
              <a href="mailto:vidhipandya820@gmail.com" className="social-btn" aria-label="Email">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="20" height="16" x="2" y="4" rx="2"/><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/></svg>
              </a>
            </div>
          </div>
        </div>

        {/* Scroll indicator */}
        <div
          className="scroll-arrow"
          onClick={() => {
            window.scrollTo(0, 0);
            navigate("/experience");
          }}
          style={{ cursor: "pointer" }}
          aria-label="Go to About page"
        >

          <span>EXPERIENCE</span>
          <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M12 5v14M5 12l7 7 7-7"/>
          </svg>
        </div>
      </main>
    </>
  );
}