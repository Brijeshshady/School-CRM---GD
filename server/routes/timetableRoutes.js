const express = require('express');
const router = express.Router();
const {
  uploadTimetable,
  getApprovedTimetable,
  checkUploadPermission,
  getDateSchedule,
  assignSubstitute
} = require('../controllers/timetableController');
const { protect, authorize } = require('../middleware/authMiddleware');
const { ROLES } = require('../constants');

router.use(protect);

router.post('/upload', authorize(ROLES.TEACHER, ROLES.ADMIN, ROLES.SUPERADMIN), uploadTimetable);
router.get('/check-permission', authorize(ROLES.TEACHER), checkUploadPermission);
router.get('/class/:classId', getApprovedTimetable);
router.get('/date-schedule', getDateSchedule);
router.post('/substitute', authorize(ROLES.ADMIN, ROLES.SUPERADMIN), assignSubstitute);

module.exports = router;
