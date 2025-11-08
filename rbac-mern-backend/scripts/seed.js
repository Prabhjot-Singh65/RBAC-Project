import 'dotenv/config';
import bcrypt from 'bcryptjs';
import { connectMongo } from '../src/db/mongoose.js';
import { User } from '../src/models/User.js';
import { Post } from '../src/models/Post.js';
import { Roles } from '../src/config/permissions.js';

async function run() {
  const conn = await connectMongo(process.env.MONGO_URI);

  await User.deleteMany({});
  await Post.deleteMany({});

  const [admin, editor, viewer] = await Promise.all([
    User.create({
      email: 'admin@example.com',
      name: 'Admin User',
      role: Roles.ADMIN,
      passwordHash: await bcrypt.hash('Admin@123', 10)
    }),
    User.create({
      email: 'editor@example.com',
      name: 'Editor User',
      role: Roles.EDITOR,
      passwordHash: await bcrypt.hash('Editor@123', 10)
    }),
    User.create({
      email: 'viewer@example.com',
      name: 'Viewer User',
      role: Roles.VIEWER,
      passwordHash: await bcrypt.hash('Viewer@123', 10)
    })
  ]);

  await Post.create([
    { title: 'Welcome Post', content: 'Published for everyone.', authorId: admin._id, published: true },
    { title: 'Editor Draft', content: 'Only editor can see/edit.', authorId: editor._id, published: false }
  ]);

  console.log('Seeded users:');
  console.log('Admin -> admin@example.com / Admin@123');
  console.log('Editor -> editor@example.com / Editor@123');
  console.log('Viewer -> viewer@example.com / Viewer@123');

  await conn.close();
}

run().catch(err => {
  console.error(err);
  process.exit(1);
});
