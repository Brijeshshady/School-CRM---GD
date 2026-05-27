const Quiz = require('../models/Quiz');
const Question = require('../models/Question');
const QuizAttempt = require('../models/QuizAttempt');
const Student = require('../models/Student');
const asyncHandler = require('../middleware/asyncHandler');
const { HTTP_STATUS } = require('../constants');

// @desc    Create a new question in the question bank
// @route   POST /api/quizzes/questions
// @access  Private (Teacher or Admin)
exports.createQuestion = asyncHandler(async (req, res) => {
  const { subject, questionText, type, options, correctOption, points } = req.body;

  if (!subject || !questionText) {
    return res.status(HTTP_STATUS.BAD_REQUEST).json({
      success: false,
      message: 'Please provide subject and question text',
    });
  }

  const question = await Question.create({
    subject,
    questionText,
    type: type || 'MCQ',
    options,
    correctOption,
    points: points || 5,
    createdBy: req.user._id,
  });

  res.status(HTTP_STATUS.CREATED).json({
    success: true,
    data: question,
  });
});

// @desc    Get questions from the question bank
// @route   GET /api/quizzes/questions
// @access  Private
exports.getQuestions = asyncHandler(async (req, res) => {
  let query = {};
  if (req.query.subject) {
    query.subject = req.query.subject;
  }

  const questions = await Question.find(query).sort('-createdAt');

  res.status(HTTP_STATUS.OK).json({
    success: true,
    data: questions,
  });
});

// @desc    Create a new quiz
// @route   POST /api/quizzes
// @access  Private (Teacher or Admin)
exports.createQuiz = asyncHandler(async (req, res) => {
  const { title, subject, class: classId, description, questions, timeLimit, allowMultipleAttempts } = req.body;

  if (!title || !subject || !classId) {
    return res.status(HTTP_STATUS.BAD_REQUEST).json({
      success: false,
      message: 'Please provide title, subject, and class',
    });
  }

  const quiz = await Quiz.create({
    title,
    subject,
    class: classId,
    description,
    questions: questions || [],
    timeLimit: timeLimit || 30,
    allowMultipleAttempts: allowMultipleAttempts !== undefined ? allowMultipleAttempts : true,
    createdBy: req.user._id,
  });

  res.status(HTTP_STATUS.CREATED).json({
    success: true,
    data: quiz,
  });
});

// @desc    Get quizzes for student class or general filter
// @route   GET /api/quizzes
// @access  Private
exports.getQuizzes = asyncHandler(async (req, res) => {
  let query = {};

  if (req.user.role === 'Student') {
    const studentProfile = await Student.findOne({ user: req.user._id });
    if (studentProfile && studentProfile.class) {
      query.class = studentProfile.class;
    }
  } else if (req.query.class) {
    query.class = req.query.class;
  }

  if (req.query.subject) {
    query.subject = req.query.subject;
  }

  const quizzes = await Quiz.find(query)
    .populate('subject', 'name code')
    .populate('class', 'name section')
    .sort('-createdAt');

  // For students, attach their attempt history summaries
  const enrichedQuizzes = await Promise.all(quizzes.map(async (q) => {
    let attemptsCount = 0;
    let highestScore = null;
    
    if (req.user.role === 'Student') {
      const studentProfile = await Student.findOne({ user: req.user._id });
      if (studentProfile) {
        const attempts = await QuizAttempt.find({ quiz: q._id, student: studentProfile._id });
        attemptsCount = attempts.length;
        if (attempts.length > 0) {
          highestScore = Math.max(...attempts.map(a => a.score));
        }
      }
    }

    return {
      ...q.toObject(),
      attemptsCount,
      highestScore,
    };
  }));

  res.status(HTTP_STATUS.OK).json({
    success: true,
    data: enrichedQuizzes,
  });
});

// @desc    Get details of a quiz (Strips answers for students)
// @route   GET /api/quizzes/:id
// @access  Private
exports.getQuizDetails = asyncHandler(async (req, res) => {
  const quiz = await Quiz.findById(req.params.id)
    .populate('questions')
    .populate('subject', 'name code')
    .populate('class', 'name section');

  if (!quiz) {
    return res.status(HTTP_STATUS.NOT_FOUND).json({
      success: false,
      message: 'Quiz not found',
    });
  }

  // Security: strip correctOption for students
  let quizData = quiz.toObject();
  if (req.user.role === 'Student') {
    quizData.questions = quizData.questions.map((q) => {
      const { correctOption, ...publicQuestion } = q;
      return publicQuestion;
    });
  }

  res.status(HTTP_STATUS.OK).json({
    success: true,
    data: quizData,
  });
});

