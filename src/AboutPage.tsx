import React, { useEffect, useRef } from "react";

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
  .about-page {
    min-height: 100vh;
    padding: 8rem 2rem 6rem;
    position: relative;
    overflow: visible;
  }

  .about-page::before {
    content: '';
    position: absolute;
    inset: 0;
    background:
      radial-gradient(ellipse 55% 50% at 10% 15%, rgba(138,100,210,0.28) 0%, transparent 65%),
      radial-gradient(ellipse 50% 45% at 90% 75%, rgba(163,130,220,0.2) 0%, transparent 60%);
    pointer-events: none;
  }

  .about-inner {
    position: relative;
    z-index: 1;
    max-width: 1000px;
    margin: 0 auto;
    display: flex;
    flex-direction: column;
    gap: 5rem;
  }

  /* ── Fade-up utility ── */
  .fade-up {
    transform: translateY(24px);
    transition: opacity 0.65s ease, transform 0.65s cubic-bezier(0.22,1,0.36,1);
  }
  .fade-up.visible { opacity: 1; transform: translateY(0); }

  /* ── Section label ── */
  .section-label {
    font-size: 0.72rem;
    font-weight: 500;
    letter-spacing: 0.12em;
    text-transform: uppercase;
    color: var(--purple-core);
    margin-bottom: 0.75rem;
  }

  .section-heading {
    font-family: 'DM Serif Display', serif;
    font-size: clamp(1.8rem, 3.5vw, 2.6rem);
    font-weight: 400;
    color: var(--text-dark);
    line-height: 1.15;
    margin-bottom: 1.25rem;
  }

  /* ── Bio section ── */
  .bio-section {
    display: grid;
    grid-template-columns: 1fr 340px;
    gap: 4rem;
    align-items: center;
  }

  .bio-text {
    font-size: clamp(0.95rem, 1.8vw, 1.08rem);
    font-weight: 300;
    color: var(--text-mid);
    line-height: 1.75;
  }

  .bio-text p + p { margin-top: 1rem; }

  .bio-photo-wrap {
    border-radius: 20px;
    overflow: hidden;
    aspect-ratio: 3/4;
    box-shadow: 0 8px 40px rgba(100,60,180,0.15);
  }

  .bio-photo-wrap img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    object-position: center top;
    display: block;
  }

  /* ── Interests ── */
  .interests-grid {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 1.25rem;
  }

  .interest-card {
    border-radius: 16px;
    overflow: hidden;
    position: relative;
    aspect-ratio: 4/5;
    cursor: default;
  }

  .interest-card img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    display: block;
    transition: transform 0.5s cubic-bezier(0.22,1,0.36,1);
  }

  .interest-card:hover img { transform: scale(1.04); }

  .interest-overlay {
    position: absolute;
    inset: 0;
    background: linear-gradient(to top, rgba(26,22,37,0.72) 0%, transparent 55%);
  }

  .interest-label {
    position: absolute;
    bottom: 1.25rem;
    left: 1.25rem;
    right: 1.25rem;
  }

  .interest-label span {
    font-size: 0.65rem;
    font-weight: 500;
    letter-spacing: 0.1em;
    text-transform: uppercase;
    color: rgba(255,255,255,0.65);
    display: block;
    margin-bottom: 0.2rem;
  }

  .interest-label h3 {
    font-family: 'DM Serif Display', serif;
    font-size: 1.3rem;
    font-weight: 400;
    color: #fff;
    line-height: 1.2;
  }

  /* ── Dance section ── */
  .dance-section {
    display: grid;
    grid-template-columns: 320px 1fr;
    gap: 4rem;
    align-items: center;
  }

  .dance-photo-wrap {
    border-radius: 20px;
    overflow: hidden;
    aspect-ratio: 3/4;
    box-shadow: 0 8px 40px rgba(100,60,180,0.18);
    position: relative;
  }

  .dance-photo-wrap img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    object-position: center top;
    display: block;
  }

  .dance-photo-wrap::after {
    content: '';
    position: absolute;
    inset: 0;
    border-radius: 20px;
    box-shadow: inset 0 0 0 1px rgba(255,255,255,0.15);
  }

  .dance-text {
    display: flex;
    flex-direction: column;
    gap: 1rem;
  }

  .dance-body {
    font-size: clamp(0.95rem, 1.8vw, 1.05rem);
    font-weight: 300;
    color: var(--text-mid);
    line-height: 1.75;
  }

  .dance-body p + p { margin-top: 0.85rem; }

  .dance-roles {
    display: flex;
    flex-wrap: wrap;
    gap: 0.5rem;
    margin-top: 0.5rem;
  }

  .dance-role-tag {
    font-size: 0.78rem;
    font-weight: 400;
    padding: 0.3rem 0.8rem;
    border-radius: 99px;
    background: rgba(123, 94, 167, 0.08);
    color: var(--purple-core);
    border: 1px solid rgba(123, 94, 167, 0.2);
  }

  /* ── Responsive ── */
  @media (max-width: 768px) {
    .bio-section { grid-template-columns: 1fr; }
    .bio-photo-wrap { max-width: 280px; margin: 0 auto; }
    .interests-grid { grid-template-columns: 1fr 1fr; }
    .dance-section { grid-template-columns: 1fr; }
    .dance-photo-wrap { max-width: 280px; margin: 0 auto; }
  }

  @media (max-width: 480px) {
    .interests-grid { grid-template-columns: 1fr; }
  }
