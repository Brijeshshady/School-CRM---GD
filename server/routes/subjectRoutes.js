const express = require('express');
const router = express.Router();
const {
  getSubjects,
  getSubject,
  createSubject,
  updateSubject,
  deleteSubject
} = require('../controllers/subjectController');
const { protect, authorize } = require('../middleware/authMiddleware');
const { ROLES } = require('../constants');

// Public routes (authenticated)
router.use(protect);

router.route('/')
  .get(getSubjects)
  .post(authorize(ROLES.ADMIN, ROLES.SUPERADMIN), createSubject);

router.route('/:id')
  .get(getSubject)
  .put(authorize(ROLES.ADMIN, ROLES.SUPERADMIN), updateSubject)
  .delete(authorize(ROLES.ADMIN, ROLES.SUPERADMIN), deleteSubject);

module.exports = router;
