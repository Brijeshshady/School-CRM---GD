const express = require('express');
const router = express.Router();
const upload = require('../middleware/uploadMiddleware');
const {
  getUsers,
  getTeachers,
  getStudents,
  getDashboard,
  getAnalytics,
  bulkImportUsers,
  updateAvatar,
  createUser,
  createClass,
  updateClass,
  deleteClass,
  updateUser,
  deleteUser,
  linkParentStudent,
  unlinkParentStudent,
  getParentStudentLinks,
  linkTeacherStudent,
  unlinkTeacherStudent,
  getTeacherStudentLinks,
  toggleTeacherTimetablePermission,
  getTimetableApprovals,
  approveTimetable,
  rejectTimetable
} = require('../controllers/adminController');
const { protect, authorize } = require('../middleware/authMiddleware');
const { ROLES } = require('../constants');

// All routes here are protected and restricted to Admin
router.use(protect);
router.use(authorize(ROLES.ADMIN, ROLES.SUPERADMIN));

router.route('/users')
  .get(getUsers)
  .post(createUser);

router.get('/teachers', getTeachers);
router.get('/students', getStudents);
router.get('/dashboard', getDashboard);
router.get('/analytics', getAnalytics);

router.post('/users/import', upload.single('file'), bulkImportUsers);
router.post('/users/:id/avatar', upload.single('avatar'), updateAvatar);

router.route('/classes')
  .post(createClass);

router.route('/classes/:id')
  .put(updateClass)
  .delete(deleteClass);



router.route('/users/:id')
  .put(updateUser)
  .delete(deleteUser);

// Parent-Student Linking
router.post('/link-parent-student', linkParentStudent);
router.delete('/unlink-parent-student', unlinkParentStudent);
router.get('/parent-student-links', getParentStudentLinks);

// Teacher-Student Linking
router.post('/link-teacher-student', linkTeacherStudent);
router.delete('/unlink-teacher-student', unlinkTeacherStudent);
router.get('/teacher-student-links', getTeacherStudentLinks);

// Timetable Management
router.patch('/teachers/:id/toggle-timetable-permission', toggleTeacherTimetablePermission);
router.get('/timetable-approvals', getTimetableApprovals);
router.patch('/timetable-approvals/:id/approve', approveTimetable);
router.patch('/timetable-approvals/:id/reject', rejectTimetable);

module.exports = router;
