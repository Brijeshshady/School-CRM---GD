const ExamType = require('../models/ExamType');
const ExamGrade = require('../models/ExamGrade');
const ReportCard = require('../models/ReportCard');
const Student = require('../models/Student');
const Class = require('../models/Class');
const Subject = require('../models/Subject');
const Attendance = require('../models/Attendance');
const Parent = require('../models/Parent');
const User = require('../models/User');
const ExamSchedule = require('../models/ExamSchedule');
const { createAndSendNotification } = require('../sockets/notificationSocket');
const asyncHandler = require('../middleware/asyncHandler');
const sendResponse = require('../utils/apiResponse');
const { HTTP_STATUS, ATTENDANCE_STATUS } = require('../constants');

// Helper to seed default exam types if none exist
const seedDefaultExamTypes = async () => {
  const count = await ExamType.countDocuments();
  if (count === 0) {
    const defaults = [
      { name: 'Unit Test', code: 'unit_test', description: 'Regular classroom unit assessment' },
      { name: 'Midterm', code: 'midterm', description: 'Middle of academic term exam' },
      { name: 'Quarterly', code: 'quarterly', description: 'First quarter assessments' },
      { name: 'Half-Yearly', code: 'half_yearly', description: 'Mid-year summative exams' },
      { name: 'Annual', code: 'annual', description: 'End of year final exams' },
      { name: 'Internal Assessment', code: 'internal', description: 'Class participation, attendance, and continuous assessment' }
    ];
    await ExamType.insertMany(defaults);
  }
};

// ==========================================
// 1. EXAM TYPE ENDPOINTS
// ==========================================

// @desc    Get all exam types
// @route   GET /api/exam-grades/exam-types
// @access  Private
exports.getExamTypes = asyncHandler(async (req, res) => {
  await seedDefaultExamTypes();
  const examTypes = await ExamType.find({ isActive: true });
  sendResponse(res, HTTP_STATUS.OK, examTypes, 'Exam types fetched successfully');
});

// @desc    Create exam type (Admin only)
// @route   POST /api/exam-grades/exam-types
// @access  Private/Admin
exports.createExamType = asyncHandler(async (req, res) => {
  const { name, code, description } = req.body;
  
  const exists = await ExamType.findOne({ code });
  if (exists) {
    res.status(HTTP_STATUS.BAD_REQUEST);
    throw new Error('Exam type code already exists');
  }

  const examType = await ExamType.create({ name, code, description });
  sendResponse(res, HTTP_STATUS.CREATED, examType, 'Exam type created successfully');
});

// @desc    Update exam type (Admin only)
// @route   PUT /api/exam-grades/exam-types/:id
// @access  Private/Admin
exports.updateExamType = asyncHandler(async (req, res) => {
  const { name, description, isActive } = req.body;
  const examType = await ExamType.findByIdAndUpdate(
    req.params.id,
    { name, description, isActive },
    { new: true, runValidators: true }
  );

  if (!examType) {
    res.status(HTTP_STATUS.NOT_FOUND);
    throw new Error('Exam type not found');
  }

  sendResponse(res, HTTP_STATUS.OK, examType, 'Exam type updated successfully');
});

// @desc    Delete exam type (Admin only)
// @route   DELETE /api/exam-grades/exam-types/:id
// @access  Private/Admin
exports.deleteExamType = asyncHandler(async (req, res) => {
  const examType = await ExamType.findByIdAndDelete(req.params.id);
  if (!examType) {
    res.status(HTTP_STATUS.NOT_FOUND);
    throw new Error('Exam type not found');
  }
  sendResponse(res, HTTP_STATUS.OK, null, 'Exam type deleted successfully');
});

// ==========================================
// 2. GRADEBOOK ENTRY ENDPOINTS
// ==========================================

