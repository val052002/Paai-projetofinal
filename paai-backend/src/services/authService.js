import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { authenticator } from 'otplib';
import qrcode from 'qrcode';
import pool from '../config/db.js';

export async function register({ name, email, password }) {
  const existing = await pool.query('SELECT id FROM companies WHERE email = $1', [email]);
  if (existing.rows.length > 0) {
    const err = new Error('Email already registered');
    err.status = 409;
    throw err;
  }

  const hash = await bcrypt.hash(password, 12);
  const result = await pool.query(
    'INSERT INTO companies (name, email, password) VALUES ($1, $2, $3) RETURNING id, name, email',
    [name, email, hash]
  );
  return result.rows[0];
}

export async function login({ email, password }) {
  const result = await pool.query('SELECT * FROM companies WHERE email = $1', [email]);
  const company = result.rows[0];

  if (!company) {
    const err = new Error('Invalid credentials');
    err.status = 401;
    throw err;
  }

  const valid = await bcrypt.compare(password, company.password);
  if (!valid) {
    const err = new Error('Invalid credentials');
    err.status = 401;
    throw err;
  }

  if (company.mfa_secret) {
    // MFA enabled — issue a short-lived pre-auth token
    const preToken = jwt.sign(
      { companyId: company.id, mfaPending: true },
      process.env.JWT_MFA_SECRET,
      { expiresIn: '5m' }
    );
    return { mfaRequired: true, preToken };
  }

  const token = issueToken(company);
  return { mfaRequired: false, token, company: safeCompany(company) };
}

export async function setupMfa(companyId) {
  const result = await pool.query('SELECT * FROM companies WHERE id = $1', [companyId]);
  const company = result.rows[0];

  if (company.mfa_secret) {
    const err = new Error('MFA already configured');
    err.status = 400;
    throw err;
  }

  const secret = authenticator.generateSecret();
  const otpauth = authenticator.keyuri(company.email, 'PAAI', secret);
  const qrDataUrl = await qrcode.toDataURL(otpauth);

  await pool.query('UPDATE companies SET mfa_secret = $1 WHERE id = $2', [secret, companyId]);

  return { qrDataUrl, secret };
}

export async function verifyMfa({ preToken, token }) {
  let payload;
  try {
    payload = jwt.verify(preToken, process.env.JWT_MFA_SECRET);
  } catch {
    const err = new Error('Invalid or expired MFA session');
    err.status = 401;
    throw err;
  }

  if (!payload.mfaPending) {
    const err = new Error('Invalid token type');
    err.status = 401;
    throw err;
  }

  const result = await pool.query('SELECT * FROM companies WHERE id = $1', [payload.companyId]);
  const company = result.rows[0];

  const valid = authenticator.check(token, company.mfa_secret);
  if (!valid) {
    const err = new Error('Invalid MFA code');
    err.status = 401;
    throw err;
  }

  return { token: issueToken(company), company: safeCompany(company) };
}

function issueToken(company) {
  return jwt.sign({ companyId: company.id }, process.env.JWT_SECRET, { expiresIn: '8h' });
}

function safeCompany(company) {
  return { id: company.id, name: company.name, email: company.email };
}
