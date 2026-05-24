const asyncHandler = require('../middleware/asyncHandler');
const sendResponse = require('../utils/apiResponse');
const teacherService = require('../services/teacherService');
const dashboardService = require('../services/dashboardService');
const attendanceService = require('../services/attendanceService');
const assignmentService = require('../services/assignmentService');
const { HTTP_STATUS } = require('../constants');
const { createAndSendNotification } = require('../sockets/notificationSocket');
const Student = require('../models/Student');
const mongoose = require('mongoose');

// @desc    Get teacher dashboard stats
// @route   GET /api/teachers/dashboard
// @access  Private/Teacher
exports.getDashboard = asyncHandler(async (req, res) => {
  const stats = await dashboardService.getTeacherStats(req.user.id);
  sendResponse(res, HTTP_STATUS.OK, stats, 'Dashboard data retrieved successfully');
});

// @desc    Get teacher assigned classes
// @route   GET /api/teachers/classes
// @access  Private/Teacher
exports.getClasses = asyncHandler(async (req, res) => {
  const classes = await teacherService.getAssignedClasses(req.user.id);
  sendResponse(res, HTTP_STATUS.OK, classes);
});

// @desc    Submit class attendance
// @route   POST /api/teachers/attendance
// @access  Private/Teacher
exports.submitAttendance = asyncHandler(async (req, res) => {
  const { classId, records } = req.body;
  const attendance = await attendanceService.submitAttendance(req.user.id, classId, records);

  // Send notifications for each student record
  try {
    for (const record of records) {
      const student = await Student.findById(record.student).populate('user');
      if (student && student.user) {
        // Notify student of attendance marked
        await createAndSendNotification({
          userId: student.user._id,
          type: 'attendance',
          title: 'Attendance Marked',
          message: `You have been marked ${record.status} for today.`,
          actionUrl: '/student/attendance',
          relatedId: student._id
        });
        
        // If absent, send warning to parents
        if (record.status?.toLowerCase() === 'absent' && student.parentIds && student.parentIds.length > 0) {
          for (const parent of student.parentIds) {
            const parentUser = await mongoose.model('Parent').findById(parent).populate('user');
            if (parentUser && parentUser.user) {
              await createAndSendNotification({
                userId: parentUser.user._id,
                type: 'attendance',
                title: 'Attendance Warning',
                message: `Your child ${student.user.name} was marked absent today.`,
                actionUrl: '/parent/attendance',
                relatedId: student._id
              });
            }
          }
        }
      }
    }
  } catch (err) {
    console.error('Error generating attendance notifications:', err);
  }

  sendResponse(res, HTTP_STATUS.CREATED, attendance, 'Attendance submitted successfully');
});

// @desc    Create new assignment
// @route   POST /api/teachers/assignments
// @access  Private/Teacher
exports.createAssignment = asyncHandler(async (req, res) => {
  const assignment = await assignmentService.createAssignment(req.user.id, req.body);

  // Notify all students in this class
  try {
    const students = await Student.find({ class: req.body.class }).populate('user');
    for (const student of students) {
      if (student.user) {
        await createAndSendNotification({
          userId: student.user._id,
          type: 'assignment',
          title: 'New Assignment Created',
          message: `Your teacher created a new assignment: ${assignment.title}`,
          actionUrl: '/student/assignments',
          relatedId: assignment._id
        });
      }
    }
  } catch (err) {
    console.error('Error generating assignment notifications:', err);
  }

  sendResponse(res, HTTP_STATUS.CREATED, assignment, 'Assignment created successfully');
});

// @desc    Get teacher created assignments
// @route   GET /api/teachers/assignments
// @access  Private/Teacher
exports.getAssignments = asyncHandler(async (req, res) => {
  const assignments = await assignmentService.getTeacherAssignments(req.user.id);
  sendResponse(res, HTTP_STATUS.OK, assignments);
});
// @desc    Get teacher assigned subjects
// @route   GET /api/teachers/subjects
// @access  Private/Teacher
exports.getSubjects = asyncHandler(async (req, res) => {
  const subjects = await teacherService.getSubjects(req.user.id);
  sendResponse(res, HTTP_STATUS.OK, subjects);
});
