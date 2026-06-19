const express = require('express');
const router = express.Router();
const db = require('../config/db');
const auth = require('../middleware/auth');

router.post('/issue', auth, async (req, res) => {
  const { book_id, member_id } = req.body;
  const issue_date = new Date().toISOString().split('T')[0];
  const due_date = new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];

  try {
    const bookResult = await db.query('SELECT available_copies FROM books WHERE book_id = $1', [book_id]);

    if (bookResult.rows.length === 0) {
      return res.status(404).json({ message: 'Book not found!' });
    }
    if (bookResult.rows[0].available_copies === 0) {
      return res.status(400).json({ message: 'Book not available!' });
    }

    await db.query(
      'INSERT INTO book_issues (book_id, member_id, issue_date, due_date) VALUES ($1,$2,$3,$4)',
      [book_id, member_id, issue_date, due_date]
    );

    await db.query('UPDATE books SET available_copies = available_copies - 1 WHERE book_id = $1', [book_id]);

    res.json({ message: 'Book issued successfully!', due_date });

  } catch (err) {
    console.log(err);
    res.status(500).json({ message: 'Error issuing book' });
  }
});

router.post('/return', auth, async (req, res) => {
  const { issue_id, book_id } = req.body;
  const return_date = new Date().toISOString().split('T')[0];

  try {
    await db.query(
      "UPDATE book_issues SET return_date = $1, status = 'returned' WHERE issue_id = $2",
      [return_date, issue_id]
    );

    await db.query('UPDATE books SET available_copies = available_copies + 1 WHERE book_id = $1', [book_id]);

    const dueResult = await db.query('SELECT due_date FROM book_issues WHERE issue_id = $1', [issue_id]);

    if (dueResult.rows.length === 0) {
      return res.json({ message: 'Book returned successfully! No fine.' });
    }

    const due = new Date(dueResult.rows[0].due_date);
    const returned = new Date(return_date);
    const days = Math.floor((returned - due) / (1000 * 60 * 60 * 24));

    if (days > 0) {
      const fine = days * 5;
      await db.query('INSERT INTO fines (issue_id, amount) VALUES ($1,$2)', [issue_id, fine]);
      return res.json({ message: `Book returned! Fine: Rs. ${fine}` });
    }

    res.json({ message: 'Book returned successfully! No fine.' });

  } catch (err) {
    console.log(err);
    res.status(500).json({ message: 'Error returning book' });
  }
});

router.get('/', auth, async (req, res) => {
  try {
    const result = await db.query(
      `SELECT bi.*, b.title, u.name
       FROM book_issues bi
       JOIN books b ON bi.book_id = b.book_id
       JOIN members m ON bi.member_id = m.member_id
       JOIN users u ON m.user_id = u.user_id`
    );
    res.json(result.rows);
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: 'Server error' });
  }
});

router.post('/renew', auth, async (req, res) => {
  const { issue_id } = req.body;
  const new_due_date = new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];

  try {
    const result = await db.query(
      "UPDATE book_issues SET due_date = $1 WHERE issue_id = $2 AND status = 'issued'",
      [new_due_date, issue_id]
    );

    if (result.rowCount === 0) {
      return res.status(400).json({ message: 'Book cannot be renewed!' });
    }

    res.json({ message: `Book renewed! New due date: ${new_due_date}` });

  } catch (err) {
    console.log(err);
    res.status(500).json({ message: 'Error renewing book' });
  }
});

module.exports = router;