const { HTTP_STATUS } = require('../constants');

/**
 * Attendance Validator
 * Validates attendance submission payloads.
 */
const validateAttendance = (req, res, next) => {
  const { classId, records } = req.body;

  if (!classId) {
    res.status(HTTP_STATUS.BAD_REQUEST);
    throw new Error('Please provide a classId');
  }

  if (!records || !Array.isArray(records) || records.length === 0) {
    res.status(HTTP_STATUS.BAD_REQUEST);
    throw new Error('Please provide an array of attendance records');
  }

  // Validate individual record structure
  const isValid = records.every(r => r.student && r.status);
  if (!isValid) {
    res.status(HTTP_STATUS.BAD_REQUEST);
    throw new Error('Each record must include student and status');
  }

  next();
};

module.exports = { validateAttendance };
