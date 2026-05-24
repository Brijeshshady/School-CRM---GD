import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '../../../lib/api';

/**
 * Hook to fetch teacher dashboard statistics
 */
export const useTeacherDashboard = () => {
  return useQuery({
    queryKey: ['teacher-dashboard'],
    queryFn: async () => {
      const { data } = await api.get('/teachers/dashboard');
      return data.data;
    },
    refetchInterval: 10000, // Keep activity stream & metrics fresh in real-time (BUG-013)
  });
};

/**
 * Hook to fetch teacher's assigned classes
 */
export const useTeacherClasses = () => {
  return useQuery({
    queryKey: ['teacher-classes'],
    queryFn: async () => {
      const { data } = await api.get('/teachers/classes');
      return data.data;
    },
  });
};

/**
 * Hook to fetch teacher's assigned subjects
 */
export const useTeacherSubjects = () => {
  return useQuery({
    queryKey: ['teacher-subjects'],
    queryFn: async () => {
      const { data } = await api.get('/teachers/subjects');
      return data.data;
    },
  });
};

/**
 * Hook to fetch teacher's assignments
 */
export const useTeacherAssignments = () => {
  return useQuery({
    queryKey: ['teacher-assignments'],
    queryFn: async () => {
      const { data } = await api.get('/teachers/assignments');
      return data.data;
    },
  });
};

/**
 * Mutation to create a new assignment
 */
export const useCreateAssignment = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (assignmentData) => {
      const { data } = await api.post('/teachers/assignments', assignmentData);
      return data.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['teacher-assignments']);
      queryClient.invalidateQueries(['teacher-dashboard']);
      queryClient.invalidateQueries(['assignments']);
      queryClient.invalidateQueries(['student-dashboard']);
    },
  });
};

/**
 * Mutation to submit attendance
 */
export const useSubmitAttendance = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (attendanceData) => {
      const { data } = await api.post('/teachers/attendance', attendanceData);
      return data.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['teacher-dashboard']);
      queryClient.invalidateQueries(['attendance']);
      queryClient.invalidateQueries(['student-dashboard']);
      queryClient.invalidateQueries(['admin-dashboard']);
    },
  });
};
