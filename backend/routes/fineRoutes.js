const express = require('express');
const router = express.Router();
const db = require('../config/db');
const auth = require('../middleware/auth');

router.get('/', auth, (req, res) => {
  db.query(
    'SELECT f.*, u.name FROM fines f JOIN book_issues bi ON f.issue_id = bi.issue_id JOIN members m ON bi.member_id = m.member_id JOIN users u ON m.user_id = u.user_id',
    (err, results) => {
      if (err) return res.status(500).json({ message: 'Server error' });
      res.json(results);
    }
  );
});

router.post('/pay', auth, (req, res) => {
  const { fine_id, paid_amount } = req.body;
  db.query(
    'UPDATE fines SET paid_amount = ?, status = "paid", paid_date = CURDATE() WHERE fine_id = ?',
    [paid_amount, fine_id],
    (err) => {
      if (err) return res.status(500).json({ message: 'Error updating fine' });
      res.json({ message: 'Fine paid successfully!' });
    }
  );
});

router.post('/waive', auth, (req, res) => {
  const { fine_id, reason } = req.body;
  db.query(
    'UPDATE fines SET status = "waived", paid_date = CURDATE() WHERE fine_id = ?',
    [fine_id],
    (err) => {
      if (err) return res.status(500).json({ message: 'Error waiving fine' });
      res.json({ message: 'Fine waived successfully!' });
    }
  );
});

module.exports = router;