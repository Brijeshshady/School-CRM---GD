/**
 * Async handler to wrap controller functions and catch errors.
 * This eliminates the need for repeated try/catch blocks.
 */
const asyncHandler = (fn) => (req, res, next) => {
  Promise.resolve(fn(req, res, next)).catch(next);
};

module.exports = asyncHandler;
