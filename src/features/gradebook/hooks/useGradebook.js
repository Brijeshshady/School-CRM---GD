import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { gradebookService } from '../services/gradebookService';
import { toast } from 'sonner';

export const useExamTypes = () => {
  return useQuery({
    queryKey: ['examTypes'],
    queryFn: gradebookService.getExamTypes
  });
};

export const useCreateExamType = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: gradebookService.createExamType,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['examTypes'] });
      toast.success('Exam type created successfully');
    },
    onError: (err) => {
      toast.error(err.response?.data?.message || 'Failed to create exam type');
    }
  });
};

export const useUpdateExamType = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }) => gradebookService.updateExamType(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['examTypes'] });
      toast.success('Exam type updated successfully');
    },
    onError: (err) => {
      toast.error(err.response?.data?.message || 'Failed to update exam type');
    }
  });
};

export const useDeleteExamType = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: gradebookService.deleteExamType,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['examTypes'] });
      toast.success('Exam type deleted successfully');
    },
    onError: (err) => {
      toast.error(err.response?.data?.message || 'Failed to delete exam type');
    }
  });
};

export const useExamGrades = (filters) => {
  return useQuery({
    queryKey: ['examGrades', filters],
    queryFn: () => gradebookService.getExamGrades(filters),
    enabled: !!(filters.classId && filters.subjectId && filters.examTypeId) || !!filters.studentId
  });
};

export const useUpsertExamGrades = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: gradebookService.upsertExamGrades,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['examGrades'] });
      queryClient.invalidateQueries({ queryKey: ['classAnalytics'] });
      queryClient.invalidateQueries({ queryKey: ['studentAnalytics'] });
      toast.success('Marks saved successfully');
    },
    onError: (err) => {
      toast.error(err.response?.data?.message || 'Failed to save marks');
    }
  });
};

export const useBulkImportGrades = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: gradebookService.bulkImportExamGrades,
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['examGrades'] });
      toast.success(`Bulk import completed! Imported: ${data.importedCount}`);
      if (data.errors && data.errors.length > 0) {
        toast.warning(`Some rows had errors:\n${data.errors.join('\n')}`);
      }
    },
    onError: (err) => {
      toast.error(err.response?.data?.message || 'Failed to bulk import marks');
    }
  });
};

export const useClassAnalytics = (classId, examTypeId) => {
  return useQuery({
    queryKey: ['classAnalytics', classId, examTypeId],
    queryFn: () => gradebookService.getClassAnalytics(classId, examTypeId),
    enabled: !!(classId && examTypeId)
  });
};

export const useStudentAnalytics = (studentId) => {
  return useQuery({
    queryKey: ['studentAnalytics', studentId],
    queryFn: () => gradebookService.getStudentAnalytics(studentId),
    enabled: !!studentId
  });
};

export const useReportCards = (filters = {}) => {
  return useQuery({
    queryKey: ['reportCards', filters],
    queryFn: () => gradebookService.getReportCards(filters)
  });
};

export const useGenerateReportCard = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: gradebookService.generateReportCard,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['reportCards'] });
      toast.success('Report card compiled and compiled successfully');
    },
    onError: (err) => {
      toast.error(err.response?.data?.message || 'Failed to compile report card');
    }
  });
};

export const usePublishReportCard = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: gradebookService.publishReportCard,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['reportCards'] });
      toast.success('Report card published and made visible to parents/students!');
    },
    onError: (err) => {
      toast.error(err.response?.data?.message || 'Failed to publish report card');
    }
  });
};
