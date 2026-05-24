const express = require('express');
const router = express.Router();
const { 
  getDashboard, 
  getProfile, 
  getGrades, 
  getAttendance, 
  getAssignments,
  getAssignedTeachers
} = require('../controllers/studentController');
const { protect, authorize } = require('../middleware/authMiddleware');
const { ROLES } = require('../constants');

// All student routes are protected
router.use(protect);

// Allow Teachers and Admins to list students (required for attendance/grading)
router.get('/', authorize(ROLES.TEACHER, ROLES.ADMIN), (req, res, next) => {
  const { getAllStudents } = require('../controllers/studentController');
  getAllStudents(req, res, next);
});

// Student personal routes restricted strictly to Students
router.use(authorize(ROLES.STUDENT));

router.get('/dashboard', getDashboard);
router.get('/profile', getProfile);
router.get('/grades', getGrades);
router.get('/attendance', getAttendance);
router.get('/assignments', getAssignments);
router.get('/teachers', getAssignedTeachers);
router.get('/schedule', (req, res, next) => {
  const { getSchedule } = require('../controllers/studentController');
  getSchedule(req, res, next);
});

module.exports = router;
