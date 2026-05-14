require("dotenv").config();
const { Pool } = require("pg");
const bcrypt = require("bcryptjs");

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false }
});

(async () => {
  const users = [
    { email: "admin@gmail.com", pass: "admin123" },
    { email: "librarian@gmail.com", pass: "lib123" },
    { email: "student@gmail.com", pass: "stu123" }
  ];

  for (let u of users) {
    const hash = await bcrypt.hash(u.pass, 10);

    await pool.query(
      "UPDATE users SET password=$1 WHERE email=$2",
      [hash, u.email]
    );

    console.log(`Updated: ${u.email}`);
  }

  process.exit();
})();