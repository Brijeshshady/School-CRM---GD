const Doubt = require('../models/Doubt');
const asyncHandler = require('../middleware/asyncHandler');
const { HTTP_STATUS } = require('../constants');
const { createAndSendNotification } = require('../sockets/notificationSocket');

// @desc    Get all doubts (filtered by user)
// @route   GET /api/doubts
// @access  Private
exports.getDoubts = asyncHandler(async (req, res) => {
  let query = {};
  
  if (req.user.role === 'Student') {
    query.student = req.user.id;
  } else if (req.user.role === 'Teacher') {
    query.teacher = req.user.id;
  }

  const doubts = await Doubt.find(query)
    .populate('student', 'name')
    .populate('teacher', 'name')
    .sort('-createdAt');

  res.status(HTTP_STATUS.OK).json({
    success: true,
    data: doubts
  });
});

// @desc    Create a new doubt
// @route   POST /api/doubts
// @access  Private (Student only)
exports.createDoubt = asyncHandler(async (req, res) => {
  const { title, question, subject, teacherId, priority } = req.body;

  const doubt = await Doubt.create({
    title,
    question,
    subject,
    teacher: teacherId,
    student: req.user.id,
    priority
  });

  // Notify the assigned teacher
  try {
    if (teacherId) {
      await createAndSendNotification({
        userId: teacherId,
        type: 'ticket',
        title: 'New Student Doubt',
        message: `${req.user.name} posted a new doubt: ${title}`,
        actionUrl: '/teacher/dashboard'
      });
    }
  } catch (err) {
    console.error('Error sending doubt notification to teacher:', err);
  }

  res.status(HTTP_STATUS.CREATED).json({
    success: true,
    data: doubt
  });
});

// @desc    Update doubt (e.g. mark resolved)
// @route   PUT /api/doubts/:id
// @access  Private
exports.updateDoubt = asyncHandler(async (req, res) => {
  const doubt = await Doubt.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true
  });

  if (!doubt) {
    return res.status(HTTP_STATUS.NOT_FOUND).json({
      success: false,
      message: 'Doubt not found'
    });
  }

  res.status(HTTP_STATUS.OK).json({
    success: true,
    data: doubt
  });
});

// @desc    Add reply to doubt
// @route   POST /api/doubts/:id/replies
// @access  Private
exports.addReply = asyncHandler(async (req, res) => {
  const doubt = await Doubt.findById(req.params.id);

  if (!doubt) {
    return res.status(HTTP_STATUS.NOT_FOUND).json({
      success: false,
      message: 'Doubt not found'
    });
  }

  const { message } = req.body;

  doubt.replies.push({
    senderId: req.user.id,
    userName: req.user.name,
    message
  });

  doubt.status = 'Answered';
  await doubt.save();

  // Notify the opposite party of reply
  try {
    const recipientId = req.user.id === doubt.student.toString()
      ? doubt.teacher
      : doubt.student;
      
    if (recipientId) {
      await createAndSendNotification({
        userId: recipientId,
        type: 'ticket',
        title: 'New Reply on Doubt',
        message: `${req.user.name} replied to doubt thread: "${doubt.title}"`,
        actionUrl: req.user.role === 'Student' ? '/teacher/dashboard' : '/student/dashboard/doubts'
      });
    }
  } catch (err) {
    console.error('Error sending doubt reply notification:', err);
  }

  res.status(HTTP_STATUS.OK).json({
    success: true,
    data: doubt
  });
});
