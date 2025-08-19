const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const cors = require('cors');

const router = express.Router();

// ✅ Allow CORS just for these routes as a backup
const corsOptions = {
  origin: [
    'http://localhost:3000',
    'http://localhost:3001',
    'http://localhost:5173',
    'https://bplo-user-1.onrender.com',
    'https://bplo-user.onrender.com',
    'https://bplo-user-1-1.onrender.com',
  ],
  credentials: true,
};

// Explicitly handle OPTIONS (preflight)
router.options('/register', cors(corsOptions));
router.options('/login', cors(corsOptions));

router.post('/register', cors(corsOptions), async (req, res) => {
  try {
    const { email, username, password } = req.body;
    if (!email || !username || !password) {
      return res
        .status(400)
        .json({ message: 'Email, username, and password are required' });
    }
    const existing = await User.findOne({ where: { email } });
    if (existing) return res.status(400).json({ message: 'Email already exists' });
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await User.create({ email, username, password: hashedPassword });
    res.status(201).json({
      message: 'User registered successfully',
      user: { id: user.id, email, username },
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.post('/login', cors(corsOptions), async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ where: { email } }); // <- you had a missing parenthesis here
    if (!user) return res.status(404).json({ message: 'User not found' });
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ message: 'Invalid credentials' });
    const token = jwt.sign(
      { id: user.id, email: user.email, username: user.username },
      process.env.JWT_SECRET || 'secretkey',
      { expiresIn: '1h' }
    );
    res.json({
      message: 'Login successful',
      token,
      user: { id: user.id, email, username: user.username },
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
