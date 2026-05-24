const express = require('express');
const router = express.Router();
const { 
  createQuestion, 
  getQuestions, 
  createQuiz, 
  getQuizzes, 
  getQuizDetails, 
  submitQuizAttempt,
  getQuizAttempts
} = require('../controllers/quizController');
const { protect, authorize } = require('../middleware/authMiddleware');
const { ROLES } = require('../constants');

router.use(protect);

router.route('/questions')
  .post(authorize(ROLES.TEACHER, ROLES.ADMIN), createQuestion)
  .get(getQuestions);

router.route('/')
  .post(authorize(ROLES.TEACHER, ROLES.ADMIN), createQuiz)
  .get(getQuizzes);

router.route('/:id')
  .get(getQuizDetails);

router.route('/:id/submit')
  .post(authorize(ROLES.STUDENT), submitQuizAttempt);

router.route('/:id/attempts')
  .get(authorize(ROLES.TEACHER, ROLES.ADMIN), getQuizAttempts);

module.exports = router;
