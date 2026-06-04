import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import './Report.css';

const API = 'http://localhost:3001';
const DOMAINS = ['Organizacional', 'Pessoas', 'Físico', 'Tecnológico'];

export default function Report() {
  const { id } = useParams();
  const navigate = useNavigate();
  const token = localStorage.getItem('token');
  const company = JSON.parse(localStorage.getItem('company') || '{}');

  const [report, setReport] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!token) return navigate('/signin');
    fetchReport();
  }, [id]);

  async function fetchReport() {
    try {
      const res = await fetch(`${API}/audits/${id}/report`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.status === 401) { localStorage.clear(); navigate('/signin'); return; }
      if (res.status === 404) { navigate('/dashboard'); return; }
      const data = await res.json();
      setReport(data);
    } catch {
      setError('Failed to load report');
    } finally {
      setLoading(false);
    }
  }

  function downloadPdf() {
    const url = `${API}/audits/${id}/report/pdf`;
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `audit-${id}-report.pdf`);
    link.setAttribute('target', '_blank');
    // Pass token via query param for PDF download
    link.href = `${url}?token=${token}`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }

  if (loading) return <div className="report-loading">Loading report...</div>;
  if (!report) return null;

  const { audit, summary, by_domain, non_conformities } = report;
  const complianceColor = summary.compliance_pct >= 70 ? 'green' : summary.compliance_pct >= 40 ? 'yellow' : 'red';

  return (
    <div className="report-page">
      {/* Navbar */}
      <nav className="dash-nav">
        <div className="nav-logo" onClick={() => navigate('/dashboard')} style={{ cursor: 'pointer' }}>
          🛡 PAAI
        </div>
        <div className="nav-right">
          <span className="nav-company">{company.name}</span>
          <button className="btn-logout" onClick={() => { localStorage.clear(); navigate('/signin'); }}>
            Sign Out
          </button>
        </div>
      </nav>

      <div className="report-body">
        {/* Header */}
        <div className="report-header">
          <div className="audit-breadcrumb">
            <span onClick={() => navigate('/dashboard')} className="breadcrumb-link">Dashboard</span>
            <span className="breadcrumb-sep">›</span>
            <span onClick={() => navigate(`/audits/${id}`)} className="breadcrumb-link">{audit.title}</span>
            <span className="breadcrumb-sep">›</span>
            <span>Report</span>
          </div>
          <div className="report-header-row">
            <div>
              <h1>Audit Report</h1>
              <p className="report-title-name">{audit.title}</p>
              <p className="report-meta">
                {audit.company_name} · Completed {audit.end_date ? new Date(audit.end_date).toLocaleDateString('en-GB') : '—'}
              </p>
            </div>
            <button className="btn-pdf" onClick={downloadPdf}>
              ⬇ Download PDF
            </button>
          </div>
        </div>

        {error && <div className="report-error">{error}</div>}

        {/* Compliance Score */}
        <div className={`score-card ${complianceColor}`}>
          <div className="score-circle">
            <span className="score-num">{summary.compliance_pct}%</span>
            <span className="score-label">Compliance</span>
          </div>
          <div className="score-details">
            <h2>
              {summary.compliance_pct >= 70
                ? 'Good Compliance Level'
                : summary.compliance_pct >= 40
                ? 'Partial Compliance'
                : 'Low Compliance — Action Required'}
            </h2>
            <p>
              {summary.compliant} out of {summary.answered} assessed controls are compliant.
              {summary.non_conformities > 0
                ? ` ${summary.non_conformities} non-conformit${summary.non_conformities === 1 ? 'y' : 'ies'} identified.`
                : ' No non-conformities found.'}
            </p>
            <div className="score-stats">
              <div className="score-stat">
                <span className="ss-val">{summary.total}</span>
                <span className="ss-label">Total Controls</span>
              </div>
              <div className="score-stat">
                <span className="ss-val">{summary.answered}</span>
                <span className="ss-label">Assessed</span>
              </div>
              <div className="score-stat green">
                <span className="ss-val">{summary.compliant}</span>
                <span className="ss-label">Compliant</span>
              </div>
              <div className="score-stat red">
                <span className="ss-val">{summary.non_conformities}</span>
                <span className="ss-label">Non-Conformities</span>
              </div>
            </div>
          </div>
        </div>

        {/* Domain Breakdown */}
        <div className="section">
          <h2 className="section-title">Results by Domain</h2>
          <div className="domain-grid">
            {DOMAINS.map(domain => {
              const d = by_domain[domain];
              if (!d) return null;
              const pct = d.total > 0 ? Math.round((d.compliant / d.total) * 100) : 0;
              const color = pct >= 70 ? 'green' : pct >= 40 ? 'yellow' : 'red';
              return (
                <div key={domain} className={`domain-card ${color}`}>
                  <div className="domain-name">{domain}</div>
                  <div className={`domain-pct ${color}`}>{pct}%</div>
                  <div className="domain-bar">
                    <div className={`domain-fill ${color}`} style={{ width: `${pct}%` }} />
                  </div>
                  <div className="domain-counts">{d.compliant}/{d.total} compliant</div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Non-Conformities */}
        <div className="section">
          <h2 className="section-title">
            Non-Conformities
            <span className="nc-badge">{non_conformities.length}</span>
          </h2>

          {non_conformities.length === 0 ? (
            <div className="nc-empty">
              <span className="nc-empty-icon">✅</span>
              <p>No non-conformities identified. Full compliance achieved.</p>
            </div>
          ) : (
            <div className="nc-list">
              {non_conformities.map((nc, idx) => (
                <div key={idx} className="nc-card">
                  <div className="nc-header">
                    <span className="nc-code">{nc.codigo}</span>
                    <span className="nc-domain">{nc.dominio}</span>
                  </div>
                  <h3 className="nc-title">{nc.titulo}</h3>
                  {nc.observation && (
                    <div className="nc-observation">
                      <span className="obs-label">Observation:</span>
                      <p>{nc.observation}</p>
                    </div>
                  )}
                  <div className="nc-recommendation">
                    <span className="rec-label">Recommendation:</span>
                    <p>{nc.recomendacao}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer actions */}
        <div className="report-footer-actions">
          <button className="btn-back" onClick={() => navigate('/dashboard')}>
            ← Back to Dashboard
          </button>
          <button className="btn-pdf" onClick={downloadPdf}>
            ⬇ Download PDF Report
          </button>
        </div>
      </div>
    </div>
  );
}
