const { HTTP_STATUS } = require('../constants');

/**
 * Assignment Validator
 * Validates assignment creation payloads.
 */
const validateAssignment = (req, res, next) => {
  const { title, description, subject, class: classId, dueDate } = req.body;

  if (!title || !description || !subject || !classId || !dueDate) {
    res.status(HTTP_STATUS.BAD_REQUEST);
    throw new Error('Please provide all required assignment fields (title, description, subject, class, dueDate)');
  }

  next();
};

module.exports = { validateAssignment };
