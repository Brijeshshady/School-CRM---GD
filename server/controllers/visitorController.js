const Visitor = require('../models/Visitor');
const asyncHandler = require('../middleware/asyncHandler');
const { HTTP_STATUS } = require('../constants');

// @desc    Get all visitor logs
// @route   GET /api/visitors
// @access  Private (Admin)
exports.getVisitors = asyncHandler(async (req, res) => {
  const visitors = await Visitor.find({}).sort('-checkInTime');
  res.status(HTTP_STATUS.OK).json({
    success: true,
    data: visitors,
  });
});

// @desc    Check-in a new visitor
// @route   POST /api/visitors
// @access  Private (Admin)
exports.createVisitor = asyncHandler(async (req, res) => {
  const { name, purpose, phone } = req.body;

  if (!name) {
    return res.status(HTTP_STATUS.BAD_REQUEST).json({
      success: false,
      message: 'Visitor name is required',
    });
  }

  const log = await Visitor.create({
    name,
    purpose,
    phone,
  });

  res.status(HTTP_STATUS.CREATED).json({
    success: true,
    data: log,
  });
});

// @desc    Checkout a visitor
// @route   PUT /api/visitors/:id/checkout
// @access  Private (Admin)
exports.checkoutVisitor = asyncHandler(async (req, res) => {
  const visitor = await Visitor.findById(req.params.id);

  if (!visitor) {
    return res.status(HTTP_STATUS.NOT_FOUND).json({
      success: false,
      message: 'Visitor record not found',
    });
  }

  visitor.checkOutTime = new Date();
  visitor.status = 'Checked-Out';
  await visitor.save();

  res.status(HTTP_STATUS.OK).json({
    success: true,
    data: visitor,
  });
});
