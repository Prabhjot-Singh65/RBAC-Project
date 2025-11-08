import { Router } from 'express';
import { listUsers, updateUserRole } from '../controllers/adminController.js';
import { authRequired } from '../middleware/auth.js';
import { requirePermission } from '../middleware/permissions.js';
import { Permission } from '../config/permissions.js';

const router = Router();
router.use(authRequired());
router.use(requirePermission(Permission.USER_MANAGE));

router.get('/users', listUsers);
router.patch('/users/:userId/role', updateUserRole);

export default router;
