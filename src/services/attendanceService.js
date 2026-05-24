/**
 * Fake attendance service to simulate async API calls.
 */

const mockAttendance = [
  { date: "2026-02-01", status: "Present" },
  { date: "2026-02-02", status: "Present" },
  { date: "2026-02-03", status: "Absent" },
  { date: "2026-02-04", status: "Present" },
];

export const attendanceService = {
  getAttendance: async (studentId) => {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(mockAttendance);
      }, 800);
    });
  },

  markAttendance: async (data) => {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({ success: true, message: "Attendance marked successfully" });
      }, 500);
    });
  }
};
