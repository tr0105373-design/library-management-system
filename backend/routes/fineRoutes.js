const express = require('express');
const router = express.Router();
const db = require('../config/db');
const auth = require('../middleware/auth');

router.get('/', auth, async (req, res) => {
  try {
    const result = await db.query(
      `SELECT f.*, u.name
       FROM fines f
       JOIN book_issues bi ON f.issue_id = bi.issue_id
       JOIN members m ON bi.member_id = m.member_id
       JOIN users u ON m.user_id = u.user_id`
    );
    res.json(result.rows);
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: 'Server error' });
  }
});

router.post('/pay', auth, async (req, res) => {
  const { fine_id, paid_amount } = req.body;
  try {
    await db.query(
      "UPDATE fines SET paid_amount = $1, status = 'paid', paid_date = CURRENT_DATE WHERE fine_id = $2",
      [paid_amount, fine_id]
    );
    res.json({ message: 'Fine paid successfully!' });
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: 'Error updating fine' });
  }
});

router.post('/waive', auth, async (req, res) => {
  const { fine_id, reason } = req.body;
  try {
    await db.query(
      "UPDATE fines SET status = 'waived', paid_date = CURRENT_DATE WHERE fine_id = $1",
      [fine_id]
    );
    res.json({ message: 'Fine waived successfully!' });
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: 'Error waiving fine' });
  }
});

module.exports = router;