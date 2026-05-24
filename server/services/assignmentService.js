const Assignment = require('../models/Assignment');
const TeacherService = require('./teacherService');
const Teacher = require('../models/Teacher');

/**
 * Assignment Service
 * Handles assignment lifecycle with ownership validation.
 */
class AssignmentService {
  async createAssignment(userId, assignmentData) {
    // 1. Verify Ownership
    const isOwner = await TeacherService.verifyClassOwnership(userId, assignmentData.class);
    if (!isOwner) {
      throw new Error('Not authorized to create assignments for this class');
    }

    const teacher = await Teacher.findOne({ user: userId });

    // 2. Create Assignment
    return await Assignment.create({
      ...assignmentData,
      teacher: teacher._id
    });
  }

  async getTeacherAssignments(userId) {
    const teacher = await Teacher.findOne({ user: userId });
    if (!teacher) return [];

    return await Assignment.find({ teacher: teacher._id })
      .populate('subject', 'name code')
      .populate('class', 'name section')
      .sort('-createdAt');
  }
}

module.exports = new AssignmentService();
