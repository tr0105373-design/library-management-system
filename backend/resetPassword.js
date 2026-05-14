const db = require('./config/db');

db.query("UPDATE users SET password = '123456'", (err, result) => {
  if (err) {
    console.log("Error:", err);
  } else {
    console.log("Passwords updated successfully ✔");
  }

  process.exit();
});