const Class = require('../models/Class');
const asyncHandler = require('../middleware/asyncHandler');
const sendResponse = require('../utils/apiResponse');
const APIFeatures = require('../utils/apiFeatures');
const { HTTP_STATUS } = require('../constants');

// @desc    Get all classes
// @route   GET /api/classes
// @access  Public
exports.getClasses = asyncHandler(async (req, res) => {
  const features = new APIFeatures(Class.find().populate({
    path: 'classTeacher',
    populate: { path: 'user', select: 'name' }
  }).populate({
    path: 'subjects',
    populate: { path: 'teacher', populate: { path: 'user', select: 'name' } }
  }), req.query)
    .filter()
    .sort()
    .limitFields()
    .paginate();

  const classes = await features.query;

  sendResponse(res, HTTP_STATUS.OK, classes, 'Classes retrieved successfully');
});

// @desc    Get single class
// @route   GET /api/classes/:id
// @access  Public
exports.getClass = asyncHandler(async (req, res) => {
  const classItem = await Class.findById(req.params.id).populate({
    path: 'classTeacher',
    populate: { path: 'user', select: 'name' }
  }).populate({
    path: 'subjects',
    populate: { path: 'teacher', populate: { path: 'user', select: 'name' } }
  });

  if (!classItem) {
    res.status(HTTP_STATUS.NOT_FOUND);
    throw new Error('Class not found');
  }

  sendResponse(res, HTTP_STATUS.OK, classItem);
});
