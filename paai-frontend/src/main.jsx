import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import './index.css'
import App from './App.jsx'
import SignIn from './pages/SignIn.jsx'
import SignUp from './pages/SignUp.jsx'
import MfaSetup from './pages/MfaSetup.jsx'
import Dashboard from './pages/Dashboard.jsx'
import AuditDetail from './pages/AuditDetail.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<App />} />
        <Route path="/signin" element={<SignIn />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/mfa/setup" element={<MfaSetup />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/audits/:id" element={<AuditDetail />} />
      </Routes>
    </BrowserRouter>
  </StrictMode>,
)
