const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const db = require('../config/db');

/* ---------------- LOGIN ---------------- */
router.post('/login', async (req, res) => {
  const { email, password } = req.body;
  console.log("LOGIN API HIT:", req.body);

  console.log("JWT SECRET:", process.env.JWT_SECRET);

  if (!email || !password) {
    return res.status(400).json({ message: 'Email and password required' });
  }

  try {
    const result = await db.query(
      'SELECT * FROM users WHERE email = $1',
      [email]
    );

    if (result.rows.length === 0) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    const user = result.rows[0];

    let isMatch = false;

    // Support both hashed and plain passwords
    if (user.password.startsWith('$2')) {
      isMatch = await bcrypt.compare(password, user.password);
    } else {
      isMatch = password === user.password;
    }

    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    const token = jwt.sign(
  { user_id: user.user_id, role: user.role },
  process.env.JWT_SECRET,
  { expiresIn: '8h' }
    );

    return res.json({
      token,
      role: user.role,
      name: user.name
    });

  } catch (err) {
    console.log(err);
    return res.status(500).json({ message: 'Server error' });
  }
});


/* ---------------- REGISTER ---------------- */
router.post('/register', async (req, res) => {
  const { name, email, password, role } = req.body;

  if (!name || !email || !password) {
    return res.status(400).json({ message: 'All fields required' });
  }

  try {
    const hashedPassword = await bcrypt.hash(password, 10);

    const result = await db.query(
      'INSERT INTO users (name, email, password, role) VALUES ($1, $2, $3, $4) RETURNING user_id',
      [name, email, hashedPassword, role || 'student']
    );

    return res.json({
      message: 'User registered successfully',
      user_id: result.rows[0].user_id
    });

  } catch (err) {
    console.log(err);
    return res.status(500).json({ message: 'Email already exists' });
  }
});

module.exports = router;