// @desc    Get exam grades based on filters
// @route   GET /api/exam-grades
// @access  Private
exports.getExamGrades = asyncHandler(async (req, res) => {
  const { classId, subjectId, examTypeId, studentId } = req.query;
  const query = {};

  if (classId) query.class = classId;
  if (subjectId) query.subject = subjectId;
  if (examTypeId) query.examType = examTypeId;

  // Role-based Access Control
  if (req.user.role === 'Student') {
    const student = await Student.findOne({ user: req.user._id });
    if (!student) {
      res.status(HTTP_STATUS.NOT_FOUND);
      throw new Error('Student profile not found');
    }
    query.student = student._id;
    query.status = 'published'; // Students can only see published grades
  } else if (req.user.role === 'Parent') {
    const parent = await Parent.findOne({ user: req.user._id });
    if (!parent) {
      res.status(HTTP_STATUS.NOT_FOUND);
      throw new Error('Parent profile not found');
    }
    // If a specific studentId is passed, verify parent linked relation
    if (studentId) {
      const isLinked = parent.studentIds.some(id => id.toString() === studentId.toString());
      if (!isLinked) {
        res.status(HTTP_STATUS.FORBIDDEN);
        throw new Error('Not authorized to access grades of this student');
      }
      query.student = studentId;
    } else {
      query.student = { $in: parent.studentIds };
    }
    query.status = 'published'; // Parents can only see published grades
  } else if (req.user.role === 'Teacher') {
    // Teachers see draft + published grades for their query
    if (studentId) query.student = studentId;
  } else if (studentId) {
    query.student = studentId;
  }

  const grades = await ExamGrade.find(query)
    .populate('student', 'rollNumber')
    .populate({
      path: 'student',
      populate: { path: 'user', select: 'name avatar' }
    })
    .populate('subject', 'name code')
    .populate('examType', 'name code')
    .populate('class', 'name section');

  sendResponse(res, HTTP_STATUS.OK, grades, 'Exam grades fetched successfully');
});

// @desc    Upsert/Bulk Save Gradebook Marks (Save Draft / Publish)
// @route   POST /api/exam-grades/upsert
// @access  Private/Teacher/Admin
exports.upsertExamGrades = asyncHandler(async (req, res) => {
  const { classId, subjectId, examTypeId, status, gradesList } = req.body;

  if (!classId || !subjectId || !examTypeId || !Array.isArray(gradesList)) {
    res.status(HTTP_STATUS.BAD_REQUEST);
    throw new Error('Invalid gradebook inputs. Missing class, subject, exam type, or grades list');
  }

  const updatedGrades = [];

  for (const item of gradesList) {
    const { studentId, marks, maxMarks, remarks } = item;
    
    // Find or create grade entry
    let gradeEntry = await ExamGrade.findOne({
      student: studentId,
      class: classId,
      subject: subjectId,
      examType: examTypeId
    });

    if (gradeEntry) {
      gradeEntry.marks = { ...gradeEntry.marks, ...marks };
      gradeEntry.maxMarks = { ...gradeEntry.maxMarks, ...maxMarks };
      gradeEntry.remarks = remarks || gradeEntry.remarks;
      gradeEntry.status = status || gradeEntry.status;
      gradeEntry.gradedBy = req.user._id;
    } else {
      gradeEntry = new ExamGrade({
        student: studentId,
        class: classId,
        subject: subjectId,
        examType: examTypeId,
        marks,
        maxMarks,
        remarks: remarks || '',
        status: status || 'draft',
        gradedBy: req.user._id
      });
    }

    await gradeEntry.save();
    updatedGrades.push(gradeEntry);

    // If grades are published, send real-time notification
    if (status === 'published') {
      const studentObj = await Student.findById(studentId).populate('user');
      const subjectObj = await Subject.findById(subjectId);
      const examTypeObj = await ExamType.findById(examTypeId);
      
      if (studentObj && studentObj.user) {
        // Notify Student
        await createAndSendNotification({
          userId: studentObj.user._id,
          type: 'grade',
          title: 'Exam Marks Published',
          message: `Your marks for ${subjectObj.name} (${examTypeObj.name}) are now available! Grade: ${gradeEntry.grade} (${gradeEntry.percentage}%)`,
          actionUrl: `/student/grades`
        });

        // Notify Linked Parents
        const parents = await Parent.find({ studentIds: studentId }).populate('user');
        for (const p of parents) {
          if (p.user) {
            await createAndSendNotification({
              userId: p.user._id,
              type: 'grade',
              title: 'New Exam Marks Available',
              message: `Exam marks for ${studentObj.user.name} in ${subjectObj.name} (${examTypeObj.name}) have been published.`,
              actionUrl: `/parent/grades`
            });
          }
        }
      }
    }
  }

  sendResponse(res, HTTP_STATUS.OK, updatedGrades, 'Gradebook entries saved successfully');
});

