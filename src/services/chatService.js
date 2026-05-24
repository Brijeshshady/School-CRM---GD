import api from '../lib/api';

const chatService = {
  getConversations: async () => {
    const { data } = await api.get('/chat/conversations');
    return data.data;
  },

  getMessages: async (conversationId) => {
    const { data } = await api.get(`/chat/messages/${conversationId}`);
    return data.data;
  },

  sendMessage: async ({ recipientId, text, conversationId }) => {
    const { data } = await api.post('/chat/send', { recipientId, text, conversationId });
    return data.data;
  },

  searchUsers: async (query) => {
    const { data } = await api.get(`/chat/search-users?query=${query}`);
    return data.data;
  }
};

export default chatService;
