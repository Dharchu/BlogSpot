/*
Creates admin user and sample data.
Run: node scripts/create_admin.js
*/
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const User = require('../src/models/User');
const Post = require('../src/models/Post');
require('dotenv').config({ path: require('path').join(__dirname, '..', '.env') });

async function main(){
  await mongoose.connect(process.env.MONGO_URI, { useNewUrlParser:true, useUnifiedTopology:true });
  console.log('Connected to DB');
  const adminEmail = process.env.ADMIN_EMAIL || 'admin@example.com';
  const admin = await User.findOne({ email: adminEmail });
  if(!admin){
    const salt = await bcrypt.genSalt(10);
    const hash = await bcrypt.hash(process.env.ADMIN_PASSWORD || 'Admin@123', salt);
    const u = new User({ name: process.env.ADMIN_NAME || 'Admin User', email: adminEmail, password: hash, role: 'admin' });
    await u.save();
    console.log('Admin created:', adminEmail);
  } else {
    console.log('Admin already exists');
  }

  // sample users
  const users = [];
  const sample = [
    {name:'Alice', email:'alice@example.com'},
    {name:'Bob', email:'bob@example.com'},
    {name:'Carol', email:'carol@example.com'}
  ];
  for(const s of sample){
    let u = await User.findOne({email: s.email});
    if(!u){
      const salt = await bcrypt.genSalt(10);
      const hash = await bcrypt.hash('Password@123', salt);
      u = new User({ name: s.name, email: s.email, password: hash, role: 'user' });
      await u.save();
      users.push(u);
    } else users.push(u);
  }
  // sample posts
  const postsCount = await Post.countDocuments();
  if(postsCount === 0){
    const imgs = [
      'https://res.cloudinary.com/dww5mitpy/image/upload/v1690000000/sample1.jpg',
      'https://res.cloudinary.com/dww5mitpy/image/upload/v1690000000/sample2.jpg',
      'https://res.cloudinary.com/dww5mitpy/image/upload/v1690000000/sample3.jpg'
    ];
    for(let i=0;i<5;i++){
      const p = new Post({
        title: 'Sample Post ' + (i+1),
        content: '<p>This is sample content for post '+(i+1)+'.</p>',
        image: imgs[i % imgs.length],
        author: users[i % users.length]._id,
        category: i%2===0 ? 'Tech' : 'Life',
        tags: ['sample','demo']
      });
      p.comments.push({ user: users[(i+1)%users.length]._id, text: 'Nice post!' });
      p.likes.push(users[(i+2)%users.length]._id);
      await p.save();
    }
    console.log('Sample posts created');
  } else {
    console.log('Posts already present, skipping sample posts');
  }
  process.exit(0);
}
main();
