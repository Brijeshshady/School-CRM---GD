const express = require('express');
const router = express.Router();
const { 
    getLinkedStudents, 
    getStudentData 
} = require('../controllers/parentController');
const { protect, authorize } = require('../middleware/authMiddleware');
const { ROLES } = require('../constants');

router.use(protect);
router.use(authorize(ROLES.PARENT));

router.get('/students', getLinkedStudents);
router.get('/students/:studentId/data', getStudentData);

module.exports = router;
