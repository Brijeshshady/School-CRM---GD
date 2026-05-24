const Notification = require('../models/Notification');
const asyncHandler = require('../middleware/asyncHandler');
const { HTTP_STATUS } = require('../constants');

// @desc    Get all notifications for current user
// @route   GET /api/notifications
// @access  Private
exports.getNotifications = asyncHandler(async (req, res) => {
  const notifications = await Notification.find({ userId: req.user.id })
    .sort('-createdAt')
    .limit(50);

  res.status(HTTP_STATUS.OK).json({
    success: true,
    data: notifications
  });
});

// @desc    Mark notification as read
// @route   PATCH /api/notifications/:id
// @access  Private
exports.markAsRead = asyncHandler(async (req, res) => {
  const notification = await Notification.findOneAndUpdate(
    { _id: req.params.id, userId: req.user.id },
    { read: true },
    { new: true }
  );

  if (!notification) {
    return res.status(HTTP_STATUS.NOT_FOUND).json({
      success: false,
      message: 'Notification not found'
    });
  }

  res.status(HTTP_STATUS.OK).json({
    success: true,
    data: notification
  });
});

// @desc    Mark all notifications as read
// @route   PATCH /api/notifications/mark-all-read
// @access  Private
exports.markAllRead = asyncHandler(async (req, res) => {
  await Notification.updateMany(
    { userId: req.user.id, read: false },
    { read: true }
  );

  res.status(HTTP_STATUS.OK).json({
    success: true,
    message: 'All notifications marked as read'
  });
});

// @desc    Delete notification
// @route   DELETE /api/notifications/:id
// @access  Private
exports.deleteNotification = asyncHandler(async (req, res) => {
  const notification = await Notification.findOneAndDelete({
    _id: req.params.id,
    userId: req.user.id
  });

  if (!notification) {
    return res.status(HTTP_STATUS.NOT_FOUND).json({
      success: false,
      message: 'Notification not found'
    });
  }

  res.status(HTTP_STATUS.OK).json({
    success: true,
    data: {}
  });
});
