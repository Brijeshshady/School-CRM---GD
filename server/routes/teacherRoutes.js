const express = require('express');
const router = express.Router();
const { 
  getDashboard, 
  getClasses, 
  submitAttendance, 
  createAssignment, 
  getAssignments,
  getSubjects 
} = require('../controllers/teacherController');
const { protect, authorize } = require('../middleware/authMiddleware');
const { ROLES } = require('../constants');
const { validateAssignment } = require('../validators/assignmentValidator');
const { validateAttendance } = require('../validators/attendanceValidator');

// All teacher routes are protected and restricted strictly to Teachers
router.use(protect);
router.use(authorize(ROLES.TEACHER));

router.get('/dashboard', getDashboard);
router.get('/classes', getClasses);
router.get('/assignments', getAssignments);
router.get('/subjects', getSubjects);

router.post('/attendance', validateAttendance, submitAttendance);
router.post('/assignments', validateAssignment, createAssignment);

module.exports = router;
