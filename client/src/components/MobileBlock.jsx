import { useState, useEffect } from "react";

const MOBILE_BREAKPOINT = 768; // px — anything below this is considered mobile

const styles = `
  @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap');

  .mb-overlay {
    position: fixed;
    inset: 0;
    z-index: 99999;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    padding: 2rem;
    background: #0a0a0f;
    font-family: 'Inter', sans-serif;
    text-align: center;
    overflow: hidden;
  }

  /* Animated gradient orbs */
  .mb-overlay::before,
  .mb-overlay::after {
    content: '';
    position: absolute;
    border-radius: 50%;
    filter: blur(80px);
    opacity: 0.35;
    animation: mb-float 6s ease-in-out infinite alternate;
    pointer-events: none;
  }
  .mb-overlay::before {
    width: 320px;
    height: 320px;
    background: radial-gradient(circle, #6c63ff, #3b37cc);
    top: -80px;
    left: -80px;
  }
  .mb-overlay::after {
    width: 260px;
    height: 260px;
    background: radial-gradient(circle, #ff6584, #c62a6a);
    bottom: -60px;
    right: -60px;
    animation-delay: 3s;
  }

  @keyframes mb-float {
    from { transform: translateY(0px) scale(1); }
    to   { transform: translateY(30px) scale(1.08); }
  }

  .mb-card {
    position: relative;
    z-index: 1;
    background: rgba(255,255,255,0.04);
    border: 1px solid rgba(255,255,255,0.08);
    border-radius: 24px;
    padding: 2.5rem 2rem;
    max-width: 360px;
    width: 100%;
    backdrop-filter: blur(16px);
    box-shadow: 0 25px 60px rgba(0,0,0,0.5);
    animation: mb-pop 0.5s cubic-bezier(0.34, 1.56, 0.64, 1) both;
  }

  @keyframes mb-pop {
    from { opacity: 0; transform: scale(0.85) translateY(20px); }
    to   { opacity: 1; transform: scale(1) translateY(0); }
  }

  .mb-icon-wrap {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 0.75rem;
    margin-bottom: 1.5rem;
  }

  .mb-icon {
    width: 56px;
    height: 56px;
    border-radius: 16px;
    display: flex;
    align-items: center;
    justify-content: center;
    background: rgba(108, 99, 255, 0.15);
    border: 1px solid rgba(108, 99, 255, 0.3);
  }

  .mb-icon svg {
    width: 28px;
    height: 28px;
    color: #6c63ff;
  }

  .mb-arrow {
    font-size: 1.25rem;
    color: rgba(255,255,255,0.2);
  }

  .mb-icon-desktop {
    background: rgba(99, 220, 177, 0.12);
    border-color: rgba(99, 220, 177, 0.3);
  }
  .mb-icon-desktop svg { color: #63dcb1; }

  .mb-badge {
    display: inline-flex;
    align-items: center;
    gap: 0.4rem;
    padding: 0.3rem 0.85rem;
    border-radius: 999px;
    background: rgba(255, 101, 132, 0.12);
    border: 1px solid rgba(255, 101, 132, 0.3);
    color: #ff6584;
    font-size: 0.72rem;
    font-weight: 600;
    letter-spacing: 0.06em;
    text-transform: uppercase;
    margin-bottom: 1rem;
  }

  .mb-title {
    color: #ffffff;
    font-size: 1.4rem;
    font-weight: 700;
    margin: 0 0 0.6rem;
    line-height: 1.3;
  }

  .mb-subtitle {
    color: rgba(255,255,255,0.45);
    font-size: 0.88rem;
    font-weight: 400;
    line-height: 1.65;
    margin: 0 0 1.75rem;
  }

  .mb-divider {
    height: 1px;
    background: rgba(255,255,255,0.06);
    margin-bottom: 1.25rem;
  }

  .mb-tip {
    display: flex;
    align-items: center;
    gap: 0.6rem;
    background: rgba(108, 99, 255, 0.08);
    border: 1px solid rgba(108, 99, 255, 0.15);
    border-radius: 12px;
    padding: 0.75rem 1rem;
  }

  .mb-tip-icon {
    font-size: 1.1rem;
    flex-shrink: 0;
  }

  .mb-tip-text {
    color: rgba(255,255,255,0.5);
    font-size: 0.8rem;
    line-height: 1.5;
    text-align: left;
  }

  .mb-tip-text strong {
    color: rgba(255,255,255,0.75);
  }
`;

export default function MobileBlock({ children }) {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < MOBILE_BREAKPOINT);
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);

  if (!isMobile) return children;

  return (
    <>
      <style>{styles}</style>
      <div className="mb-overlay">
        <div className="mb-card">
          {/* Icons */}
          <div className="mb-icon-wrap">
            <div className="mb-icon">
              {/* Mobile icon */}
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <rect x="5" y="2" width="14" height="20" rx="2" ry="2"/>
                <line x1="12" y1="18" x2="12.01" y2="18"/>
              </svg>
            </div>
            <span className="mb-arrow">→</span>
            <div className="mb-icon mb-icon-desktop">
              {/* Desktop icon */}
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <rect x="2" y="3" width="20" height="14" rx="2" ry="2"/>
                <line x1="8" y1="21" x2="16" y2="21"/>
                <line x1="12" y1="17" x2="12" y2="21"/>
              </svg>
            </div>
          </div>

          {/* Badge */}
          <div className="mb-badge">
            <span>⚠</span> Desktop Only
          </div>

          <h1 className="mb-title">Best on a Bigger Screen</h1>
          <p className="mb-subtitle">
            This application is designed for desktop use and requires a larger screen
            to deliver the full experience.
          </p>

          <div className="mb-divider" />

          <div className="mb-tip">
            <span className="mb-tip-icon">💻</span>
            <p className="mb-tip-text">
              Open this link on a <strong>laptop or desktop computer</strong> for the best experience.
            </p>
          </div>
        </div>
      </div>
    </>
  );
}
