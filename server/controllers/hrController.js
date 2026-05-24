const StaffPayroll = require('../models/StaffPayroll');
const Teacher = require('../models/Teacher');
const asyncHandler = require('../middleware/asyncHandler');
const { HTTP_STATUS } = require('../constants');

// Mock Performance Reviews Store (in-memory for demo representation)
let performanceReviews = [
  { id: "rev1", teacherName: "Priya Sharma", rating: 5, feedback: "Excellent coordination of CBSE class 10 syllabus. Promoted to Head of Science.", reviewedAt: new Date("2026-04-15") },
  { id: "rev2", teacherName: "Rajesh Koothrappali", rating: 4, feedback: "Highly energetic lab practical delivery. Needs to focus on homework grading speeds.", reviewedAt: new Date("2026-05-01") },
];

// @desc    Get all staff payroll items
// @route   GET /api/hr/payroll
// @access  Private (Admin)
exports.getPayroll = asyncHandler(async (req, res) => {
  const payroll = await StaffPayroll.find({})
    .populate({
      path: 'teacher',
      populate: { path: 'user', select: 'name email' }
    })
    .sort('-createdAt');

  res.status(HTTP_STATUS.OK).json({
    success: true,
    data: payroll,
  });
});

// @desc    Generate/Save payroll slip
// @route   POST /api/hr/payroll
// @access  Private (Admin)
exports.createPayroll = asyncHandler(async (req, res) => {
  const { teacherId, basicSalary, allowances, deductions, month, status } = req.body;

  if (!teacherId || !basicSalary || !month) {
    return res.status(HTTP_STATUS.BAD_REQUEST).json({
      success: false,
      message: 'Please provide teacher ID, basic salary, and month',
    });
  }

  const payroll = await StaffPayroll.create({
    teacher: teacherId,
    basicSalary,
    allowances: allowances || 0,
    deductions: deductions || 0,
    month,
    status: status || 'Pending',
  });

  const populated = await StaffPayroll.findById(payroll._id).populate({
    path: 'teacher',
    populate: { path: 'user', select: 'name email' }
  });

  res.status(HTTP_STATUS.CREATED).json({
    success: true,
    data: populated,
  });
});

// @desc    Get all staff performance reviews
// @route   GET /api/hr/reviews
// @access  Private (Admin)
exports.getReviews = asyncHandler(async (req, res) => {
  res.status(HTTP_STATUS.OK).json({
    success: true,
    data: performanceReviews,
  });
});

// @desc    Create a teacher performance review
// @route   POST /api/hr/reviews
// @access  Private (Admin)
exports.createReview = asyncHandler(async (req, res) => {
  const { teacherName, rating, feedback } = req.body;

  if (!teacherName || !rating) {
    return res.status(HTTP_STATUS.BAD_REQUEST).json({
      success: false,
      message: 'Please provide teacher name and rating (1-5)',
    });
  }

  const review = {
    id: `rev${Date.now()}`,
    teacherName,
    rating: Number(rating),
    feedback: feedback || '',
    reviewedAt: new Date()
  };

  performanceReviews.unshift(review);

  res.status(HTTP_STATUS.CREATED).json({
    success: true,
    data: review,
  });
});
