const express = require('express');
const router = express.Router();
const db = require('../config/db');
const auth = require('../middleware/auth');

router.get('/summary', auth, (req, res) => {
  const summary = {};
  db.query('SELECT COUNT(*) as total FROM books', (err, r) => {
    summary.books = r[0].total;
    db.query('SELECT COUNT(*) as total FROM members', (err, r) => {
      summary.members = r[0].total;
      db.query('SELECT COUNT(*) as total FROM book_issues WHERE status="issued"', (err, r) => {
        summary.issued = r[0].total;
        db.query('SELECT SUM(amount) as total FROM fines WHERE status="pending"', (err, r) => {
          summary.pendingFines = r[0].total || 0;
          res.json(summary);
        });
      });
    });
  });
});

router.get('/most-borrowed', auth, (req, res) => {
  db.query(
    'SELECT b.title, b.author, COUNT(bi.book_id) as borrow_count FROM book_issues bi JOIN books b ON bi.book_id = b.book_id GROUP BY bi.book_id ORDER BY borrow_count DESC LIMIT 5',
    (err, results) => {
      if (err) return res.status(500).json({ message: 'Server error' });
      res.json(results);
    }
  );
});

module.exports = router;