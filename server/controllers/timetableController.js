const Timetable = require('../models/Timetable');
const Teacher = require('../models/Teacher');
const Student = require('../models/Student');
const Substitution = require('../models/Substitution');
const LeaveRequest = require('../models/LeaveRequest');
const Class = require('../models/Class');
const asyncHandler = require('../middleware/asyncHandler');
const sendResponse = require('../utils/apiResponse');
const { HTTP_STATUS } = require('../constants');

// Clash Check Helper
const checkTimetableClashes = async (classId, section, rows, currentTimetableId = null) => {
  for (const row of rows) {
    const { day, period, teacherId, room } = row;
    if (!day || !period) continue;

    // Find any approved timetables except the current one
    const approvedTimetables = await Timetable.find({
      status: 'Approved',
      _id: { $ne: currentTimetableId },
    }).lean();

    for (const t of approvedTimetables) {
      const matchingRow = t.rows.find(r => r.day === day && r.period === period);
      if (matchingRow) {
        // 1. Teacher Clash
        if (teacherId && matchingRow.teacherId && matchingRow.teacherId.toString() === teacherId.toString()) {
          const teacherObj = await Teacher.findById(teacherId).populate('user', 'name');
          const className = await Class.findById(t.class);
          return {
            clash: true,
            message: `Conflict: Teacher ${teacherObj?.user?.name || 'Assigned teacher'} is already scheduled to teach Class ${className?.name || t.class} (Section ${t.section}) on ${day} Period ${period}.`,
          };
        }
        // 2. Room Clash
        if (room && matchingRow.room && matchingRow.room.toLowerCase() === room.toLowerCase()) {
          const className = await Class.findById(t.class);
          return {
            clash: true,
            message: `Conflict: Room/Lab ${room} is already booked for Class ${className?.name || t.class} (Section ${t.section}) on ${day} Period ${period}.`,
          };
        }
      }
    }
  }
  return { clash: false };
};

// @desc    Upload timetable for approval
// @route   POST /api/timetables/upload
// @access  Private/Teacher
exports.uploadTimetable = asyncHandler(async (req, res) => {
  const { classId, section, rows } = req.body;

  if (!classId || !section || !rows || !rows.length) {
    return res.status(HTTP_STATUS.BAD_REQUEST).json({
      success: false,
      message: 'Missing required fields or empty timetable',
    });
  }

  // Check if teacher has permission
  const teacher = await Teacher.findOne({ user: req.user._id });
  if (!teacher || !teacher.canUploadTimetable) {
    return res.status(HTTP_STATUS.FORBIDDEN).json({
      success: false,
      message: 'You do not have permission to upload timetables',
    });
  }

  // Check conflicts in the template
  const conflictResult = await checkTimetableClashes(classId, section, rows);
  if (conflictResult.clash) {
    return res.status(HTTP_STATUS.BAD_REQUEST).json({
      success: false,
      message: conflictResult.message,
    });
  }

  const timetable = await Timetable.create({
    class: classId,
    section,
    uploadedBy: req.user._id,
    rows,
    status: 'Pending',
  });

  sendResponse(res, HTTP_STATUS.CREATED, timetable, 'Timetable submitted for approval');
});

// @desc    Get approved timetable for a class
// @route   GET /api/timetables/class/:classId
// @access  Private
exports.getApprovedTimetable = asyncHandler(async (req, res) => {
  const { classId } = req.params;
  const { section } = req.query;

  const query = { 
    class: classId, 
    status: 'Approved',
  };
  
  if (section) query.section = section;

  const timetable = await Timetable.findOne(query)
    .sort({ approvedAt: -1 });

  if (!timetable) {
    return sendResponse(res, HTTP_STATUS.OK, null, 'No approved timetable found for this class');
  }

  sendResponse(res, HTTP_STATUS.OK, timetable, 'Approved timetable fetched successfully');
});

// @desc    Check if teacher can upload
// @route   GET /api/timetables/check-permission
// @access  Private/Teacher
exports.checkUploadPermission = asyncHandler(async (req, res) => {
  const teacher = await Teacher.findOne({ user: req.user._id });
  sendResponse(res, HTTP_STATUS.OK, { canUpload: !!teacher?.canUploadTimetable }, 'Permission status fetched');
});

