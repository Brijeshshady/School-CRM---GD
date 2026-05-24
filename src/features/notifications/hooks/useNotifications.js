import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useEffect } from 'react';
import { notificationService } from '../services/notificationService';
import { toast } from 'sonner';

export const useNotifications = () => {
  const queryClient = useQueryClient();

  // Fetch notifications
  const { data: notifications = [], isLoading, error } = useQuery({
    queryKey: ['notifications'],
    queryFn: notificationService.getNotifications,
    refetchOnWindowFocus: true,
    staleTime: 30000 // 30 seconds
  });

  // Calculate unread count
  const unreadCount = notifications.filter((n) => !n.read).length;

  // Mutations
  const markAsReadMutation = useMutation({
    mutationFn: notificationService.markAsRead,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['notifications'] });
    }
  });

  const markAllReadMutation = useMutation({
    mutationFn: notificationService.markAllRead,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['notifications'] });
      toast.success('All notifications marked as read');
    }
  });

  const deleteMutation = useMutation({
    mutationFn: notificationService.deleteNotification,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['notifications'] });
      toast.success('Notification deleted');
    }
  });

  // Live Socket connection
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) return;

    // Initialize socket connection and pass handler
    notificationService.initSocket((newNotification) => {
      // Invalidate query to refresh the list & update unread badges
      queryClient.invalidateQueries({ queryKey: ['notifications'] });

      // Trigger a gorgeous toast notification
      toast(newNotification.title || 'New Notification', {
        description: newNotification.message,
        action: newNotification.actionUrl ? {
          label: 'View',
          onClick: () => {
            window.location.href = newNotification.actionUrl;
          }
        } : undefined,
        duration: 5000,
        style: {
          background: 'rgba(30, 41, 59, 0.95)',
          backdropFilter: 'blur(10px)',
          border: '1px solid rgba(255, 255, 255, 0.1)',
          color: '#fff',
          borderRadius: '12px'
        }
      });
    });

    return () => {
      notificationService.disconnectSocket();
    };
  }, [queryClient]);

  return {
    notifications,
    unreadCount,
    isLoading,
    error,
    markAsRead: markAsReadMutation.mutate,
    markAllRead: markAllReadMutation.mutate,
    deleteNotification: deleteMutation.mutate,
    isMarkingRead: markAsReadMutation.isPending,
    isMarkingAllRead: markAllReadMutation.isPending
  };
};
