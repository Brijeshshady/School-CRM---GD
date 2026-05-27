const Vehicle = require('../models/Vehicle');
const VehicleRoute = require('../models/VehicleRoute');
const BusAttendance = require('../models/BusAttendance');
const DriverProfile = require('../models/DriverProfile');
const Student = require('../models/Student');
const User = require('../models/User');
const asyncHandler = require('../middleware/asyncHandler');
const { HTTP_STATUS } = require('../constants');

// ==========================================
// 1. VEHICLE MANAGEMENT
// ==========================================

exports.getVehicles = asyncHandler(async (req, res) => {
  const vehicles = await Vehicle.find({})
    .populate('driver', 'name email')
    .populate('assistant', 'name email');
  res.status(HTTP_STATUS.OK).json({ success: true, data: vehicles });
});

exports.createVehicle = asyncHandler(async (req, res) => {
  const { vehicleNumber, capacity, model, driverId, assistantId } = req.body;
  if (!vehicleNumber || !capacity) {
    return res.status(HTTP_STATUS.BAD_REQUEST).json({ success: false, message: 'Vehicle number and capacity are required' });
  }

  const exists = await Vehicle.findOne({ vehicleNumber });
  if (exists) {
    return res.status(HTTP_STATUS.BAD_REQUEST).json({ success: false, message: 'Vehicle number already exists' });
  }

  const vehicle = await Vehicle.create({
    vehicleNumber,
    capacity,
    model,
    driver: driverId || null,
    assistant: assistantId || null,
  });

  res.status(HTTP_STATUS.CREATED).json({ success: true, data: vehicle });
});

exports.updateVehicle = asyncHandler(async (req, res) => {
  const { capacity, model, status, driverId, assistantId } = req.body;
  const vehicle = await Vehicle.findById(req.params.id);
  if (!vehicle) {
    return res.status(HTTP_STATUS.NOT_FOUND).json({ success: false, message: 'Vehicle not found' });
  }

  if (capacity) vehicle.capacity = capacity;
  if (model) vehicle.model = model;
  if (status) vehicle.status = status;
  if (driverId !== undefined) vehicle.driver = driverId || null;
  if (assistantId !== undefined) vehicle.assistant = assistantId || null;

  await vehicle.save();
  const populated = await Vehicle.findById(vehicle._id)
    .populate('driver', 'name email')
    .populate('assistant', 'name email');

  res.status(HTTP_STATUS.OK).json({ success: true, data: populated });
});

// ==========================================
// 2. ROUTE & STOPS MANAGEMENT
// ==========================================

exports.getRoutes = asyncHandler(async (req, res) => {
  const query = {};
  
  // If user is a driver, restrict to their assigned route
  if (req.user.role === 'Driver') {
    query.$or = [{ driver: req.user._id }, { assistant: req.user._id }];
  }

  const routes = await VehicleRoute.find(query)
    .populate('vehicle')
    .populate('driver', 'name email')
    .populate('assistant', 'name email')
    .populate({
      path: 'studentsAllocated.student',
      populate: { path: 'user', select: 'name email avatar' }
    });

  res.status(HTTP_STATUS.OK).json({ success: true, data: routes });
});

exports.createRoute = asyncHandler(async (req, res) => {
  const { routeName, routeNumber, vehicleNumber, vehicleId, driverId, assistantId, stops } = req.body;
  if (!routeName || !routeNumber || !vehicleNumber) {
    return res.status(HTTP_STATUS.BAD_REQUEST).json({ success: false, message: 'Route Name, Route Number, and Vehicle Number are required' });
  }

  const exists = await VehicleRoute.findOne({ routeNumber });
  if (exists) {
    return res.status(HTTP_STATUS.BAD_REQUEST).json({ success: false, message: 'Route number already exists' });
  }

  const route = await VehicleRoute.create({
    routeName,
    routeNumber,
    vehicleNumber,
    vehicle: vehicleId || null,
    driver: driverId || null,
    assistant: assistantId || null,
    stops: stops || [],
  });

  res.status(HTTP_STATUS.CREATED).json({ success: true, data: route });
});

const notifyStopsUpdate = (route) => {
  try {
    const { getIO } = require('../sockets/socketManager');
    const io = getIO();
    io.to(`route:${route._id}`).emit('route-stops-updated', {
      routeId: route._id,
      stops: route.stops,
      studentsAllocated: route.studentsAllocated
    });
  } catch (err) {
    // Socket not active/initialized
  }
};

exports.addRouteStop = asyncHandler(async (req, res) => {
  const { stopName, latitude, longitude, scheduledTime } = req.body;
  if (!stopName || latitude === undefined || longitude === undefined) {
    return res.status(HTTP_STATUS.BAD_REQUEST).json({ success: false, message: 'Stop name, latitude and longitude are required' });
  }

  const route = await VehicleRoute.findById(req.params.id);
  if (!route) {
    return res.status(HTTP_STATUS.NOT_FOUND).json({ success: false, message: 'Route not found' });
  }

  route.stops.push({ stopName, latitude, longitude, scheduledTime });
  await route.save();
  notifyStopsUpdate(route);

  res.status(HTTP_STATUS.OK).json({ success: true, data: route });
});

