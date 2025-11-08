import { Router } from 'express';
import { authRequired } from '../middleware/auth.js';
import { requirePermission } from '../middleware/permissions.js';
import { Permission } from '../config/permissions.js';
import { createPost, listPosts, updatePost, deletePost, getPost } from '../controllers/postController.js';

const router = Router();
router.get('/', authRequired({ allowAnonymous: true }), listPosts);
router.get('/:id', authRequired({ allowAnonymous: true }), getPost);
router.post('/', authRequired(), requirePermission(Permission.POST_CREATE), createPost);
router.patch('/:id', authRequired(), requirePermission(Permission.POST_UPDATE), updatePost);
router.delete('/:id', authRequired(), requirePermission(Permission.POST_DELETE), deletePost);

export default router;
