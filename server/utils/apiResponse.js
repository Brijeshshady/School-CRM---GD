/**
 * Standardized API response helper to ensure consistent format.
 * Format: { success, data, message, meta }
 */
const sendResponse = (res, statusCode, data, message = 'Success', meta = null) => {
  return res.status(statusCode).json({
    success: true,
    message,
    data,
    meta,
  });
};

module.exports = sendResponse;
