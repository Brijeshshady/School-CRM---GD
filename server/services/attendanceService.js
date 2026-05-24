const Attendance = require('../models/Attendance');
const TeacherService = require('./teacherService');

/**
 * Attendance Service
 * Handles transactional attendance logic with ownership validation.
 */
class AttendanceService {
  /**
   * Submit attendance for a class
   * Enforces that the submitting teacher actually teaches the class.
   */
  async submitAttendance(userId, classId, records) {
    // 1. Verify Ownership
    const isOwner = await TeacherService.verifyClassOwnership(userId, classId);
    if (!isOwner) {
      throw new Error('Not authorized to submit attendance for this class');
    }

    // 2. Process Records
    const attendanceData = records.map(record => ({
      ...record,
      class: classId,
      recordedBy: userId,
      date: record.date || new Date()
    }));

    // In a real app, we might use a bulkWrite or updateMany here
    return await Attendance.insertMany(attendanceData);
  }

  async getClassAttendance(userId, classId) {
    const isOwner = await TeacherService.verifyClassOwnership(userId, classId);
    if (!isOwner) {
      throw new Error('Not authorized to view attendance for this class');
    }

    return await Attendance.find({ class: classId })
      .populate('student', 'name studentId')
      .sort('-date');
  }
}

module.exports = new AttendanceService();
