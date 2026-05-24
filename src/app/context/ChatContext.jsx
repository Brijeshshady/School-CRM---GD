import { createContext, useContext, useState, useEffect } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import chatService from "../../services/chatService";
import { useAuth } from "./AuthContext";
import { useNotifications } from "./NotificationContext";
import { notificationService } from "../../features/notifications/services/notificationService";

const ChatContext = createContext(undefined);

export const ChatProvider = ({ children }) => {
  const { user, isAuthenticated } = useAuth();
  const { addNotification, showToast } = useNotifications();
  const [lastMessageIds, setLastMessageIds] = useState(new Set());
  const queryClient = useQueryClient();

  useEffect(() => {
    if (!isAuthenticated) return;
    const socket = notificationService.getSocket();
    if (!socket) return;

    const handleReceiveMessage = (newMessage) => {
      console.log('ChatContext received realtime message:', newMessage);
      queryClient.invalidateQueries({ queryKey: ['conversations-global'] });
      queryClient.invalidateQueries({ queryKey: ['conversations'] });
    };

    socket.on('chat:message:receive', handleReceiveMessage);

    return () => {
      socket.off('chat:message:receive', handleReceiveMessage);
    };
  }, [isAuthenticated, queryClient]);

  // Global polling for conversations (to detect new messages)
  const { data: conversations = [] } = useQuery({
    queryKey: ['conversations-global'],
    queryFn: chatService.getConversations,
    enabled: isAuthenticated,
    refetchInterval: 15000, // Poll every 15 seconds for new messages
  });

  const unreadConversationsCount = (conversations || []).filter(c => {
    if (!c.lastMessage) return false;
    // Check if last message is unread AND not sent by current user
    const isMe = c.lastMessage.sender === user?.id || c.lastMessage.sender?._id === user?.id || c.lastMessage.sender === user?._id;
    return !c.lastMessage.isRead && !isMe;
  }).length;

  // Detect new messages and trigger toast/notifications
  useEffect(() => {
    if (!conversations || !conversations.length) return;

    const newLastMessageIds = new Set();
    
    conversations.forEach(conv => {
      const lastMsg = conv.lastMessage;
      if (lastMsg) {
        newLastMessageIds.add(lastMsg._id);
        
        // If this is a new message ID we haven't seen before
        // AND it's not from us
        // AND it's unread
        const isMe = lastMsg.sender === user?.id || lastMsg.sender?._id === user?.id || lastMsg.sender === user?._id;
        if (!lastMessageIds.has(lastMsg._id) && !isMe && !lastMsg.isRead && lastMessageIds.size > 0) {
          
          const otherParticipant = conv.participants?.find(p => p._id !== user?.id && p._id !== user?._id);
          const senderName = otherParticipant?.name || "Someone";
          
          const rolePath = user?.role?.toLowerCase() === 'admin' ? 'admin' : 
                           user?.role?.toLowerCase() === 'teacher' ? 'teacher' : 
                           user?.role?.toLowerCase() === 'parent' ? 'parent' : 'student';
          
          showToast("info", "New Message", `${senderName}: ${lastMsg.text}`);
          addNotification({
            type: "message",
            title: "New Message",
            message: `${senderName}: ${lastMsg.text}`,
            actionUrl: `/${rolePath}/dashboard/chat`
          });
        }
      }
    });
    
    setLastMessageIds(newLastMessageIds);
  }, [conversations, user?.id, user?._id]);

  return (
    <ChatContext.Provider value={{ unreadConversationsCount, conversations }}>
      {children}
    </ChatContext.Provider>
  );
};

export const useChatContext = () => {
  const context = useContext(ChatContext);
  if (context === undefined) {
    throw new Error("useChatContext must be used within a ChatProvider");
  }
  return context;
};
