const Parent = require('../models/Parent');
const Student = require('../models/Student');
const Attendance = require('../models/Attendance');
const Grade = require('../models/Grade');
const Assignment = require('../models/Assignment');
const Announcement = require('../models/Announcement');
const Fee = require('../models/Fee');
const Schedule = require('../models/Schedule');
const asyncHandler = require('../middleware/asyncHandler');
const sendResponse = require('../utils/apiResponse');
const { HTTP_STATUS } = require('../constants');

// @desc    Get linked students for current parent
// @route   GET /api/parents/students
// @access  Private/Parent
exports.getLinkedStudents = asyncHandler(async (req, res) => {
  const parent = await Parent.findOne({ user: req.user._id })
    .populate({
      path: 'studentIds',
      populate: { path: 'user', select: 'name avatar' }
    });

  if (!parent) {
    res.status(HTTP_STATUS.NOT_FOUND);
    throw new Error('Parent profile not found');
  }

  sendResponse(res, HTTP_STATUS.OK, parent.studentIds, 'Linked students fetched successfully');
});

// @desc    Get data for a specific linked student
// @route   GET /api/parents/students/:studentId/data
// @access  Private/Parent
exports.getStudentData = asyncHandler(async (req, res) => {
  const { studentId } = req.params;

  // Verify this student is linked to the parent
  const parent = await Parent.findOne({ user: req.user._id });
  if (!parent || !parent.studentIds.some(id => id.toString() === studentId)) {
    res.status(HTTP_STATUS.FORBIDDEN);
    throw new Error('Not authorized to view this student data');
  }

  const studentProfile = await Student.findById(studentId)
    .populate('user', 'name email avatar')
    .populate('class', 'name section');
  
  if (!studentProfile) {
    res.status(HTTP_STATUS.NOT_FOUND);
    throw new Error('Student profile not found');
  }

  const studentId_ref = studentProfile._id;

  // 1. Fetch Attendance
  const attendance = await Attendance.find({ student: studentId_ref }).sort({ date: -1 });

  // 2. Fetch Grades
  const grades = await Grade.find({ student: studentId_ref }).populate('subject', 'name');
  
  // 3. Fetch Assignments for the student's class
  let assignments = [];
  if (studentProfile.class) {
    assignments = await Assignment.find({ class: studentProfile.class._id })
      .populate('subject', 'name')
      .populate({
        path: 'teacher',
        populate: { path: 'user', select: 'name' }
      })
      .sort({ dueDate: -1 });
  }

  // 4. Fetch Announcements (General or specific to their class)
  const announcements = await Announcement.find({
    isActive: true,
    $or: [
      { targetAudience: 'All' },
      { targetAudience: 'Parents' },
      { class: studentProfile.class?._id }
    ]
  }).sort({ createdAt: -1 });

  // 5. Fetch Fees
  const fees = await Fee.find({ student: studentId_ref }).sort({ dueDate: 1 });

  // 6. Fetch Schedule
  let schedule = [];
  if (studentProfile.class) {
    schedule = await Schedule.find({ class: studentProfile.class._id })
      .populate('periods.subject', 'name')
      .populate({
        path: 'periods.teacher',
        populate: { path: 'user', select: 'name' }
      });
  }

  sendResponse(res, HTTP_STATUS.OK, {
    student: studentProfile,
    attendance,
    grades,
    assignments,
    announcements,
    fees,
    schedule
  }, 'Student data fetched successfully');
});
