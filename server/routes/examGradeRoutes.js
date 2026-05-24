const express = require('express');
const router = express.Router();
const {
  getExamTypes,
  createExamType,
  updateExamType,
  deleteExamType,
  getExamGrades,
  upsertExamGrades,
  bulkImportExamGrades,
  getClassAnalytics,
  getStudentAnalytics,
  generateReportCard,
  publishReportCard,
  getReportCards
} = require('../controllers/examGradeController');
const { protect, authorize } = require('../middleware/authMiddleware');

// All routes are protected by default
router.use(protect);

// 1. Exam Type Routes
router.get('/exam-types', getExamTypes);
router.post('/exam-types', authorize('Admin'), createExamType);
router.put('/exam-types/:id', authorize('Admin'), updateExamType);
router.delete('/exam-types/:id', authorize('Admin'), deleteExamType);

// 2. Gradebook Entries Routes
router.get('/', getExamGrades);
router.post('/upsert', authorize('Teacher', 'Admin'), upsertExamGrades);
router.post('/bulk-import', authorize('Teacher', 'Admin'), bulkImportExamGrades);

// 3. Analytics & Ranking Routes
router.get('/class-analytics/:classId', getClassAnalytics);
router.get('/student-analytics/:studentId', getStudentAnalytics);

// 4. Report Card Routes
router.get('/report-cards', getReportCards);
router.post('/report-cards/generate', authorize('Teacher', 'Admin'), generateReportCard);
router.put('/report-cards/:id/publish', authorize('Teacher', 'Admin'), publishReportCard);

module.exports = router;
