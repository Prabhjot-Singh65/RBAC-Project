import Joi from 'joi';
import { User } from '../models/User.js';
import { Roles } from '../config/permissions.js';

export async function listUsers(req, res) {
  const users = await User.find().select('email name role createdAt');
  res.json({ users });
}

const updateRoleSchema = Joi.object({
  role: Joi.string().valid(...Object.values(Roles)).required()
});

export async function updateUserRole(req, res) {
  const { error, value } = updateRoleSchema.validate(req.body);
  if (error) return res.status(400).json({ error: error.message });
  const user = await User.findByIdAndUpdate(req.params.userId, { role: value.role }, { new: true }).select('email name role');
  if (!user) return res.status(404).json({ error: 'User not found' });
  res.json({ user });
}
