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
      </main>

      <footer className="footer">
        <p>PAAI &copy; 2026</p>
      </footer>
    </div>
  )
}

export default App
