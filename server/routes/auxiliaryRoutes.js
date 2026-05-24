const express = require('express');
const router = express.Router();
const { 
  getLibraryItems, 
  addLibraryItem, 
  issueLibraryBook,
  getHostelRooms,
  allocateHostelRoom,
  getVehicleRoutes,
  allocateTransport
} = require('../controllers/auxiliaryController');
const { protect, authorize } = require('../middleware/authMiddleware');
const { ROLES } = require('../constants');

router.use(protect);

router.route('/library')
  .get(getLibraryItems)
  .post(authorize(ROLES.ADMIN), addLibraryItem);

router.route('/library/issue')
  .post(authorize(ROLES.ADMIN), issueLibraryBook);

router.route('/hostel')
  .get(getHostelRooms)
  .post(authorize(ROLES.ADMIN), allocateHostelRoom);

router.route('/transport')
  .get(getVehicleRoutes)
  .post(authorize(ROLES.ADMIN), allocateTransport);

module.exports = router;
