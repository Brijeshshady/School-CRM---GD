const express = require('express');
const router = express.Router();
const { getVisitors, createVisitor, checkoutVisitor } = require('../controllers/visitorController');
const { protect, authorize } = require('../middleware/authMiddleware');
const { ROLES } = require('../constants');

router.use(protect);
router.use(authorize(ROLES.ADMIN));

router.route('/')
  .get(getVisitors)
  .post(createVisitor);

router.route('/:id/checkout')
  .put(checkoutVisitor);

module.exports = router;
