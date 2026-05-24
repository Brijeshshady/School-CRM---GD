/**
 * Centralized constants for the School CRM backend.
 * This ensures consistency across models, controllers, and middleware.
 */

const ROLES = {
  ADMIN: 'Admin',
  SUPER_ADMIN: 'SuperAdmin',
  TEACHER: 'Teacher',
  STAFF: 'Staff',
  STUDENT: 'Student',
  PARENT: 'Parent',
};

const STATUS = {
  ACTIVE: 'Active',
  INACTIVE: 'Inactive',
  PENDING: 'Pending',
  SUSPENDED: 'Suspended',
};

const ATTENDANCE_STATUS = {
  PRESENT: 'Present',
  ABSENT: 'Absent',
  LATE: 'Late',
  EXCUSED: 'Excused',
};

const ASSIGNMENT_STATUS = {
  PUBLISHED: 'Published',
  DRAFT: 'Draft',
  ARCHIVED: 'Archived',
};

const HTTP_STATUS = {
  OK: 200,
  CREATED: 201,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  INTERNAL_SERVER_ERROR: 500,
};

module.exports = {
  ROLES,
  STATUS,
  ATTENDANCE_STATUS,
  ASSIGNMENT_STATUS,
  HTTP_STATUS,
};
