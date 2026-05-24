const express = require('express');
const router = express.Router();
const { getClasses, getClass } = require('../controllers/classController');
const { protect } = require('../middleware/authMiddleware');

router.use(protect);

router.get('/', getClasses);
router.get('/:id', getClass);

module.exports = router;
