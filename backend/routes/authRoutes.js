const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const db = require('../config/db');

/* ---------------- LOGIN ---------------- */
router.post('/login', (req, res) => {
  const { email, password } = req.body;
  console.log("LOGIN API HIT:", req.body);

  if (!email || !password) {
    return res.status(400).json({ message: 'Email and password required' });
  }

  db.query(
    'SELECT * FROM users WHERE email = ?',
    [email],
    async (err, results) => {
      if (err) {
        console.log(err);
        return res.status(500).json({ message: 'Server error' });
      }

      if (!results || results.length === 0) {
        return res.status(401).json({ message: 'Invalid email or password' });
      }

      const user = results[0];

      let isMatch = false;

      try {
        // 🔥 SUPPORT BOTH TYPES OF PASSWORDS
        if (user.password.startsWith('$2')) {
          isMatch = await bcrypt.compare(password, user.password);
        } else {
          isMatch = password === user.password;
        }
      } catch (e) {
        console.log(e);
        return res.status(500).json({ message: 'Password error' });
      }

      if (!isMatch) {
        return res.status(401).json({ message: 'Invalid email or password' });
      }

      const token = jwt.sign(
        { user_id: user.user_id, role: user.role },
        process.env.JWT_SECRET || "secretkey",
        { expiresIn: '8h' }
      );

      return res.json({
        token,
        role: user.role,
        name: user.name
      });
    }
  );
});

/* ---------------- REGISTER ---------------- */
router.post('/register', async (req, res) => {
  const { name, email, password, role } = req.body;

  if (!name || !email || !password) {
    return res.status(400).json({ message: 'All fields required' });
  }

  try {
    const hashedPassword = await bcrypt.hash(password, 10);

    db.query(
      'INSERT INTO users (name, email, password, role) VALUES (?, ?, ?, ?)',
      [name, email, hashedPassword, role || 'student'],
      (err, result) => {
        if (err) {
          console.log(err);
          return res.status(500).json({ message: 'Email already exists' });
        }

        return res.json({
          message: 'User registered successfully',
          user_id: result.insertId
        });
      }
    );
  } catch (err) {
    console.log(err);
    return res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;