// @desc    Excel Bulk Import Marks
// @route   POST /api/exam-grades/bulk-import
// @access  Private/Teacher/Admin
exports.bulkImportExamGrades = asyncHandler(async (req, res) => {
  const { classId, subjectId, examTypeId, grades } = req.body;

  if (!classId || !subjectId || !examTypeId || !Array.isArray(grades)) {
    res.status(HTTP_STATUS.BAD_REQUEST);
    throw new Error('Invalid upload structure');
  }

  const results = [];
  const errors = [];

  for (let idx = 0; idx < grades.length; idx++) {
    const row = grades[idx];
    const { rollNumber, theory, practical, assignment, attendance, viva, theoryMax, practicalMax, assignmentMax, attendanceMax, vivaMax, remarks } = row;

    try {
      // Find student by roll number and class
      const student = await Student.findOne({ class: classId, rollNumber }).populate('user');
      if (!student) {
        errors.push(`Row ${idx + 1}: Student with Roll Number "${rollNumber}" not found in this class.`);
        continue;
      }

      // Upsert
      let entry = await ExamGrade.findOne({
        student: student._id,
        class: classId,
        subject: subjectId,
        examType: examTypeId
      });

      const marks = {
        theory: Number(theory) || 0,
        practical: Number(practical) || 0,
        assignment: Number(assignment) || 0,
        attendance: Number(attendance) || 0,
        viva: Number(viva) || 0
      };

      const maxMarks = {
        theory: Number(theoryMax) || 0,
        practical: Number(practicalMax) || 0,
        assignment: Number(assignmentMax) || 0,
        attendance: Number(attendanceMax) || 0,
        viva: Number(vivaMax) || 0
      };

      if (entry) {
        entry.marks = marks;
        entry.maxMarks = maxMarks;
        entry.remarks = remarks || '';
        entry.gradedBy = req.user._id;
      } else {
        entry = new ExamGrade({
          student: student._id,
          class: classId,
          subject: subjectId,
          examType: examTypeId,
          marks,
          maxMarks,
          remarks: remarks || '',
          gradedBy: req.user._id,
          status: 'draft' // Bulk uploads start as drafts by default
        });
      }

      await entry.save();
      results.push(entry);
    } catch (e) {
      errors.push(`Row ${idx + 1}: Save error - ${e.message}`);
    }
  }

  if (errors.length > 0 && results.length === 0) {
    res.status(HTTP_STATUS.BAD_REQUEST);
    return sendResponse(res, HTTP_STATUS.BAD_REQUEST, { errors }, 'Bulk import failed completely');
  }

  sendResponse(res, HTTP_STATUS.OK, { importedCount: results.length, errors }, `Bulk import completed. Imported: ${results.length}, Errors: ${errors.length}`);
});

// ==========================================
// 3. ANALYTICS & RANKING SYSTEM
// ==========================================

