/**
 * Fake grades service to simulate async API calls.
 */

const mockGrades = [
  { subject: "Mathematics", grade: "A", score: 92 },
  { subject: "Science", grade: "A+", score: 96 },
  { subject: "English", grade: "B+", score: 85 },
];

export const gradesService = {
  getGrades: async (studentId) => {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(mockGrades);
      }, 800);
    });
  },

  submitGrade: async (data) => {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({ success: true, message: "Grade submitted successfully" });
      }, 500);
    });
  }
};
