const Class = require('../models/Class');
const Subject = require('../models/Subject');
const User = require('../models/User');

const Student = require('../models/Student');
const Teacher = require('../models/Teacher');
const Parent = require('../models/Parent');
const Timetable = require('../models/Timetable');
const asyncHandler = require('../middleware/asyncHandler');
const sendResponse = require('../utils/apiResponse');
const xlsx = require('xlsx');
const dashboardService = require('../services/dashboardService');
const { HTTP_STATUS, ROLES } = require('../constants');
const { createAndSendNotification } = require('../sockets/notificationSocket');

// @desc    Get all users
// @route   GET /api/admin/users
// @access  Private/Admin
exports.getUsers = asyncHandler(async (req, res) => {
  const users = await User.find({}).sort({ createdAt: -1 }).lean();
  
  // Attach profile IDs for Students and Parents
  const enrichedUsers = await Promise.all(users.map(async (u) => {
    if (u.role === ROLES.STUDENT) {
      const student = await Student.findOne({ user: u._id }).select('_id parentIds class rollNumber').populate({
        path: 'parentIds',
        populate: { path: 'user', select: 'name' }
      });
      return { 
        ...u, 
        profileId: student?._id, 
        linkedParents: student?.parentIds || [],
        class: student?.class,
        rollNumber: student?.rollNumber
      };
    } else if (u.role === ROLES.PARENT) {
      const parent = await Parent.findOne({ user: u._id }).select('_id studentIds').populate({
        path: 'studentIds',
        populate: { path: 'user', select: 'name' }
      });
      return { ...u, profileId: parent?._id, linkedStudents: parent?.studentIds || [] };
    }
    return u;
  }));

  sendResponse(res, HTTP_STATUS.OK, enrichedUsers, 'Users fetched successfully');
});

// @desc    Get all teachers
// @route   GET /api/admin/teachers
// @access  Private/Admin
exports.getTeachers = asyncHandler(async (req, res) => {
  const teachers = await Teacher.find({})
    .populate('user', 'name email isActive')
    .populate({
      path: 'assignedStudents',
      populate: { path: 'user', select: 'name email' }
    })
    .sort({ createdAt: -1 });
  sendResponse(res, HTTP_STATUS.OK, teachers, 'Teachers fetched successfully');
});

// @desc    Get all students
// @route   GET /api/admin/students
// @access  Private/Admin
exports.getStudents = asyncHandler(async (req, res) => {
  const filter = {};
  if (req.query.class) {
    filter.class = req.query.class;
  }

  const students = await Student.find(filter)
    .populate('user', 'name email isActive')
    .populate('class', 'name section')
    .sort({ createdAt: -1 });
  sendResponse(res, HTTP_STATUS.OK, students, 'Students fetched successfully');
});

// @desc    Get admin dashboard stats
// @route   GET /api/admin/dashboard
// @access  Private/Admin
exports.getDashboard = asyncHandler(async (req, res) => {
  const stats = await dashboardService.getAdminStats();
  sendResponse(res, HTTP_STATUS.OK, stats, 'Admin dashboard data retrieved successfully');
});


// @desc    Create a new user
// @route   POST /api/admin/users
// @access  Private/Admin
exports.createUser = asyncHandler(async (req, res) => {
  const { name, email, password, role, ...roleData } = req.body;

  try {
    // Check if user exists
    const userExists = await User.findOne({ email });
    if (userExists) {
      res.status(HTTP_STATUS.BAD_REQUEST);
      throw new Error(`User already exists with email: ${email}`);
    }

    // Create base user
    const user = await User.create({
      name,
      email,
      password,
      role: role || ROLES.STUDENT
    });

    if (!user) {
      res.status(HTTP_STATUS.BAD_REQUEST);
      throw new Error('Failed to create user record');
    }

    // Create role-specific profile
    try {
      if (role === ROLES.STUDENT) {
        let classId = null;
        if (roleData.class) {
          // Check if it's a valid ObjectId, if not try to find class by name
          if (roleData.class.match(/^[0-9a-fA-F]{24}$/)) {
            classId = roleData.class;
          } else {
            const foundClass = await Class.findOne({ name: new RegExp('^' + roleData.class + '$', 'i') });
            if (foundClass) classId = foundClass._id;
          }
        }

        await Student.create({
          user: user._id,
          studentId: roleData.studentId || `STU${Date.now()}`,
          rollNumber: roleData.rollNumber,
          class: classId,
          address: roleData.address
        });
      } else if (role === ROLES.TEACHER || role === ROLES.STAFF) {
        await Teacher.create({
          user: user._id,
          employeeId: roleData.employeeId || `EMP${Date.now()}`,
          department: roleData.department,
          qualification: roleData.qualification
        });
      } else if (role === ROLES.PARENT) {
        await Parent.create({
          user: user._id,
          occupation: roleData.occupation,
          emergencyContact: roleData.emergencyContact
        });
      }
    } catch (profileError) {
      console.error(`Profile creation failed for role ${role}:`, profileError);
      // Clean up the user if profile fails
      await User.findByIdAndDelete(user._id);
      res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR);
      throw new Error(`Profile creation failed: ${profileError.message}`);
    }

    sendResponse(res, HTTP_STATUS.CREATED, user, 'User and profile created successfully');
  } catch (error) {
    console.error('User creation process failed:', error);
    if (!res.statusCode || res.statusCode === 200) {
      res.status(HTTP_STATUS.BAD_REQUEST);
    }
    throw error;
  }
});

