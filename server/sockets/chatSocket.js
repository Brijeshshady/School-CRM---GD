const Conversation = require('../models/Conversation');
const Message = require('../models/Message');
const User = require('../models/User');
const EVENTS = require('./chatEvents');

const registerChatHandlers = (io, socket, userSockets) => {
  const userId = socket.user.id;

  // Broadcast user is online when they connect
  const broadcastPresence = (status) => {
    Conversation.find({ participants: { $in: [userId] } })
      .then(conversations => {
        conversations.forEach(conv => {
          socket.to(`conversation:${conv._id.toString()}`).emit(EVENTS.STATUS_UPDATE, {
            userId,
            status,
            lastSeen: new Date()
          });
        });
      })
      .catch(err => console.error("Error broadcasting presence:", err));
  };

  // Broadcast online presence initially
  broadcastPresence('online');

  // Join a conversation room
  socket.on(EVENTS.JOIN_CONVERSATION, ({ conversationId }) => {
    if (!conversationId) return;
    socket.join(`conversation:${conversationId}`);
    console.log(`Socket user ${socket.user.name} joined conversation room: ${conversationId}`);

    // Check other participants online/offline status and emit immediately
    Conversation.findById(conversationId)
      .populate('participants', '_id name lastSeen')
      .then(conv => {
        if (!conv) return;
        conv.participants.forEach(p => {
          const pIdStr = p._id.toString();
          if (pIdStr !== userId) {
            const isOnline = userSockets.has(pIdStr) && userSockets.get(pIdStr).size > 0;
            socket.emit(EVENTS.STATUS_UPDATE, {
              userId: pIdStr,
              status: isOnline ? 'online' : 'offline',
              lastSeen: p.lastSeen || new Date()
            });
          }
        });
      })
      .catch(err => console.error("Error sending initial presence update:", err));
  });

  // Leave a conversation room
  socket.on(EVENTS.LEAVE_CONVERSATION, ({ conversationId }) => {
    if (!conversationId) return;
    socket.leave(`conversation:${conversationId}`);
    console.log(`Socket user ${socket.user.name} left conversation room: ${conversationId}`);
  });

  // Handle typing indicator
  socket.on(EVENTS.TYPING, ({ conversationId, isTyping }) => {
    if (!conversationId) return;
    socket.to(`conversation:${conversationId}`).emit(EVENTS.TYPING, {
      conversationId,
      userId,
      isTyping
    });
  });

  // Handle read receipt
  socket.on(EVENTS.READ_RECEIPT, async ({ conversationId }) => {
    if (!conversationId) return;

    try {
      // Mark all incoming messages in this conversation as read
      await Message.updateMany(
        { 
          conversation: conversationId, 
          sender: { $ne: userId },
          isRead: false 
        },
        { $set: { isRead: true } }
      );

      // Broadcast read receipt to room
      socket.to(`conversation:${conversationId}`).emit(EVENTS.READ_RECEIPT, {
        conversationId,
        userId
      });
    } catch (err) {
      console.error("Error processing read receipt:", err);
    }
  });

  // Handle clean disconnect
  socket.on('disconnect', () => {
    setTimeout(() => {
      const isOnline = userSockets.has(userId) && userSockets.get(userId).size > 0;
      if (!isOnline) {
        User.findByIdAndUpdate(userId, { lastSeen: new Date() }).catch(err => console.error(err));
        broadcastPresence('offline');
      }
    }, 1000);
  });
};

module.exports = {
  registerChatHandlers
};
