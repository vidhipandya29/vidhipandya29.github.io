import React, { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";

// ── types ──────────────────────────────────────────────────────────────────
interface Role {
  title: string;
  period: string;
  team: string;
  bullets: string[];
  tags: string[];
}

interface ExperienceItem {
  company: string;
  roles: Role[];
  color: string; // accent colour per company
}

// ── data ───────────────────────────────────────────────────────────────────
const EXPERIENCES: ExperienceItem[] = [
  {
    company: "Wealthsimple",
    color: "#00c8a0",
    roles: [
      {
        title: "Data Science Intern",
        period: "Jan 2026 – Present",
        team: "💼 Portfolios + Wealthsimple for Business Data Science \n 💼 Payments & Money Movements Data Science",
        bullets: [
          "Improved dbt test & doc coverage by 16% across Kimball-modeled warehouse tables.",
          "Running cross-sell clustering analysis on 10+ metrics for product adoption insights.",
        ],
        tags: ["SQL", "Python", "dbt", "Redshift", "Preset"],
      },
    ],
  },
  {
    company: "Shopify",
    color: "#96bf48",
    roles: [
      {
        title: "Machine Learning Engineer Intern",
        period: "Sep 2024 – Apr 2025",
        team: "🔐 Fraud & Risk Data Science",
        bullets: [
          "EDA on 100K+ email records to inform an autoencoder fraud detection model.",
          "Built SQL + Airflow pipeline linking merchant onboarding to fraud enforcement actions.",
        ],
        tags: ["Python", "SQL", "Airflow"],
      },
      {
        title: "Data Science / Data Engineer Intern",
        period: "Jan 2024 – Aug 2024",
        team: "💵 Finance Data Science",
        bullets: [
          "Replaced single-source ETL with multi-source pipeline for 30M+ shops, 300% more data coverage.",
          "Identified $2M GMV discrepancy in financial reporting via SQL analysis.",
        ],
        tags: ["SQL", "Python", "BigQuery"],
      },
      {
        title: "Mobile Developer Intern",
        period: "May 2023 – Dec 2023",
        team: "📱 Shopify POS",
        bullets: [
          "Fixed barcode validation bug, boosting merchant scanner efficiency by 94% across 10+ countries.",
          "Built Kotlin ROM alert dialog, improving developer productivity by 67%.",
        ],
        tags: ["Kotlin", "React Native"],
      },
      {
        title: "Frontend Developer Intern",
        period: "May 2022 – Apr 2023",
        team: "🌐 Retail Start (Shopify POS Webpages)",
        bullets: [
          "Built 15+ POS pages in React + TypeScript with i18n across 175+ countries.",
          "Implemented 10+ reusable components for Tap to Pay, driving 40% growth in Retail Sales.",
        ],
        tags: ["React", "TypeScript", "Rails", "Storybook"],
      },
    ],
  },
];

// ── education & project data ───────────────────────────────────────────────
const EDUCATION = {
  school: "York University",
  period: "Sep 2021 – Apr 2025",
  degree: "Honours Bachelor of Science in Computer Science, Shopify Dev Degree",
  scholarship: "Shopify Dev Degree Scholarship · $160K",
  badges: [],
};

const PROJECTS = [
  {
    title: "Battle of the AIs: Deepfake Content Spread Simulation",
    bullets: [
      "Simulated AI deepfake spread using Mesa's SIR model on an Erdős–Rényi graph, modelling virality, resistance, and detection accuracy.",
      "Built a Solara frontend with real-time network visualizations and interactive controls.",
    ],
    tags: ["Python", "Mesa", "Solara", "Network Simulation"],
  },
];


const STYLES = `
  @import url('https://fonts.googleapis.com/css2?family=DM+Serif+Display:ital@0;1&family=DM+Sans:wght@300;400;500&display=swap');

  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

  :root {
    --purple-core: #7B5EA7;
    --off-white:   #F7F5FF;
    --text-dark:   #1a1625;
    --text-mid:    #3d3557;
    --nav-inactive:#6B6B8A;
    --nav-active:  #2d1f6e;
  }

  html, body {
    font-family: 'DM Sans', sans-serif;
    background: var(--off-white);
    color: var(--text-dark);
    overflow-x: hidden;
  }

  /* ── Nav ── */
  .nav {
    position: fixed;
    top: 0; left: 0; right: 0;
    z-index: 50;
    display: flex;
    justify-content: center;
    align-items: center;
    gap: clamp(2rem, 6vw, 6rem);
    padding: 1.4rem 2rem;
    background: rgba(247, 245, 255, 0.72);
    backdrop-filter: blur(14px);
    border-bottom: 1px solid rgba(123, 94, 167, 0.12);
  }

  .nav-link {
    font-family: 'DM Sans', sans-serif;
    font-size: 1rem;
    font-weight: 400;
    color: var(--nav-inactive);
    text-decoration: none;
    position: relative;
    padding-bottom: 2px;
    transition: color 0.25s ease;
    cursor: pointer;
    background: none;
    border: none;
  }

  .nav-link.active { color: var(--nav-active); font-weight: 500; }

  .nav-link::after {
    content: '';
    position: absolute;
    bottom: -2px; left: 0; right: 0;
    height: 2px;
    background: var(--purple-core);
    border-radius: 99px;
    transform: scaleX(0);
    transform-origin: left;
    transition: transform 0.3s cubic-bezier(0.4,0,0.2,1);
  }

  .nav-link.active::after,
  .nav-link:hover::after { transform: scaleX(1); }
  .nav-link:hover { color: var(--nav-active); }

  /* ── Page ── */
  .exp-page {
    min-height: 100vh;
    padding: 8rem 2rem 5rem;
    position: relative;
    overflow: visible;
  }

  .exp-page::before {
    content: '';
    position: absolute;
    inset: 0;
    background:
      radial-gradient(ellipse 60% 50% at 90% 10%, rgba(138,100,210,0.3) 0%, transparent 65%),
      radial-gradient(ellipse 45% 45% at 5% 80%, rgba(163,130,220,0.2) 0%, transparent 60%);
    pointer-events: none;
  }

  .exp-inner {
    position: relative;
    z-index: 1;
    max-width: 1000px;
    margin: 0 auto;
  }

  /* ── Page heading ── */
  .exp-heading {
    font-family: 'DM Serif Display', serif;
    font-size: clamp(2rem, 4vw, 3rem);
    font-weight: 400;
    color: var(--text-dark);
    margin-bottom: 3rem;
    transform: translateY(20px);
    transition: opacity 0.6s ease 0.1s, transform 0.6s cubic-bezier(0.22,1,0.36,1) 0.1s;
  }

  .exp-heading.visible { opacity: 1; transform: translateY(0); }

  /* ── Company section ── */
  .company-section {
    margin-bottom: 3rem;
  }

  .company-label {
    display: flex;
    align-items: center;
    gap: 0.65rem;
    margin-bottom: 1.25rem;
    opacity: 0;
    transform: translateY(14px);
    transition: opacity 0.5s ease, transform 0.5s cubic-bezier(0.22,1,0.36,1);
  }

  .company-label.visible { opacity: 1; transform: translateY(0); }

  .company-logo {
    height: 22px;
    width: auto;
    display: block;
    opacity: 0.85;
  }

  /* ── Card grid ── */
  .card-grid {
    display: flex;
    flex-direction: column;
    gap: 1rem;
  }

  /* ── Card ── */
  .exp-card {
    background: rgba(255, 255, 255, 0.65);
    border: 1px solid rgba(123, 94, 167, 0.1);
    border-radius: 16px;
    padding: 1.5rem 2rem;
    display: grid;
    grid-template-columns: 280px 1fr auto;
    align-items: start;
    gap: 2rem;
    backdrop-filter: blur(8px);
    opacity: 0;
    transform: translateY(20px);
    transition: opacity 0.55s ease, transform 0.55s cubic-bezier(0.22,1,0.36,1),
                box-shadow 0.25s ease, border-color 0.25s ease;
  }

  .exp-card.visible { opacity: 1; transform: translateY(0); }

  .exp-card:hover {
    box-shadow: 0 8px 32px rgba(100, 60, 180, 0.1);
    border-color: rgba(123, 94, 167, 0.25);
  }

  .card-header { display: flex; flex-direction: column; gap: 0.25rem; }

  .card-title {
    font-family: 'DM Serif Display', serif;
    font-size: 1.05rem;
    font-weight: 400;
    color: var(--text-dark);
    line-height: 1.3;
  }

  .card-period {
    font-size: 0.78rem;
    font-weight: 400;
    color: var(--nav-inactive);
    letter-spacing: 0.02em;
  }

  .card-team {
    font-size: 0.78rem;
    font-weight: 400;
    color: var(--nav-inactive);
    margin-top: 0.2rem;
  }

  .card-bullets {
    list-style: none;
    display: flex;
    flex-direction: column;
    gap: 0.45rem;
  }

  .card-bullets li {
    font-size: 0.88rem;
    font-weight: 300;
    color: var(--text-mid);
    line-height: 1.55;
    padding-left: 1rem;
    position: relative;
  }

  .card-bullets li::before {
    content: '·';
    position: absolute;
    left: 0;
    color: var(--purple-core);
    font-size: 1.1rem;
    line-height: 1.4;
  }

  .card-tags {
    display: flex;
    flex-direction: column;
    flex-wrap: wrap;
    gap: 0.4rem;
    align-items: flex-end;
  }

  .tag {
    font-size: 0.72rem;
    font-weight: 400;
    padding: 0.25rem 0.65rem;
    border-radius: 99px;
    background: rgba(123, 94, 167, 0.08);
    color: var(--purple-core);
    border: 1px solid rgba(123, 94, 167, 0.15);
    letter-spacing: 0.02em;
    white-space: nowrap;
  }

  /* ── Section heading ── */
  .section-heading {
    font-family: 'DM Serif Display', serif;
    font-size: clamp(1.4rem, 3vw, 1.8rem);
    font-weight: 400;
    color: var(--text-dark);
    margin-bottom: 1.25rem;
  }

  .section-heading.visible { opacity: 1; transform: translateY(0); }

  /* ── Education ── */
  .edu-section { margin-bottom: 3.5rem; }

  .edu-card {
    background: rgba(255, 255, 255, 0.65);
    border: 1px solid rgba(123, 94, 167, 0.1);
    border-radius: 16px;
    padding: 1.5rem 2rem;
    display: grid;
    grid-template-columns: 280px 1fr;
    align-items: start;
    gap: 2rem;
    backdrop-filter: blur(8px);
    opacity: 0;
    transform: translateY(20px);
    transition: opacity 0.55s ease, transform 0.55s cubic-bezier(0.22,1,0.36,1),
                box-shadow 0.25s ease, border-color 0.25s ease;
  }

  .edu-card.visible { opacity: 1; transform: translateY(0); }

  .edu-card:hover {
    box-shadow: 0 8px 32px rgba(100, 60, 180, 0.1);
    border-color: rgba(123, 94, 167, 0.25);
  }

  .edu-school {
    font-family: 'DM Serif Display', serif;
    font-size: 1.05rem;
    color: var(--text-dark);
  }

  .edu-period {
    font-size: 0.78rem;
    color: var(--nav-inactive);
    margin-top: 0.2rem;
  }

  .edu-degree {
    font-size: 0.92rem;
    font-weight: 400;
    color: var(--text-mid);
    line-height: 1.5;
  }

  .edu-badges {
    display: flex;
    flex-wrap: wrap;
    gap: 0.5rem;
    margin-top: 0.75rem;
  }

  .edu-badge {
    font-size: 0.72rem;
    padding: 0.25rem 0.65rem;
    border-radius: 99px;
    background: rgba(123, 94, 167, 0.08);
    color: var(--purple-core);
    border: 1px solid rgba(123, 94, 167, 0.15);
    white-space: nowrap;
  }

  /* ── Projects ── */
  .proj-section { margin-bottom: 3.5rem; }

  .proj-card {
    background: rgba(255, 255, 255, 0.65);
    border: 1px solid rgba(123, 94, 167, 0.1);
    border-radius: 16px;
    padding: 1.5rem 2rem;
    display: grid;
    grid-template-columns: 280px 1fr auto;
    align-items: start;
    gap: 2rem;
    backdrop-filter: blur(8px);
    opacity: 0;
    transform: translateY(20px);
    transition: opacity 0.55s ease, transform 0.55s cubic-bezier(0.22,1,0.36,1),
                box-shadow 0.25s ease, border-color 0.25s ease;
  }

  .proj-card.visible { opacity: 1; transform: translateY(0); }

  .proj-card:hover {
    box-shadow: 0 8px 32px rgba(100, 60, 180, 0.1);
    border-color: rgba(123, 94, 167, 0.25);
  }

  .proj-title {
    font-family: 'DM Serif Display', serif;
    font-size: 1.05rem;
    color: var(--text-dark);
    line-height: 1.3;
  }

  .proj-link {
    display: inline-flex;
    align-items: center;
    gap: 0.35rem;
    margin-top: 0.5rem;
    font-size: 0.78rem;
    color: var(--nav-inactive);
    text-decoration: none;
    transition: color 0.2s ease;
  }

  .proj-link:hover { color: var(--nav-active); }

  .proj-tags {
    display: flex;
    flex-direction: column;
    gap: 0.4rem;
    align-items: flex-end;
  }

  @media (max-width: 700px) {
    .edu-card, .proj-card { grid-template-columns: 1fr; gap: 1rem; }
    .proj-tags { flex-direction: row; align-items: flex-start; }
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
`;

// ── component ──────────────────────────────────────────────────────────────
export default function ExperiencePage() {
const [visible, setVisible] = useState(false);
  const navigate = useNavigate();
  const cardRefs = useRef<(HTMLDivElement | null)[]>([]);
  const labelRefs = useRef<(HTMLDivElement | null)[]>([]);
  const eduRef = useRef<HTMLDivElement | null>(null);
  const projRef = useRef<HTMLDivElement | null>(null);
  const eduHeadRef = useRef<HTMLHeadingElement | null>(null);
  const expHeadRef = useRef<HTMLHeadingElement | null>(null);
  const projHeadRef = useRef<HTMLHeadingElement | null>(null);

  useEffect(() => {
    const id = "vidhi-exp-styles";
    if (!document.getElementById(id)) {
      const tag = document.createElement("style");
      tag.id = id;
      tag.textContent = STYLES;
      document.head.appendChild(tag);
    }
    const t = setTimeout(() => setVisible(true), 60);
    return () => clearTimeout(t);
  }, []);

  // Intersection observer for cards
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("visible");
          }
        });
      },
      { threshold: 0.1 }
    );

    [...cardRefs.current, ...labelRefs.current, eduRef.current, projRef.current, eduHeadRef.current, expHeadRef.current, projHeadRef.current].forEach((el) => {
      if (el) observer.observe(el);
    });

    return () => observer.disconnect();
  }, []);


  let cardIndex = 0;

  return (
    <>
      <main className="exp-page">

        <div className="exp-inner">
          {/* ── Education ── */}
          <section className="edu-section">
            <h2 className="section-heading" ref={eduHeadRef}>Education</h2>
            <div className="edu-card" ref={eduRef}>
              <div>
                <div className="edu-school">{EDUCATION.school}</div>
                <div className="edu-period">{EDUCATION.period}</div>
              </div>
              <div>
                <div className="edu-degree">{EDUCATION.degree}</div>
                <div className="edu-period" style={{marginTop: '0.5rem'}}>{EDUCATION.scholarship}</div>
              </div>
            </div>
          </section>

          {/* ── Experience ── */}
          <section style={{marginBottom: '3.5rem'}}>
            <h2 className="section-heading" ref={expHeadRef}>Experience</h2>
            {EXPERIENCES.map((exp, eIdx) => {
            const labelRef = (el: HTMLDivElement | null) => {
              labelRefs.current[eIdx] = el;
            };

            return (
              <section className="company-section" key={exp.company}>
                {/* Company label */}
                <div className="company-label" ref={labelRef}>
                  {exp.company === "Wealthsimple" ? (
                    <img
                      className="company-logo"
                      src="/ws.svg"
                      alt="Wealthsimple"
                    />
                  ) : (
                    <img
                      className="company-logo"
                      src="/shopify.png"
                      alt="Shopify"
                    />
                  )}
                </div>

                {/* Cards */}
                <div className="card-grid">
                  {exp.roles.map((role) => {
                    const idx = cardIndex++;
                    return (
                      <div
                        className="exp-card"
                        key={role.title}
                        ref={(el) => { cardRefs.current[idx] = el; }}
                        style={{ transitionDelay: `${0.05 * (idx % 4)}s` }}
                      >
                        <div className="card-header">
                          <div className="card-title">{role.title}</div>
                          <div className="card-period">{role.period}</div>
                          <div className="card-team">{role.team}</div>
                        </div>
                        <ul className="card-bullets">
                          {role.bullets.map((b, i) => (
                            <li key={i}>{b}</li>
                          ))}
                        </ul>
                        <div className="card-tags">
                          {role.tags.map((tag) => (
                            <span className="tag" key={tag}>{tag}</span>
                          ))}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </section>
            );
          })}
          </section>

          {/* ── Projects ── */}
          <section className="proj-section">
            <h2 className="section-heading" ref={projHeadRef}>Projects</h2>
            {PROJECTS.map((proj, i) => (
              <div className="proj-card" key={i} ref={projRef}>
                <div>
                  <div className="proj-title">{proj.title}</div>
                  <a
                    href="https://github.com/vidhipandya29/battle-of-the-ais"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="proj-link"
                    aria-label="View on GitHub"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12"/></svg>
                    GitHub Project
                  </a>
                </div>
                <ul className="card-bullets">
                  {proj.bullets.map((b, j) => (
                    <li key={j}>{b}</li>
                  ))}
                </ul>
                <div className="proj-tags">
                  {proj.tags.map((tag) => (
                    <span className="tag" key={tag}>{tag}</span>
                  ))}
                </div>
              </div>
            ))}
          </section>



        </div>

        {/* Scroll indicator */}

<div
          className="scroll-arrow"
          onClick={() => navigate("/about")}
          style={{ cursor: "pointer" }}
          aria-label="Go to About page"
        >
          <span>ABOUT ME</span>
          <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M12 5v14M5 12l7 7 7-7"/>
          </svg>
        </div>
      </main>
    </>
  );
}