// @desc    Update user
// @route   PUT /api/admin/users/:id
// @access  Private/Admin
exports.updateUser = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id);

  if (!user) {
    console.error(`User update failed: User ${req.params.id} not found`);
    res.status(HTTP_STATUS.NOT_FOUND);
    throw new Error('User not found');
  }


  user.name = req.body.name || user.name;
  user.email = req.body.email || user.email;
  if (req.body.password) {
    user.password = req.body.password;
  }
  user.role = req.body.role || user.role;
  user.phoneNumber = req.body.phoneNumber || user.phoneNumber;
  user.isActive = req.body.isActive !== undefined ? req.body.isActive : user.isActive;
  if (req.body.address) {
    user.address = { ...user.address, ...req.body.address };
  }

  const updatedUser = await user.save();

  // Update/Create role-specific profile
  try {
    if (updatedUser.role === ROLES.TEACHER || updatedUser.role === ROLES.STAFF) {
      const teacher = await Teacher.findOne({ user: updatedUser._id });
      if (teacher) {
        if (req.body.department) teacher.department = req.body.department;
        if (req.body.qualification) teacher.qualification = req.body.qualification;
        await teacher.save();
      } else {
        await Teacher.create({
          user: updatedUser._id,
          employeeId: `EMP${Date.now()}`,
          department: req.body.department || 'General'
        });
      }
    } else if (updatedUser.role === ROLES.STUDENT) {
      const student = await Student.findOne({ user: updatedUser._id });
      if (student) {
        if (req.body.studentId) student.studentId = req.body.studentId;
        if (req.body.rollNumber) student.rollNumber = req.body.rollNumber;
        if (req.body.class) {
          student.class = req.body.class;
          try {
            const classObj = await Class.findById(req.body.class);
            await createAndSendNotification({
              userId: updatedUser._id,
              type: 'info',
              title: 'Class Assigned',
              message: `Your class assignment has been updated to: ${classObj ? classObj.name : 'New Class'}`,
              actionUrl: '/student/dashboard'
            });
          } catch (err) {
            console.error('Error sending class assignment notification:', err);
          }
        }
        await student.save();
      } else {
        await Student.create({
          user: updatedUser._id,
          studentId: `STU${Date.now()}`,
          class: req.body.class
        });
      }
    } else if (updatedUser.role === ROLES.PARENT) {
      const parent = await Parent.findOne({ user: updatedUser._id });
      if (parent) {
        if (req.body.occupation) parent.occupation = req.body.occupation;
        await parent.save();
      } else {
        await Parent.create({
          user: updatedUser._id
        });
      }
    }
  } catch (profileError) {
    console.error('Failed to update/create profile during user update:', profileError);
  }

  sendResponse(res, HTTP_STATUS.OK, updatedUser, 'User and profile updated successfully');
});

// @desc    Update user avatar
// @route   POST /api/admin/users/:id/avatar
// @access  Private/Admin
exports.updateAvatar = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id);
  if (!user) {
    res.status(HTTP_STATUS.NOT_FOUND);
    throw new Error('User not found');
  }

  if (!req.file) {
    res.status(HTTP_STATUS.BAD_REQUEST);
    throw new Error('Please upload an image');
  }

  user.avatar = `/uploads/${req.file.filename}`;
  await user.save();

  sendResponse(res, HTTP_STATUS.OK, user, 'Avatar updated successfully');
});

