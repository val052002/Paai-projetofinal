import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './Auth.css';
import './MfaSetup.css';

export default function MfaSetup() {
  const navigate = useNavigate();
  const [qrDataUrl, setQrDataUrl] = useState('');
  const [secret, setSecret] = useState('');
  const [code, setCode] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState('loading'); // loading | scan | done

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) return navigate('/signin');
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
        // MFA already configured — go to dashboard
        if (res.status === 400) return navigate('/dashboard');
        throw new Error(data.error || 'Failed to load MFA setup');
      }
      setQrDataUrl(data.qrDataUrl);
      setSecret(data.secret);
      setStep('scan');
    } catch (err) {
      setError(err.message);
      setStep('scan');
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
        body: JSON.stringify({ token: code }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Invalid code');
      localStorage.removeItem('mfa_pending');
      setStep('done');
      setTimeout(() => navigate('/dashboard'), 1500);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  if (step === 'loading') return null;

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
