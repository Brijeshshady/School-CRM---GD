import api from '../../../lib/api';
import { io } from 'socket.io-client';

const getSocketUrl = () => {
  if (typeof window !== 'undefined' && (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1')) {
    return 'http://localhost:5000';
  }
  return import.meta.env.VITE_API_URL
    ? import.meta.env.VITE_API_URL.replace('/api', '')
    : 'http://localhost:5000';
};

const socketUrl = getSocketUrl();

let socket = null;

export const notificationService = {
  // HTTP requests
  async getNotifications() {
    const res = await api.get('/notifications');
    return res.data.data;
  },

  async markAsRead(id) {
    const res = await api.patch(`/notifications/${id}`);
    return res.data.data;
  },

  async markAllRead() {
    const res = await api.patch('/notifications/mark-all-read');
    return res.data;
  },

  async deleteNotification(id) {
    const res = await api.delete(`/notifications/${id}`);
    return res.data.data;
  },

  // Socket management
  getSocket() {
    if (!socket) {
      this.initSocket();
    }
    return socket;
  },

  initSocket(onNotificationReceived) {
    const token = localStorage.getItem('token');
    if (!token) return null;

    if (socket) {
      socket.disconnect();
    }

    socket = io(socketUrl, {
      auth: {
        token: `Bearer ${token}`
      },
      reconnection: true,
      reconnectionAttempts: 10,
      reconnectionDelay: 2000,
      autoConnect: true
    });

    socket.on('connect', () => {
      console.log('Socket.IO connection established with backend!');
    });

    socket.on('connect_error', (error) => {
      console.error('Socket.IO connection error:', error.message);
    });

    socket.on('notification', (notification) => {
      console.log('Realtime notification received:', notification);
      if (onNotificationReceived) {
        onNotificationReceived(notification);
      }
    });

    socket.on('disconnect', (reason) => {
      console.log('Socket.IO disconnected:', reason);
    });

    return socket;
  },

  disconnectSocket() {
    if (socket) {
      socket.disconnect();
      socket = null;
    }
  }
};
