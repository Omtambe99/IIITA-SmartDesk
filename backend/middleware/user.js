const jwt = require("jsonwebtoken");
const secretKey = process.env.JWT_SECRET || "dev_secret_for_local";

const Userauthenticate = (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader) {
    return res
      .status(401)
      .json({ message: "No token provided, authorization denied" });
  }
  // Support "Bearer <token>" format
  const token = authHeader.startsWith("Bearer ")
    ? authHeader.slice(7)
    : authHeader;

  try {
    const decoded = jwt.verify(token, secretKey);
    req.user = decoded; // Attach all user info to req.user
    next();
  } catch (err) {
    console.error("Authentication error:", err);
    res.status(401).json({ message: "Token is not valid" });
  }
};

module.exports = Userauthenticate;
