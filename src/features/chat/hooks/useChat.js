import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useEffect, useState, useRef } from 'react';
import { chatService } from '../services/chatService';
import { notificationService } from '../../notifications/services/notificationService';
import { toast } from 'sonner';

export const useChat = (conversationId = null) => {
  const queryClient = useQueryClient();
  const [typingUsers, setTypingUsers] = useState({}); // conversationId -> Set of userIds
  const [onlineStatuses, setOnlineStatuses] = useState({}); // userId -> { status, lastSeen }
  const typingTimeoutRef = useRef(null);

  // 1. Fetch conversations
  const { data: conversations = [], isLoading: isConversationsLoading } = useQuery({
    queryKey: ['conversations'],
    queryFn: chatService.getConversations,
    refetchOnWindowFocus: true
  });

  // 2. Fetch messages
  const { data: messages = [], isLoading: isMessagesLoading } = useQuery({
    queryKey: ['messages', conversationId],
    queryFn: () => chatService.getMessages(conversationId),
    enabled: !!conversationId
  });

  // 3. Send message mutation
  const sendMessageMutation = useMutation({
    mutationFn: chatService.sendMessage,
    onSuccess: (newMessage) => {
      queryClient.setQueryData(['messages', conversationId], (old) => {
        const list = old || [];
        if (list.some(m => m._id === newMessage._id)) return list;
        return [...list, newMessage];
      });
      queryClient.invalidateQueries({ queryKey: ['conversations'] });
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || 'Failed to send message');
    }
  });

  // 4. Pin/Unpin mutation
  const pinMutation = useMutation({
    mutationFn: chatService.togglePin,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['conversations'] });
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || 'Failed to update pin');
    }
  });

  // 5. File upload mutation
  const uploadMutation = useMutation({
    mutationFn: chatService.uploadFile,
    onError: (error) => {
      toast.error(error.response?.data?.message || 'Failed to upload file');
    }
  });

  // Socket event binding and listeners
  useEffect(() => {
    const socket = notificationService.getSocket();
    if (!socket) return;

    if (conversationId) {
      socket.emit('chat:join', { conversationId });
      socket.emit('chat:read', { conversationId });
    }

    const handleReceiveMessage = (newMessage) => {
      if (conversationId && newMessage.conversation === conversationId) {
        queryClient.setQueryData(['messages', conversationId], (old) => {
          const list = old || [];
          if (list.some(m => m._id === newMessage._id)) return list;
          return [...list, newMessage];
        });
        socket.emit('chat:read', { conversationId });
      } else {
        const senderName = newMessage.sender?.name || 'Someone';
        toast.info(`New Message from ${senderName}`, {
          description: newMessage.text,
          action: {
            label: 'Open',
            onClick: () => {
              window.location.href = `/student/dashboard/chat?id=${newMessage.conversation}`;
            }
          }
        });
      }

      queryClient.invalidateQueries({ queryKey: ['conversations'] });
      queryClient.invalidateQueries({ queryKey: ['conversations-global'] });
    };

    const handleReadReceipt = ({ conversationId: readConvId }) => {
      if (conversationId && readConvId === conversationId) {
        queryClient.setQueryData(['messages', conversationId], (old) => {
          if (!old) return [];
          return old.map(msg => ({ ...msg, isRead: true }));
        });
      }
      queryClient.invalidateQueries({ queryKey: ['conversations'] });
    };

    const handleTyping = ({ conversationId: typingConvId, userId: typingUserId, isTyping }) => {
      setTypingUsers((prev) => {
        const copy = { ...prev };
        if (!copy[typingConvId]) {
          copy[typingConvId] = new Set();
        }
        if (isTyping) {
          copy[typingConvId].add(typingUserId);
        } else {
          copy[typingConvId].delete(typingUserId);
        }
        const updated = {};
        Object.keys(copy).forEach(k => {
          updated[k] = new Set(copy[k]);
        });
        return updated;
      });
    };

    const handleStatusUpdate = ({ userId: statusUserId, status, lastSeen }) => {
      setOnlineStatuses((prev) => ({
        ...prev,
        [statusUserId]: { status, lastSeen }
      }));
    };

    socket.on('chat:message:receive', handleReceiveMessage);
    socket.on('chat:read', handleReadReceipt);
    socket.on('chat:typing', handleTyping);
    socket.on('user:status', handleStatusUpdate);

    return () => {
      if (conversationId) {
        socket.emit('chat:leave', { conversationId });
      }
      socket.off('chat:message:receive', handleReceiveMessage);
      socket.off('chat:read', handleReadReceipt);
      socket.off('chat:typing', handleTyping);
      socket.off('user:status', handleStatusUpdate);
    };
  }, [conversationId, queryClient]);

  const emitTyping = (isTyping) => {
    const socket = notificationService.getSocket();
    if (!socket || !conversationId) return;

    socket.emit('chat:typing', { conversationId, isTyping });

    if (isTyping) {
      if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current);
      typingTimeoutRef.current = setTimeout(() => {
        socket.emit('chat:typing', { conversationId, isTyping: false });
      }, 3000);
    }
  };

  const searchUsers = async (query) => {
    return await chatService.searchUsers(query);
  };

  return {
    conversations,
    isConversationsLoading,
    messages,
    isMessagesLoading,
    sendMessage: sendMessageMutation.mutateAsync,
    isSending: sendMessageMutation.isPending,
    togglePin: pinMutation.mutate,
    isPinning: pinMutation.isPending,
    uploadFile: uploadMutation.mutateAsync,
    isUploading: uploadMutation.isPending,
    searchUsers,
    typingUsers: conversationId ? Array.from(typingUsers[conversationId] || []) : [],
    onlineStatuses,
    emitTyping
  };
};
export default useChat;
