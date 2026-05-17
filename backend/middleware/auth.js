const jwt = require("jsonwebtoken");

module.exports = function(req, res, next) {

  console.log("👉 AUTH MIDDLEWARE HIT");

  const authHeader = req.headers.authorization;
  console.log("👉 AUTH HEADER:", authHeader);

  if (!authHeader) {
    console.log("❌ NO TOKEN FOUND");
    return res.status(401).json({ message: "No token" });
  }

  const token = authHeader.split(" ")[1];
  console.log("👉 TOKEN EXTRACTED:", token);

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    console.log("✅ TOKEN VERIFIED:", decoded);

    req.user = decoded;
    next();

  } catch (err) {
    console.log("❌ TOKEN INVALID:", err.message);

    return res.status(401).json({ message: "Invalid token" });
  }
};