import api from './axios';

export const getActiveChats = async () => {
  const { data } = await api.get('/chat/active');
  return data.data;
};

export const getChatHistory = async () => {
  const { data } = await api.get('/chat/history');
  return data.data;
};

export const getChatMessages = async (slotId) => {
  const { data } = await api.get(`/chat/${slotId}/messages`);
  return data.data;
};
