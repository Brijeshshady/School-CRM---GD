const express = require('express');
const router = express.Router();
const { getExpenses, createExpense, getFinancialStatement } = require('../controllers/financeController');
const { protect, authorize } = require('../middleware/authMiddleware');
const { ROLES } = require('../constants');

router.use(protect);
router.use(authorize(ROLES.ADMIN));

router.route('/expenses')
  .get(getExpenses)
  .post(createExpense);

router.route('/statement')
  .get(getFinancialStatement);

module.exports = router;
