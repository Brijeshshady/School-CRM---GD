import { useQuery } from '@tanstack/react-query';
import api from '../../../lib/api';

/**
 * Hook to fetch student dashboard statistics
 */
export const useStudentDashboard = () => {
  return useQuery({
    queryKey: ['student-dashboard'],
    queryFn: async () => {
      const { data } = await api.get('/students/dashboard');
      return data.data;
    },
  });
};

/**
 * Hook to fetch student grades
 */
export const useStudentGrades = () => {
  return useQuery({
    queryKey: ['student-grades'],
    queryFn: async () => {
      const { data } = await api.get('/students/grades');
      return data.data;
    },
  });
};

/**
 * Hook to fetch student attendance
 */
export const useStudentAttendance = () => {
  return useQuery({
    queryKey: ['student-attendance'],
    queryFn: async () => {
      const { data } = await api.get('/students/attendance');
      return data.data;
    },
  });
};

/**
 * Hook to fetch student assignments
 */
export const useStudentAssignments = () => {
  return useQuery({
    queryKey: ['student-assignments'],
    queryFn: async () => {
      const { data } = await api.get('/students/assignments');
      return data.data;
    },
  });
};

/**
 * Hook to fetch student schedule
 */
export const useStudentSchedule = () => {
  return useQuery({
    queryKey: ['student-schedule'],
    queryFn: async () => {
      const { data } = await api.get('/students/schedule');
      return data.data;
    },
  });
};

/**
 * Hook to fetch student assigned teachers
 */
export const useStudentTeachers = () => {
  return useQuery({
    queryKey: ['student-teachers'],
    queryFn: async () => {
      const { data } = await api.get('/students/teachers');
      return data.data;
    },
  });
};
