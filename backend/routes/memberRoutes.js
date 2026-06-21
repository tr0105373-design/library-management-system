const express = require('express');
const router = express.Router();
const db = require('../config/db');
const auth = require('../middleware/auth');

router.get('/', auth, async (req, res) => {
  try {
    const result = await db.query(
      'SELECT m.*, u.name, u.email, u.role FROM members m JOIN users u ON m.user_id = u.user_id'
    );
    res.json(result.rows);
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: 'Server error' });
  }
});

router.get('/search', auth, async (req, res) => {
  const { query } = req.query;
  try {
    const result = await db.query(
      `SELECT m.*, u.name, u.email, u.role
       FROM members m
       JOIN users u ON m.user_id = u.user_id
       WHERE u.name ILIKE $1 OR u.email ILIKE $1`,
      [`%${query}%`]
    );
    res.json(result.rows);
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: 'Error searching members' });
  }
});

router.post('/add', auth, async (req, res) => {
  const { user_id, member_type, max_books } = req.body;
  try {
    await db.query(
      'INSERT INTO members (user_id, member_type, max_books) VALUES ($1,$2,$3)',
      [user_id, member_type, max_books]
    );
    res.json({ message: 'Member added successfully!' });
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: 'Error adding member' });
  }
});

router.delete('/:id', auth, async (req, res) => {
  const memberId = req.params.id;
  try {
    const result = await db.query('SELECT user_id FROM members WHERE member_id = $1', [memberId]);

    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'Member not found' });
    }

    const userId = result.rows[0].user_id;

    await db.query('DELETE FROM members WHERE member_id = $1', [memberId]);
    await db.query('DELETE FROM users WHERE user_id = $1', [userId]);

    res.json({ message: 'Member deleted successfully!' });
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: 'Error deleting member' });
  }
});

module.exports = router;