import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { transportService } from '../services/transportService';
import { toast } from 'sonner';

export const useVehicles = () => {
  return useQuery({
    queryKey: ['vehicles'],
    queryFn: transportService.getVehicles
  });
};

export const useCreateVehicle = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: transportService.createVehicle,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['vehicles'] });
      toast.success('Vehicle added successfully');
    },
    onError: (err) => {
      toast.error(err.response?.data?.message || 'Failed to add vehicle');
    }
  });
};

export const useUpdateVehicle = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }) => transportService.updateVehicle(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['vehicles'] });
      toast.success('Vehicle updated successfully');
    },
    onError: (err) => {
      toast.error(err.response?.data?.message || 'Failed to update vehicle');
    }
  });
};

export const useRoutes = () => {
  return useQuery({
    queryKey: ['transportRoutes'],
    queryFn: transportService.getRoutes
  });
};

export const useCreateRoute = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: transportService.createRoute,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['transportRoutes'] });
      toast.success('Route created successfully');
    },
    onError: (err) => {
      toast.error(err.response?.data?.message || 'Failed to create route');
    }
  });
};

export const useAddRouteStop = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ routeId, stopData }) => transportService.addRouteStop(routeId, stopData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['transportRoutes'] });
      toast.success('Stop added successfully');
    },
    onError: (err) => {
      toast.error(err.response?.data?.message || 'Failed to add stop');
    }
  });
};

export const useDeleteRouteStop = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ routeId, stopName }) => transportService.deleteRouteStop(routeId, stopName),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['transportRoutes'] });
      toast.success('Stop deleted successfully');
    },
    onError: (err) => {
      toast.error(err.response?.data?.message || 'Failed to delete stop');
    }
  });
};

export const useAssignStudentStop = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ routeId, studentId, stopName }) => transportService.assignStudentStop(routeId, studentId, stopName),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['transportRoutes'] });
      toast.success('Student stop assigned successfully');
    },
    onError: (err) => {
      toast.error(err.response?.data?.message || 'Failed to assign stop');
    }
  });
};

export const useAllocateStudent = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: transportService.allocateStudent,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['transportRoutes'] });
      toast.success('Student allocated to transport route');
    },
    onError: (err) => {
      toast.error(err.response?.data?.message || 'Failed to allocate student');
    }
  });
};

export const useMarkBusAttendance = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: transportService.markBusAttendance,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['busAttendance'] });
      toast.success('Bus attendance marked successfully');
    },
    onError: (err) => {
      toast.error(err.response?.data?.message || 'Failed to mark attendance');
    }
  });
};

export const useBusAttendance = (filters = {}) => {
  return useQuery({
    queryKey: ['busAttendance', filters],
    queryFn: () => transportService.getBusAttendance(filters)
  });
};

export const useStaff = () => {
  return useQuery({
    queryKey: ['transportStaff'],
    queryFn: transportService.getStaff
  });
};
