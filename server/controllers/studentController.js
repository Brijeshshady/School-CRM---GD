const asyncHandler = require('../middleware/asyncHandler');
const sendResponse = require('../utils/apiResponse');
const studentService = require('../services/studentService');
const dashboardService = require('../services/dashboardService');
const { HTTP_STATUS } = require('../constants');

// @desc    Get student dashboard stats
// @route   GET /api/students/dashboard
// @access  Private/Student
exports.getDashboard = asyncHandler(async (req, res) => {
  const stats = await dashboardService.getStudentStats(req.user.id);
  sendResponse(res, HTTP_STATUS.OK, stats, 'Dashboard data retrieved successfully');
});

// @desc    Get student profile
// @route   GET /api/students/profile
// @access  Private/Student
exports.getProfile = asyncHandler(async (req, res) => {
  const profile = await studentService.getProfile(req.user.id);
  sendResponse(res, HTTP_STATUS.OK, profile);
});

// @desc    Get student grades
// @route   GET /api/students/grades
// @access  Private/Student
exports.getGrades = asyncHandler(async (req, res) => {
  const grades = await studentService.getGrades(req.user.id);
  sendResponse(res, HTTP_STATUS.OK, grades);
});

// @desc    Get student attendance
// @route   GET /api/students/attendance
// @access  Private/Student
exports.getAttendance = asyncHandler(async (req, res) => {
  const attendance = await studentService.getAttendance(req.user.id);
  sendResponse(res, HTTP_STATUS.OK, attendance);
});

// @desc    Get student assignments
// @route   GET /api/students/assignments
// @access  Private/Student
exports.getAssignments = asyncHandler(async (req, res) => {
  const assignments = await studentService.getAssignments(req.user.id);
  sendResponse(res, HTTP_STATUS.OK, assignments);
});

// @desc    Get student schedule
// @route   GET /api/students/schedule
// @access  Private/Student
exports.getSchedule = asyncHandler(async (req, res) => {
  const schedule = await studentService.getSchedule(req.user.id);
  sendResponse(res, HTTP_STATUS.OK, schedule);
});

// @desc    Get student assigned teachers
// @route   GET /api/students/teachers
// @access  Private/Student
exports.getAssignedTeachers = asyncHandler(async (req, res) => {
  const teachers = await studentService.getAssignedTeachers(req.user.id);
  sendResponse(res, HTTP_STATUS.OK, teachers);
});

// @desc    Get all students (for teachers/admins)
// @route   GET /api/students
// @access  Private/Teacher,Admin
exports.getAllStudents = asyncHandler(async (req, res) => {
  const query = { ...req.query };
  
  // If user is a teacher, restrict to their assigned students
  if (req.user.role === 'Teacher') {
    const Teacher = require('../models/Teacher');
    const teacher = await Teacher.findOne({ user: req.user._id });
    if (teacher) {
      query.teacherId = teacher._id;
    }
  }

  const students = await studentService.getAllStudents(query);
  sendResponse(res, HTTP_STATUS.OK, students);
});
