import jwt from 'jsonwebtoken';

export default function authenticate(req, res, next) {
  const header = req.headers.authorization;
  if (!header || !header.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Missing or invalid authorization header' });
  }

  const token = header.slice(7);
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
