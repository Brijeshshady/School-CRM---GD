require('dotenv').config();
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

// Models
const User = require('../models/User');
const Student = require('../models/Student');
const Teacher = require('../models/Teacher');
const Parent = require('../models/Parent');
const Class = require('../models/Class');
const Subject = require('../models/Subject');
const Schedule = require('../models/Schedule');
const Timetable = require('../models/Timetable');
const Assignment = require('../models/Assignment');
const Attendance = require('../models/Attendance');
const Grade = require('../models/Grade');
const Announcement = require('../models/Announcement');
const Ticket = require('../models/Ticket');
const Doubt = require('../models/Doubt');
const Conversation = require('../models/Conversation');
const Message = require('../models/Message');
const Notification = require('../models/Notification');
const ExamType = require('../models/ExamType');
const ExamGrade = require('../models/ExamGrade');
const ReportCard = require('../models/ReportCard');
const Fee = require('../models/Fee');

const { ROLES, ATTENDANCE_STATUS, ASSIGNMENT_STATUS } = require('../constants');
const sampleData = require('../data/sampleData');

const seedDatabase = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB for advanced seeding...');

    // 1. Reset database collections
    const collections = await mongoose.connection.db.collections();
    for (let collection of collections) {
      await collection.deleteMany({});
      console.log(`Cleared collection: ${collection.collectionName}`);
    }

    // 2. Seed Users
    const hashedUsers = await Promise.all(sampleData.users.map(async (user) => {
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(user.password, salt);
      return { ...user, password: hashedPassword };
    }));
    const users = await User.insertMany(hashedUsers);
    console.log('✔ Seeded Users');

    const admin = users.find(u => u.role === ROLES.ADMIN);
    const parentUsers = users.filter(u => u.role === ROLES.PARENT);
    const studentUsers = users.filter(u => u.role === ROLES.STUDENT);
    const teacherUsers = users.filter(u => u.role === ROLES.TEACHER);

    // Find specific parents by email
    const ravi1 = parentUsers.find(u => u.email === 'parent1@school.com');
    const ravi2 = parentUsers.find(u => u.email === 'ravi.kumar@example.com');
    const sunita = parentUsers.find(u => u.email === 'parent2@school.com');

    // Find specific students by email
    const aarav1 = studentUsers.find(u => u.email === 'student1@school.com');
    const aarav2 = studentUsers.find(u => u.email === 'aarav.kumar@school.edu.in');
    const rohan = studentUsers.find(u => u.email === 'student2@school.com');

    // Find specific teachers by email/name
    const priya1 = teacherUsers.find(u => u.email === 'teacher1@school.com');
    const priya2 = teacherUsers.find(u => u.email === 'priya.sharma@school.edu.in');
    const anjali1 = teacherUsers.find(u => u.email === 'teacher2@school.com');
    const anjali2 = teacherUsers.find(u => u.email === 'anjali.gupta@school.edu.in');
    const rajesh1 = teacherUsers.find(u => u.email === 'teacher3@school.com');
    const rajesh2 = teacherUsers.find(u => u.email === 'rajesh.k@school.edu.in');
    const vikram = teacherUsers.find(u => u.email === 'teacher4@school.com');
    const kavita = teacherUsers.find(u => u.email === 'teacher5@school.com');
    const meera = teacherUsers.find(u => u.email === 'teacher6@school.com');
    const rahul = teacherUsers.find(u => u.email === 'teacher7@school.com');

    // 3. Seed Classes
    const classes = await Class.insertMany(sampleData.classes);
    console.log('✔ Seeded Classes');

    const class10A = classes.find(c => c.name === 'Class 10' && c.section === 'A');
    const class10B = classes.find(c => c.name === 'Class 10' && c.section === 'B');

    // 4. Seed Teachers
    const teacherDocsData = [
      { user: priya1._id, employeeId: 'EMP101', department: 'Languages', assignedClasses: [class10A._id], canUploadTimetable: true },
      { user: priya2._id, employeeId: 'EMP101-2', department: 'Languages', assignedClasses: [class10A._id], canUploadTimetable: true },
      { user: anjali1._id, employeeId: 'EMP102', department: 'Mathematics', assignedClasses: [class10A._id, class10B._id] },
      { user: anjali2._id, employeeId: 'EMP102-2', department: 'Mathematics', assignedClasses: [class10A._id, class10B._id] },
      { user: rajesh1._id, employeeId: 'EMP103', department: 'Science', assignedClasses: [class10A._id] },
      { user: rajesh2._id, employeeId: 'EMP103-2', department: 'Science', assignedClasses: [class10A._id] },
      { user: vikram._id, employeeId: 'EMP104', department: 'Sports', assignedClasses: [class10A._id, class10B._id] },
      { user: kavita._id, employeeId: 'EMP105', department: 'Science', assignedClasses: [class10A._id, class10B._id] },
      { user: meera._id, employeeId: 'EMP106', department: 'Languages', assignedClasses: [class10A._id] },
      { user: rahul._id, employeeId: 'EMP107', department: 'Social Sciences', assignedClasses: [class10A._id, class10B._id] }
    ];
    const teachers = await Teacher.insertMany(teacherDocsData);
    console.log('✔ Seeded Teachers');

    const teacherPriyaDoc = teachers.find(t => t.user.toString() === priya2._id.toString() || t.user.toString() === priya1._id.toString());
    const teacherAnjaliDoc = teachers.find(t => t.user.toString() === anjali2._id.toString() || t.user.toString() === anjali1._id.toString());
    const teacherRajeshDoc = teachers.find(t => t.user.toString() === rajesh2._id.toString() || t.user.toString() === rajesh1._id.toString());
    const teacherVikramDoc = teachers.find(t => t.user.toString() === vikram._id.toString());
    const teacherKavitaDoc = teachers.find(t => t.user.toString() === kavita._id.toString());
    const teacherMeeraDoc = teachers.find(t => t.user.toString() === meera._id.toString());
    const teacherRahulDoc = teachers.find(t => t.user.toString() === rahul._id.toString());

    // Link Priya Sharma as Class Teacher of 10-A
    class10A.classTeacher = teacherPriyaDoc._id;
    await class10A.save();

    // 5. Seed Subjects
    const subjectData = sampleData.subjects.map(sub => {
      let teacherId = teacherAnjaliDoc._id; // default
      if (sub.name === 'Physics') teacherId = teacherRajeshDoc._id;
      else if (sub.name === 'Chemistry') teacherId = teacherKavitaDoc._id;
      else if (sub.name === 'English') teacherId = teacherMeeraDoc._id;
      else if (sub.name === 'History' || sub.name === 'Geography') teacherId = teacherRahulDoc._id;

      return {
        ...sub,
        class: class10A._id,
        teacher: teacherId
      };
    });
    const subjects = await Subject.insertMany(subjectData);
    console.log('✔ Seeded Subjects');

    const mathSub = subjects.find(s => s.name === 'Mathematics');
    const physSub = subjects.find(s => s.name === 'Physics');
    const chemSub = subjects.find(s => s.name === 'Chemistry');
    const englSub = subjects.find(s => s.name === 'English');
    const histSub = subjects.find(s => s.name === 'History');
    const geogSub = subjects.find(s => s.name === 'Geography');

    // Link subjects to class
    class10A.subjects = subjects.map(s => s._id);
    await class10A.save();

    // 6. Seed Students
    const studentDocsData = [
      { user: aarav1._id, studentId: 'STU-2026-0142', class: class10A._id, rollNumber: '15' },
      { user: aarav2._id, studentId: 'STU-2026-0142-2', class: class10A._id, rollNumber: '15' },
      { user: rohan._id, studentId: 'STU-2026-0143', class: class10B._id, rollNumber: '1' }
    ];
    const students = await Student.insertMany(studentDocsData);
    console.log('✔ Seeded Students');

    const studentAaravDoc1 = students.find(s => s.user.toString() === aarav1._id.toString());
    const studentAaravDoc2 = students.find(s => s.user.toString() === aarav2._id.toString());
    const studentRohanDoc = students.find(s => s.user.toString() === rohan._id.toString());

    // 7. Seed Parents
    const parentDocsData = [
      { user: ravi1._id, studentIds: [studentAaravDoc1._id, studentAaravDoc2._id], occupation: 'Business' },
      { user: ravi2._id, studentIds: [studentAaravDoc1._id, studentAaravDoc2._id], occupation: 'Business' },
      { user: sunita._id, studentIds: [studentRohanDoc._id], occupation: 'Teacher' }
    ];
    const parents = await Parent.insertMany(parentDocsData);
    console.log('✔ Seeded Parents');

    const parentRaviDoc1 = parents.find(p => p.user.toString() === ravi1._id.toString());
    const parentRaviDoc2 = parents.find(p => p.user.toString() === ravi2._id.toString());
    const parentSunitaDoc = parents.find(p => p.user.toString() === sunita._id.toString());

    // Update students to link parentIds
    studentAaravDoc1.parentIds = [parentRaviDoc1._id, parentRaviDoc2._id];
    await studentAaravDoc1.save();
    studentAaravDoc2.parentIds = [parentRaviDoc1._id, parentRaviDoc2._id];
    await studentAaravDoc2.save();
    studentRohanDoc.parentIds = [parentSunitaDoc._id];
    await studentRohanDoc.save();

    // 8. Seed Schedules
    const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];
    const periodsTemplate = [
      { startTime: '08:00', endTime: '09:00', subject: mathSub._id, teacher: teacherAnjaliDoc._id, room: 'Room 201' },
      { startTime: '09:00', endTime: '10:00', subject: physSub._id, teacher: teacherRajeshDoc._id, room: 'Lab 1' },
      { startTime: '10:15', endTime: '11:15', subject: chemSub._id, teacher: teacherKavitaDoc._id, room: 'Lab 2' },
      { startTime: '11:15', endTime: '12:15', subject: englSub._id, teacher: teacherMeeraDoc._id, room: 'Room 105' },
      { startTime: '13:00', endTime: '14:00', subject: histSub._id, teacher: teacherRahulDoc._id, room: 'Room 303' },
      { startTime: '14:00', endTime: '15:00', subject: geogSub._id, teacher: teacherRahulDoc._id, room: 'Room 303' }
    ];

    const scheduleData = days.map(day => ({
      class: class10A._id,
      day,
      periods: periodsTemplate
    }));
    await Schedule.insertMany(scheduleData);
    console.log('✔ Seeded Weekly Schedules');

    // 9. Seed Timetable Upload Approval
    const timetableRows = [
      { day: 'Monday', period: '1', startTime: '08:00', endTime: '09:00', subject: 'Mathematics', teacher: 'Mrs. Anjali Gupta', room: 'Room 201' },
      { day: 'Monday', period: '2', startTime: '09:00', endTime: '10:00', subject: 'Physics', teacher: 'Mr. Rajesh Koothrappali', room: 'Lab 1' },
      { day: 'Tuesday', period: '1', startTime: '08:00', endTime: '09:00', subject: 'Mathematics', teacher: 'Mrs. Anjali Gupta', room: 'Room 201' },
      { day: 'Wednesday', period: '1', startTime: '08:00', endTime: '09:00', subject: 'Mathematics', teacher: 'Mrs. Anjali Gupta', room: 'Room 201' },
      { day: 'Thursday', period: '1', startTime: '08:00', endTime: '09:00', subject: 'Mathematics', teacher: 'Mrs. Anjali Gupta', room: 'Room 201' },
      { day: 'Friday', period: '1', startTime: '08:00', endTime: '09:00', subject: 'Mathematics', teacher: 'Mrs. Anjali Gupta', room: 'Room 201' }
    ];
    await Timetable.create({
      class: class10A._id,
      section: 'A',
      uploadedBy: priya2._id,
      rows: timetableRows,
      status: 'Approved',
      approvedBy: admin._id,
      approvedAt: new Date()
    });
    console.log('✔ Seeded Timetable Approval Record');

    // 10. Seed Assignments
    const assignmentDocsData = sampleData.assignments.map(ass => {
      let subId = mathSub._id;
      let tId = teacherAnjaliDoc._id;

      if (ass.title.includes('Newton\'s')) { subId = physSub._id; tId = teacherRajeshDoc._id; }
      else if (ass.title.includes('Chemical')) { subId = chemSub._id; tId = teacherKavitaDoc._id; }
      else if (ass.title.includes('Climate')) { subId = englSub._id; tId = teacherMeeraDoc._id; }
      else if (ass.title.includes('Freedom')) { subId = histSub._id; tId = teacherRahulDoc._id; }
      else if (ass.title.includes('Sports')) { subId = mathSub._id; tId = teacherVikramDoc._id; }

      return {
        ...ass,
        teacher: tId,
        subject: subId,
        class: class10A._id,
        dueDate: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000)
      };
    });
    const assignments = await Assignment.insertMany(assignmentDocsData);
    console.log('✔ Seeded Assignments');

    // 11. Seed Attendance
    const attendanceRecords = [];
    const baseDate = new Date('2026-02-01');
    const statuses = [
      ATTENDANCE_STATUS.PRESENT,
      ATTENDANCE_STATUS.PRESENT,
      ATTENDANCE_STATUS.PRESENT,
      ATTENDANCE_STATUS.LATE,
      ATTENDANCE_STATUS.PRESENT,
      ATTENDANCE_STATUS.ABSENT,
      ATTENDANCE_STATUS.PRESENT,
      ATTENDANCE_STATUS.PRESENT
    ];

    for (let i = 0; i < 20; i++) {
      const date = new Date(baseDate);
      date.setDate(baseDate.getDate() - i);
      // Skip weekends
      if (date.getDay() !== 0 && date.getDay() !== 6) {
        attendanceRecords.push({
          student: studentAaravDoc1._id,
          class: class10A._id,
          date,
          status: statuses[i % statuses.length],
          recordedBy: priya2._id
        });
        attendanceRecords.push({
          student: studentAaravDoc2._id,
          class: class10A._id,
          date,
          status: statuses[i % statuses.length],
          recordedBy: priya2._id
        });
      }
    }
    await Attendance.insertMany(attendanceRecords);
    console.log('✔ Seeded Attendance History');

    // 12. Seed Grades
    const gradeData = [
      { student: studentAaravDoc1._id, subject: mathSub._id, assignment: assignments[0]._id, marksObtained: 42, totalMarks: 50, grade: 'A', gradedBy: priya2._id },
      { student: studentAaravDoc1._id, subject: physSub._id, assignment: assignments[1]._id, marksObtained: 46, totalMarks: 50, grade: 'A+', gradedBy: priya2._id },
      { student: studentAaravDoc2._id, subject: mathSub._id, assignment: assignments[0]._id, marksObtained: 44, totalMarks: 50, grade: 'A', gradedBy: priya2._id },
      { student: studentAaravDoc2._id, subject: physSub._id, assignment: assignments[1]._id, marksObtained: 48, totalMarks: 50, grade: 'A+', gradedBy: priya2._id }
    ];
    await Grade.insertMany(gradeData);
    console.log('✔ Seeded Assignment Grades');

    // 13. Seed Tickets
    const ticketDocsData = sampleData.tickets.map(t => ({
      ...t,
      createdBy: ravi2._id,
      assignedTo: admin._id,
      messages: t.messages.map((m, idx) => ({
        ...m,
        senderId: m.senderRole === ROLES.PARENT ? ravi2._id : admin._id,
        timestamp: new Date(Date.now() - (t.messages.length - idx) * 3600 * 1000)
      }))
    }));
    await Ticket.insertMany(ticketDocsData);
    console.log('✔ Seeded Tickets');

    // 14. Seed Doubts
    const doubtDocsData = sampleData.doubts.map(d => ({
      ...d,
      student: aarav2._id,
      teacher: anjali2._id,
      replies: d.replies.map((r, idx) => ({
        ...r,
        senderId: r.senderRole === ROLES.STUDENT ? aarav2._id : anjali2._id,
        timestamp: new Date(Date.now() - (d.replies.length - idx) * 1800 * 1000)
      }))
    }));
    await Doubt.insertMany(doubtDocsData);
    console.log('✔ Seeded Doubts');

    // 15. Seed Announcements
    const announcementDocsData = sampleData.announcements.map(a => ({
      ...a,
      createdBy: admin._id,
      class: a.targetAudience === 'Parents' ? class10A._id : undefined
    }));
    await Announcement.insertMany(announcementDocsData);
    console.log('✔ Seeded Announcements');

    // 16. Seed Exam Types
    const examTypes = await ExamType.insertMany(sampleData.examTypes);
    console.log('✔ Seeded Exam Types');

    const midtermType = examTypes.find(e => e.code === 'MID');

    // 17. Seed Exam Grades & Report Cards
    const examGradesData = [
      { student: studentAaravDoc2._id, class: class10A._id, subject: mathSub._id, examType: midtermType._id, marks: { theory: 88, practical: 0, assignment: 10, attendance: 5, viva: 0 }, maxMarks: { theory: 100, practical: 0, assignment: 10, attendance: 5, viva: 0 }, gradedBy: anjali2._id },
      { student: studentAaravDoc2._id, class: class10A._id, subject: physSub._id, examType: midtermType._id, marks: { theory: 85, practical: 15, assignment: 10, attendance: 5, viva: 0 }, maxMarks: { theory: 100, practical: 20, assignment: 10, attendance: 5, viva: 0 }, gradedBy: rajesh2._id },
      { student: studentAaravDoc2._id, class: class10A._id, subject: chemSub._id, examType: midtermType._id, marks: { theory: 79, practical: 16, assignment: 10, attendance: 5, viva: 0 }, maxMarks: { theory: 100, practical: 20, assignment: 10, attendance: 5, viva: 0 }, gradedBy: kavita._id },
      { student: studentAaravDoc2._id, class: class10A._id, subject: englSub._id, examType: midtermType._id, marks: { theory: 82, practical: 0, assignment: 10, attendance: 5, viva: 0 }, maxMarks: { theory: 100, practical: 0, assignment: 10, attendance: 5, viva: 0 }, gradedBy: meera._id },
      { student: studentAaravDoc2._id, class: class10A._id, subject: histSub._id, examType: midtermType._id, marks: { theory: 86, practical: 0, assignment: 10, attendance: 5, viva: 0 }, maxMarks: { theory: 100, practical: 0, assignment: 10, attendance: 5, viva: 0 }, gradedBy: rahul._id },
      { student: studentAaravDoc2._id, class: class10A._id, subject: geogSub._id, examType: midtermType._id, marks: { theory: 80, practical: 0, assignment: 10, attendance: 5, viva: 0 }, maxMarks: { theory: 100, practical: 0, assignment: 10, attendance: 5, viva: 0 }, gradedBy: rahul._id }
    ];
    // We will save individually to trigger pre-save totals calculation hook
    const examGrades = [];
    for (let egData of examGradesData) {
      const egDoc = new ExamGrade(egData);
      await egDoc.save();
      examGrades.push(egDoc);
    }
    console.log('✔ Seeded Exam Grades');

    // Report Card
    const reportCard = new ReportCard({
      student: studentAaravDoc2._id,
      class: class10A._id,
      academicYear: '2025-2026',
      term: 'Midterm',
      attendancePercentage: 94,
      overallPercentage: 83.2,
      gpa: 3.5,
      cgpa: 3.5,
      classRank: 3,
      classPercentile: 90,
      teacherRemarks: 'Excellent analytical skills in Math and Science.',
      principalRemarks: 'Promising student, keep up the hard work.',
      status: 'published',
      publishedAt: new Date(),
      generatedBy: admin._id,
      subjectGrades: examGrades.map(eg => ({
        subject: eg.subject,
        examMarks: [{
          examType: eg.examType,
          marks: eg.marks,
          maxMarks: eg.maxMarks,
          totalObtained: eg.totalObtained,
          totalMax: eg.totalMax,
          percentage: eg.percentage,
          grade: eg.grade
        }],
        subjectPercentage: eg.percentage,
        subjectGrade: eg.grade,
        teacherRemarks: eg.remarks || 'Good progress'
      }))
    });
    await reportCard.save();
    console.log('✔ Seeded Report Card');

    // 18. Seed Fees
    const feeDocsData = sampleData.fees.map(f => ({
      ...f,
      student: aarav2._id,
      category: 'Tuition'
    }));
    await Fee.insertMany(feeDocsData);
    console.log('✔ Seeded Student Fee Invoices');

    // 19. Seed Notifications
    const notificationDocsData = [
      { userId: aarav2._id, type: 'assignment', title: 'New Math Assignment', message: 'Quadratic Equations Worksheet due in 5 days.', read: false },
      { userId: aarav2._id, type: 'grade', title: 'Physics Grade Published', message: 'You scored 48/50 in Newton\'s Laws Lab Report.', read: true },
      { userId: ravi2._id, type: 'attendance', title: 'Child Absent Alert', message: 'Aarav Kumar was marked absent on Jan 30, 2026.', read: false },
      { userId: ravi2._id, type: 'ticket', title: 'Ticket Updated', message: 'Ticket TKT-2026-001 has been set to In Progress.', read: false }
    ];
    await Notification.insertMany(notificationDocsData);
    console.log('✔ Seeded Notifications');

    // 20. Seed Chats / Conversations
    const pConversations = [
      { participants: [ravi2._id, priya2._id] },
      { participants: [ravi2._id, anjali2._id] },
      { participants: [ravi2._id, admin._id] }
    ];
    const createdConvs = await Conversation.insertMany(pConversations);

    // Messages for conversations
    const messageDocsData = [
      { conversation: createdConvs[0]._id, sender: ravi2._id, text: 'Namaste Priya ji, I wanted to ask about the upcoming exams.', isRead: true },
      { conversation: createdConvs[0]._id, sender: priya2._id, text: 'Namaste Ravi ji, yes, please feel free to ask.', isRead: true },
      { conversation: createdConvs[0]._id, sender: ravi2._id, text: 'Will the exam cover Chapter 5?', isRead: true },
      { conversation: createdConvs[0]._id, sender: priya2._id, text: 'Yes, it is included. Please ensure Aarav completes the revision worksheet.', isRead: false },
      
      { conversation: createdConvs[1]._id, sender: ravi2._id, text: 'Namaste Mrs. Gupta, Aarav is working hard on Math.', isRead: true },
      { conversation: createdConvs[1]._id, sender: anjali2._id, text: 'Excellent! He is making great progress in algebra classes.', isRead: true }
    ];
    const createdMsgs = await Message.insertMany(messageDocsData);

    // Update conversation lastMessage field
    createdConvs[0].lastMessage = createdMsgs[3]._id;
    await createdConvs[0].save();
    createdConvs[1].lastMessage = createdMsgs[5]._id;
    await createdConvs[1].save();

    console.log('✔ Seeded Conversations and Messages');

    console.log('\n\x1b[32m%s\x1b[0m', '★ Database optimized and seeded successfully! ★');
    process.exit(0);
  } catch (error) {
    console.error('Error seeding database:', error);
    process.exit(1);
  }
};

seedDatabase();
