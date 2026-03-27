const { verifyAccessToken } = require("../services/authService");

const requireAuth = (req, _res, next) => {
  try {
    const authHeader = req.headers.authorization || "";

    if (!authHeader.startsWith("Bearer ")) {
      const error = new Error("Missing or invalid Authorization header");
      error.statusCode = 401;
      throw error;
    }

    const token = authHeader.slice(7);
    const payload = verifyAccessToken(token);
    req.auth = payload;

    return next();
  } catch (error) {
    if (!error.statusCode) {
      error.statusCode = 401;
      error.message = "Invalid or expired token";
    }
    return next(error);
  }
};

const authorizeRoles = (...allowedRoles) => (req, _res, next) => {
  const role = req.auth?.role;

  if (!role || !allowedRoles.includes(role)) {
    const error = new Error("You are not authorized to access this resource");
    error.statusCode = 403;
    return next(error);
  }

  return next();
};

module.exports = {
  requireAuth,
  authorizeRoles,
};