// @desc    Get analytics for class rankings & toppers
// @route   GET /api/exam-grades/class-analytics/:classId
// @access  Private
exports.getClassAnalytics = asyncHandler(async (req, res) => {
  const { classId } = req.params;
  const { examTypeId } = req.query;

  if (!classId || !examTypeId) {
    res.status(HTTP_STATUS.BAD_REQUEST);
    throw new Error('Class ID and Exam Type ID are required');
  }

  // 1. Fetch all published grades for this class and exam type
  const grades = await ExamGrade.find({
    class: classId,
    examType: examTypeId,
    status: 'published'
  }).populate('student').populate({
    path: 'student',
    populate: { path: 'user', select: 'name' }
  }).populate('subject', 'name');

  if (grades.length === 0) {
    return sendResponse(res, HTTP_STATUS.OK, {
      subjectToppers: [],
      studentRankings: [],
      classAverage: 0
    }, 'No published grades found for analytics');
  }

  // 2. Calculate Subject-wise Toppers & Averages
  const subjectMap = {};
  const studentMap = {};

  grades.forEach(grade => {
    const subName = grade.subject.name;
    const stuName = grade.student.user.name;
    const stuId = grade.student._id.toString();

    // Subject stats
    if (!subjectMap[subName]) {
      subjectMap[subName] = {
        subject: subName,
        totalPercentage: 0,
        count: 0,
        topper: { name: '', score: -1 }
      };
    }
    subjectMap[subName].totalPercentage += grade.percentage;
    subjectMap[subName].count += 1;
    if (grade.percentage > subjectMap[subName].topper.score) {
      subjectMap[subName].topper = { name: stuName, score: grade.percentage };
    }

    // Student stats
    if (!studentMap[stuId]) {
      studentMap[stuId] = {
        id: stuId,
        name: stuName,
        rollNumber: grade.student.rollNumber,
        totalPercentage: 0,
        subjectCount: 0
      };
    }
    studentMap[stuId].totalPercentage += grade.percentage;
    studentMap[stuId].subjectCount += 1;
  });

  // Convert subject stats
  const subjectToppers = Object.values(subjectMap).map(sub => ({
    subject: sub.subject,
    average: parseFloat((sub.totalPercentage / sub.count).toFixed(2)),
    topperName: sub.topper.name,
    topperScore: sub.topper.score
  }));

  // Convert student stats, calculate overall average
  const studentRankings = Object.values(studentMap).map(stu => ({
    id: stu.id,
    name: stu.name,
    rollNumber: stu.rollNumber,
    overallPercentage: parseFloat((stu.totalPercentage / stu.subjectCount).toFixed(2))
  })).sort((a, b) => b.overallPercentage - a.overallPercentage);

  // Assign ranks
  studentRankings.forEach((stu, index) => {
    stu.rank = index + 1;
  });

  // Calculate overall class average
  const overallClassAverage = parseFloat(
    (studentRankings.reduce((sum, stu) => sum + stu.overallPercentage, 0) / studentRankings.length).toFixed(2)
  );

  sendResponse(res, HTTP_STATUS.OK, {
    subjectToppers,
    studentRankings,
    classAverage: overallClassAverage
  }, 'Class academic analytics loaded successfully');
});

// @desc    Get student performance trends and weak subjects
// @route   GET /api/exam-grades/student-analytics/:studentId
// @access  Private
exports.getStudentAnalytics = asyncHandler(async (req, res) => {
  const { studentId } = req.params;

  // Access validation
  if (req.user.role === 'Student') {
    const profile = await Student.findOne({ user: req.user._id });
    if (!profile || profile._id.toString() !== studentId) {
      res.status(HTTP_STATUS.FORBIDDEN);
      throw new Error('Not authorized to access these analytics');
    }
  } else if (req.user.role === 'Parent') {
    const parent = await Parent.findOne({ user: req.user._id });
    const isLinked = parent && parent.studentIds.some(id => id.toString() === studentId.toString());
    if (!parent || !isLinked) {
      res.status(HTTP_STATUS.FORBIDDEN);
      throw new Error('Not authorized to access linked student analytics');
    }
  }

  // Fetch all published grades for this student
  const grades = await ExamGrade.find({
    student: studentId,
    status: 'published'
  }).populate('subject', 'name').populate('examType', 'name');

  if (grades.length === 0) {
    return sendResponse(res, HTTP_STATUS.OK, {
      trends: [],
      weakSubjects: [],
      averages: []
    }, 'No academic records found for analytics');
  }

  // 1. Calculate subject averages and trends
  const subjectPerformance = {};
  const trendMap = {};

  grades.forEach(grade => {
    const subName = grade.subject.name;
    const examName = grade.examType.name;

    // Subject averages
    if (!subjectPerformance[subName]) {
      subjectPerformance[subName] = { total: 0, count: 0 };
    }
    subjectPerformance[subName].total += grade.percentage;
    subjectPerformance[subName].count += 1;

    // Exam type trends
    if (!trendMap[examName]) {
      trendMap[examName] = { exam: examName, total: 0, count: 0 };
    }
    trendMap[examName].total += grade.percentage;
    trendMap[examName].count += 1;
  });

  const weakSubjects = [];
  const averages = Object.entries(subjectPerformance).map(([subject, stats]) => {
    const avg = parseFloat((stats.total / stats.count).toFixed(2));
    if (avg < 50) {
      weakSubjects.push({ subject, average: avg, status: 'Needs Improvement' });
    } else if (avg < 65) {
      weakSubjects.push({ subject, average: avg, status: 'Moderate Performance' });
    }
    return { subject, average: avg };
  });

  const trends = Object.values(trendMap).map(tr => ({
    exam: tr.exam,
    average: parseFloat((tr.total / tr.count).toFixed(2))
  }));

  sendResponse(res, HTTP_STATUS.OK, {
    averages,
    trends,
    weakSubjects
  }, 'Student academic trends loaded successfully');
});

