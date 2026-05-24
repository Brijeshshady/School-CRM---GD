const LeaveRequest = require('../models/LeaveRequest');
const Teacher = require('../models/Teacher');
const User = require('../models/User');
const asyncHandler = require('../middleware/asyncHandler');
const { HTTP_STATUS } = require('../constants');
const { createAndSendNotification } = require('../sockets/notificationSocket');

// @desc    Get all leave requests
// @route   GET /api/leaves
// @access  Private (Admin or Teacher)
exports.getLeaves = asyncHandler(async (req, res) => {
  let query = {};

  if (req.user.role === 'Teacher' || req.user.role === 'Staff') {
    const teacherProfile = await Teacher.findOne({ user: req.user._id });
    if (!teacherProfile) {
      return res.status(HTTP_STATUS.NOT_FOUND).json({
        success: false,
        message: 'Teacher profile not found',
      });
    }
    query.teacher = teacherProfile._id;
  }

  const leaves = await LeaveRequest.find(query)
    .populate({
      path: 'teacher',
      populate: { path: 'user', select: 'name email' },
    })
    .sort('-createdAt');

  res.status(HTTP_STATUS.OK).json({
    success: true,
    data: leaves,
  });
});

// @desc    Apply for leave
// @route   POST /api/leaves
// @access  Private (Teacher or Staff)
exports.applyForLeave = asyncHandler(async (req, res) => {
  const { startDate, endDate, reason } = req.body;

  if (!startDate || !endDate || !reason) {
    return res.status(HTTP_STATUS.BAD_REQUEST).json({
      success: false,
      message: 'Please provide start date, end date, and reason',
    });
  }

  const teacherProfile = await Teacher.findOne({ user: req.user._id });
  if (!teacherProfile) {
    return res.status(HTTP_STATUS.NOT_FOUND).json({
      success: false,
      message: 'Teacher profile not found',
    });
  }

  const leave = await LeaveRequest.create({
    teacher: teacherProfile._id,
    startDate,
    endDate,
    reason,
  });

  // Notify admins of new leave request
  try {
    const admins = await User.find({ role: { $in: ['Admin', 'SuperAdmin'] } });
    for (const admin of admins) {
      await createAndSendNotification({
        userId: admin._id,
        type: 'info',
        title: 'New Leave Request',
        message: `Teacher ${req.user.name} requested leave: ${reason}`,
        actionUrl: '/admin/dashboard/leaves',
      });
    }
  } catch (err) {
    console.error('Error creating leave notification:', err);
  }

  res.status(HTTP_STATUS.CREATED).json({
    success: true,
    data: leave,
  });
});

// @desc    Update leave request status (Approve/Reject)
// @route   PATCH /api/leaves/:id/status
// @access  Private (Admin)
exports.updateLeaveStatus = asyncHandler(async (req, res) => {
  const { status, rejectionReason } = req.body;

  if (!['Approved', 'Rejected'].includes(status)) {
    return res.status(HTTP_STATUS.BAD_REQUEST).json({
      success: false,
      message: 'Invalid status. Must be Approved or Rejected',
    });
  }

  const leave = await LeaveRequest.findById(req.params.id).populate({
    path: 'teacher',
    populate: { path: 'user', select: '_id name' },
  });

  if (!leave) {
    return res.status(HTTP_STATUS.NOT_FOUND).json({
      success: false,
      message: 'Leave request not found',
    });
  }

  leave.status = status;
  leave.approvedBy = req.user._id;
  if (status === 'Rejected') {
    leave.rejectionReason = rejectionReason || 'No reason provided';
  }
  await leave.save();

  // Notify teacher of decision
  try {
    await createAndSendNotification({
      userId: leave.teacher.user._id,
      type: 'announcement',
      title: `Leave Request ${status}`,
      message: `Your leave request from ${new Date(leave.startDate).toLocaleDateString()} to ${new Date(leave.endDate).toLocaleDateString()} has been ${status.toLowerCase()}.${status === 'Rejected' ? ` Reason: ${leave.rejectionReason}` : ''}`,
      actionUrl: '/teacher/dashboard',
    });
  } catch (err) {
    console.error('Error sending leave update notification:', err);
  }

  res.status(HTTP_STATUS.OK).json({
    success: true,
    data: leave,
  });
});
