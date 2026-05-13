const mysql = require('mysql2');
const dotenv = require('dotenv');

dotenv.config();

// const db = mysql.createConnection({
//   host: mysql.railway.internal,
//   user:root ,
//   password: ePlxPYVuDivhunrdEeJWcIgmedarftom,
//   database: "railway"
// });

// db.connect((err) => {
//   if (err) {
//     console.error('Database connection failed:', err);
//     return;
//   }
//   console.log('MySQL Database Connected!');
// });

// module.exports = db;

// const db = mysql.createConnection({
//   host: process.env.DB_HOST,
//   user: process.env.DB_USER,
//   password: process.env.DB_PASSWORD,
//   database: process.env.DB_NAME
// });

const mysql = require("mysql2");

const db = mysql.createConnection({
  host: process.env.MYSQLHOST,
  user: process.env.MYSQLUSER,
  password: process.env.MYSQLPASSWORD,
  database: process.env.MYSQLDATABASE,
  port: process.env.MYSQLPORT
});

db.connect((err) => {
  if (err) {
    console.log("Database connection failed:", err);
    return;
  }
  console.log("MySQL connected");
});

module.exports = db;