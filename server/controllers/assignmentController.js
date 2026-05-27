const Assignment = require('../models/Assignment');
const AssignmentSubmission = require('../models/AssignmentSubmission');
const Student = require('../models/Student');
const Grade = require('../models/Grade');
const asyncHandler = require('../middleware/asyncHandler');
const sendResponse = require('../utils/apiResponse');
const APIFeatures = require('../utils/apiFeatures');
const { HTTP_STATUS } = require('../constants');

// @desc    Get all assignments
// @route   GET /api/assignments
// @access  Public
exports.getAssignments = asyncHandler(async (req, res) => {
  const features = new APIFeatures(Assignment.find().populate('subject', 'name').populate({
    path: 'teacher',
    populate: { path: 'user', select: 'name' }
  }), req.query)
    .filter()
    .sort()
    .limitFields()
    .paginate();

  const assignments = await features.query;

  sendResponse(res, HTTP_STATUS.OK, assignments, 'Assignments retrieved successfully');
});

// @desc    Get single assignment
// @route   GET /api/assignments/:id
// @access  Public
exports.getAssignment = asyncHandler(async (req, res) => {
  const assignment = await Assignment.findById(req.params.id)
    .populate('subject')
    .populate({
      path: 'teacher',
      populate: { path: 'user', select: 'name avatar' }
    })
    .populate('class');

  if (!assignment) {
    res.status(HTTP_STATUS.NOT_FOUND);
    throw new Error('Assignment not found');
  }

  sendResponse(res, HTTP_STATUS.OK, assignment);
});

// @desc    Submit an assignment (student submits homework)
// @route   POST /api/assignments/:id/submit
// @access  Private (Student)
exports.submitAssignment = asyncHandler(async (req, res) => {
  const { submissionText, attachments } = req.body;

  const assignment = await Assignment.findById(req.params.id);
  if (!assignment) {
    res.status(HTTP_STATUS.NOT_FOUND);
    throw new Error('Assignment not found');
  }

  // Find the student profile for this user
  const studentProfile = await Student.findOne({ user: req.user._id });
  if (!studentProfile) {
    res.status(HTTP_STATUS.NOT_FOUND);
    throw new Error('Student profile not found');
  }

  // Check if already submitted
  const existing = await AssignmentSubmission.findOne({
    assignment: assignment._id,
    student: studentProfile._id,
  });
  if (existing) {
    // Allow re-submission (update)
    existing.submissionText = submissionText || existing.submissionText;
    existing.attachments = attachments || existing.attachments;
    existing.submittedAt = new Date();
    existing.status = 'submitted';
    await existing.save();
    return sendResponse(res, HTTP_STATUS.OK, existing, 'Assignment re-submitted successfully');
  }

  const submission = await AssignmentSubmission.create({
    assignment: assignment._id,
    student: studentProfile._id,
    submissionText: submissionText || '',
    attachments: attachments || [],
    status: 'submitted',
    submittedAt: new Date(),
  });

  sendResponse(res, HTTP_STATUS.CREATED, submission, 'Assignment submitted successfully');
});

// @desc    Get all submissions for an assignment (teacher/admin view)
// @route   GET /api/assignments/:id/submissions
// @access  Private (Teacher/Admin)
exports.getSubmissions = asyncHandler(async (req, res) => {
  const assignment = await Assignment.findById(req.params.id);
  if (!assignment) {
    res.status(HTTP_STATUS.NOT_FOUND);
    throw new Error('Assignment not found');
  }

  const submissions = await AssignmentSubmission.find({ assignment: assignment._id })
    .populate({
      path: 'student',
      populate: { path: 'user', select: 'name email avatar' },
    })
    .sort('-submittedAt');

  sendResponse(res, HTTP_STATUS.OK, submissions, 'Submissions retrieved successfully');
});

// @desc    Grade a student's submission (teacher grades and syncs to Grade collection)
// @route   PATCH /api/assignments/submissions/:submissionId/grade
// @access  Private (Teacher/Admin)
exports.gradeSubmission = asyncHandler(async (req, res) => {
  const { score, feedback, grade } = req.body;

  const submission = await AssignmentSubmission.findById(req.params.submissionId)
    .populate('assignment');
  if (!submission) {
    res.status(HTTP_STATUS.NOT_FOUND);
    throw new Error('Submission not found');
  }

  // Update submission
  submission.score = score !== undefined ? score : submission.score;
  submission.feedback = feedback || submission.feedback;
  submission.grade = grade || submission.grade;
  submission.status = 'graded';
  await submission.save();

  // Sync to Grade collection for gradebook integration
  const assignment = submission.assignment;
  const totalMarks = assignment.totalMarks || 100;

  await Grade.findOneAndUpdate(
    {
      student: submission.student,
      assignment: assignment._id,
      subject: assignment.subject,
    },
    {
      student: submission.student,
      subject: assignment.subject,
      assignment: assignment._id,
      marksObtained: score || 0,
      totalMarks: totalMarks,
      grade: grade || '',
      remarks: feedback || '',
      gradedBy: req.user._id,
    },
    { upsert: true, new: true }
  );

  sendResponse(res, HTTP_STATUS.OK, submission, 'Submission graded successfully');
});

// @desc    Get submission status for current student on an assignment
// @route   GET /api/assignments/:id/my-submission
// @access  Private (Student)
exports.getMySubmission = asyncHandler(async (req, res) => {
  const studentProfile = await Student.findOne({ user: req.user._id });
  if (!studentProfile) {
    return sendResponse(res, HTTP_STATUS.OK, null, 'No student profile');
  }

  const submission = await AssignmentSubmission.findOne({
    assignment: req.params.id,
    student: studentProfile._id,
  });

  sendResponse(res, HTTP_STATUS.OK, submission);
});
