const express = require('express');
const router = express.Router();
const { getLeaves, applyForLeave, updateLeaveStatus } = require('../controllers/leaveController');
const { protect, authorize } = require('../middleware/authMiddleware');
const { ROLES } = require('../constants');

router.use(protect);

router.route('/')
  .get(getLeaves)
  .post(authorize(ROLES.TEACHER, ROLES.STAFF), applyForLeave);

router.route('/:id/status')
  .patch(authorize(ROLES.ADMIN), updateLeaveStatus);

module.exports = router;
