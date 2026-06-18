const express = require('express');
const router = express.Router();
const db = require('../config/db');
const auth = require('../middleware/auth');

router.get('/', auth, async (req,res)=>{
try{
const result = await db.query("SELECT * FROM books");
res.json(result.rows);
}catch(err){
console.log(err);
res.status(500).json({message:"Server error"});
}
});

router.get('/search', auth, async (req,res)=>{
const { query } = req.query;
try{
const result = await db.query(
  `SELECT * FROM books
   WHERE title ILIKE $1 OR author ILIKE $1 OR isbn ILIKE $1`,
  [`%${query}%`]
);
res.json(result.rows);
}catch(err){
console.log(err);
res.status(500).json({message:"Error searching books"});
}
});

router.post('/add', auth, async (req,res)=>{
const {title,author,isbn,publisher,year,category_id,total_copies} = req.body;
try{
await db.query(
`INSERT INTO books
(title,author,isbn,publisher,year,category_id,total_copies,available_copies)
VALUES($1,$2,$3,$4,$5,$6,$7,$8)`,
[title,author,isbn,publisher,year,category_id,total_copies,total_copies]
);
res.json({message:"Book added successfully"});
}catch(err){
console.log(err);
res.status(500).json({message:"Error adding book"});
}
});

router.delete('/:id', auth, async (req,res)=>{
try{
await db.query("DELETE FROM books WHERE book_id=$1",[req.params.id]);
res.json({message:"Book deleted"});
}catch(err){
console.log(err);
res.status(500).json({message:"Error deleting book"});
}
});

module.exports = router;