// ==========================================
// 4. REPORT CARD COMPILATION & GENERATION
// ==========================================

// @desc    Generate / Compile Report Card for a Student
// @route   POST /api/exam-grades/report-cards/generate
// @access  Private/Teacher/Admin
exports.generateReportCard = asyncHandler(async (req, res) => {
  const { studentId, classId, academicYear, term, teacherRemarks } = req.body;

  if (!studentId || !classId) {
    res.status(HTTP_STATUS.BAD_REQUEST);
    throw new Error('Student ID and Class ID are required');
  }

  // 1. Fetch published grades for this student, class, academicYear
  const grades = await ExamGrade.find({
    student: studentId,
    class: classId,
    academicYear: academicYear || '2025-2026',
    status: 'published'
  }).populate('subject').populate('examType');

  if (grades.length === 0) {
    res.status(HTTP_STATUS.BAD_REQUEST);
    throw new Error('No published exam grades found for this student. Cannot compile report card');
  }

  // 2. Fetch attendance dynamically
  const attendanceRecords = await Attendance.find({
    student: studentId,
    class: classId
  });
  
  let attendancePercentage = 100;
  if (attendanceRecords.length > 0) {
    const presentCount = attendanceRecords.filter(r => r.status === ATTENDANCE_STATUS.PRESENT || r.status === ATTENDANCE_STATUS.LATE).length;
    attendancePercentage = parseFloat(((presentCount / attendanceRecords.length) * 100).toFixed(2));
  }

  // 3. Group by subject and compile components
  const subjectMap = {};
  grades.forEach(g => {
    const subId = g.subject._id.toString();
    if (!subjectMap[subId]) {
      subjectMap[subId] = {
        subject: g.subject._id,
        examMarks: [],
        gradesList: []
      };
    }

    subjectMap[subId].examMarks.push({
      examType: g.examType._id,
      marks: g.marks,
      maxMarks: g.maxMarks,
      totalObtained: g.totalObtained,
      totalMax: g.totalMax,
      percentage: g.percentage,
      grade: g.grade
    });

    subjectMap[subId].gradesList.push(g);
  });

  const getExamGroup = (examType) => {
    const code = (examType?.code || '').toLowerCase();
    const name = (examType?.name || '').toLowerCase();

    if (code === 'annual' || name.includes('annual') || name.includes('final')) {
      return 3; // 50%
    }
    if (code === 'midterm' || code === 'half_yearly' || name.includes('mid') || name.includes('half')) {
      return 2; // 30%
    }
    return 1; // 20%
  };

  // Calculate subject final average using grading weightage (20% Unit Test + 30% Midterm + 50% Final Exam)
  const subjectGrades = Object.values(subjectMap).map(sub => {
    const groupSum = { 1: 0, 2: 0, 3: 0 };
    const groupCount = { 1: 0, 2: 0, 3: 0 };

    sub.gradesList.forEach(g => {
      const group = getExamGroup(g.examType);
      const pct = g.totalMax > 0 ? (g.totalObtained / g.totalMax) * 100 : 0;
      groupSum[group] += pct;
      groupCount[group] += 1;
    });

    let totalWeight = 0;
    let weightedSum = 0;

    for (let g = 1; g <= 3; g++) {
      if (groupCount[g] > 0) {
        const avg = groupSum[g] / groupCount[g];
        const weight = g === 1 ? 20 : g === 2 ? 30 : 50;
        totalWeight += weight;
        weightedSum += avg * weight;
      }
    }

    const subPct = totalWeight > 0 ? parseFloat((weightedSum / totalWeight).toFixed(2)) : 0;

    let subGrade = 'F';
    if (subPct >= 90) subGrade = 'A+';
    else if (subPct >= 80) subGrade = 'A';
    else if (subPct >= 70) subGrade = 'B';
    else if (subPct >= 60) subGrade = 'C';
    else if (subPct >= 50) subGrade = 'D';
    else if (subPct >= 40) subGrade = 'E';

    return {
      subject: sub.subject,
      examMarks: sub.examMarks,
      subjectPercentage: subPct,
      subjectGrade: subGrade,
      teacherRemarks: ''
    };
  });

  // Overall calculation
  const overallPercentage = parseFloat(
    (subjectGrades.reduce((sum, s) => sum + s.subjectPercentage, 0) / subjectGrades.length).toFixed(2)
  );

  // Compute GPA and CGPA
  const gpa = parseFloat(ExamGrade.calculateGPA(overallPercentage).toFixed(2));
  const cgpa = gpa; // Simple representation

  // 4. Calculate Rank and Percentile compared to classmates using the same weightage calculation
  const classStudents = await Student.find({ class: classId });
  const classPercentages = [];

  const calculateStudentOverallWeighted = async (studId) => {
    const studGrades = await ExamGrade.find({
      student: studId,
      class: classId,
      academicYear: academicYear || '2025-2026',
      status: 'published'
    }).populate('examType');

    if (studGrades.length === 0) return 0;

    // Group by subject
    const studSubMap = {};
    studGrades.forEach(g => {
      const subId = g.subject.toString();
      if (!studSubMap[subId]) studSubMap[subId] = [];
      studSubMap[subId].push(g);
    });

    const subPcts = Object.values(studSubMap).map(exams => {
      const groupSum = { 1: 0, 2: 0, 3: 0 };
      const groupCount = { 1: 0, 2: 0, 3: 0 };

      exams.forEach(g => {
        const group = getExamGroup(g.examType);
        const pct = g.totalMax > 0 ? (g.totalObtained / g.totalMax) * 100 : 0;
        groupSum[group] += pct;
        groupCount[group] += 1;
      });

      let totalWeight = 0;
      let weightedSum = 0;

      for (let g = 1; g <= 3; g++) {
        if (groupCount[g] > 0) {
          const avg = groupSum[g] / groupCount[g];
          const weight = g === 1 ? 20 : g === 2 ? 30 : 50;
          totalWeight += weight;
          weightedSum += avg * weight;
        }
      }

      return totalWeight > 0 ? weightedSum / totalWeight : 0;
    });

    if (subPcts.length === 0) return 0;
    return subPcts.reduce((sum, p) => sum + p, 0) / subPcts.length;
  };

  for (const stud of classStudents) {
    const pct = await calculateStudentOverallWeighted(stud._id);
    classPercentages.push({ 
      studentId: stud._id.toString(), 
      percentage: parseFloat(pct.toFixed(2)) 
    });
  }

  // Sort class percentages descending to find rank
  classPercentages.sort((a, b) => b.percentage - a.percentage);
  const myRank = classPercentages.findIndex(item => item.studentId === studentId.toString()) + 1;
  
  // Percentile calculation
  const lowerScoreCount = classPercentages.filter(item => item.percentage < overallPercentage).length;
  const percentile = classPercentages.length > 1
    ? parseFloat(((lowerScoreCount / (classPercentages.length - 1)) * 100).toFixed(2))
    : 100;

  // 5. Create or Update ReportCard in DB
  let reportCard = await ReportCard.findOne({
    student: studentId,
    academicYear: academicYear || '2025-2026',
    term: term || 'Full Year'
  });

  if (reportCard) {
    reportCard.class = classId;
    reportCard.subjectGrades = subjectGrades;
    reportCard.attendancePercentage = attendancePercentage;
    reportCard.overallPercentage = overallPercentage;
    reportCard.gpa = gpa;
    reportCard.cgpa = cgpa;
    reportCard.classRank = myRank;
    reportCard.classPercentile = percentile;
    reportCard.teacherRemarks = teacherRemarks || reportCard.teacherRemarks;
    reportCard.generatedBy = req.user._id;
  } else {
    reportCard = new ReportCard({
      student: studentId,
      class: classId,
      academicYear: academicYear || '2025-2026',
      term: term || 'Full Year',
      subjectGrades,
      attendancePercentage,
      overallPercentage,
      gpa,
      cgpa,
      classRank: myRank,
      classPercentile: percentile,
      teacherRemarks: teacherRemarks || '',
      status: 'draft',
      generatedBy: req.user._id
    });
  }

  await reportCard.save();
  
  // Populate for return
  const populatedReportCard = await ReportCard.findById(reportCard._id)
    .populate({
      path: 'student',
      populate: { path: 'user', select: 'name email avatar' }
    })
    .populate('class', 'name section')
    .populate('subjectGrades.subject', 'name code')
    .populate('subjectGrades.examMarks.examType', 'name code');

  sendResponse(res, HTTP_STATUS.OK, populatedReportCard, 'Report card compiled successfully');
});

