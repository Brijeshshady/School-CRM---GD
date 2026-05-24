import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import chatService from '../../services/chatService';
import { useNotifications } from '../context/NotificationContext';

export const useChat = (conversationId = null) => {
  const queryClient = useQueryClient();

  // Fetch conversations
  const { 
    data: conversations = [], 
    isLoading: isConversationsLoading 
  } = useQuery({
    queryKey: ['conversations'],
    queryFn: chatService.getConversations,
    refetchInterval: 5000, // Polling every 5 seconds
  });

  // Fetch messages for a specific conversation
  const { 
    data: messages = [], 
    isLoading: isMessagesLoading 
  } = useQuery({
    queryKey: ['messages', conversationId],
    queryFn: () => chatService.getMessages(conversationId),
    enabled: !!conversationId,
    refetchInterval: 3000, // Faster polling for active chat
  });

  const { showToast } = useNotifications();

  // Send message mutation
  const sendMessageMutation = useMutation({
    mutationFn: chatService.sendMessage,
    onSuccess: (newMessage) => {
      // Optimistically update messages
      queryClient.setQueryData(['messages', conversationId], (old) => [...(old || []), newMessage]);
      // Invalidate conversations to update last message
      queryClient.invalidateQueries(['conversations']);
    },
    onError: (error) => {
        const message = error.response?.data?.message || "Failed to send message";
        showToast("error", "Error", message);
    }
  });

  // Search users mutation
  const searchUsers = async (query) => {
    return await chatService.searchUsers(query);
  };

  return {
    conversations,
    isConversationsLoading,
    messages,
    isMessagesLoading,
    sendMessage: sendMessageMutation.mutate,
    isSending: sendMessageMutation.isPending,
    searchUsers,
  };
};