`;

export default function AboutPage() {
  const refs = useRef<(HTMLElement | null)[]>([]);

  useEffect(() => {
    const id = "vidhi-about-styles";
    if (!document.getElementById(id)) {
      const tag = document.createElement("style");
      tag.id = id;
      tag.textContent = STYLES;
      document.head.appendChild(tag);
    }
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => {
      refs.current.forEach((el) => {
        if (el) el.classList.add("visible");
      });
    }, 300);
    return () => clearTimeout(timer);
  }, []);

  const addRef = (i: number) => (el: HTMLElement | null) => {
    refs.current[i] = el;
  };

  return (
    <>
      <main className="about-page">
        <div className="about-inner">

          {/* ── Bio ── */}
          <section className="bio-section">
            {/* LEFT: text column — give it a ref so headings animate in */}
            <div
              className="fade-up"
              ref={addRef(0)}
              style={{ transitionDelay: "0s" }}
            >
              <p className="section-label">About Me</p>
              <h1 className="section-heading">When the laptop closes.</h1>
              <div className="bio-text">
                <p>
                  I'm Vidhi, a Data and Software Engineer who's equally at home in a dataset and on a dance floor.
                  I thrive on finding solutions in ambiguity and thinking critically through complex problems. That led
                  me to computer science, and eventually to Shopify, where I completed four internships working across
                  the full stack, from frontend to data pipelines. I'm currently a Data Science intern at Wealthsimple,
                  working on financial data and product analytics. 👩🏽‍💻
                </p>
                <p>
                  Outside of work, I'm happiest exploring somewhere new, discovering live music, or performing on stage.
                  My perspective is grounded in a strong appreciation for culture, travel, and community. 🌎
                </p>
              </div>
            </div>

            {/* RIGHT: photo */}
            <div
              className="bio-photo-wrap fade-up"
              ref={addRef(1)}
              style={{ transitionDelay: "0.15s" }}
            >
              <img src="como.png" alt="Vidhi at Lake Como" />
            </div>
          </section>

          {/* ── Interests ── */}
          <section>
            <p
              className="section-label fade-up"
              ref={addRef(2)}
              style={{ transitionDelay: "0s" }}
            >
              What I love
            </p>
            <div className="interests-grid">
              {[
                {
                  src: "/sintra.png",
                  alt: "Vidhi overlooking Sintra, Portugal",
                  tag: "Passion",
                  title: "Travelling",
                },
                {
                  src: "/concert.png",
                  alt: "Concert stage with lights",
                  tag: "Music",
                  title: "Live concerts",
                },
                {
                  src: "/team.png",
                  alt: "Vidhi in traditional Raas attire",
                  tag: "Heritage",
                  title: "Dance & culture",
                },
              ].map((item, i) => (
                <div
                  className="interest-card fade-up"
                  key={i}
                  ref={addRef(3 + i)}
                  style={{ transitionDelay: `${0.1 * i}s` }}
                >
                  <img src={item.src} alt={item.alt} />
                  <div className="interest-overlay" />
                  <div className="interest-label">
                    <span>{item.tag}</span>
                    <h3>{item.title}</h3>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* ── Dance & Leadership ── */}
          <section className="dance-section">
            {/* LEFT: photo */}
            <div
              className="dance-photo-wrap fade-up"
              ref={addRef(6)}
              style={{ transitionDelay: "0s" }}
            >
              <img src="/raas.jpg" alt="Vidhi dancing Raas in traditional attire" />
            </div>

            {/* RIGHT: text column — give it a ref so headings animate in */}
            <div
              className="dance-text fade-up"
              ref={addRef(7)}
              style={{ transitionDelay: "0.15s" }}
            >
              <p className="section-label">Dance & Leadership</p>
              <h2 className="section-heading">Shaped by culture &amp; community.</h2>
              <div className="dance-body">
                <p>
                  Raas and Garba have been a constant in my life. What began as a cultural connection grew into
                  a meaningful journey of leadership and community. I've had the privilege of co-founding and
                  leading university dance communities, organizing performances, and helping create spaces where
                  people feel connected and proud of their heritage. 🪷
                </p>
                <p>
                  Leading these teams taught me how to build trust, work with creative people, and bring a vision
                  to life from the ground up. Those experiences continue to shape how I collaborate and take
                  initiative in technical spaces today. It's the part of my story I'm most proud of. ✨
                </p>
              </div>
              <div className="dance-roles">
                <span className="dance-role-tag">YorkU Roaring Raas · Co-President</span>
                <span className="dance-role-tag">RaasMotion · Campus Coordinator</span>
                <span className="dance-role-tag">Hackathon Organizer · Co-Chair</span>
              </div>
            </div>
          </section>

        </div>
      </main>
    </>
  );
}