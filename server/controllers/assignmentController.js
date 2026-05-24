const Assignment = require('../models/Assignment');
const asyncHandler = require('../middleware/asyncHandler');
const sendResponse = require('../utils/apiResponse');
const APIFeatures = require('../utils/apiFeatures');
const { HTTP_STATUS } = require('../constants');

// @desc    Get all assignments
// @route   GET /api/assignments
// @access  Public
exports.getAssignments = asyncHandler(async (req, res) => {
  const features = new APIFeatures(Assignment.find().populate('subject', 'name').populate({
    path: 'teacher',
    populate: { path: 'user', select: 'name' }
  }), req.query)
    .filter()
    .sort()
    .limitFields()
    .paginate();

  const assignments = await features.query;

  sendResponse(res, HTTP_STATUS.OK, assignments, 'Assignments retrieved successfully');
});

// @desc    Get single assignment
// @route   GET /api/assignments/:id
// @access  Public
exports.getAssignment = asyncHandler(async (req, res) => {
  const assignment = await Assignment.findById(req.params.id)
    .populate('subject')
    .populate({
      path: 'teacher',
      populate: { path: 'user', select: 'name avatar' }
    })
    .populate('class');

  if (!assignment) {
    res.status(HTTP_STATUS.NOT_FOUND);
    throw new Error('Assignment not found');
  }

  sendResponse(res, HTTP_STATUS.OK, assignment);
});
