import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import cors from 'cors';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

dotenv.config();

const app = express();
app.use(cors());

app.use(express.json({ limit: '5mb' }));
app.use(express.urlencoded({ limit: '5mb', extended: true }));

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
  try {
    const hashedPassword = await bcrypt.hash(req.body.password, 10);
    const user = new User({ ...req.body, password: hashedPassword });
    await user.save();
    // Fetch the full user (excluding password)
    const userToSend = await User.findById(user._id).select('-password');
    // Create JWT token for the new user
    const payload = { id: user._id, email: user.email, username: user.username };
    const token = jwt.sign(payload, JWT_SECRET, { expiresIn: '1h' });
    res.status(201).json({ user: userToSend, token });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

//Email required and Email exists
app.get('/api/users/check-email', async (req, res) => {
  const { email } = req.query;
  if (!email) return res.status(400).json({ exists: false, message: 'Email is required' });
  const user = await User.findOne({ email });
  res.json({ exists: !!user })
});

//Username required and Username exists
app.get('/api/users/check-username', async (req, res) => {
  const { username } = req.query;
  if (!username) return res.status(400).json({ exists: false, message: 'Username is required' });
  const user = await User.findOne({ username });
  res.json({ exists: !!user })
});

//To log a user in
const JWT_SECRET = process.env.JWT_SECRET || 'jwt_secret_key';

app.post('/api/login', async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });
  if (!user) {
    return res.status(401).json({ error: 'Invalid email or password' });
  }
  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) {
    return res.status(401).json({ error: 'Invalid email or password' });
  }
  const payload = { id: user._id, email: user.email, username: user.username };
  const token = jwt.sign(payload, JWT_SECRET, { expiresIn: '1h' });
  res.json({ message: 'Login successful', token, user: payload });
});

function authenticateToken(req, res, next) {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];
  if (!token) return res.sendStatus(401);
  
  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) return res.sendStatus(403);
    req.user = user;
    next();
  });
}

app.get('/api/protected', authenticateToken, (req, res) => {
  res.json({ message: 'This is protected', user: req.user });
});


app.get('/api/me', authenticateToken, async (req, res) => {
  const user = await User.findById(req.user.id).select('-password');
  if (!user) return res.status(404).json({ error: 'User not found' });
  res.json(user);
});

// Update current user profile
app.put('/api/me', authenticateToken, async (req, res) => {
  try {
    const updatedUser = await User.findByIdAndUpdate(
      req.user.id,
      { $set: req.body },
      { new: true }
    ).select('-password');
    if (!updatedUser) return res.status(404).json({ error: 'User not found' });
    res.json(updatedUser);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Example route
app.get('/', (req, res) => {
  res.send('API is running');
});

app.use('/api', (req, res) => {
  res.status(404).json({ error: 'API route not found' });
});

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: err.message || 'Server error' });
});

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));