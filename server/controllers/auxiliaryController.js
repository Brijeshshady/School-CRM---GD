const LibraryItem = require('../models/LibraryItem');
const HostelRoom = require('../models/HostelRoom');
const VehicleRoute = require('../models/VehicleRoute');
const Student = require('../models/Student');
const asyncHandler = require('../middleware/asyncHandler');
const { HTTP_STATUS } = require('../constants');

// ==========================================
// LIBRARY CATALOG ENDPOINTS
// ==========================================

exports.getLibraryItems = asyncHandler(async (req, res) => {
  const items = await LibraryItem.find({}).populate('issuedTo', 'name email').sort('-createdAt');
  res.status(HTTP_STATUS.OK).json({ success: true, data: items });
});

exports.addLibraryItem = asyncHandler(async (req, res) => {
  const { title, author, isbn, category } = req.body;
  if (!title) {
    return res.status(HTTP_STATUS.BAD_REQUEST).json({ success: false, message: 'Title is required' });
  }
  const item = await LibraryItem.create({ title, author, isbn, category });
  res.status(HTTP_STATUS.CREATED).json({ success: true, data: item });
});

exports.issueLibraryBook = asyncHandler(async (req, res) => {
  const { itemId, issuedToUserId, days } = req.body;
  if (!itemId || !issuedToUserId) {
    return res.status(HTTP_STATUS.BAD_REQUEST).json({ success: false, message: 'Please provide item ID and user ID' });
  }

  const book = await LibraryItem.findById(itemId);
  if (!book || book.status === 'Issued') {
    return res.status(HTTP_STATUS.BAD_REQUEST).json({ success: false, message: 'Book is not available for issue' });
  }

  const dueDate = new Date();
  dueDate.setDate(dueDate.getDate() + (Number(days) || 14));

  book.status = 'Issued';
  book.issuedTo = issuedToUserId;
  book.dueDate = dueDate;
  await book.save();

  const populated = await LibraryItem.findById(itemId).populate('issuedTo', 'name email');

  res.status(HTTP_STATUS.OK).json({ success: true, data: populated });
});

// ==========================================
// HOSTEL ALLOTMENT ENDPOINTS
// ==========================================

exports.getHostelRooms = asyncHandler(async (req, res) => {
  const rooms = await HostelRoom.find({}).populate({
    path: 'occupants',
    populate: { path: 'user', select: 'name email' }
  }).sort('roomNumber');
  res.status(HTTP_STATUS.OK).json({ success: true, data: rooms });
});

exports.allocateHostelRoom = asyncHandler(async (req, res) => {
  const { block, roomNumber, studentId } = req.body;
  if (!block || !roomNumber || !studentId) {
    return res.status(HTTP_STATUS.BAD_REQUEST).json({ success: false, message: 'Please provide block, room number and student ID' });
  }

  let room = await HostelRoom.findOne({ block, roomNumber });
  if (!room) {
    room = await HostelRoom.create({ block, roomNumber, capacity: 3 });
  }

  if (room.occupants.length >= room.capacity) {
    return res.status(HTTP_STATUS.BAD_REQUEST).json({ success: false, message: 'This room has reached full capacity' });
  }

  room.occupants.push(studentId);
  await room.save();

  const populated = await HostelRoom.findById(room._id).populate({
    path: 'occupants',
    populate: { path: 'user', select: 'name email' }
  });

  res.status(HTTP_STATUS.OK).json({ success: true, data: populated });
});

// ==========================================
// VEHICLE ROUTE ENDPOINTS
// ==========================================

exports.getVehicleRoutes = asyncHandler(async (req, res) => {
  const routes = await VehicleRoute.find({}).populate({
    path: 'studentsAllocated',
    populate: { path: 'user', select: 'name email' }
  }).sort('routeName');
  res.status(HTTP_STATUS.OK).json({ success: true, data: routes });
});

exports.allocateTransport = asyncHandler(async (req, res) => {
  const { routeId, studentId } = req.body;
  if (!routeId || !studentId) {
    return res.status(HTTP_STATUS.BAD_REQUEST).json({ success: false, message: 'Please provide route ID and student ID' });
  }

  const route = await VehicleRoute.findById(routeId);
  if (!route) {
    return res.status(HTTP_STATUS.NOT_FOUND).json({ success: false, message: 'Transport route not found' });
  }

  route.studentsAllocated.push(studentId);
  await route.save();

  const populated = await VehicleRoute.findById(routeId).populate({
    path: 'studentsAllocated',
    populate: { path: 'user', select: 'name email' }
  });

  res.status(HTTP_STATUS.OK).json({ success: true, data: populated });
});
