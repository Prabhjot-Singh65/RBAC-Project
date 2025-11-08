import { canRole } from '../config/permissions.js';

export function requirePermission(permission) {
  return function(req, res, next) {
    const role = req.user?.role;
    if (!role) return res.status(401).json({ error: 'Unauthenticated' });
    if (!canRole(role, permission)) {
      return res.status(403).json({ error: 'Forbidden: insufficient permission', permission });
    }
    next();
  }
}

// Helper to enforce ownership on resource queries
export function enforceOwnershipOrAdmin(getFilter) {
  return function(req, res, next) {
    const role = req.user?.role;
    const userId = req.user?.id;
    if (!role || !userId) return res.status(401).json({ error: 'Unauthenticated' });
    if (role === 'admin') return next();
    // Attach ownership filter for downstream handlers
    req.ownershipFilter = getFilter(userId, req);
    return next();
  }
}
