const express = require('express');
const router = express.Router();
const {
  getVehicles,
  createVehicle,
  updateVehicle,
  getRoutes,
  createRoute,
  addRouteStop,
  deleteRouteStop,
  assignStudentStop,
  allocateStudent,
  markBusAttendance,
  getBusAttendance,
  getDriversAndHelpers
} = require('../controllers/transportController');
const { protect, authorize } = require('../middleware/authMiddleware');

router.use(protect);

// 1. Vehicle Fleets
router.route('/vehicles')
  .get(getVehicles)
  .post(authorize('Admin'), createVehicle);

router.route('/vehicles/:id')
  .put(authorize('Admin'), updateVehicle);

// 2. Routes & Stops
router.route('/routes')
  .get(getRoutes)
  .post(authorize('Admin'), createRoute);

router.route('/routes/:id/stops')
  .post(addRouteStop);

router.route('/routes/:id/stops/:stopName')
  .delete(deleteRouteStop);

router.route('/routes/:id/students/:studentId/stop')
  .patch(assignStudentStop);

// 3. Allocations & Attendance
router.post('/allocate', authorize('Admin'), allocateStudent);
router.post('/attendance', markBusAttendance);
router.get('/attendance', getBusAttendance);

// 4. Utility
router.get('/staff', getDriversAndHelpers);

module.exports = router;
