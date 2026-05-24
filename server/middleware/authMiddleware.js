const jwt = require('jsonwebtoken');
const asyncHandler = require('./asyncHandler');
const User = require('../models/User');
const { HTTP_STATUS } = require('../constants');

/**
 * Protect middleware to ensure only logged-in users can access routes.
 * Verifies the JWT token and attaches the user to the request object.
 */
const protect = asyncHandler(async (req, res, next) => {
  let token;

  // Check for token in Authorization header
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    token = req.headers.authorization.split(' ')[1];
  }

  // Ensure token exists
  if (!token) {
    res.status(HTTP_STATUS.UNAUTHORIZED);
    throw new Error('Not authorized to access this route');
  }

  try {
    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Attach user to request (excluding password)
    req.user = await User.findById(decoded.id);

    if (!req.user || !req.user.isActive) {
      res.status(HTTP_STATUS.UNAUTHORIZED);
      throw new Error('User not found or account is inactive');
    }

    next();
  } catch (err) {
    res.status(HTTP_STATUS.UNAUTHORIZED);
    throw new Error('Not authorized to access this route');
  }
});

/**
 * Authorize middleware to restrict access to specific roles.
 */
const authorize = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      res.status(HTTP_STATUS.FORBIDDEN);
      throw new Error(`User role ${req.user.role} is not authorized to access this route`);
    }
    next();
  };
};

module.exports = { protect, authorize };
