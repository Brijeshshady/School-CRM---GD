const Timetable = require('../models/Timetable');
const Teacher = require('../models/Teacher');
const Student = require('../models/Student');
const asyncHandler = require('../middleware/asyncHandler');
const sendResponse = require('../utils/apiResponse');
const { HTTP_STATUS } = require('../constants');

// @desc    Upload timetable for approval
// @route   POST /api/timetables/upload
// @access  Private/Teacher
exports.uploadTimetable = asyncHandler(async (req, res) => {
  const { classId, section, rows } = req.body;

  if (!classId || !section || !rows || !rows.length) {
    res.status(HTTP_STATUS.BAD_REQUEST);
    throw new Error('Missing required fields or empty timetable');
  }

  // Check if teacher has permission
  const teacher = await Teacher.findOne({ user: req.user._id });
  if (!teacher || !teacher.canUploadTimetable) {
    res.status(HTTP_STATUS.FORBIDDEN);
    throw new Error('You do not have permission to upload timetables');
  }

  const timetable = await Timetable.create({
    class: classId,
    section,
    uploadedBy: req.user._id,
    rows,
    status: 'Pending'
  });

  sendResponse(res, HTTP_STATUS.CREATED, timetable, 'Timetable submitted for approval');
});

// @desc    Get approved timetable for a class
// @route   GET /api/timetables/class/:classId
// @access  Private
exports.getApprovedTimetable = asyncHandler(async (req, res) => {
  const { classId } = req.params;
  const { section } = req.query;

  const query = { 
    class: classId, 
    status: 'Approved' 
  };
  
  if (section) query.section = section;

  const timetable = await Timetable.findOne(query)
    .sort({ approvedAt: -1 });

  if (!timetable) {
    return sendResponse(res, HTTP_STATUS.OK, null, 'No approved timetable found for this class');
  }

  sendResponse(res, HTTP_STATUS.OK, timetable, 'Approved timetable fetched successfully');
});

// @desc    Check if teacher can upload
// @route   GET /api/timetables/check-permission
// @access  Private/Teacher
exports.checkUploadPermission = asyncHandler(async (req, res) => {
  const teacher = await Teacher.findOne({ user: req.user._id });
  sendResponse(res, HTTP_STATUS.OK, { canUpload: !!teacher?.canUploadTimetable }, 'Permission status fetched');
});
