import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import cors from 'cors';
import { use } from 'react';

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.error('MongoDB connection error:', err));

//Defining a user schema and model
const userSchema = new mongoose.Schema({
  username: String,
  full_name: String,
  email: String,
  password: String,
  description: String,
  profile_picture: String,
  location: String,
  website: String,
  social_links: {
    twitter: String,
    github: String,
    linkedin: String,
  },
  date_created: { type: String, default: () => new Date().toISOString() },
  reset_token: String,
});
const User = mongoose.model('User', userSchema);

//Route to save a user
app.post('/api/users', async (req, res) => {
    try{
        const user = new User(req.body);
        await user.save();
        res.status(201).json(user);
      } catch (error) {
        res.status(400).json({error: error.message});
      }  
});

//Email required and Email exists
app.get('/api/users/check-email', async (req, res) => {
  const { email } = req.query;
  if (!email) return res.status(400).json({ exists: false, message: 'Email is required' });
  const user = await User.findOne({ email });
  res.json({ exists: !!user })
});

// Example route
app.get('/', (req, res) => {
  res.send('API is running');
});

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));