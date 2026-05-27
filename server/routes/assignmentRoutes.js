const express = require('express');
const router = express.Router();
const {
  getAssignments,
  getAssignment,
  submitAssignment,
  getSubmissions,
  gradeSubmission,
  getMySubmission,
} = require('../controllers/assignmentController');
const { protect, authorize } = require('../middleware/authMiddleware');
const { ROLES } = require('../constants');

router.use(protect);

router.get('/', getAssignments);
router.get('/:id', getAssignment);

// Student submits homework
router.post('/:id/submit', authorize(ROLES.STUDENT), submitAssignment);

// Student checks own submission status
router.get('/:id/my-submission', authorize(ROLES.STUDENT), getMySubmission);

// Teacher/Admin views all submissions for an assignment
router.get('/:id/submissions', authorize(ROLES.TEACHER, ROLES.ADMIN), getSubmissions);

// Teacher/Admin grades a specific submission
router.patch('/submissions/:submissionId/grade', authorize(ROLES.TEACHER, ROLES.ADMIN), gradeSubmission);

module.exports = router;

