const express = require('express');
const router = express.Router();
const db = require('../config/db');
const auth = require('../middleware/auth');

router.post('/issue', auth, (req, res) => {
  const { book_id, member_id } = req.body;
  const issue_date = new Date().toISOString().split('T')[0];
  const due_date = new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];

  db.query('SELECT available_copies FROM books WHERE book_id = ?', [book_id], (err, results) => {
    if (err) return res.status(500).json({ message: 'Server error' });
    if (results[0].available_copies === 0) return res.status(400).json({ message: 'Book not available!' });

    db.query(
      'INSERT INTO book_issues (book_id, member_id, issue_date, due_date) VALUES (?,?,?,?)',
      [book_id, member_id, issue_date, due_date],
      (err) => {
        if (err) return res.status(500).json({ message: 'Error issuing book' });
        db.query('UPDATE books SET available_copies = available_copies - 1 WHERE book_id = ?', [book_id]);
        res.json({ message: 'Book issued successfully!', due_date });
      }
    );
  });
});

router.post('/return', auth, (req, res) => {
  const { issue_id, book_id } = req.body;
  const return_date = new Date().toISOString().split('T')[0];

  db.query(
    'UPDATE book_issues SET return_date = ?, status = "returned" WHERE issue_id = ?',
    [return_date, issue_id],
    (err) => {
      if (err) return res.status(500).json({ message: 'Error returning book' });
      db.query('UPDATE books SET available_copies = available_copies + 1 WHERE book_id = ?', [book_id]);

      db.query('SELECT due_date FROM book_issues WHERE issue_id = ?', [issue_id], (err, results) => {
        const due = new Date(results[0].due_date);
        const returned = new Date(return_date);
        const days = Math.floor((returned - due) / (1000 * 60 * 60 * 24));
        if (days > 0) {
          const fine = days * 5;
          db.query('INSERT INTO fines (issue_id, amount) VALUES (?,?)', [issue_id, fine]);
          return res.json({ message: `Book returned! Fine: Rs. ${fine}` });
        }
        res.json({ message: 'Book returned successfully! No fine.' });
      });
    }
  );
});

router.get('/', auth, (req, res) => {
  db.query(
    'SELECT bi.*, b.title, u.name FROM book_issues bi JOIN books b ON bi.book_id = b.book_id JOIN members m ON bi.member_id = m.member_id JOIN users u ON m.user_id = u.user_id',
    (err, results) => {
      if (err) return res.status(500).json({ message: 'Server error' });
      res.json(results);
    }
  );
});

router.post('/renew', auth, (req, res) => {
  const { issue_id } = req.body;
  const new_due_date = new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];

  db.query(
    'UPDATE book_issues SET due_date = ? WHERE issue_id = ? AND status = "issued"',
    [new_due_date, issue_id],
    (err, result) => {
      if (err) return res.status(500).json({ message: 'Error renewing book' });
      if (result.affectedRows === 0) return res.status(400).json({ message: 'Book cannot be renewed!' });
      res.json({ message: `Book renewed! New due date: ${new_due_date}` });
    }
  );
});

module.exports = router;