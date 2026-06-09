import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './Dashboard.css';

const API = 'http://localhost:3001';

export default function Dashboard() {
  const navigate = useNavigate();
  const company = JSON.parse(localStorage.getItem('company') || '{}');
  const token = localStorage.getItem('token');

  const [audits, setAudits] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [creating, setCreating] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!token) return navigate('/signin');
    fetchAudits();
  }, []);

  async function fetchAudits() {
    try {
      const res = await fetch(`${API}/audits`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.status === 401) { logout(); return; }
      const data = await res.json();
      setAudits(data);
    } catch {
      setError('Failed to load audits');
    } finally {
      setLoading(false);
    }
  }

  async function handleCreate(e) {
    e.preventDefault();
    setCreating(true);
    try {
      const res = await fetch(`${API}/audits`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({ title: newTitle }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      setAudits(prev => [data, ...prev]);
      setShowModal(false);
      setNewTitle('');
      navigate(`/audits/${data.id}`);
    } catch (err) {
      setError(err.message);
    } finally {
      setCreating(false);
    }
  }

  function logout() {
    localStorage.clear();
    navigate('/signin');
  }

  const total = audits.length;
  const completed = audits.filter(a => a.status === 'COMPLETED').length;
  const inProgress = audits.filter(a => a.status === 'IN_PROGRESS').length;
  const avgCompliance = audits.filter(a => a.compliance_pct !== null).length > 0
    ? Math.round(audits.filter(a => a.compliance_pct !== null)
        .reduce((sum, a) => sum + Number(a.compliance_pct), 0) /
        audits.filter(a => a.compliance_pct !== null).length)
    : null;

  return (
    <div className="dashboard">
      {/* Navbar */}
      <nav className="dash-nav">
        <div className="nav-logo">PAAI</div>
        <div className="nav-right">
          <span className="nav-company">{company.name}</span>
          <button className="btn-logout" onClick={logout}>Sign Out</button>
        </div>
      </nav>

      <div className="dash-body">
        {/* Header */}
        <div className="dash-header">
          <div>
            <h1>Dashboard</h1>
            <p className="dash-sub">Manage your ISO 27001 audits</p>
          </div>
          <button className="btn-new" onClick={() => setShowModal(true)}>
            + New Audit
          </button>
        </div>

        {/* Stats */}
        <div className="stats-grid">
          <div className="stat-card">
            <div className="stat-value">{total}</div>
            <div className="stat-label">Total Audits</div>
          </div>
          <div className="stat-card">
            <div className="stat-value in-progress">{inProgress}</div>
            <div className="stat-label">In Progress</div>
          </div>
          <div className="stat-card">
            <div className="stat-value completed">{completed}</div>
            <div className="stat-label">Completed</div>
          </div>
          <div className="stat-card">
            <div className="stat-value compliance">
              {avgCompliance !== null ? `${avgCompliance}%` : '—'}
            </div>
            <div className="stat-label">Avg Compliance</div>
          </div>
        </div>

        {/* Audit List */}
        {error && <div className="dash-error">{error}</div>}

        {loading ? (
          <div className="dash-loading">Loading audits...</div>
        ) : audits.length === 0 ? (
          <div className="dash-empty">
            <div className="empty-icon">📋</div>
            <h3>No audits yet</h3>
            <p>Create your first ISO 27001 audit to get started</p>
            <button className="btn-new" onClick={() => setShowModal(true)}>
              + Create First Audit
            </button>
          </div>
        ) : (
          <div className="audit-list">
            <div className="audit-list-header">
              <span>Audit</span>
              <span>Date</span>
              <span>Progress</span>
              <span>Status</span>
              <span></span>
            </div>
            {audits.map(audit => (
              <div key={audit.id} className="audit-row">
                <div className="audit-title">{audit.title}</div>
                <div className="audit-date">
                  {new Date(audit.start_date).toLocaleDateString('en-GB')}
                </div>
                <div className="audit-progress">
                  {audit.compliance_pct !== null ? (
                    <>
                      <div className="progress-bar">
                        <div
                          className="progress-fill"
                          style={{ width: `${audit.compliance_pct}%` }}
                        />
                      </div>
                      <span className="progress-pct">{audit.compliance_pct}%</span>
                    </>
                  ) : (
                    <span className="progress-none">Not started</span>
                  )}
                </div>
                <div className="audit-status">
                  <span className={`badge ${audit.status === 'COMPLETED' ? 'badge-done' : 'badge-progress'}`}>
                    {audit.status === 'COMPLETED' ? 'Completed' : 'In Progress'}
                  </span>
                </div>
                <div className="audit-actions">
                  <button
                    className="btn-open"
                    onClick={() => navigate(`/audits/${audit.id}`)}
                  >
                    Open →
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Create Audit Modal */}
      {showModal && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <div className="modal" onClick={e => e.stopPropagation()}>
            <h2>New Audit</h2>
            <p className="modal-sub">Give your audit a descriptive title</p>
            <form onSubmit={handleCreate}>
              <input
                type="text"
                placeholder="e.g. ISO 27001 Internal Audit Q2 2026"
                value={newTitle}
                onChange={e => setNewTitle(e.target.value)}
                autoFocus
                required
              />
              <div className="modal-actions">
                <button type="button" className="btn-cancel" onClick={() => setShowModal(false)}>
                  Cancel
                </button>
                <button type="submit" className="btn-create" disabled={creating}>
                  {creating ? 'Creating...' : 'Create Audit'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
