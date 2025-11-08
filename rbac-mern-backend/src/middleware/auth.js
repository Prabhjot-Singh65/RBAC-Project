import jwt from 'jsonwebtoken';
import { User } from '../models/User.js';

export function authRequired({ allowAnonymous = false } = {}) {
  return async function(req, res, next) {
    try {
      const auth = req.headers.authorization || '';
      const token = auth.startsWith('Bearer ') ? auth.slice(7) : null;
      if (!token) {
        if (allowAnonymous) return next();
        return res.status(401).json({ error: 'Missing token' });
      }
      const payload = jwt.verify(token, process.env.JWT_SECRET);
      req.user = { id: payload.sub, role: payload.role };
      next();
    } catch (err) {
      return res.status(401).json({ error: 'Invalid or expired token' });
    }
  }
}
