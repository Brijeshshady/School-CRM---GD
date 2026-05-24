const Student = require('../models/Student');
const Grade = require('../models/Grade');
const Attendance = require('../models/Attendance');
const Assignment = require('../models/Assignment');
const Subject = require('../models/Subject'); // Added to ensure registration

/**
 * Student Service
 * Handles identity-based data retrieval for students.
 */
class StudentService {
  async getProfile(userId) {
    return await Student.findOne({ user: userId })
      .populate('user', 'name email')
      .populate('class', 'name section');
  }

  async getGrades(userId) {
    const student = await Student.findOne({ user: userId });
    if (!student) return [];
    
    return await Grade.find({ student: student._id })
      .populate('subject', 'name code')
      .populate('assignment', 'title')
      .sort('-createdAt');
  }

  async getAttendance(userId) {
    const student = await Student.findOne({ user: userId });
    if (!student) return [];

    return await Attendance.find({ student: student._id })
      .populate('class', 'name section')
      .sort('-date');
  }

  async getAssignments(userId) {
    const student = await Student.findOne({ user: userId });
    if (!student) return [];

    return await Assignment.find({ class: student.class })
      .populate('subject', 'name')
      .populate({
        path: 'teacher',
        populate: { path: 'user', select: 'name' }
      })
      .sort('dueDate');
  }

  async getSchedule(userId) {
    const student = await Student.findOne({ user: userId });
    if (!student) return null;

    const Schedule = require('../models/Schedule');
    return await Schedule.find({ class: student.class })
      .populate('periods.subject', 'name')
      .populate({
        path: 'periods.teacher',
        populate: { path: 'user', select: 'name' }
      });
  }

  async getAssignedTeachers(userId) {
    const student = await Student.findOne({ user: userId });
    if (!student) return [];

    const Teacher = require('../models/Teacher');
    return await Teacher.find({ assignedStudents: student._id })
      .populate('user', 'name email')
      .populate('assignedClasses', 'name section');
  }

  async getAllStudents(query = {}) {
    const filter = {};
    if (query.class) filter.class = query.class;
    
    // If teacher is specified, find students in classes managed by that teacher
    if (query.teacherId) {
      const Teacher = require('../models/Teacher');
      const Class = require('../models/Class');
      const teacher = await Teacher.findById(query.teacherId);
      
      if (teacher) {
        // Find all classes where this teacher is assigned or leading
        const classes = await Class.find({
          $or: [
            { _id: { $in: teacher.assignedClasses } },
            { classTeacher: teacher._id }
          ]
        });
        
        const classIds = classes.map(c => c._id);
        
        // Filter students by these classes OR if they are explicitly assigned to the teacher
        filter.$or = [
          { class: { $in: classIds } },
          { _id: { $in: teacher.assignedStudents } }
        ];
      }
    }
    
    return await Student.find(filter)
      .populate('user', 'name email')
      .populate('class', 'name section')
      .populate({
        path: 'parentIds',
        populate: { path: 'user', select: 'name email' }
      })
      .sort('rollNumber');
  }
}

module.exports = new StudentService();
