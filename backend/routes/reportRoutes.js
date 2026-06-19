const express = require('express');
const router = express.Router();
const db = require('../config/db');
const auth = require('../middleware/auth');

router.get('/summary', auth, async (req, res) => {
  try {
    const booksResult = await db.query('SELECT COUNT(*) as total FROM books');
    const membersResult = await db.query('SELECT COUNT(*) as total FROM members');
    const issuedResult = await db.query("SELECT COUNT(*) as total FROM book_issues WHERE status = 'issued'");
    const finesResult = await db.query("SELECT SUM(amount) as total FROM fines WHERE status = 'pending'");

    const summary = {
      books: booksResult.rows[0].total,
      members: membersResult.rows[0].total,
      issued: issuedResult.rows[0].total,
      pendingFines: finesResult.rows[0].total || 0
    };

    res.json(summary);

  } catch (err) {
    console.log(err);
    res.status(500).json({ message: 'Server error' });
  }
});

router.get('/most-borrowed', auth, async (req, res) => {
  try {
    const result = await db.query(
      `SELECT b.title, b.author, COUNT(bi.book_id) as borrow_count
       FROM book_issues bi
       JOIN books b ON bi.book_id = b.book_id
       GROUP BY b.book_id, b.title, b.author
       ORDER BY borrow_count DESC
       LIMIT 5`
    );
    res.json(result.rows);
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;