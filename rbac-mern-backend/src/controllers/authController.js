import Joi from 'joi';
import bcrypt from 'bcryptjs';
import { User } from '../models/User.js';
import { signAccessToken } from '../utils/jwt.js';
import { Roles } from '../config/permissions.js';

const registerSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().min(6).required(),
  name: Joi.string().min(2).required()
});

export async function register(req, res) {
  const { error, value } = registerSchema.validate(req.body);
  if (error) return res.status(400).json({ error: error.message });

  const existing = await User.findOne({ email: value.email });
  if (existing) return res.status(409).json({ error: 'Email already exists' });

  const passwordHash = await bcrypt.hash(value.password, 10);
  const user = await User.create({ email: value.email, name: value.name, passwordHash, role: Roles.VIEWER });
  const token = signAccessToken({ userId: user._id.toString(), role: user.role }, process.env.JWT_SECRET, process.env.JWT_EXPIRES_IN || '15m');
  res.status(201).json({ token, user: { id: user._id, email: user.email, name: user.name, role: user.role } });
}

const loginSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().required()
});

export async function login(req, res) {
  const { error, value } = loginSchema.validate(req.body);
  if (error) return res.status(400).json({ error: error.message });

  const user = await User.findOne({ email: value.email });
  if (!user) return res.status(401).json({ error: 'Invalid credentials' });
  const match = await user.comparePassword(value.password);
  if (!match) return res.status(401).json({ error: 'Invalid credentials' });

  const token = signAccessToken({ userId: user._id.toString(), role: user.role }, process.env.JWT_SECRET, process.env.JWT_EXPIRES_IN || '15m');
  res.json({ token, user: { id: user._id, email: user.email, name: user.name, role: user.role } });
}

export async function me(req, res) {
  const user = await User.findById(req.user.id).select('email name role createdAt');
  res.json({ user });
}
