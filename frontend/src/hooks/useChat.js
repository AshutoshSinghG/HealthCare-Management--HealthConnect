import { useQuery } from '@tanstack/react-query';
import { getActiveChats, getChatHistory, getChatMessages } from '../api/chatApi';

export const useActiveChats = () => {
  return useQuery({
    queryKey: ['chat', 'active'],
    queryFn: getActiveChats,
    refetchInterval: 30000, // Refetch every 30 seconds to update availability window
    retry: 2,
    staleTime: 10000, // Consider data stale after 10 seconds
    onError: (error) => {
      console.error('[useActiveChats] Error fetching active chats:', error?.message || error);
    },
  });
};

export const useChatHistory = () => {
  return useQuery({
    queryKey: ['chat', 'history'],
    queryFn: getChatHistory,
    retry: 2,
    onError: (error) => {
      console.error('[useChatHistory] Error fetching chat history:', error?.message || error);
    },
  });
};

export const useChatMessages = (slotId) => {
  return useQuery({
    queryKey: ['chat', 'messages', slotId],
    queryFn: () => getChatMessages(slotId),
    enabled: !!slotId,
    retry: 2,
    onError: (error) => {
      console.error('[useChatMessages] Error fetching messages:', error?.message || error);
    },
  });
};
