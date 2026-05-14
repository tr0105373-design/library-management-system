const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const db = require('./config/db');
const path = require("path");

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

/* ---------------- API ROUTES ---------------- */
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

/* ---------------- FRONTEND (VITE BUILD) ---------------- */

// correct Vite build path
const frontendPath = path.join(__dirname, 'frontend/dist');

app.use(express.static(frontendPath));

// IMPORTANT: React/Vite routing fix
app.get("/*", (req, res) => {
  res.sendFile(path.join(frontendPath, "index.html"));
});

/* ---------------- SERVER ---------------- */

const PORT = process.env.PORT || 10000;

app.listen(PORT, "0.0.0.0", () => {
  console.log(`Server running on port ${PORT}`);
});