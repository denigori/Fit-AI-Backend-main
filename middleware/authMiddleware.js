const jwt = require("jsonwebtoken");

// Store blacklisted tokens (temporary in-memory solution)
const tokenBlacklist = new Set();

const authMiddleware = (req, res, next) => {
  try {
    const authHeader = req.header("Authorization");

    if (!authHeader) {
      console.log("🚨 No Authorization header received.");
      return res.status(401).json({ message: "Unauthorized: No token provided" });
    }

    console.log("🔑 Received Authorization Header:", authHeader);

    // Extract the token from "Bearer <token>"
    const token = authHeader.startsWith("Bearer ") ? authHeader.split(" ")[1] : authHeader;

    if (!token) {
      console.log("🚨 Invalid Authorization header format.");
      return res.status(401).json({ message: "Unauthorized: Invalid token format" });
    }

    // Check if the token is blacklisted (Logged out user)
    if (tokenBlacklist.has(token)) {
      console.log("🚨 Token is blacklisted. User logged out.");
      return res.status(401).json({ message: "Unauthorized: Token has been revoked" });
    }

    // Verify the token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    console.log("✅ Token Decoded Successfully:", decoded);

    // Attach decoded payload to req.user
    req.user = decoded;
    next();
  } catch (error) {
    if (error.name === "TokenExpiredError") {
      console.log("🚨 Token has expired.");
      return res.status(401).json({ message: "Unauthorized: Token has expired" });
    }

    console.log("🚨 Token verification failed:", error.message);
    return res.status(401).json({ message: "Unauthorized: Invalid Token", error: error.message });
  }
};

// Attach the blacklistToken function as a property on authMiddleware
authMiddleware.blacklistToken = (token) => {
  tokenBlacklist.add(token);
};

module.exports = authMiddleware;