// @desc    Bulk import users from Excel
// @route   POST /api/admin/users/import
// @access  Private/Admin
exports.bulkImportUsers = asyncHandler(async (req, res) => {
  if (!req.file) {
    res.status(HTTP_STATUS.BAD_REQUEST);
    throw new Error('Please upload an Excel file');
  }

  const workbook = xlsx.readFile(req.file.path);
  const sheetName = workbook.SheetNames[0];
  const data = xlsx.utils.sheet_to_json(workbook.Sheets[sheetName]);

  const results = {
    success: 0,
    failed: 0,
    errors: []
  };

  for (const row of data) {
    try {
      const { name, email, role, password, ...profileData } = row;
      
      // Check if user exists
      const existingUser = await User.findOne({ email: email.toLowerCase() });
      if (existingUser) {
        results.failed++;
        results.errors.push(`Email ${email} already exists`);
        continue;
      }

      const user = await User.create({
        name,
        email: email.toLowerCase(),
        role: role || ROLES.STUDENT,
        password: password || 'Welcome@123'
      });

      if (user.role === ROLES.STUDENT) {
        await Student.create({
          user: user._id,
          studentId: profileData.studentId || `STU${Date.now()}${results.success}`,
          rollNumber: profileData.rollNumber,
          class: profileData.classId // Assumes ID is provided in Excel
        });
      } else if (user.role === ROLES.TEACHER) {
        await Teacher.create({
          user: user._id,
          employeeId: profileData.employeeId || `EMP${Date.now()}${results.success}`,
          department: profileData.department
        });
      }

      results.success++;
    } catch (err) {
      results.failed++;
      results.errors.push(`Error importing ${row.email}: ${err.message}`);
    }
  }

  sendResponse(res, HTTP_STATUS.OK, results, 'Bulk import completed');
});

// @desc    Get detailed school analytics
// @route   GET /api/admin/analytics
// @access  Private/Admin
exports.getAnalytics = asyncHandler(async (req, res) => {
  const analytics = await dashboardService.getAdminAnalytics();
  sendResponse(res, HTTP_STATUS.OK, analytics, 'Analytics retrieved successfully');
});

// @desc    Delete user
// @route   DELETE /api/admin/users/:id
// @access  Private/Admin
exports.deleteUser = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id);

  if (!user) {
    res.status(HTTP_STATUS.NOT_FOUND);
    throw new Error('User not found');
  }

  // Delete profile first
  if (user.role === ROLES.STUDENT) {
    await Student.findOneAndDelete({ user: user._id });
  } else if (user.role === ROLES.TEACHER || user.role === ROLES.STAFF) {
    await Teacher.findOneAndDelete({ user: user._id });
  } else if (user.role === ROLES.PARENT) {
    await Parent.findOneAndDelete({ user: user._id });
  }

  await User.findByIdAndDelete(req.params.id);

  sendResponse(res, HTTP_STATUS.OK, {}, 'User and associated profile deleted successfully');
});

// @desc    Create a new class
// @route   POST /api/admin/classes
// @access  Private/Admin
exports.createClass = asyncHandler(async (req, res) => {
  const { name, section, classTeacherId, ...otherData } = req.body;
  
  const classObj = {
    name,
    section,
    ...otherData
  };

  if (classTeacherId) {
    classObj.classTeacher = classTeacherId;
  }

  let newClass = await Class.create(classObj);
  
  // Populate for immediate UI update
  newClass = await Class.findById(newClass._id).populate({
    path: 'classTeacher',
    populate: { path: 'user', select: 'name' }
  });

  sendResponse(res, HTTP_STATUS.CREATED, newClass, 'Class created successfully');
});

// @desc    Update a class
// @route   PUT /api/admin/classes/:id
// @access  Private/Admin
exports.updateClass = asyncHandler(async (req, res) => {
  const { classTeacherId, ...updateData } = req.body;
  
  if (classTeacherId) {
    updateData.classTeacher = classTeacherId;
  }

  const updatedClass = await Class.findByIdAndUpdate(
    req.params.id, 
    updateData, 
    { new: true, runValidators: true }
  ).populate({
    path: 'classTeacher',
    populate: { path: 'user', select: 'name' }
  });

  if (!updatedClass) {
    res.status(HTTP_STATUS.NOT_FOUND);
    throw new Error('Class not found');
  }

  sendResponse(res, HTTP_STATUS.OK, updatedClass, 'Class updated successfully');
});

