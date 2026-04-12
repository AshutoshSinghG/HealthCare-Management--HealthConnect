import { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { Send, X, AlertTriangle, Loader2 } from 'lucide-react';
import io from 'socket.io-client';
import toast from 'react-hot-toast';
import { API_BASE_URL } from '../../utils/constants';
import { getToken } from '../../utils/jwtHelpers';
import { useAuth } from '../../hooks/useAuth';
import { useChatMessages } from '../../hooks/useChat';
import Button from '../ui/Button';

// Extract the host part of API_BASE_URL for socket connection
const SOCKET_URL = API_BASE_URL.replace('/api', '');

const ChatWindow = ({ slot, onClose }) => {
  const { user } = useAuth();
  const [messages, setMessages] = useState([]);
  const [inputText, setInputText] = useState('');
  const [socket, setSocket] = useState(null);
  const [isConnected, setIsConnected] = useState(false);
  const [errorMsg, setErrorMsg] = useState(null);
  
  const messagesEndRef = useRef(null);
  
  // Fetch old messages
  const { data: pastMessages, isLoading: isPastLoading } = useChatMessages(slot.slotId);

  useEffect(() => {
    if (pastMessages) {
      setMessages(pastMessages);
      scrollToBottom();
    }
  }, [pastMessages]);

  useEffect(() => {
    const token = getToken();
    if (!token) {
      setErrorMsg('Authentication error');
      return;
    }

    const newSocket = io(SOCKET_URL, {
      auth: { token },
      transports: ['websocket', 'polling'],
    });

    newSocket.on('connect', () => {
      newSocket.emit('joinChat', { slotId: slot.slotId });
    });

    newSocket.on('joined', () => {
      setIsConnected(true);
      setErrorMsg(null);
    });

    newSocket.on('newMessage', (msg) => {
      setMessages((prev) => [...prev, msg]);
      scrollToBottom();
    });

    newSocket.on('error', (err) => {
      console.error('Socket error:', err);
      setErrorMsg(err);
      toast.error(err);
      if (err.includes('only available during')) {
        setIsConnected(false); // Disconnect visually if time expired
      }
    });

    setSocket(newSocket);

    return () => {
      newSocket.disconnect();
    };
  }, [slot.slotId]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const sendMessage = (e) => {
    e.preventDefault();
    if (!inputText.trim() || !socket || !isConnected) return;

    socket.emit('sendMessage', {
      slotId: slot.slotId,
      message: inputText.trim(),
    });

    setInputText('');
  };

  return (
    <div className="flex flex-col h-[500px] w-full bg-white rounded-2xl shadow-card border border-surface-200 mt-4 overflow-hidden relative">
      {/* Header */}
      <div className="bg-primary-600 px-4 py-3 flex items-center justify-between text-white shrink-0">
        <div>
          <h3 className="font-semibold">{slot.partnerName}</h3>
          <p className="text-xs text-primary-100 flex items-center gap-1">
            {isConnected ? (
              <><span className="w-2 h-2 rounded-full bg-success-400"></span> Live</>
            ) : errorMsg ? (
              <><span className="w-2 h-2 rounded-full bg-danger-400"></span> Disconnected</>
            ) : (
              <Loader2 className="w-3 h-3 animate-spin"/>
            )}
            · {slot.time}
          </p>
        </div>
        <button onClick={onClose} className="p-1 hover:bg-primary-700 rounded-lg transition-colors">
          <X className="w-5 h-5"/>
        </button>
      </div>

      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto p-4 bg-surface-50 space-y-4">
        {errorMsg && (
          <div className="bg-danger-50 border border-danger-100 p-3 rounded-xl flex gap-2 items-start text-danger-700 text-sm">
            <AlertTriangle className="w-4 h-4 shrink-0 mt-0.5" />
            <p>{errorMsg}</p>
          </div>
        )}

        {isPastLoading ? (
          <div className="flex justify-center py-4"><Loader2 className="animate-spin text-surface-400" /></div>
        ) : messages.length === 0 ? (
          <p className="text-center text-surface-400 text-sm mt-10">No messages yet. Start the conversation!</p>
        ) : (
          messages.map((msg, idx) => {
            const isMe = msg.senderRole === user.role;
            return (
              <div key={msg.id || idx} className={`flex flex-col ${isMe ? 'items-end' : 'items-start'}`}>
                <div className={`max-w-[80%] rounded-2xl px-4 py-2 ${
                  isMe ? 'bg-primary-500 text-white rounded-tr-sm' : 'bg-white border border-surface-200 text-surface-800 rounded-tl-sm'
                }`}>
                  <p className="text-sm break-words whitespace-pre-wrap">{msg.message}</p>
                </div>
                <span className="text-[10px] text-surface-400 mt-1 mx-1">
                  {new Date(msg.sentAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </span>
              </div>
            );
          })
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <div className="p-3 bg-white border-t border-surface-100 shrink-0">
        <form onSubmit={sendMessage} className="flex gap-2">
          <input
            type="text"
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            disabled={!isConnected}
            placeholder={isConnected ? "Type a message..." : "Chat is not available"}
            className="flex-1 bg-surface-50 border border-surface-200 rounded-xl px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 disabled:opacity-50 disabled:cursor-not-allowed"
          />
          <Button 
            type="submit" 
            disabled={!inputText.trim() || !isConnected} 
            className="!px-3 !rounded-xl"
          >
            <Send className="w-4 h-4" />
          </Button>
        </form>
      </div>
    </div>
  );
};

export default ChatWindow;
