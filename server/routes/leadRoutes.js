const express = require('express');
const router = express.Router();
const { getLeads, createLead, updateLead, deleteLead } = require('../controllers/leadController');
const { protect, authorize } = require('../middleware/authMiddleware');
const { ROLES } = require('../constants');

router.use(protect);

router.route('/')
  .get(getLeads)
  .post(authorize(ROLES.ADMIN, ROLES.TEACHER), createLead);

router.route('/:id')
  .put(authorize(ROLES.ADMIN, ROLES.TEACHER), updateLead)
  .delete(authorize(ROLES.ADMIN), deleteLead);

module.exports = router;