// @desc    Delete a class
// @route   DELETE /api/admin/classes/:id
// @access  Private/Admin
exports.deleteClass = asyncHandler(async (req, res) => {
  await Class.findByIdAndDelete(req.params.id);
  sendResponse(res, HTTP_STATUS.OK, {}, 'Class deleted successfully');
});
// @desc    Link parent and student
// @route   POST /api/admin/link-parent-student
// @access  Private/Admin
exports.linkParentStudent = asyncHandler(async (req, res) => {
  const { parentId, studentId } = req.body;

  if (!parentId || !studentId) {
    res.status(HTTP_STATUS.BAD_REQUEST);
    throw new Error('Please provide both parentId and studentId');
  }

  const parent = await Parent.findById(parentId);
  const student = await Student.findById(studentId);

  if (!parent || !student) {
    res.status(HTTP_STATUS.NOT_FOUND);
    throw new Error('Parent or Student profile not found');
  }

  // Check for duplicate link
  if (parent.studentIds.includes(studentId) || student.parentIds.includes(parentId)) {
    res.status(HTTP_STATUS.BAD_REQUEST);
    throw new Error('Relationship already exists');
  }

  // Update parent
  parent.studentIds.push(studentId);
  await parent.save();

  // Update student
  student.parentIds.push(parentId);
  await student.save();

  // Notify both parent and student of linkage
  try {
    const parentUser = await User.findById(parent.user);
    const studentUser = await User.findById(student.user);
    if (parentUser) {
      await createAndSendNotification({
        userId: parentUser._id,
        type: 'info',
        title: 'Student Account Linked',
        message: `Your account has been successfully linked to student: ${studentUser ? studentUser.name : 'Unknown Student'}`,
        actionUrl: '/parent/dashboard'
      });
    }
    if (studentUser) {
      await createAndSendNotification({
        userId: studentUser._id,
        type: 'info',
        title: 'Parent Account Linked',
        message: `Your account has been linked to parent: ${parentUser ? parentUser.name : 'Unknown Parent'}`,
        actionUrl: '/student/dashboard'
      });
    }
  } catch (err) {
    console.error('Error generating linking notifications:', err);
  }

  sendResponse(res, HTTP_STATUS.OK, { parent, student }, 'Parent and Student linked successfully');
});

// @desc    Unlink parent and student
// @route   DELETE /api/admin/unlink-parent-student
// @access  Private/Admin
exports.unlinkParentStudent = asyncHandler(async (req, res) => {
  const { parentId, studentId } = req.body;

  if (!parentId || !studentId) {
    res.status(HTTP_STATUS.BAD_REQUEST);
    throw new Error('Please provide both parentId and studentId');
  }

  const parent = await Parent.findById(parentId);
  const student = await Student.findById(studentId);

  if (!parent || !student) {
    res.status(HTTP_STATUS.NOT_FOUND);
    throw new Error('Parent or Student profile not found');
  }

  // Remove student from parent's children
  parent.studentIds = parent.studentIds.filter(id => id.toString() !== studentId);
  await parent.save();

  // Remove parent from student's parents
  student.parentIds = student.parentIds.filter(id => id.toString() !== parentId);
  await student.save();

  sendResponse(res, HTTP_STATUS.OK, {}, 'Relationship removed successfully');
});

// @desc    Get all parent-student links
// @route   GET /api/admin/parent-student-links
// @access  Private/Admin
exports.getParentStudentLinks = asyncHandler(async (req, res) => {
  const parents = await Parent.find({ studentIds: { $exists: true, $not: { $size: 0 } } })
    .populate('user', 'name email')
    .populate({
      path: 'studentIds',
      populate: { path: 'user', select: 'name email' }
    });

  sendResponse(res, HTTP_STATUS.OK, parents, 'Parent-student links fetched successfully');
});

// @desc    Link teacher and student
// @route   POST /api/admin/link-teacher-student
// @access  Private/Admin
exports.linkTeacherStudent = asyncHandler(async (req, res) => {
  const { teacherId, studentIds } = req.body;

  if (!teacherId || !studentIds || !Array.isArray(studentIds)) {
    res.status(HTTP_STATUS.BAD_REQUEST);
    throw new Error('Please provide teacherId and an array of studentIds');
  }

  const teacher = await Teacher.findById(teacherId);
  if (!teacher) {
    res.status(HTTP_STATUS.NOT_FOUND);
    throw new Error('Teacher profile not found');
  }

  // Add students to teacher's assignedStudents array if not already present
  let addedCount = 0;
  for (const studentId of studentIds) {
    if (!teacher.assignedStudents.includes(studentId)) {
      teacher.assignedStudents.push(studentId);
      addedCount++;
    }
  }

  if (addedCount > 0) {
    await teacher.save();
  }

  sendResponse(res, HTTP_STATUS.OK, teacher, `${addedCount} students linked to teacher successfully`);
});

