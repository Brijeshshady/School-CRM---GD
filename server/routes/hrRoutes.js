const express = require('express');
const router = express.Router();
const { getPayroll, createPayroll, getReviews, createReview } = require('../controllers/hrController');
const { protect, authorize } = require('../middleware/authMiddleware');
const { ROLES } = require('../constants');

router.use(protect);
router.use(authorize(ROLES.ADMIN));

router.route('/payroll')
  .get(getPayroll)
  .post(createPayroll);

router.route('/reviews')
  .get(getReviews)
  .post(createReview);

module.exports = router;
