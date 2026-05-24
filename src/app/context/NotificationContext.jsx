import { createContext, useContext, useState, useCallback, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import api from "../../lib/api";
import { useAuth } from "./AuthContext";
import { toast } from "sonner";

const NotificationContext = createContext(undefined);

export const NotificationProvider = ({ children }) => {
  const { user, isAuthenticated } = useAuth();
  const queryClient = useQueryClient();

  // Fetch notifications from API
  const { data: notifications = [] } = useQuery({
    queryKey: ["notifications", user?.id],
    queryFn: async () => {
      const response = await api.get("/notifications");
      return response.data.data;
    },
    enabled: isAuthenticated,
    refetchInterval: 30000, // Poll every 30 seconds to reduce load
  });

  const unreadCount = notifications.filter((n) => !n.read).length;

  const markAsReadMutation = useMutation({
    mutationFn: (id) => api.patch(`/notifications/${id}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["notifications"] });
    }
  });

  const markAllReadMutation = useMutation({
    mutationFn: () => api.patch("/notifications/mark-all-read"),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["notifications"] });
    }
  });

  const deleteNotificationMutation = useMutation({
    mutationFn: (id) => api.delete(`/notifications/${id}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["notifications"] });
    }
  });

  const showToast = useCallback((type, message, description) => {
    switch (type) {
      case "success":
        toast.success(message, { description });
        break;
      case "error":
        toast.error(message, { description });
        break;
      case "warning":
        toast.warning(message, { description });
        break;
      case "info":
      default:
        toast.info(message, { description });
        break;
    }
  }, []);

  // For backward compatibility and for sending real notifications
  // In a real app, this might trigger a server-side creation
  const addNotification = useCallback(async (notification) => {
    try {
      // If userId is provided, it's meant for another user (e.g. from admin to student)
      // Otherwise, it's for current user (which is less common for client-side call)
      if (notification.userId) {
        await api.post("/notifications", notification);
      }
      queryClient.invalidateQueries({ queryKey: ["notifications"] });
    } catch (error) {
      console.error("Failed to add notification:", error);
    }
  }, [queryClient]);

  return (
    <NotificationContext.Provider
      value={{
        notifications,
        unreadCount,
        addNotification,
        markAsRead: (id) => markAsReadMutation.mutateAsync(id),
        markAllAsRead: () => markAllReadMutation.mutateAsync(),
        clearAll: () => markAllReadMutation.mutateAsync(), // Alias for simplicity
        deleteNotification: (id) => deleteNotificationMutation.mutateAsync(id),
        showToast
      }}
    >
      {children}
    </NotificationContext.Provider>
  );
};

export const useNotifications = () => {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error("useNotifications must be used within NotificationProvider");
  }
  return context;
};
