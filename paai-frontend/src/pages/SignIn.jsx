import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './Auth.css';

export default function SignIn() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: '', password: '' });
  const [mfa, setMfa] = useState({ required: false, preToken: '', code: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  function handleChange(e) {
    setForm(f => ({ ...f, [e.target.name]: e.target.value }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const res = await fetch('http://localhost:7000/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Login failed');

      if (data.mfaRequired) {
        setMfa(m => ({ ...m, required: true, preToken: data.preToken }));
      } else {
        localStorage.setItem('token', data.token);
        localStorage.setItem('company', JSON.stringify(data.company));
        navigate('/dashboard');
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  async function handleMfa(e) {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const res = await fetch('http://localhost:7000/auth/mfa/verify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ preToken: mfa.preToken, token: mfa.code }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'MFA verification failed');

      localStorage.setItem('token', data.token);
      localStorage.setItem('company', JSON.stringify(data.company));
      navigate('/dashboard');
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  if (mfa.required) {
    return (
      <div className="auth-page">
        <div className="auth-card">
          <div className="auth-logo">🛡 PAAI</div>
          <h2>Two-Factor Authentication</h2>
          <p className="auth-sub">Enter the 6-digit code from your authenticator app</p>
          {error && <div className="auth-error">{error}</div>}
          <form onSubmit={handleMfa}>
            <div className="form-group">
              <label>MFA Code</label>
              <input
                type="text"
                inputMode="numeric"
                maxLength={6}
                placeholder="000000"
                value={mfa.code}
                onChange={e => setMfa(m => ({ ...m, code: e.target.value }))}
                className="mfa-input"
                required
              />
            </div>
            <button className="btn-submit" disabled={loading}>
              {loading ? 'Verifying...' : 'Verify'}
            </button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="auth-page">
      <div className="auth-card">
        <div className="auth-logo">🛡 PAAI</div>
        <h2>Sign In</h2>
        <p className="auth-sub">Access your audit platform</p>
        {error && <div className="auth-error">{error}</div>}
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Email</label>
            <input
              type="email"
              name="email"
              placeholder="company@example.com"
              value={form.email}
              onChange={handleChange}
              required
            />
          </div>
          <div className="form-group">
            <label>Password</label>
            <input
              type="password"
              name="password"
              placeholder="••••••••"
              value={form.password}
              onChange={handleChange}
              required
            />
          </div>
          <button className="btn-submit" disabled={loading}>
            {loading ? 'Signing in...' : 'Sign In'}
          </button>
        </form>
        <p className="auth-footer">
          Don't have an account? <Link to="/signup">Sign Up</Link>
        </p>
      </div>
    </div>
  );
}
