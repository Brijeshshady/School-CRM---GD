import api from '../../../lib/api';

export const transportService = {
  // Vehicles
  getVehicles: async () => {
    const res = await api.get('/transport/vehicles');
    return res.data.data;
  },

  createVehicle: async (data) => {
    const res = await api.post('/transport/vehicles', data);
    return res.data.data;
  },

  updateVehicle: async (id, data) => {
    const res = await api.put(`/transport/vehicles/${id}`, data);
    return res.data.data;
  },

  // Routes & Stops
  getRoutes: async () => {
    const res = await api.get('/transport/routes');
    return res.data.data;
  },

  createRoute: async (data) => {
    const res = await api.post('/transport/routes', data);
    return res.data.data;
  },

  addRouteStop: async (routeId, stopData) => {
    const res = await api.post(`/transport/routes/${routeId}/stops`, stopData);
    return res.data.data;
  },

  deleteRouteStop: async (routeId, stopName) => {
    const res = await api.delete(`/transport/routes/${routeId}/stops/${encodeURIComponent(stopName)}`);
    return res.data.data;
  },

  assignStudentStop: async (routeId, studentId, stopName) => {
    const res = await api.patch(`/transport/routes/${routeId}/students/${studentId}/stop`, { stopName });
    return res.data.data;
  },

  allocateStudent: async (data) => {
    const res = await api.post('/transport/allocate', data);
    return res.data.data;
  },

  // Attendance
  markBusAttendance: async (data) => {
    const res = await api.post('/transport/attendance', data);
    return res.data.data;
  },

  getBusAttendance: async (filters = {}) => {
    const res = await api.get('/transport/attendance', { params: filters });
    return res.data.data;
  },

  // Staff (Drivers & Helpers)
  getStaff: async () => {
    const res = await api.get('/transport/staff');
    return res.data.data;
  }
};
