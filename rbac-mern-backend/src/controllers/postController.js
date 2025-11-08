import Joi from 'joi';
import { Post } from '../models/Post.js';
import { Permission } from '../config/permissions.js';

const createSchema = Joi.object({
  title: Joi.string().min(3).required(),
  content: Joi.string().min(1).required(),
  published: Joi.boolean().optional()
});

export async function createPost(req, res) {
  const { error, value } = createSchema.validate(req.body);
  if (error) return res.status(400).json({ error: error.message });
  const post = await Post.create({ ...value, authorId: req.user.id });
  res.status(201).json({ post });
}

export async function listPosts(req, res) {
  // Editors & Viewers see published posts, Editors also see their drafts; Admin sees all
  const role = req.user?.role;
  const userId = req.user?.id;
  const page = Math.max(parseInt(req.query.page || '1'), 1);
  const limit = Math.min(Math.max(parseInt(req.query.limit || '10'), 1), 100);
  const skip = (page - 1) * limit;

  let filter = {};
  if (role === 'admin') {
    // no extra filter
  } else if (role === 'editor') {
    filter = { $or: [{ published: true }, { authorId: userId }] };
  } else {
    filter = { published: true };
  }

  const [total, items] = await Promise.all([
    Post.countDocuments(filter),
    Post.find(filter).sort({ createdAt: -1 }).skip(skip).limit(limit)
  ]);
  res.json({ page, limit, total, items });
}

const updateSchema = Joi.object({
  title: Joi.string().min(3),
  content: Joi.string().min(1),
  published: Joi.boolean()
}).min(1);

export async function updatePost(req, res) {
  const { error, value } = updateSchema.validate(req.body);
  if (error) return res.status(400).json({ error: error.message });

  const role = req.user.role;
  const userId = req.user.id;
  const baseFilter = { _id: req.params.id };
  const ownershipFilter = role === 'admin' ? baseFilter : { ...baseFilter, authorId: userId };

  const post = await Post.findOneAndUpdate(ownershipFilter, { ...value }, { new: true });
  if (!post) return res.status(404).json({ error: 'Post not found or not permitted' });
  res.json({ post });
}

export async function deletePost(req, res) {
  const role = req.user.role;
  const userId = req.user.id;
  const baseFilter = { _id: req.params.id };
  const filter = role === 'admin' ? baseFilter : { ...baseFilter, authorId: userId };
  const result = await Post.findOneAndDelete(filter);
  if (!result) return res.status(404).json({ error: 'Post not found or not permitted' });
  res.status(204).end();
}

export async function getPost(req, res) {
  const role = req.user?.role;
  const userId = req.user?.id;
  const id = req.params.id;
  let filter = { _id: id };
  if (role === 'admin') {
    // ok
  } else if (role === 'editor') {
    filter = { $and: [{ _id: id }, { $or: [{ published: true }, { authorId: userId }] }] };
  } else {
    filter = { _id: id, published: true };
  }
  const post = await Post.findOne(filter);
  if (!post) return res.status(404).json({ error: 'Post not found or not permitted' });
  res.json({ post });
}
