const Subject = require('../models/Subject');
const Class = require('../models/Class');
const Teacher = require('../models/Teacher');
const asyncHandler = require('../middleware/asyncHandler');
const sendResponse = require('../utils/apiResponse');
const { HTTP_STATUS } = require('../constants');

// @desc    Get all subjects
// @route   GET /api/subjects
// @access  Public (or restricted based on requirement)
exports.getSubjects = asyncHandler(async (req, res) => {
  const subjects = await Subject.find({})
    .populate('teacher', 'user department')
    .populate({
      path: 'teacher',
      populate: { path: 'user', select: 'name email' }
    })
    .populate('class', 'name section')
    .sort({ createdAt: -1 });

  sendResponse(res, HTTP_STATUS.OK, subjects, 'Subjects fetched successfully');
});

// @desc    Get single subject
// @route   GET /api/subjects/:id
// @access  Public
exports.getSubject = asyncHandler(async (req, res) => {
  const subject = await Subject.findById(req.params.id)
    .populate('teacher', 'user department')
    .populate({
      path: 'teacher',
      populate: { path: 'user', select: 'name email' }
    })
    .populate('class', 'name section');

  if (!subject) {
    res.status(HTTP_STATUS.NOT_FOUND);
    throw new Error('Subject not found');
  }

  sendResponse(res, HTTP_STATUS.OK, subject);
});

// @desc    Create a new subject
// @route   POST /api/admin/subjects
// @access  Private/Admin
exports.createSubject = asyncHandler(async (req, res) => {
  const subject = await Subject.create(req.body);

  // If class is provided, add subject to class's subjects array
  if (req.body.class) {
    await Class.findByIdAndUpdate(req.body.class, {
      $addToSet: { subjects: subject._id }
    });
  }

  sendResponse(res, HTTP_STATUS.CREATED, subject, 'Subject created successfully');
});

// @desc    Update subject
// @route   PUT /api/admin/subjects/:id
// @access  Private/Admin
exports.updateSubject = asyncHandler(async (req, res) => {
  const oldSubject = await Subject.findById(req.params.id);
  if (!oldSubject) {
    res.status(HTTP_STATUS.NOT_FOUND);
    throw new Error('Subject not found');
  }

  const subject = await Subject.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });

  // Handle class relationship update
  if (req.body.class && req.body.class !== oldSubject.class?.toString()) {
    // Remove from old class
    if (oldSubject.class) {
      await Class.findByIdAndUpdate(oldSubject.class, {
        $pull: { subjects: subject._id }
      });
    }
    // Add to new class
    await Class.findByIdAndUpdate(req.body.class, {
      $addToSet: { subjects: subject._id }
    });
  }

  sendResponse(res, HTTP_STATUS.OK, subject, 'Subject updated successfully');
});

// @desc    Delete subject
// @route   DELETE /api/admin/subjects/:id
// @access  Private/Admin
exports.deleteSubject = asyncHandler(async (req, res) => {
  const subject = await Subject.findById(req.params.id);

  if (!subject) {
    res.status(HTTP_STATUS.NOT_FOUND);
    throw new Error('Subject not found');
  }

  // Remove from class if linked
  if (subject.class) {
    await Class.findByIdAndUpdate(subject.class, {
      $pull: { subjects: subject._id }
    });
  }

  await subject.deleteOne();

  sendResponse(res, HTTP_STATUS.OK, null, 'Subject deleted successfully');
});
