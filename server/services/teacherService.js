const Teacher = require('../models/Teacher');
const Class = require('../models/Class');

/**
 * Teacher Service
 * Handles teacher-specific academic management.
 */
class TeacherService {
  /**
   * Internal helper to ensure a teacher profile exists
   */
  async _getOrCreateProfile(userId) {
    let teacher = await Teacher.findOne({ user: userId });
    
    // Auto-create profile if missing but user is Teacher/Staff
    if (!teacher) {
      const User = require('../models/User');
      const user = await User.findById(userId);
      if (user && (user.role === 'Teacher' || user.role === 'Staff')) {
        teacher = await Teacher.create({
          user: userId,
          employeeId: `EMP${Date.now()}`,
          department: 'General'
        });
      }
    }
    return teacher;
  }

  async getProfile(userId) {
    let teacher = await this._getOrCreateProfile(userId);
    if (!teacher) return null;

    // Refresh teacher with populations
    teacher = await Teacher.findById(teacher._id)
      .populate('user', 'name email isActive')
      .populate('assignedClasses', 'name section');
    
    // Also find classes where this teacher is the primary class teacher
    const classesLeading = await Class.find({ classTeacher: teacher._id });
    
    return {
      ...teacher.toObject(),
      classesLeading
    };
  }

  async getAssignedClasses(userId) {
    const teacher = await this._getOrCreateProfile(userId);
    if (!teacher) return [];

    // Return classes explicitly in assignedClasses array OR where they are the classTeacher
    return await Class.find({
      $or: [
        { _id: { $in: teacher.assignedClasses } },
        { classTeacher: teacher._id }
      ]
    }).populate({
        path: 'classTeacher',
        populate: { path: 'user', select: 'name' }
      });
  }

  /**
   * Helper to verify if a teacher owns a class
   */
  async verifyClassOwnership(userId, classId) {
    const teacher = await this._getOrCreateProfile(userId);
    if (!teacher) return false;
    
    const isAssigned = teacher.assignedClasses.some(id => id.toString() === classId.toString());
    if (isAssigned) return true;

    const classDoc = await Class.findOne({ _id: classId, classTeacher: teacher._id });
    return !!classDoc;
  }

  /**
   * Get all subjects taught by this teacher
   */
  async getSubjects(userId) {
    const teacher = await this._getOrCreateProfile(userId);
    if (!teacher) return [];

    const Subject = require('../models/Subject');
    return await Subject.find({ teacher: teacher._id }).populate('class', 'name section');
  }
}

module.exports = new TeacherService();
