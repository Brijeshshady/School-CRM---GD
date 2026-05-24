import { createContext, useContext, useMemo } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import api from "../../lib/api";
import { useAuth } from "./AuthContext";
import { toast } from "sonner";

const DataContext = createContext(void 0);

export const DataProvider = ({ children }) => {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  // 1. Fetch Assignments
  const { data: assignments = [] } = useQuery({
    queryKey: ["assignments", user?.id],
    queryFn: async () => {
      let endpoint = "";
      if (user?.role === "Student") endpoint = "/students/assignments";
      else if (user?.role === "Teacher" || user?.role === "Staff") endpoint = "/teachers/assignments";
      else return [];

      const response = await api.get(endpoint);
      return response.data.data;
    },
    enabled: !!user && (user.role === "Student" || user.role === "Teacher" || user.role === "Staff")
  });

  // 2. Fetch Attendance
  const { data: attendance = [] } = useQuery({
    queryKey: ["attendance", user?.id],
    queryFn: async () => {
      if (user?.role !== "Student") return [];
      const response = await api.get("/students/attendance");
      return response.data.data;
    },
    enabled: !!user && user.role === "Student"
  });

  // 3. Fetch Grades
  const { data: grades = [] } = useQuery({
    queryKey: ["grades", user?.id],
    queryFn: async () => {
      if (user?.role !== "Student") return [];
      const response = await api.get("/students/grades");
      return response.data.data;
    },
    enabled: !!user && user.role === "Student"
  });

  // 4. Fetch Users
  const { data: users = [] } = useQuery({
    queryKey: ["users"],
    queryFn: async () => {
      const response = await api.get("/admin/users");
      return response.data.data;
    },
    enabled: !!user && user.role === "Admin"
  });

  // 5. Fetch Tickets
  const { data: tickets = [] } = useQuery({
    queryKey: ["tickets", user?.id],
    queryFn: async () => {
      const response = await api.get("/tickets");
      return response.data.data;
    },
    enabled: !!user
  });

  // 6. Fetch Doubts
  const { data: doubts = [] } = useQuery({
    queryKey: ["doubts", user?.id],
    queryFn: async () => {
      const response = await api.get("/doubts");
      return response.data.data;
    },
    enabled: !!user
  });

  // Mutations
  const addTicketMutation = useMutation({
    mutationFn: (ticketData) => api.post("/tickets", ticketData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["tickets"] });
    }
  });

  const addDoubtMutation = useMutation({
    mutationFn: (doubtData) => api.post("/doubts", doubtData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["doubts"] });
    }
  });

  const updateDoubtMutation = useMutation({
    mutationFn: ({ id, ...data }) => api.put(`/doubts/${id}`, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["doubts"] });
    }
  });

  // 7. Fetch Linked Students (for Parents)
  const { data: linkedStudents = [], isLoading: isLinkedStudentsLoading } = useQuery({
    queryKey: ["linkedStudents", user?.id],
    queryFn: async () => {
      if (user?.role !== "Parent") return [];
      const response = await api.get("/parents/students");
      return response.data.data;
    },
    enabled: !!user && user.role === "Parent"
  });

  const value = useMemo(() => ({
    threads: [],
    messages: [],
    tickets,
    assignments,
    attendance,
    grades,
    users,
    doubts,
    linkedStudents,
    isLinkedStudentsLoading,
    addTicket: (data) => addTicketMutation.mutateAsync(data),
    addTicketMessage: (id, message) => api.post(`/tickets/${id}/messages`, { message }).then(() => queryClient.invalidateQueries({ queryKey: ["tickets"] })),
    updateTicket: (id, data) => api.put(`/tickets/${id}`, data).then(() => queryClient.invalidateQueries({ queryKey: ["tickets"] })),
    deleteTicket: (id) => api.delete(`/tickets/${id}`).then(() => queryClient.invalidateQueries({ queryKey: ["tickets"] })),
    addDoubt: (data) => addDoubtMutation.mutateAsync(data),
    updateDoubt: (id, data) => updateDoubtMutation.mutateAsync({ id, ...data }),
    addDoubtReply: (id, message) => api.post(`/doubts/${id}/replies`, { message }).then(() => queryClient.invalidateQueries({ queryKey: ["doubts"] })),
  }), [assignments, attendance, grades, users, tickets, doubts, linkedStudents, isLinkedStudentsLoading]);

  return <DataContext.Provider value={value}>
      {children}
    </DataContext.Provider>;
};

export const useData = () => {
  const context = useContext(DataContext);
  if (context === void 0) {
    throw new Error("useData must be used within a DataProvider");
  }
  return context;
};
