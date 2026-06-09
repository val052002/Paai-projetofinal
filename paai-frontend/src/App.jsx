import { useNavigate } from 'react-router-dom'
import './App.css'

function App() {
  const navigate = useNavigate()
  return (
    <div className="landing">
      <nav className="navbar">
        <span className="nav-logo">PAAI</span>
      </nav>

      <main className="main">
        <h1>ISO 27001 Audit Platform</h1>
        <p>Perform internal ISO 27001 audits, assess compliance controls and generate audit reports.</p>
        <div className="buttons">
          <button onClick={() => navigate('/signup')}>Sign Up</button>
          <button className="outline" onClick={() => navigate('/signin')}>Sign In</button>
        </div>

        <div className="steps">
          <h2>How it works</h2>
          <div className="steps-list">
            <div className="step">
              <span className="step-num">1</span>
              <div>
                <strong>Create an account</strong>
                <p>Register your company and set up two-factor authentication.</p>
              </div>
            </div>
            <div className="step">
              <span className="step-num">2</span>
              <div>
                <strong>Start an audit</strong>
                <p>Create a new audit session and go through all 93 ISO 27001 controls.</p>
              </div>
            </div>
            <div className="step">
              <span className="step-num">3</span>
              <div>
                <strong>Record compliance</strong>
                <p>Mark each control as compliant or non-conformity and add observations.</p>
              </div>
            </div>
            <div className="step">
              <span className="step-num">4</span>
              <div>
                <strong>Get your report</strong>
                <p>Finalize the audit to generate a compliance report and download it as PDF.</p>
              </div>
            </div>
          </div>
        </div>
      </main>

      <footer className="footer">
        <p>PAAI &copy; 2026</p>
      </footer>
    </div>
  )
}

export default App
