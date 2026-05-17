const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const path = require("path");

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

/* API ROUTES */

app.use("/api/auth", require("./routes/authRoutes"));
app.use("/api/books", require("./routes/bookRoutes"));
app.use("/api/members", require("./routes/memberRoutes"));
app.use("/api/issues", require("./routes/issueRoutes"));
app.use("/api/fines", require("./routes/fineRoutes"));
app.use("/api/reports", require("./routes/reportRoutes"));

/* FRONTEND */

const frontendPath = path.join(__dirname, "../frontend/dist");

app.use(express.static(frontendPath));

/* React Router fallback */
app.get(/.*/, (req, res) => {
  res.sendFile(path.join(frontendPath, "index.html"));
});

/* SERVER */

const PORT = process.env.PORT || 5000;

app.listen(PORT, "0.0.0.0", () => {
  console.log("Server running on port", PORT);
});