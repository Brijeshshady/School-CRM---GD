const express = require('express');
const router = express.Router();
const {
  uploadTimetable,
  getApprovedTimetable,
  checkUploadPermission
} = require('../controllers/timetableController');
const { protect, authorize } = require('../middleware/authMiddleware');
const { ROLES } = require('../constants');

router.use(protect);

router.post('/upload', authorize(ROLES.TEACHER, ROLES.ADMIN, ROLES.SUPERADMIN), uploadTimetable);
router.get('/check-permission', authorize(ROLES.TEACHER), checkUploadPermission);
router.get('/class/:classId', getApprovedTimetable);

module.exports = router;
