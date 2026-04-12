import { useQuery } from '@tanstack/react-query';
import { getActiveChats, getChatHistory, getChatMessages } from '../api/chatApi';

export const useActiveChats = () => {
  return useQuery({
    queryKey: ['chat', 'active'],
    queryFn: getActiveChats,
    refetchInterval: 60000, // Refetch every minute to update availability window
  });
};

export const useChatHistory = () => {
  return useQuery({
    queryKey: ['chat', 'history'],
    queryFn: getChatHistory,
  });
};

export const useChatMessages = (slotId) => {
  return useQuery({
    queryKey: ['chat', 'messages', slotId],
    queryFn: () => getChatMessages(slotId),
    enabled: !!slotId,
  });
};
