const jwt = require("jsonwebtoken");

module.exports = (req, res, next) => {
  const token = req.headers.authorization?.split(" ")[1];
  if (!token) return res.status(401).json({ message: "No token" });

  /**
   * Verifies a JWT token and decodes its payload
   * @param {string} token - The JWT token to verify
   * @param {string} process.env.JWT_SECRET - The secret key for JWT verification
   * @returns {Object} decoded - The decoded JWT payload containing user information
   * @throws {Error} Throws an error if the token is invalid or expired
   */
  const decoded = jwt.verify(token, process.env.JWT_SECRET);
  req.user = decoded;
  next();
};
