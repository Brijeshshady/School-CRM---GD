const ROLES = {
  ADMIN: 'Admin',
  SUPERADMIN: 'SuperAdmin',
  TEACHER: 'Teacher',
  STAFF: 'Staff',
  STUDENT: 'Student',
  PARENT: 'Parent',
  DRIVER: 'Driver',
  HELPER: 'Helper'
};

const ATTENDANCE_STATUS = {
  PRESENT: 'present',
  ABSENT: 'absent',
  LATE: 'late'
};

const ASSIGNMENT_STATUS = {
  PENDING: 'pending',
  PUBLISHED: 'published',
  SUBMITTED: 'submitted',
  GRADED: 'graded'
};

const HTTP_STATUS = {
  OK: 200,
  CREATED: 201,
  ACCEPTED: 202,
  NO_CONTENT: 204,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  INTERNAL_SERVER_ERROR: 500
};

module.exports = {
  ROLES,
  ATTENDANCE_STATUS,
  ASSIGNMENT_STATUS,
  HTTP_STATUS
};
