const express = require('express');
const router = express.Router();
const db = require('../config/db');
const auth = require('../middleware/auth');

router.get('/', auth, (req, res) => {
  db.query('SELECT * FROM books', (err, results) => {
    if (err) return res.status(500).json({ message: 'Server error' });
    res.json(results);
  });
});

router.post('/add', auth, (req, res) => {
  const { title, author, isbn, publisher, year, category_id, total_copies } = req.body;
  db.query(
    'INSERT INTO books (title, author, isbn, publisher, year, category_id, total_copies, available_copies) VALUES (?,?,?,?,?,?,?,?)',
    [title, author, isbn, publisher, year, category_id, total_copies, total_copies],
    (err) => {
      if (err) return res.status(500).json({ message: 'Error adding book' });
      res.json({ message: 'Book added successfully!' });
    }
  );
});

router.get('/search', auth, (req, res) => {
  const { query } = req.query;
  db.query(
    'SELECT * FROM books WHERE title LIKE ? OR author LIKE ? OR isbn LIKE ?',
    [`%${query}%`, `%${query}%`, `%${query}%`],
    (err, results) => {
      if (err) return res.status(500).json({ message: 'Server error' });
      res.json(results);
    }
  );
});

router.delete('/:id', auth, (req, res) => {
  db.query('DELETE FROM books WHERE book_id = ?', [req.params.id], (err) => {
    if (err) return res.status(500).json({ message: 'Error deleting book' });
    res.json({ message: 'Book deleted successfully!' });
  });
});

router.post('/lost', auth, (req, res) => {
  const { book_id, issue_id } = req.body;
  db.query('UPDATE books SET available_copies = available_copies - 1, total_copies = total_copies - 1 WHERE book_id = ?', [book_id], (err) => {
    if (err) return res.status(500).json({ message: 'Error marking book lost' });
    db.query('UPDATE book_issues SET status = "overdue" WHERE issue_id = ?', [issue_id]);
    res.json({ message: 'Book marked as lost!' });
  });
});

module.exports = router;