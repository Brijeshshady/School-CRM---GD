const jwt = require('jsonwebtoken');
const User = require('../models/User');
const asyncHandler = require('../middleware/asyncHandler');
const sendResponse = require('../utils/apiResponse');
const { HTTP_STATUS } = require('../constants');

/**
 * Helper to generate JWT token
 */
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRE,
  });
};

// @desc    Register a new user
// @route   POST /api/auth/register
// @access  Public
exports.register = asyncHandler(async (req, res) => {
  const { name, email, password, role } = req.body;

  // Check if user exists
  const userExists = await User.findOne({ email });

  if (userExists) {
    res.status(HTTP_STATUS.BAD_REQUEST);
    throw new Error('User already exists');
  }

  // Create user
  const user = await User.create({
    name,
    email,
    password,
    role,
  });

  if (user) {
    const token = generateToken(user._id);
    
    // Don't send back password
    const userResponse = {
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
    };

    sendResponse(res, HTTP_STATUS.CREATED, { token, user: userResponse }, 'User registered successfully');
  } else {
    res.status(HTTP_STATUS.BAD_REQUEST);
    throw new Error('Invalid user data');
  }
});

// @desc    Login user
// @route   POST /api/auth/login
// @access  Public
exports.login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  // Validate email & password
  if (!email || !password) {
    res.status(HTTP_STATUS.BAD_REQUEST);
    throw new Error('Please provide an email and password');
  }

  let user;

  if (email.includes('@')) {
    user = await User.findOne({ email }).select('+password');
  } else {
    // Try resolving as studentId
    const Student = require('../models/Student');
    const student = await Student.findOne({ studentId: email });
    if (student) {
      user = await User.findById(student.user).select('+password');
    } else {
      // Try resolving as employeeId
      const Teacher = require('../models/Teacher');
      const teacher = await Teacher.findOne({ employeeId: email });
      if (teacher) {
        user = await User.findById(teacher.user).select('+password');
      }
    }
  }

  // Fallback to email search in case of an unusual username
  if (!user) {
    user = await User.findOne({ email }).select('+password');
  }

  if (!user || !(await user.matchPassword(password))) {
    res.status(HTTP_STATUS.UNAUTHORIZED);
    throw new Error('Invalid credentials');
  }

  if (!user.isActive) {
    res.status(HTTP_STATUS.UNAUTHORIZED);
    throw new Error('Account is inactive');
  }

  const token = generateToken(user._id);

  // User object without password
  let userResponse = {
    _id: user._id,
    name: user.name,
    email: user.email,
    role: user.role,
  };

  if (user.role === 'Student') {
    const Student = require('../models/Student');
    const studentProfile = await Student.findOne({ user: user._id }).populate('class');
    if (studentProfile) {
      userResponse.class = studentProfile.class;
      userResponse.studentId = studentProfile.studentId;
    }
  }

  sendResponse(res, HTTP_STATUS.OK, { token, user: userResponse }, 'User logged in successfully');
});

// @desc    Get current logged in user
// @route   GET /api/auth/me
// @access  Private
exports.getMe = asyncHandler(async (req, res) => {
  // req.user is attached by protect middleware
  let userData = req.user.toObject();
  
  if (userData.role === 'Student') {
    const Student = require('../models/Student');
    const studentProfile = await Student.findOne({ user: userData._id }).populate('class');
    if (studentProfile) {
      userData.class = studentProfile.class;
      userData.studentId = studentProfile.studentId;
    }
  }

  sendResponse(res, HTTP_STATUS.OK, userData);
});

// @desc    Forgot password - send OTP
// // @route   POST /api/auth/forgot-password
// // @access  Public
exports.forgotPassword = asyncHandler(async (req, res) => {
  const { email } = req.body;
  const user = await User.findOne({ email });

  if (!user) {
    res.status(HTTP_STATUS.NOT_FOUND);
    throw new Error('User not found with this email');
  }

  // Generate 6-digit OTP
  const otp = Math.floor(100000 + Math.random() * 900000).toString();
  user.otpCode = otp;
  user.otpExpires = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes
  await user.save();

  console.log(`[OTP DEVELOPMENT] Password Reset OTP for ${email}: ${otp}`);

  sendResponse(res, HTTP_STATUS.OK, { otp }, 'OTP sent to email (simulated)');
});

// @desc    Verify OTP
// // @route   POST /api/auth/verify-otp
// // @access  Public
exports.verifyOTP = asyncHandler(async (req, res) => {
  const { email, otp } = req.body;
  const user = await User.findOne({ email });

  if (!user) {
    res.status(HTTP_STATUS.NOT_FOUND);
    throw new Error('User not found');
  }

  if (!user.otpCode || user.otpCode !== otp || user.otpExpires < new Date()) {
    res.status(HTTP_STATUS.BAD_REQUEST);
    throw new Error('Invalid or expired OTP');
  }

  sendResponse(res, HTTP_STATUS.OK, {}, 'OTP verified successfully');
});

// @desc    Reset password
// // @route   POST /api/auth/reset-password
// // @access  Public
exports.resetPassword = asyncHandler(async (req, res) => {
  const { email, otp, password } = req.body;
  const user = await User.findOne({ email });

  if (!user) {
    res.status(HTTP_STATUS.NOT_FOUND);
    throw new Error('User not found');
  }

  if (!user.otpCode || user.otpCode !== otp || user.otpExpires < new Date()) {
    res.status(HTTP_STATUS.BAD_REQUEST);
    throw new Error('Invalid or expired OTP');
  }

  // Set new password
  user.password = password;
  user.otpCode = ''; // Clear OTP fields
  user.otpExpires = undefined;
  await user.save();

  sendResponse(res, HTTP_STATUS.OK, {}, 'Password reset successfully');
});
