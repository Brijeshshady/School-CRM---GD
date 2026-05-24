const express = require('express');
const router = express.Router();
const { getMyTickets, createTicket, addMessage, updateTicket, deleteTicket } = require('../controllers/ticketController');
const { protect, authorize } = require('../middleware/authMiddleware');
const { ROLES } = require('../constants');

router.use(protect);

router.route('/')
  .get(getMyTickets)
  .post(createTicket);

router.route('/:id/messages')
  .post(addMessage);

// Restricted to Admin
router.use(authorize(ROLES.ADMIN, ROLES.SUPERADMIN));

router.route('/:id')
  .put(updateTicket)
  .delete(deleteTicket);

module.exports = router;