// @desc    Publish Report Card
// @route   PUT /api/exam-grades/report-cards/:id/publish
// @access  Private/Teacher/Admin
exports.publishReportCard = asyncHandler(async (req, res) => {
  const reportCard = await ReportCard.findById(req.params.id);
  if (!reportCard) {
    res.status(HTTP_STATUS.NOT_FOUND);
    throw new Error('Report card not found');
  }

  reportCard.status = 'published';
  reportCard.publishedAt = new Date();
  await reportCard.save();

  // Send Socket.IO notifications
  const student = await Student.findById(reportCard.student).populate('user');
  if (student && student.user) {
    // Notify Student
    await createAndSendNotification({
      userId: student.user._id,
      type: 'grade',
      title: 'Report Card Available',
      message: `Your compiled report card for ${reportCard.academicYear} is now published! GPA: ${reportCard.gpa}`,
      actionUrl: `/student/report-card`
    });

    // Notify Parents
    const parents = await Parent.find({ studentIds: reportCard.student }).populate('user');
    for (const p of parents) {
      if (p.user) {
        await createAndSendNotification({
          userId: p.user._id,
          type: 'grade',
          title: 'Report Card Published',
          message: `The report card for ${student.user.name} has been published. GPA: ${reportCard.gpa}`,
          actionUrl: `/parent/report-card`
        });
      }
    }
  }

  sendResponse(res, HTTP_STATUS.OK, reportCard, 'Report card published successfully');
});

