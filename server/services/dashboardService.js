const Student = require('../models/Student');
const Teacher = require('../models/Teacher');
const Attendance = require('../models/Attendance');
const Grade = require('../models/Grade');
const Assignment = require('../models/Assignment');
const Class = require('../models/Class');
const Subject = require('../models/Subject');
const Ticket = require('../models/Ticket');
const { ATTENDANCE_STATUS, ROLES } = require('../constants');

/**
 * Dashboard Service
 * Handles complex aggregations and summary statistics for dashboards.
 */
class DashboardService {
  /**
   * Get statistics for a specific student
   */
  async getStudentStats(userId) {
    const student = await Student.findOne({ user: userId });
    if (!student) return null;

    const studentId = student._id;

    // 1. Calculate Attendance Percentage
    const attendanceRecords = await Attendance.find({ student: studentId });
    const totalDays = attendanceRecords.length;
    const presentDays = attendanceRecords.filter(r => r.status === ATTENDANCE_STATUS.PRESENT).length;
    const attendancePercentage = totalDays > 0 ? (presentDays / totalDays) * 100 : 0;

    // 2. Calculate Average Grade
    const grades = await Grade.find({ student: studentId });
    const avgGrade = grades.length > 0 
      ? grades.reduce((acc, curr) => acc + (curr.marksObtained / curr.totalMarks), 0) / grades.length * 100 
      : 0;

    // 3. Count Pending Assignments
    const pendingAssignments = await Assignment.countDocuments({
      class: student.class,
      dueDate: { $gte: new Date() }
    });

    // 4. Recent activities
    const recentActivities = [
      ...(await Attendance.find({ student: studentId }).sort({ createdAt: -1 }).limit(2).lean()).map(a => ({
        type: 'attendance',
        msg: `Attendance recorded: ${a.status}`,
        time: a.createdAt,
        color: 'text-emerald-600',
        bg: 'bg-emerald-100'
      })),
      ...(await Grade.find({ student: studentId }).populate('subject', 'name').sort({ createdAt: -1 }).limit(2).lean()).map(g => ({
        type: 'grade',
        msg: `Grade posted for ${g.subject ? g.subject.name : 'Subject'}`,
        time: g.createdAt,
        color: 'text-purple-600',
        bg: 'bg-purple-100'
      }))
    ].sort((a, b) => b.time - a.time).slice(0, 4);

    let totalSubjects = 0;
    if (student.class) {
      totalSubjects = await Subject.countDocuments({ class: student.class });
    }
    if (totalSubjects === 0) {
      totalSubjects = await Grade.distinct('subject', { student: studentId }).then(s => s.length);
    }

    return {
      attendancePercentage: Math.round(attendancePercentage),
      averageGrade: Math.round(avgGrade),
      pendingAssignments,
      totalSubjects,
      activities: recentActivities
    };
  }

  /**
   * Get statistics for a specific teacher
   */
  async getTeacherStats(userId) {
    const teacherService = require('./teacherService');
    const teacher = await teacherService._getOrCreateProfile(userId);
    if (!teacher) return null;

    const teacherId = teacher._id;

    // 1. Total Classes
    const classes = await Class.find({
      $or: [
        { _id: { $in: teacher.assignedClasses } },
        { classTeacher: teacherId }
      ]
    });
    
    const totalClasses = classes.length;

    // 2. Active Assignments
    const activeAssignments = await Assignment.countDocuments({
      teacher: teacherId,
      dueDate: { $gte: new Date() }
    });

    // 3. Pending Attendance
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const classesWithAttendance = await Attendance.distinct('class', { date: { $gte: today } });
    const pendingAttendance = classes.filter(c => !classesWithAttendance.some(id => id.toString() === c._id.toString())).length;

    // 4. Total Students
    const totalAssignedStudents = await Student.countDocuments({
      class: { $in: classes.map(c => c._id) }
    });

    // 5. Recent Activities
    const recentActivities = [
      ...(await Assignment.find({ teacher: teacherId }).sort({ createdAt: -1 }).limit(2).lean()).map(a => ({
        type: 'assignment',
        msg: `Assignment created: ${a.title}`,
        time: a.createdAt,
        color: 'text-blue-600',
        bg: 'bg-blue-100'
      })),
      ...(await Attendance.find({ class: { $in: classes.map(c => c._id) } }).sort({ createdAt: -1 }).limit(2).lean()).map(a => ({
        type: 'attendance',
        msg: `Attendance updated for Class`,
        time: a.createdAt,
        color: 'text-emerald-600',
        bg: 'bg-emerald-100'
      }))
    ].sort((a, b) => b.time - a.time).slice(0, 4);

    return {
      totalClasses,
      activeAssignments,
      pendingAttendance,
      totalAssignedStudents,
      department: teacher.department,
      activities: recentActivities
    };
  }

  /**
   * Get comprehensive Admin Analytics
   */
  async getAdminStats() {
    return {
      totalStudents: await Student.countDocuments(),
      totalTeachers: await Teacher.countDocuments(),
      totalClasses: await Class.countDocuments(),
      totalSubjects: await Subject.countDocuments(),
      openTickets: await Ticket.countDocuments({ status: { $in: ['Open', 'In Progress'] } })
    };
  }

  /**
   * Get comprehensive Admin Analytics for Charts
   */
  async getAdminAnalytics() {
    // 1. Enrollment Trends (last 6 months)
    const sixMonthsAgo = new Date();
    sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);
    
    const enrollmentTrends = await Student.aggregate([
      { $match: { createdAt: { $gte: sixMonthsAgo } } },
      {
        $group: {
          _id: { $month: "$createdAt" },
          count: { $sum: 1 }
        }
      },
      { $sort: { "_id": 1 } }
    ]);

    // 2. Performance by Class
    const classPerformance = await Grade.aggregate([
      {
        $group: {
          _id: "$class",
          avgScore: { $avg: { $divide: ["$marksObtained", "$totalMarks"] } },
          totalStudents: { $addToSet: "$student" }
        }
      },
      {
        $lookup: {
          from: 'classes',
          localField: '_id',
          foreignField: '_id',
          as: 'classInfo'
        }
      },
      { $unwind: "$classInfo" },
      {
        $project: {
          name: "$classInfo.name",
          section: "$classInfo.section",
          avgScore: { $multiply: ["$avgScore", 100] },
          studentCount: { $size: "$totalStudents" }
        }
      }
    ]);

    // 3. Attendance Overview
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const attendanceStats = await Attendance.aggregate([
      { $match: { date: { $gte: today } } },
      {
        $group: {
          _id: "$status",
          count: { $sum: 1 }
        }
      }
    ]);

    // 4. Ticket Status Distribution
    const ticketStats = await Ticket.aggregate([
      {
        $group: {
          _id: "$status",
          count: { $sum: 1 }
        }
      }
    ]);

    return {
      enrollmentTrends,
      classPerformance,
      attendanceStats,
      ticketStats,
      totalStudents: await Student.countDocuments(),
      totalTeachers: await Teacher.countDocuments(),
      totalClasses: await Class.countDocuments(),
      openTickets: await Ticket.countDocuments({ status: { $in: ['Open', 'In Progress'] } })
    };
  }
}

module.exports = new DashboardService();
