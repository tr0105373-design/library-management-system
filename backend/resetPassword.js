const bcrypt = require("bcryptjs");
const db = require("./config/db");

(async () => {
  const hash = await bcrypt.hash("123456", 10);

  db.query(
    "UPDATE users SET password = $1",
    [hash],
    (err) => {
      if (err) {
        console.log("Error:", err);
      } else {
        console.log("Password updated ✔");
      }
      process.exit();
    }
  );
})();