const express = require('express');
const router = express.Router();
const db = require('../config/db');
const auth = require('../middleware/auth');

router.get('/', auth, (req, res) => {
  db.query(
    'SELECT m.*, u.name, u.email, u.role FROM members m JOIN users u ON m.user_id = u.user_id',
    (err, results) => {
      if (err) return res.status(500).json({ message: 'Server error' });
      res.json(results);
    }
  );
});

router.post('/add', auth, (req, res) => {
  const { user_id, member_type, max_books } = req.body;
  db.query(
    'INSERT INTO members (user_id, member_type, max_books) VALUES (?,?,?)',
    [user_id, member_type, max_books],
    (err) => {
      if (err) return res.status(500).json({ message: 'Error adding member' });
      res.json({ message: 'Member added successfully!' });
    }
  );
});

router.delete('/:id', auth, (req, res) => {
  const memberId = req.params.id;
  db.query('SELECT user_id FROM members WHERE member_id = ?', [memberId], (err, results) => {
    if (err) return res.status(500).json({ message: 'Server error' });
    if (results.length === 0) return res.status(404).json({ message: 'Member not found' });
    const userId = results[0].user_id;
    db.query('DELETE FROM members WHERE member_id = ?', [memberId], (err) => {
      if (err) return res.status(500).json({ message: 'Error deleting member' });
      db.query('DELETE FROM users WHERE user_id = ?', [userId], (err) => {
        if (err) return res.status(500).json({ message: 'Error deleting user' });
        res.json({ message: 'Member deleted successfully!' });
      });
    });
  });
});


module.exports = router;