const jwt = require("jsonwebtoken");

const professorauthenticate = (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader) {
    return res.status(401).json({ msg: "Access denied. No token provided." });
  }
  const token = authHeader.startsWith("Bearer ")
    ? authHeader.slice(7)
    : authHeader;

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    if (!decoded.role || decoded.role.toLowerCase() !== "professor") {
      return res
        .status(403)
        .json({ msg: "Access denied. User is not a professor." });
    }
    req.user = decoded;
    next();
  } catch (error) {
    console.error(error);
    res.status(400).json({ msg: "Invalid token" });
  }
};

module.exports = professorauthenticate;
