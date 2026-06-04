import jwt from 'jsonwebtoken';

export default function authenticate(req, res, next) {
  const header = req.headers.authorization;
  // Allow token via query param for PDF downloads
  const token = (header && header.startsWith('Bearer '))
    ? header.slice(7)
    : req.query.token;

  if (!token) {
    return res.status(401).json({ error: 'Missing or invalid authorization header' });
  }
  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET);
    if (payload.mfaPending) {
      return res.status(401).json({ error: 'MFA verification required' });
    }
    req.company = { id: payload.companyId };
    next();
  } catch {
    res.status(401).json({ error: 'Invalid or expired token' });
  }
}
