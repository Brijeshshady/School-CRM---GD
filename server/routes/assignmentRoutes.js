const express = require('express');
const router = express.Router();
const { getAssignments, getAssignment } = require('../controllers/assignmentController');
const { protect } = require('../middleware/authMiddleware');

router.use(protect);

router.get('/', getAssignments);
router.get('/:id', getAssignment);

module.exports = router;
