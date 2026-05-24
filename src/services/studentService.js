/**
 * Fake student service to simulate async API calls.
 */

const mockStudents = [
  { id: "1", name: "Aarav Kumar", class: "10-A", rollNo: "101" },
  { id: "2", name: "Priya Patel", class: "10-B", rollNo: "102" },
];

export const studentService = {
  getStudents: async () => {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(mockStudents);
      }, 800);
    });
  },

  getStudentById: async (id) => {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        const student = mockStudents.find(s => s.id === id);
        if (student) resolve(student);
        else reject(new Error("Student not found"));
      }, 800);
    });
  }
};
