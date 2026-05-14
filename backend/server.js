// const express = require('express');
// const cors = require('cors');
// const dotenv = require('dotenv');
// const db = require('./config/db');

// dotenv.config();

// const app = express();

// app.use(cors());
// app.use(express.json());

// const authRoutes = require('./routes/authRoutes');
// const bookRoutes = require('./routes/bookRoutes');
// const memberRoutes = require('./routes/memberRoutes');
// const issueRoutes = require('./routes/issueRoutes');
// const fineRoutes = require('./routes/fineRoutes');
// const reportRoutes = require('./routes/reportRoutes');

// app.use('/api/auth', authRoutes);
// app.use('/api/books', bookRoutes);
// app.use('/api/members', memberRoutes);
// app.use('/api/issues', issueRoutes);
// app.use('/api/fines', fineRoutes);
// app.use('/api/reports', reportRoutes);

// app.get('/', (req, res) => {
//   res.json({ message: 'Library Management System API Running!' });
// });

// const PORT = process.env.PORT || 5000;
// app.listen(PORT, () => {
//   console.log(`Server running on port ${PORT}`);
// });

const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const path = require('path');
const db = require('./config/db');
const path = require("path");


dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

// API Routes
const authRoutes = require('./routes/authRoutes');
const bookRoutes = require('./routes/bookRoutes');
const memberRoutes = require('./routes/memberRoutes');
const issueRoutes = require('./routes/issueRoutes');
const fineRoutes = require('./routes/fineRoutes');
const reportRoutes = require('./routes/reportRoutes');

app.use('/api/auth', authRoutes);
app.use('/api/books', bookRoutes);
app.use('/api/members', memberRoutes);
app.use('/api/issues', issueRoutes);
app.use('/api/fines', fineRoutes);
app.use('/api/reports', reportRoutes);
app.use(express.static(path.join(__dirname, "frontend/dist")));

app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "frontend/dist/index.html"));
});


// Serve frontend
app.use(express.static(path.join(__dirname, '../frontend/dist')));

app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../frontend/dist/index.html'));
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});