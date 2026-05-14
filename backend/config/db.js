// const mysql = require('mysql2');
// const dotenv = require('dotenv');

// dotenv.config();

// const db = mysql.createConnection({
//   host: process.env.MYSQLHOST,
//   user: process.env.MYSQLUSER,
//   password: process.env.MYSQLPASSWORD,
//   database: process.env.MYSQLDATABASE,
//   port: process.env.MYSQLPORT
// });

// db.connect((err) => {
//   if (err) {
//     console.log("Database connection failed:", err);
//     return;
//   }
//   console.log("MySQL connected");
// });

// module.exports = db;
const { Pool } = require("pg");
require("dotenv").config();

const pool = new Pool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  port: process.env.DB_PORT,
  ssl: {
    rejectUnauthorized: false
  }
});

pool.connect((err) => {
  if (err) {
    console.log("Database connection failed:", err);
  } else {
    console.log("PostgreSQL connected");
  }
});

module.exports = pool;