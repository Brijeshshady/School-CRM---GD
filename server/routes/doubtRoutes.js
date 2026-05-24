const express = require('express');
const router = express.Router();
const { getDoubts, createDoubt, updateDoubt, addReply } = require('../controllers/doubtController');
const { protect } = require('../middleware/authMiddleware');

router.use(protect);

router.route('/')
  .get(getDoubts)
  .post(createDoubt);

router.route('/:id')
  .put(updateDoubt);

router.route('/:id/replies')
  .post(addReply);

module.exports = router;
