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

    // 2. Process Records with upsert to prevent unique constraint crashes and support edits
    const savedRecords = [];
    for (const record of records) {
      const dateVal = record.date ? new Date(record.date) : new Date();
      dateVal.setHours(12, 0, 0, 0); // Normalize time components
      const period = record.period || 'Daily';

      const updatedRecord = await Attendance.findOneAndUpdate(
        { student: record.student, date: dateVal, period },
        {
          student: record.student,
          class: classId,
          date: dateVal,
          period,
          status: record.status,
          remarks: record.remarks || '',
          recordedBy: userId,
          type: record.type || 'Daily',
          mode: record.mode || 'Offline',
        },
        { upsert: true, new: true }
      );
      savedRecords.push(updatedRecord);
    }

    return savedRecords;
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
