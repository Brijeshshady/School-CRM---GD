import api from '../../../lib/api';

export const gradebookService = {
  // Exam Types
  getExamTypes: async () => {
    const res = await api.get('/exam-grades/exam-types');
    return res.data.data;
  },
  
  createExamType: async (data) => {
    const res = await api.post('/exam-grades/exam-types', data);
    return res.data.data;
  },

  updateExamType: async (id, data) => {
    const res = await api.put(`/exam-grades/exam-types/${id}`, data);
    return res.data.data;
  },

  deleteExamType: async (id) => {
    const res = await api.delete(`/exam-grades/exam-types/${id}`);
    return res.data.data;
  },

  // Exam Grades
  getExamGrades: async (filters = {}) => {
    const res = await api.get('/exam-grades', { params: filters });
    return res.data.data;
  },

  upsertExamGrades: async (data) => {
    const res = await api.post('/exam-grades/upsert', data);
    return res.data.data;
  },

  bulkImportExamGrades: async (data) => {
    const res = await api.post('/exam-grades/bulk-import', data);
    return res.data.data;
  },

  // Analytics
  getClassAnalytics: async (classId, examTypeId) => {
    const res = await api.get(`/exam-grades/class-analytics/${classId}`, {
      params: { examTypeId }
    });
    return res.data.data;
  },

  getStudentAnalytics: async (studentId) => {
    const res = await api.get(`/exam-grades/student-analytics/${studentId}`);
    return res.data.data;
  },

  // Report Cards
  getReportCards: async (filters = {}) => {
    const res = await api.get('/exam-grades/report-cards', { params: filters });
    return res.data.data;
  },

  generateReportCard: async (data) => {
    const res = await api.post('/exam-grades/report-cards/generate', data);
    return res.data.data;
  },

  publishReportCard: async (id) => {
    const res = await api.put(`/exam-grades/report-cards/${id}/publish`);
    return res.data.data;
  },

  // Exam Timetables / Schedules
  getExamSchedules: async (filters = {}) => {
    const res = await api.get('/exam-grades/schedules', { params: filters });
    return res.data.data;
  },

  upsertExamSchedule: async (data) => {
    const res = await api.post('/exam-grades/schedules', data);
    return res.data.data;
  },

  deleteExamSchedule: async (id) => {
    const res = await api.delete(`/exam-grades/schedules/${id}`);
    return res.data.data;
  }
};