// @desc    Get date-specific schedule including active leaves and substitutions
// @route   GET /api/timetables/date-schedule
// @access  Private
exports.getDateSchedule = asyncHandler(async (req, res) => {
  const { classId, date } = req.query;
  if (!classId || !date) {
    return res.status(HTTP_STATUS.BAD_REQUEST).json({
      success: false,
      message: 'Class ID and Date are required',
    });
  }

  const queryDate = new Date(date);
  const daysOfWeek = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  const dayName = daysOfWeek[queryDate.getDay()];

  const timetable = await Timetable.findOne({ class: classId, status: 'Approved' });
  if (!timetable) {
    return res.status(HTTP_STATUS.OK).json({ success: true, data: [] });
  }

  const dayRows = timetable.rows.filter(r => r.day.toLowerCase() === dayName.toLowerCase());

  const startOfDay = new Date(queryDate.setHours(0, 0, 0, 0));
  const endOfDay = new Date(queryDate.setHours(23, 59, 59, 999));

  const enrichedSchedule = await Promise.all(dayRows.map(async (row) => {
    let isTeacherOnLeave = false;
    let substituteTeacherData = null;

    if (row.teacherId) {
      const leave = await LeaveRequest.findOne({
        teacher: row.teacherId,
        status: 'Approved',
        startDate: { $lte: endOfDay },
        endDate: { $gte: startOfDay },
      });
      if (leave) {
        isTeacherOnLeave = true;
      }
    }

    const substitution = await Substitution.findOne({
      class: classId,
      date: { $gte: startOfDay, $lte: endOfDay },
      period: row.period,
    }).populate({
      path: 'substituteTeacher',
      populate: { path: 'user', select: 'name' },
    });

    if (substitution) {
      substituteTeacherData = {
        id: substitution.substituteTeacher?._id,
        name: substitution.substituteTeacher?.user?.name || substitution.substituteTeacherName || 'Substitute Cover',
      };
    }

    return {
      ...row.toObject(),
      onLeave: isTeacherOnLeave,
      substitute: substituteTeacherData,
    };
  }));

  res.status(HTTP_STATUS.OK).json({
    success: true,
    data: enrichedSchedule,
  });
});

// @desc    Assign a substitute teacher to a slot
// @route   POST /api/timetables/substitute
// @access  Private (Admin)
exports.assignSubstitute = asyncHandler(async (req, res) => {
  const { classId, date, period, originalTeacherId, substituteTeacherId, subject } = req.body;

  if (!classId || !date || !period || !originalTeacherId || !substituteTeacherId) {
    return res.status(HTTP_STATUS.BAD_REQUEST).json({
      success: false,
      message: 'Please provide all substitution details',
    });
  }

  const queryDate = new Date(date);
  const startOfDay = new Date(queryDate.setHours(0, 0, 0, 0));
  const endOfDay = new Date(queryDate.setHours(23, 59, 59, 999));

  // 1. Verify if substitute is on leave
  const isSubstituteOnLeave = await LeaveRequest.findOne({
    teacher: substituteTeacherId,
    status: 'Approved',
    startDate: { $lte: endOfDay },
    endDate: { $gte: startOfDay },
  });

  if (isSubstituteOnLeave) {
    return res.status(HTTP_STATUS.BAD_REQUEST).json({
      success: false,
      message: 'The selected substitute teacher is on approved leave for this date.',
    });
  }

  // 2. Check if substitute has another slot in approved timetable
  const daysOfWeek = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  const dayName = daysOfWeek[queryDate.getDay()];

  const conflictingTimetable = await Timetable.findOne({
    status: 'Approved',
    rows: {
      $elemMatch: {
        day: dayName,
        period: period,
        teacherId: substituteTeacherId,
      },
    },
  });

  if (conflictingTimetable) {
    return res.status(HTTP_STATUS.BAD_REQUEST).json({
      success: false,
      message: 'Conflict: The selected substitute is already teaching another class in the regular timetable for this period.',
    });
  }

  // 3. Check if substitute is already assigned elsewhere as substitute on this date/period
  const conflictingSub = await Substitution.findOne({
    substituteTeacher: substituteTeacherId,
    date: { $gte: startOfDay, $lte: endOfDay },
    period: period,
  });

  if (conflictingSub) {
    return res.status(HTTP_STATUS.BAD_REQUEST).json({
      success: false,
      message: 'Conflict: The selected substitute is already assigned to cover another class for this date and period.',
    });
  }

  // Create or Update substitution
  const sub = await Substitution.findOneAndUpdate(
    { class: classId, date: { $gte: startOfDay, $lte: endOfDay }, period },
    {
      class: classId,
      date: queryDate,
      period,
      originalTeacher: originalTeacherId,
      substituteTeacher: substituteTeacherId,
      subject: subject || 'Substitute Cover',
    },
    { upsert: true, new: true }
  );

  res.status(HTTP_STATUS.OK).json({
    success: true,
    data: sub,
  });
});
