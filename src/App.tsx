import React, { useEffect } from "react";
import { BrowserRouter, Routes, Route, useNavigate, useLocation } from "react-router-dom";
import LandingPage from "./LandingPage";
import ExperiencePage from "./ExperiencePage";
import AboutPage from "./AboutPage";

function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => {
    setTimeout(() => window.scrollTo(0, 0), 0);
  }, [pathname]);
  return null;
}

function AppRoutes() {
  const navigate = useNavigate();
  const location = useLocation();

  const handleNavClick = (label: string) => {
    if (label === "Home") navigate("/");
    if (label === "Experience") navigate("/experience");
    if (label === "About Me") navigate("/about");
  };

  const activePage =
    location.pathname === "/" ? "Home"
    : location.pathname === "/experience" ? "Experience"
    : "About Me";

  return (
    <>
      <ScrollToTop /> 
      <nav
        style={{
          position: "fixed",
          top: 0, left: 0, right: 0,
          zIndex: 50,
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          gap: "clamp(2rem, 6vw, 6rem)",
          padding: "1.4rem 2rem",
          background: "rgba(247, 245, 255, 0.72)",
          backdropFilter: "blur(14px)",
          borderBottom: "1px solid rgba(123, 94, 167, 0.12)",
          fontFamily: "'DM Sans', sans-serif",
        }}
        role="navigation"
        aria-label="Main"
      >
        {["Home", "Experience", "About Me"].map((label) => (
          <button
            key={label}
            onClick={() => handleNavClick(label)}
            aria-current={activePage === label ? "page" : undefined}
            style={{
              fontFamily: "'DM Sans', sans-serif",
              fontSize: "1rem",
              fontWeight: activePage === label ? 500 : 400,
              color: activePage === label ? "#2d1f6e" : "#6B6B8A",
              background: "none",
              border: "none",
              cursor: "pointer",
              position: "relative",
              paddingBottom: "2px",
              transition: "color 0.25s ease",
            }}
          >
            {label}
            {activePage === label && (
              <span
                style={{
                  position: "absolute",
                  bottom: -2, left: 0, right: 0,
                  height: 2,
                  background: "#7B5EA7",
                  borderRadius: 99,
                }}
              />
            )}
          </button>
        ))}
      </nav>

      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/experience" element={<ExperiencePage />} />
        <Route path="/about" element={<AboutPage />} />
      </Routes>
    </>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <AppRoutes />
    </BrowserRouter>
  );
}