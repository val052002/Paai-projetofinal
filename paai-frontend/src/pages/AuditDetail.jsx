import { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import './AuditDetail.css';

const API = 'http://localhost:3001';
const DOMAINS = ['Organizacional', 'Pessoas', 'Físico', 'Tecnológico'];

export default function AuditDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const token = localStorage.getItem('token');
  const company = JSON.parse(localStorage.getItem('company') || '{}');

  const [audit, setAudit] = useState(null);
  const [responses, setResponses] = useState({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [finalizing, setFinalizing] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState('');
  const [activeTab, setActiveTab] = useState(DOMAINS[0]);
  const [showFinalizeModal, setShowFinalizeModal] = useState(false);

  useEffect(() => {
    if (!token) return navigate('/signin');
    fetchAudit();
  }, [id]);

  async function fetchAudit() {
    try {
      const res = await fetch(`${API}/audits/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.status === 401) { localStorage.clear(); navigate('/signin'); return; }
      if (res.status === 404) { navigate('/dashboard'); return; }
      const data = await res.json();
      setAudit(data);

      const map = {};
      data.controls.forEach(c => {
        if (c.response_id) {
          map[c.id] = { compliant: c.compliant, observation: c.observation || '' };
        }
      });
      setResponses(map);
    } catch {
      setError('Failed to load audit');
    } finally {
      setLoading(false);
    }
  }

  function setResponse(controlId, field, value) {
    setResponses(prev => ({
      ...prev,
      [controlId]: { ...prev[controlId], [field]: value },
    }));
    setSaved(false);
  }

  async function handleSave() {
    setSaving(true);
    setError('');
    try {
      const payload = Object.entries(responses).map(([controlo_id, r]) => ({
        controlo_id: Number(controlo_id),
        compliant: r.compliant,
        observation: r.observation || null,
      }));

      if (payload.length === 0) {
        setError('No responses to save yet');
        return;
      }

      const res = await fetch(`${API}/audits/${id}/responses`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({ responses: payload }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    } catch (err) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  }

  async function handleFinalize() {
    setFinalizing(true);
    try {
      await handleSave();
      const res = await fetch(`${API}/audits/${id}/finalize`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      setAudit(prev => ({ ...prev, status: 'COMPLETED' }));
      setShowFinalizeModal(false);
      navigate(`/audits/${id}/report`);
    } catch (err) {
      setError(err.message);
    } finally {
      setFinalizing(false);
    }
  }

  if (loading) return <div className="audit-loading">Loading audit...</div>;
  if (!audit) return null;

  const controls = audit.controls || [];
  const answered = Object.keys(responses).length;
  const total = controls.length;
  const compliantCount = Object.values(responses).filter(r => r.compliant === true).length;
  const compliancePct = answered > 0 ? Math.round((compliantCount / answered) * 100) : 0;
  const isCompleted = audit.status === 'COMPLETED';

  const domainControls = (domain) => controls.filter(c => c.dominio === domain);
  const domainAnswered = (domain) => domainControls(domain).filter(c => responses[c.id] !== undefined).length;

  return (
    <div className="audit-detail">
      {/* Navbar */}
      <nav className="dash-nav">
        <div className="nav-logo" onClick={() => navigate('/dashboard')} style={{ cursor: 'pointer' }}>
          PAAI
        </div>
        <div className="nav-right">
          <span className="nav-company">{company.name}</span>
          <button className="btn-logout" onClick={() => { localStorage.clear(); navigate('/signin'); }}>
            Sign Out
          </button>
        </div>
      </nav>

      <div className="audit-body">
        {/* Header */}
        <div className="audit-header">
          <div className="audit-breadcrumb">
            <span onClick={() => navigate('/dashboard')} className="breadcrumb-link">Dashboard</span>
            <span className="breadcrumb-sep">›</span>
            <span>{audit.title}</span>
          </div>
          <div className="audit-header-row">
            <div>
              <h1>{audit.title}</h1>
              <div className="audit-meta">
                <span className={`badge ${isCompleted ? 'badge-done' : 'badge-progress'}`}>
                  {isCompleted ? 'Completed' : 'In Progress'}
                </span>
                <span className="meta-text">Started {new Date(audit.start_date).toLocaleDateString('en-GB')}</span>
              </div>
            </div>
            {!isCompleted && (
              <div className="audit-actions">
                <button className="btn-save" onClick={handleSave} disabled={saving}>
                  {saving ? 'Saving...' : saved ? '✓ Saved' : 'Save Progress'}
                </button>
                <button className="btn-finalize" onClick={() => setShowFinalizeModal(true)}>
                  Finalize Audit
                </button>
              </div>
            )}
            {isCompleted && (
              <button className="btn-report" onClick={() => navigate(`/audits/${id}/report`)}>
                View Report →
              </button>
            )}
          </div>
        </div>

        {error && <div className="audit-error">{error}</div>}

        {/* Progress Summary */}
        <div className="progress-summary">
          <div className="summary-stat">
            <span className="summary-val">{answered}/{total}</span>
            <span className="summary-label">Controls Answered</span>
          </div>
          <div className="summary-stat">
            <span className="summary-val green">{compliantCount}</span>
            <span className="summary-label">Compliant</span>
          </div>
          <div className="summary-stat">
            <span className="summary-val red">{answered - compliantCount}</span>
            <span className="summary-label">Non-Conformities</span>
          </div>
          <div className="summary-stat">
            <span className="summary-val blue">{compliancePct}%</span>
            <span className="summary-label">Compliance Rate</span>
          </div>
          <div className="summary-bar-wrap">
            <div className="summary-bar">
              <div className="summary-fill" style={{ width: `${(answered / total) * 100}%` }} />
            </div>
            <span className="summary-bar-label">{Math.round((answered / total) * 100)}% complete</span>
          </div>
        </div>

        {/* Domain Tabs */}
        <div className="domain-tabs">
          {DOMAINS.map(domain => (
            <button
              key={domain}
              className={`domain-tab ${activeTab === domain ? 'active' : ''}`}
              onClick={() => setActiveTab(domain)}
            >
              {domain}
              <span className="tab-count">
                {domainAnswered(domain)}/{domainControls(domain).length}
              </span>
            </button>
          ))}
        </div>

        {/* Controls List */}
        <div className="controls-list">
          {domainControls(activeTab).map((control, idx) => {
            const resp = responses[control.id];
            return (
              <div key={control.id} className={`control-card ${resp ? (resp.compliant ? 'compliant' : 'non-compliant') : ''}`}>
                <div className="control-header">
                  <div className="control-meta">
                    <span className="control-code">{control.codigo}</span>
                    <span className="control-domain">{control.dominio}</span>
                  </div>
                  <div className="control-compliance">
                    <button
                      className={`btn-compliance yes ${resp?.compliant === true ? 'active' : ''}`}
                      onClick={() => !isCompleted && setResponse(control.id, 'compliant', true)}
                      disabled={isCompleted}
                    >
                      ✓ Compliant
                    </button>
                    <button
                      className={`btn-compliance no ${resp?.compliant === false ? 'active' : ''}`}
                      onClick={() => !isCompleted && setResponse(control.id, 'compliant', false)}
                      disabled={isCompleted}
                    >
                      ✗ Non-Conformity
                    </button>
                  </div>
                </div>
                <h3 className="control-title">{control.titulo}</h3>
                {resp?.compliant === false && (
                  <div className="recommendation-box">
                    <span className="rec-label">Recommendation:</span>
                    <p className="rec-text">{control.recomendacao}</p>
                  </div>
                )}
                <textarea
                  className="control-observation"
                  placeholder="Add observation or notes..."
                  value={resp?.observation || ''}
                  onChange={e => !isCompleted && setResponse(control.id, 'observation', e.target.value)}
                  disabled={isCompleted}
                  rows={2}
                />
              </div>
            );
          })}
        </div>
      </div>

      {/* Finalize Modal */}
      {showFinalizeModal && (
        <div className="modal-overlay" onClick={() => setShowFinalizeModal(false)}>
          <div className="modal" onClick={e => e.stopPropagation()}>
            <h2>Finalize Audit?</h2>
            <p className="modal-sub">
              This will mark the audit as <strong>Completed</strong> and generate your report.
              You won't be able to edit responses after this.
            </p>
            <div className="modal-summary">
              <span>Controls answered: <strong>{answered}/{total}</strong></span>
              <span>Compliance rate: <strong>{compliancePct}%</strong></span>
            </div>
            <div className="modal-actions">
              <button className="btn-cancel" onClick={() => setShowFinalizeModal(false)}>Cancel</button>
              <button className="btn-create" onClick={handleFinalize} disabled={finalizing}>
                {finalizing ? 'Finalizing...' : 'Yes, Finalize'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
