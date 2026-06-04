import { useNavigate } from 'react-router-dom'
import './App.css'

function App() {
  const navigate = useNavigate()
  return (
    <div className="landing">
      {/* Navbar */}
      <nav className="navbar">
        <div className="nav-logo">
          <span className="logo-icon">🛡</span>
          <span className="logo-text">PAAI</span>
        </div>
        <div className="nav-links">
          <a href="#features">Features</a>
          <a href="#about">About</a>
        </div>
      </nav>

      {/* Hero */}
      <section className="hero">
        <div className="hero-badge">ISO 27001:2022</div>
        <h1>
          Internal Audit Platform<br />
          <span className="hero-accent">Built for Compliance</span>
        </h1>
        <p className="hero-subtitle">
          Streamline your ISO 27001 audits. Assess all 93 controls, track
          non-conformities, and generate detailed PDF reports — all in one place.
        </p>
        <div className="hero-buttons">
          <button className="btn btn-primary" onClick={() => navigate('/signup')}>Sign Up</button>
          <button className="btn btn-secondary" onClick={() => navigate('/signin')}>Sign In</button>
        </div>
      </section>

      {/* Features */}
      <section className="features" id="features">
        <div className="feature-card">
          <div className="feature-icon">✅</div>
          <h3>93 ISO Controls</h3>
          <p>Full Annex A checklist covering Organizational, People, Physical and Technological domains.</p>
        </div>
        <div className="feature-card">
          <div className="feature-icon">📊</div>
          <h3>Compliance Reports</h3>
          <p>Automatic compliance percentage calculation with non-conformity identification.</p>
        </div>
        <div className="feature-card">
          <div className="feature-icon">📄</div>
          <h3>PDF Export</h3>
          <p>Generate and download detailed audit reports with recommendations per control.</p>
        </div>
        <div className="feature-card">
          <div className="feature-icon">🔒</div>
          <h3>Secure Access</h3>
          <p>JWT authentication with TOTP multi-factor authentication for each company account.</p>
        </div>
      </section>

      {/* Footer */}
      <footer className="footer">
        <p>© 2026 PAAI — ISO 27001 Audit Platform</p>
      </footer>
    </div>
  )
}

export default App