exports.deleteRouteStop = asyncHandler(async (req, res) => {
  const route = await VehicleRoute.findById(req.params.id);
  if (!route) {
    return res.status(HTTP_STATUS.NOT_FOUND).json({ success: false, message: 'Route not found' });
  }

  route.stops = route.stops.filter(s => s.stopName !== req.params.stopName);
  await route.save();
  notifyStopsUpdate(route);

  res.status(HTTP_STATUS.OK).json({ success: true, data: route });
});

exports.assignStudentStop = asyncHandler(async (req, res) => {
  const { studentId } = req.params;
  const { stopName } = req.body;
  if (!stopName) {
    return res.status(HTTP_STATUS.BAD_REQUEST).json({ success: false, message: 'Stop name is required' });
  }

  const route = await VehicleRoute.findById(req.params.id);
  if (!route) {
    return res.status(HTTP_STATUS.NOT_FOUND).json({ success: false, message: 'Route not found' });
  }

  const studentAlloc = route.studentsAllocated.find(item => item.student.toString() === studentId);
  if (studentAlloc) {
    studentAlloc.stopName = stopName;
  } else {
    route.studentsAllocated.push({ student: studentId, stopName });
  }

  await route.save();
  notifyStopsUpdate(route);

  res.status(HTTP_STATUS.OK).json({ success: true, data: route });
});

exports.allocateStudent = asyncHandler(async (req, res) => {
  const { routeId, studentId, stopName } = req.body;
  if (!routeId || !studentId || !stopName) {
    return res.status(HTTP_STATUS.BAD_REQUEST).json({ success: false, message: 'Please provide route ID, student ID and stop name' });
  }

  const route = await VehicleRoute.findById(routeId);
  if (!route) {
    return res.status(HTTP_STATUS.NOT_FOUND).json({ success: false, message: 'Route not found' });
  }

  // Remove student from any other route allocation to prevent duplication
  await VehicleRoute.updateMany(
    {},
    { $pull: { studentsAllocated: { student: studentId } } }
  );

  route.studentsAllocated.push({ student: studentId, stopName });
  await route.save();

  const populated = await VehicleRoute.findById(routeId).populate({
    path: 'studentsAllocated.student',
    populate: { path: 'user', select: 'name email avatar' }
  });

  res.status(HTTP_STATUS.OK).json({ success: true, data: populated });
});

// ==========================================
// 3. ATTENDANCE OPERATIONS
// ==========================================

exports.markBusAttendance = asyncHandler(async (req, res) => {
  const { routeId, date, tripType, attendanceList } = req.body;
  if (!routeId || !date || !tripType || !Array.isArray(attendanceList)) {
    return res.status(HTTP_STATUS.BAD_REQUEST).json({ success: false, message: 'Invalid attendance parameters' });
  }

  const results = [];
  const parsedDate = new Date(new Date(date).setHours(0, 0, 0, 0));

  for (const record of attendanceList) {
    const { studentId, status } = record;

    let att = await BusAttendance.findOne({
      student: studentId,
      date: parsedDate,
      tripType
    });

    if (att) {
      att.status = status;
      att.markedBy = req.user._id;
      att.markedAt = new Date();
    } else {
      att = new BusAttendance({
        student: studentId,
        route: routeId,
        date: parsedDate,
        tripType,
        status,
        markedBy: req.user._id,
        markedAt: new Date()
      });
    }

    await att.save();
    results.push(att);
  }

  res.status(HTTP_STATUS.OK).json({ success: true, data: results });
});

exports.getBusAttendance = asyncHandler(async (req, res) => {
  const { studentId, routeId, date, tripType } = req.query;
  const filter = {};

  if (studentId) filter.student = studentId;
  if (routeId) filter.route = routeId;
  if (date) {
    filter.date = new Date(new Date(date).setHours(0, 0, 0, 0));
  }
  if (tripType) filter.tripType = tripType;

  const records = await BusAttendance.find(filter)
    .populate('student')
    .populate('route', 'routeName routeNumber');

  res.status(HTTP_STATUS.OK).json({ success: true, data: records });
});

// ==========================================
// 4. DRIVER & ASSISTANT USERS UTILITY
// ==========================================

exports.getDriversAndHelpers = asyncHandler(async (req, res) => {
  // Return all users who are drivers/assistants, or have Driver role
  const staff = await User.find({ role: { $in: ['Driver', 'Helper', 'Assistant', 'Teacher', 'Admin'] } }).select('name email role');
  res.status(HTTP_STATUS.OK).json({ success: true, data: staff });
});
