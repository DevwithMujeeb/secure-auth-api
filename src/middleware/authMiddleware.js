const { verifyAccessToken } = require("../utils/tokenHelper");
const logger = require("../utils/logger");

// Verify JWT - who are you?
const protect = (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res
        .status(401)
        .json({ success: false, message: "No token provided" });
    }

    const token = authHeader.split(" ")[1];
    const decoded = verifyAccessToken(token);

    req.user = decoded;
    next();
  } catch (error) {
    logger.warn(`Invalid or expired access token: ${error.message}`);
    return res
      .status(401)
      .json({ success: false, message: "Invalid or expired token" });
  }
};

// Check role - are you allowed?
const authorize = (...roles) => {
  return (req, res, next) => {
    if (!req.user) {
      return res
        .status(401)
        .json({ success: false, message: "Not authenticated" });
    }

    if (!roles.includes(req.user.role)) {
      logger.warn(
        `Unauthorized access attempt by user ${req.user.id} with role ${req.user.role}`,
      );
      return res.status(403).json({
        success: false,
        message: `Access denied. Required role: ${roles.join(" or ")}`,
      });
    }

    next();
  };
};

module.exports = { protect, authorize };
