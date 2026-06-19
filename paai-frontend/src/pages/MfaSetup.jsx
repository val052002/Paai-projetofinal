import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './Auth.css';
import './MfaSetup.css';

const SESSION_KEY = 'mfa_setup_session';

export default function MfaSetup() {
  const navigate = useNavigate();
  const [qrDataUrl, setQrDataUrl] = useState('');
  const [secret, setSecret] = useState('');
  const [setupToken, setSetupToken] = useState('');
  const [code, setCode] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState('loading');

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) return navigate('/signin');

    // If a setup session exists from a previous load (e.g. page refresh), reuse it
    const saved = sessionStorage.getItem(SESSION_KEY);
    if (saved) {
      try {
        const { qrDataUrl, secret, setupToken } = JSON.parse(saved);
        setQrDataUrl(qrDataUrl);
        setSecret(secret);
        setSetupToken(setupToken);
        setStep('scan');
        return;
      } catch {
        sessionStorage.removeItem(SESSION_KEY);
      }
    }

    fetchQr(token);
  }, []);

  async function fetchQr(token) {
    try {
      const res = await fetch('http://localhost:3001/auth/mfa/setup', {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (!res.ok) {
        if (res.status === 400) return navigate('/dashboard');
        if (res.status === 401) { localStorage.clear(); return navigate('/signin'); }
        throw new Error(data.error || 'Failed to load MFA setup');
      }
      // Persist setup session so page refresh reuses same QR
      sessionStorage.setItem(SESSION_KEY, JSON.stringify({
        qrDataUrl: data.qrDataUrl,
        secret: data.secret,
        setupToken: data.setupToken,
      }));
      setQrDataUrl(data.qrDataUrl);
      setSecret(data.secret);
      setSetupToken(data.setupToken);
      setStep('scan');
    } catch (err) {
      setError(err.message);
      setStep('error');
    }
  }

  async function handleConfirm(e) {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      const res = await fetch('http://localhost:3001/auth/mfa/confirm', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ token: code, setupToken }),
      });
      const data = await res.json();
      if (!res.ok) {
        // setupToken expired — clear session and restart
        if (res.status === 400 && data.error && data.error.includes('expired')) {
          sessionStorage.removeItem(SESSION_KEY);
          setError('Setup session expired. Generating a new QR code...');
          setTimeout(() => {
            setStep('loading');
            setError('');
            const authToken = localStorage.getItem('token');
            if (authToken) fetchQr(authToken);
          }, 2000);
          return;
        }
        throw new Error(data.error || 'Invalid code');
      }
      sessionStorage.removeItem(SESSION_KEY);
      setStep('done');
      setTimeout(() => navigate('/dashboard'), 1500);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  if (step === 'loading') return (
    <div style={{ minHeight: '100vh', background: '#f5f5f5', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'Arial', color: '#888', fontSize: 14 }}>
      Loading...
    </div>
  );

  if (step === 'error') return (
    <div className="auth-page">
      <div className="auth-card">
        <p style={{ color: '#c00', fontSize: 13, marginBottom: 16 }}>{error}</p>
        <button className="btn-submit" onClick={() => navigate('/signin')}>Back to Sign In</button>
      </div>
    </div>
  );

  return (
    <div className="auth-page">
      <div className="auth-card mfa-setup-card">
        <div className="auth-logo">PAAI</div>

        {step === 'scan' && (
          <>
            <h2>Set Up Two-Factor Auth</h2>
            <p style={{ fontSize: 13, color: '#555', marginBottom: 12 }}>Scan this QR code with Google Authenticator or Authy</p>

            {error && <div className="auth-error">{error}</div>}

            {qrDataUrl && (
              <div className="qr-wrapper">
                <img src={qrDataUrl} alt="MFA QR Code" className="qr-image" />
              </div>
            )}

            <div className="secret-box">
              <span className="secret-label">Manual entry key:</span>
              <code className="secret-code">{secret}</code>
            </div>

            <div className="mfa-steps">
              <div className="mfa-step">
                <span className="step-num">1</span>
                <span>Open Google Authenticator or Authy</span>
              </div>
              <div className="mfa-step">
                <span className="step-num">2</span>
                <span>Tap <strong>+</strong> and scan the QR code above</span>
              </div>
              <div className="mfa-step">
                <span className="step-num">3</span>
                <span>Enter the 6-digit code below to confirm</span>
              </div>
            </div>

            <form onSubmit={handleConfirm}>
              <div className="form-group">
                <label>Confirmation Code</label>
                <input
                  type="text"
                  inputMode="numeric"
                  maxLength={6}
                  placeholder="000000"
                  value={code}
                  onChange={e => setCode(e.target.value.replace(/\D/g, ''))}
                  className="mfa-input"
                  required
                />
              </div>
              <button className="btn-submit" disabled={loading || code.length !== 6}>
                {loading ? 'Verifying...' : 'Confirm & Continue'}
              </button>
            </form>
          </>
        )}

        {step === 'done' && (
          <div className="mfa-done">
            <h2>MFA Enabled</h2>
            <p style={{ fontSize: 13, color: '#555' }}>Redirecting to your dashboard...</p>
          </div>
        )}
      </div>
    </div>
  );
}