// @desc    Submit answers for a quiz (with check for attempt controls)
// @route   POST /api/quizzes/:id/submit
// @access  Private (Student)
exports.submitQuizAttempt = asyncHandler(async (req, res) => {
  const { answers } = req.body; // array of { question: id, selectedOption: index, descriptiveAnswer: string }

  if (!answers || !Array.isArray(answers)) {
    return res.status(HTTP_STATUS.BAD_REQUEST).json({
      success: false,
      message: 'Please provide answers array',
    });
  }

  const quiz = await Quiz.findById(req.params.id).populate('questions');
  if (!quiz) {
    return res.status(HTTP_STATUS.NOT_FOUND).json({
      success: false,
      message: 'Quiz not found',
    });
  }

  const studentProfile = await Student.findOne({ user: req.user._id });
  if (!studentProfile) {
    return res.status(HTTP_STATUS.NOT_FOUND).json({
      success: false,
      message: 'Student profile not found',
    });
  }

  // Enforce attempt control limit
  if (!quiz.allowMultipleAttempts) {
    const existingAttempt = await QuizAttempt.findOne({ quiz: quiz._id, student: studentProfile._id });
    if (existingAttempt) {
      return res.status(HTTP_STATUS.BAD_REQUEST).json({
        success: false,
        message: 'Multiple attempts are disabled for this quiz.',
      });
    }
  }

  // Auto-grading logic (MCQ only; Descriptive requires manual grading)
  let score = 0;
  let totalPoints = 0;
  const gradedAnswers = [];

  for (const ans of answers) {
    const questionObj = quiz.questions.find((q) => q._id.toString() === ans.question.toString());
    if (questionObj) {
      totalPoints += questionObj.points;

      if (questionObj.type === 'Descriptive') {
        // Descriptive questions require manual grading — save answer, score = 0
        gradedAnswers.push({
          question: ans.question,
          descriptiveAnswer: ans.descriptiveAnswer || '',
          isCorrect: null, // Pending manual review
          score: 0,
        });
      } else {
        // MCQ auto-grading
        const isCorrect = questionObj.correctOption === ans.selectedOption;
        const pts = isCorrect ? questionObj.points : 0;
        if (isCorrect) score += questionObj.points;

        gradedAnswers.push({
          question: ans.question,
          selectedOption: ans.selectedOption,
          isCorrect,
          score: pts,
        });
      }
    }
  }

  const attempt = await QuizAttempt.create({
    quiz: quiz._id,
    student: studentProfile._id,
    answers: gradedAnswers,
    score,
    totalPoints,
  });

  res.status(HTTP_STATUS.CREATED).json({
    success: true,
    data: attempt,
  });
});

// @desc    Get all attempts for a quiz (for teachers/admins)
// @route   GET /api/quizzes/:id/attempts
// @access  Private (Teacher or Admin)
exports.getQuizAttempts = asyncHandler(async (req, res) => {
  const attempts = await QuizAttempt.find({ quiz: req.params.id })
    .populate({
      path: 'student',
      populate: { path: 'user', select: 'name email' },
    })
    .populate('answers.question')
    .sort('-createdAt');

  res.status(HTTP_STATUS.OK).json({
    success: true,
    data: attempts,
  });
});

// @desc    Manually grade descriptive answers in a quiz attempt
// @route   PATCH /api/quizzes/attempts/:attemptId/grade
// @access  Private (Teacher or Admin)
exports.gradeQuizAttempt = asyncHandler(async (req, res) => {
  const { grades } = req.body; // array of { questionId, score }

  if (!grades || !Array.isArray(grades)) {
    return res.status(HTTP_STATUS.BAD_REQUEST).json({
      success: false,
      message: 'Please provide grades array',
    });
  }

  const attempt = await QuizAttempt.findById(req.params.attemptId);
  if (!attempt) {
    return res.status(HTTP_STATUS.NOT_FOUND).json({
      success: false,
      message: 'Attempt not found',
    });
  }

  // Update individual answer scores
  let newTotal = 0;
  for (const ans of attempt.answers) {
    const gradeEntry = grades.find(g => g.questionId === ans.question.toString());
    if (gradeEntry !== undefined && gradeEntry.score !== undefined) {
      ans.score = gradeEntry.score;
      ans.isCorrect = gradeEntry.score > 0;
    }
    newTotal += ans.score || 0;
  }

  attempt.score = newTotal;
  await attempt.save();

  res.status(HTTP_STATUS.OK).json({
    success: true,
    data: attempt,
    message: 'Attempt graded successfully',
  });
});