// @desc    Unlink teacher and student
// @route   DELETE /api/admin/unlink-teacher-student
// @access  Private/Admin
exports.unlinkTeacherStudent = asyncHandler(async (req, res) => {
  const { teacherId, studentId } = req.body;

  if (!teacherId || !studentId) {
    res.status(HTTP_STATUS.BAD_REQUEST);
    throw new Error('Please provide both teacherId and studentId');
  }

  const teacher = await Teacher.findById(teacherId);
  if (!teacher) {
    res.status(HTTP_STATUS.NOT_FOUND);
    throw new Error('Teacher profile not found');
  }

  // Remove student from teacher's assignedStudents
  teacher.assignedStudents = teacher.assignedStudents.filter(id => id.toString() !== studentId);
  await teacher.save();

  sendResponse(res, HTTP_STATUS.OK, {}, 'Relationship removed successfully');
});

// @desc    Get all teacher-student links
// @route   GET /api/admin/teacher-student-links
// @access  Private/Admin
exports.getTeacherStudentLinks = asyncHandler(async (req, res) => {
  const teachers = await Teacher.find({ assignedStudents: { $exists: true, $not: { $size: 0 } } })
    .populate('user', 'name email')
    .populate({
      path: 'assignedStudents',
      populate: { path: 'user', select: 'name email' }
    });

  sendResponse(res, HTTP_STATUS.OK, teachers, 'Teacher-student links fetched successfully');
});

// @desc    Toggle teacher timetable upload permission
// @route   PATCH /api/admin/teachers/:id/toggle-timetable-permission
// @access  Private/Admin
exports.toggleTeacherTimetablePermission = asyncHandler(async (req, res) => {
  const teacher = await Teacher.findById(req.params.id);
  if (!teacher) {
    res.status(HTTP_STATUS.NOT_FOUND);
    throw new Error('Teacher not found');
  }

  teacher.canUploadTimetable = !teacher.canUploadTimetable;
  await teacher.save();

  sendResponse(res, HTTP_STATUS.OK, teacher, `Timetable upload permission ${teacher.canUploadTimetable ? 'enabled' : 'disabled'} for teacher`);
});

// @desc    Get all timetable approvals
// @route   GET /api/admin/timetable-approvals
// @access  Private/Admin
exports.getTimetableApprovals = asyncHandler(async (req, res) => {
  const approvals = await Timetable.find({ status: 'Pending' })
    .populate('class', 'name section')
    .populate('uploadedBy', 'name email')
    .sort({ createdAt: -1 });

  sendResponse(res, HTTP_STATUS.OK, approvals, 'Timetable approvals fetched successfully');
});

// @desc    Approve timetable
// @route   PATCH /api/admin/timetable-approvals/:id/approve
// @access  Private/Admin
exports.approveTimetable = asyncHandler(async (req, res) => {
  const timetable = await Timetable.findById(req.params.id);
  if (!timetable) {
    res.status(HTTP_STATUS.NOT_FOUND);
    throw new Error('Timetable not found');
  }

  timetable.status = 'Approved';
  timetable.approvedBy = req.user._id;
  timetable.approvedAt = new Date();
  await timetable.save();

  // Notify teacher of timetable approval
  try {
    if (timetable.uploadedBy) {
      await createAndSendNotification({
        userId: timetable.uploadedBy,
        type: 'announcement',
        title: 'Timetable Approved',
        message: `Your timetable upload has been approved by the Admin.`,
        actionUrl: '/teacher/dashboard'
      });
    }
  } catch (err) {
    console.error('Error sending timetable approval notification:', err);
  }

  sendResponse(res, HTTP_STATUS.OK, timetable, 'Timetable approved successfully');
});

// @desc    Reject timetable
// @route   PATCH /api/admin/timetable-approvals/:id/reject
// @access  Private/Admin
exports.rejectTimetable = asyncHandler(async (req, res) => {
  const { reason } = req.body;
  const timetable = await Timetable.findById(req.params.id);
  if (!timetable) {
    res.status(HTTP_STATUS.NOT_FOUND);
    throw new Error('Timetable not found');
  }

  timetable.status = 'Rejected';
  timetable.rejectionReason = reason || 'No reason provided';
  await timetable.save();

  // Notify teacher of timetable rejection
  try {
    if (timetable.uploadedBy) {
      await createAndSendNotification({
        userId: timetable.uploadedBy,
        type: 'announcement',
        title: 'Timetable Rejected',
        message: `Your timetable upload has been rejected. Reason: ${timetable.rejectionReason}`,
        actionUrl: '/teacher/dashboard'
      });
    }
  } catch (err) {
    console.error('Error sending timetable rejection notification:', err);
  }

  sendResponse(res, HTTP_STATUS.OK, timetable, 'Timetable rejected successfully');
});
