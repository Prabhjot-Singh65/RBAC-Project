import mongoose from 'mongoose';

const postSchema = new mongoose.Schema({
  title: { type: String, required: true },
  content: { type: String, required: true },
  authorId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
  published: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

postSchema.index({ authorId: 1, createdAt: -1 });

postSchema.pre('save', function(next){
  this.updatedAt = new Date();
  next();
});

export const Post = mongoose.model('Post', postSchema);
