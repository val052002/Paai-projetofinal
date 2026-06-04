import pool from '../config/db.js';

export async function createAudit({ companyId, title }) {
  const result = await pool.query(
    `INSERT INTO audits (company_id, title) VALUES ($1, $2)
     RETURNING id, company_id, title, start_date, end_date, status`,
    [companyId, title]
  );
  return result.rows[0];
}

export async function getAudits(companyId) {
  const result = await pool.query(
    `SELECT a.id, a.title, a.start_date, a.end_date, a.status,
       COUNT(r.id) AS total_responses,
       COUNT(r.id) FILTER (WHERE r.compliant = true) AS compliant_count
     FROM audits a
     LEFT JOIN audit_responses r ON r.audit_id = a.id
     WHERE a.company_id = $1
     GROUP BY a.id
     ORDER BY a.start_date DESC`,
    [companyId]
  );
  return result.rows.map(row => ({
    ...row,
    compliance_pct: row.total_responses > 0
      ? Math.round((row.compliant_count / row.total_responses) * 100)
      : null,
  }));
}

export async function getAuditById(auditId, companyId) {
  const auditResult = await pool.query(
    `SELECT a.id, a.title, a.start_date, a.end_date, a.status,
       COUNT(r.id) AS total_responses,
       COUNT(r.id) FILTER (WHERE r.compliant = true) AS compliant_count,
       COUNT(r.id) FILTER (WHERE r.compliant = false) AS non_conformities
     FROM audits a
     LEFT JOIN audit_responses r ON r.audit_id = a.id
     WHERE a.id = $1 AND a.company_id = $2
     GROUP BY a.id`,
    [auditId, companyId]
  );

  if (!auditResult.rows[0]) {
    const err = new Error('Audit not found');
    err.status = 404;
    throw err;
  }

  const audit = auditResult.rows[0];
  audit.compliance_pct = audit.total_responses > 0
    ? Math.round((audit.compliant_count / audit.total_responses) * 100)
    : null;

  const responsesResult = await pool.query(
    `SELECT r.id, r.compliant, r.observation,
       c.id AS controlo_id, c.codigo, c.titulo, c.dominio, c.recomendacao
     FROM audit_responses r
     JOIN controlos_iso c ON c.id = r.controlo_id
     WHERE r.audit_id = $1
     ORDER BY c.codigo`,
    [auditId]
  );

  // Attach all 93 controls with existing responses merged in
  const controlsResult = await pool.query(
    `SELECT c.id, c.codigo, c.titulo, c.dominio, c.recomendacao,
       r.id AS response_id, r.compliant, r.observation
     FROM controlos_iso c
     LEFT JOIN audit_responses r ON r.controlo_id = c.id AND r.audit_id = $1
     ORDER BY c.codigo`,
    [auditId]
  );

  audit.controls = controlsResult.rows;
  return audit;
}

export async function saveResponses(auditId, companyId, responses) {
  // Verify audit belongs to company
  const check = await pool.query(
    'SELECT id, status FROM audits WHERE id = $1 AND company_id = $2',
    [auditId, companyId]
  );
  if (!check.rows[0]) {
    const err = new Error('Audit not found');
    err.status = 404;
    throw err;
  }
  if (check.rows[0].status === 'COMPLETED') {
    const err = new Error('Audit is already finalized');
    err.status = 400;
    throw err;
  }

  // Upsert each response
  for (const { controlo_id, compliant, observation } of responses) {
    await pool.query(
      `INSERT INTO audit_responses (audit_id, controlo_id, compliant, observation)
       VALUES ($1, $2, $3, $4)
       ON CONFLICT (audit_id, controlo_id)
       DO UPDATE SET compliant = $3, observation = $4`,
      [auditId, controlo_id, compliant, observation ?? null]
    );
  }
  return { saved: responses.length };
}

export async function finalizeAudit(auditId, companyId) {
  const check = await pool.query(
    'SELECT id, status FROM audits WHERE id = $1 AND company_id = $2',
    [auditId, companyId]
  );
  if (!check.rows[0]) {
    const err = new Error('Audit not found');
    err.status = 404;
    throw err;
  }
  if (check.rows[0].status === 'COMPLETED') {
    const err = new Error('Audit is already finalized');
    err.status = 400;
    throw err;
  }

  const result = await pool.query(
    `UPDATE audits SET status = 'COMPLETED', end_date = CURRENT_DATE
     WHERE id = $1 RETURNING *`,
    [auditId]
  );
  return result.rows[0];
}
