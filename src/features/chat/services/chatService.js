import api from '../../../lib/api';

export const chatService = {
  async getConversations() {
    const { data } = await api.get('/chat/conversations');
    return data.data;
  },

  async getMessages(conversationId) {
    const { data } = await api.get(`/chat/messages/${conversationId}`);
    return data.data;
  },

  async sendMessage({ recipientId, text, conversationId, attachments }) {
    const { data } = await api.post('/chat/send', { 
      recipientId, 
      text, 
      conversationId,
      attachments: attachments || []
    });
    return data.data;
  },

  async searchUsers(query) {
    const { data } = await api.get(`/chat/search-users?query=${query}`);
    return data.data;
  },

  async togglePin(conversationId) {
    const { data } = await api.patch(`/chat/conversations/${conversationId}/pin`);
    return data.data;
  },

  async uploadFile(file) {
    const formData = new FormData();
    formData.append('file', file);
    const { data } = await api.post('/chat/upload', formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    });
    return data.url; // Returns server path like /uploads/...
  }
};

export default chatService;