// @desc    Get compiled report cards
// @route   GET /api/exam-grades/report-cards
// @access  Private
exports.getReportCards = asyncHandler(async (req, res) => {
  const { studentId, classId, status } = req.query;
  const query = {};

  if (classId) query.class = classId;
  if (status) query.status = status;

  // RBAC checks
  if (req.user.role === 'Student') {
    const student = await Student.findOne({ user: req.user._id });
    if (!student) {
      res.status(HTTP_STATUS.NOT_FOUND);
      throw new Error('Student profile not found');
    }
    query.student = student._id;
    query.status = 'published';
  } else if (req.user.role === 'Parent') {
    const parent = await Parent.findOne({ user: req.user._id });
    if (!parent) {
      res.status(HTTP_STATUS.NOT_FOUND);
      throw new Error('Parent profile not found');
    }
    if (studentId) {
      const isLinked = parent.studentIds.some(id => id.toString() === studentId.toString());
      if (!isLinked) {
        res.status(HTTP_STATUS.FORBIDDEN);
        throw new Error('Not authorized to access linked student report card');
      }
      query.student = studentId;
    } else {
      query.student = { $in: parent.studentIds };
    }
    query.status = 'published';
  } else if (studentId) {
    query.student = studentId;
  }

  const reportCards = await ReportCard.find(query)
    .populate({
      path: 'student',
      populate: { path: 'user', select: 'name avatar rollNumber' }
    })
    .populate('class', 'name section')
    .populate('subjectGrades.subject', 'name code')
    .populate('subjectGrades.examMarks.examType', 'name code')
    .sort({ createdAt: -1 });

  sendResponse(res, HTTP_STATUS.OK, reportCards, 'Report cards fetched successfully');
});

// @desc    Get exam schedules
// @route   GET /api/exam-grades/schedules
// @access  Private
exports.getExamSchedules = asyncHandler(async (req, res) => {
  const { classId, examTypeId } = req.query;
  const query = {};
  if (classId) query.class = classId;
  if (examTypeId) query.examType = examTypeId;

  const schedules = await ExamSchedule.find(query)
    .populate('examType', 'name code')
    .populate('class', 'name section')
    .populate('timetable.subject', 'name code');

  sendResponse(res, HTTP_STATUS.OK, schedules, 'Exam schedules fetched successfully');
});

// @desc    Upsert/Create/Update Exam Schedule
// @route   POST /api/exam-grades/schedules
// @access  Private/Admin
exports.upsertExamSchedule = asyncHandler(async (req, res) => {
  const { classId, examTypeId, timetable, academicYear } = req.body;

  if (!classId || !examTypeId || !Array.isArray(timetable)) {
    res.status(HTTP_STATUS.BAD_REQUEST);
    throw new Error('Class ID, Exam Type ID, and timetable array are required');
  }

  let schedule = await ExamSchedule.findOne({ class: classId, examType: examTypeId });

  if (schedule) {
    schedule.timetable = timetable;
    if (academicYear) schedule.academicYear = academicYear;
  } else {
    schedule = new ExamSchedule({
      class: classId,
      examType: examTypeId,
      timetable,
      academicYear: academicYear || '2025-2026'
    });
  }

  await schedule.save();

  const populated = await ExamSchedule.findById(schedule._id)
    .populate('examType', 'name code')
    .populate('class', 'name section')
    .populate('timetable.subject', 'name code');

  // Notify class students and parents about the new schedule
  const students = await Student.find({ class: classId }).populate('user');
  const examTypeObj = await ExamType.findById(examTypeId);

  for (const s of students) {
    if (s.user) {
      await createAndSendNotification({
        userId: s.user._id,
        type: 'info',
        title: 'Exam Timetable Updated',
        message: `The timetable for ${examTypeObj?.name || 'upcoming'} exams has been updated. Please check the dashboard.`,
        actionUrl: `/student/grades`
      });

      const parents = await Parent.find({ studentIds: s._id }).populate('user');
      for (const p of parents) {
        if (p.user) {
          await createAndSendNotification({
            userId: p.user._id,
            type: 'info',
            title: 'Child Exam Timetable Updated',
            message: `The exam timetable for ${s.user.name} has been configured.`,
            actionUrl: `/parent/grades`
          });
        }
      }
    }
  }

  sendResponse(res, HTTP_STATUS.OK, populated, 'Exam schedule saved successfully');
});

// @desc    Delete Exam Schedule
// @route   DELETE /api/exam-grades/schedules/:id
// @access  Private/Admin
exports.deleteExamSchedule = asyncHandler(async (req, res) => {
  const schedule = await ExamSchedule.findByIdAndDelete(req.params.id);
  if (!schedule) {
    res.status(HTTP_STATUS.NOT_FOUND);
    throw new Error('Exam schedule not found');
  }
  sendResponse(res, HTTP_STATUS.OK, null, 'Exam schedule deleted successfully');
});

