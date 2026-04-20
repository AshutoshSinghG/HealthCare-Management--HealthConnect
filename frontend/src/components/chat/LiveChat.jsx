import { useState } from 'react';
import { motion } from 'framer-motion';
import { MessageCircle, Clock, Calendar, CheckCircle, Loader2, AlertCircle } from 'lucide-react';
import Card from '../ui/Card';
import Badge from '../ui/Badge';
import { useActiveChats, useChatHistory } from '../../hooks/useChat';
import ChatWindow from './ChatWindow';
import { formatDate } from '../../utils/formatDate';

const LiveChat = () => {
  const [tab, setTab] = useState('live');
  const [activeChatSlot, setActiveChatSlot] = useState(null); // The slot the user is actively chatting in
  const [viewHistorySlot, setViewHistorySlot] = useState(null); // The slot selected for viewing history

  const { data: activeChats = [], isLoading: isActiveLoading, error: activeError } = useActiveChats();
  const { data: history = [], isLoading: isHistoryLoading, error: historyError } = useChatHistory();

  return (
    <div className="space-y-6">
      <div className="border-b border-surface-200">
        <nav className="flex gap-1">
          <button onClick={() => { setTab('live'); setViewHistorySlot(null); }}
            className={`px-4 py-3 text-sm font-medium border-b-2 transition-colors ${tab === 'live' ? 'border-primary-500 text-primary-600' : 'border-transparent text-surface-500 hover:text-surface-700'}`}>
            Live Chat
          </button>
          <button onClick={() => { setTab('history'); setActiveChatSlot(null); }}
            className={`px-4 py-3 text-sm font-medium border-b-2 transition-colors ${tab === 'history' ? 'border-primary-500 text-primary-600' : 'border-transparent text-surface-500 hover:text-surface-700'}`}>
            Chat History
          </button>
        </nav>
      </div>

      <motion.div key={tab} initial={{ opacity: 0, y: 5 }} animate={{ opacity: 1, y: 0 }}>
        {tab === 'live' && (
          <div>
            {!activeChatSlot ? (
              <div className="space-y-4">
                <div className="bg-primary-50 border border-primary-100 rounded-xl p-4 flex items-start gap-3">
                  <MessageCircle className="w-5 h-5 text-primary-600 shrink-0" />
                  <div>
                    <h3 className="text-sm font-semibold text-primary-800">Time-Restricted Chat</h3>
                    <p className="text-xs text-primary-700 mt-1">
                      You can only chat with your doctor or patient if you have a booked appointment covering the current time ({new Date().toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}). Outside of this window, chat is disabled.
                    </p>
                  </div>
                </div>

                {activeError ? (
                  <Card>
                    <div className="flex flex-col items-center justify-center py-10 text-center">
                      <AlertCircle className="w-12 h-12 text-danger-400 mb-3" />
                      <h3 className="text-surface-800 font-medium">Error loading chats</h3>
                      <p className="text-sm text-surface-500 mt-1">
                        {activeError?.response?.data?.message || activeError?.message || 'Could not fetch active chats. Please try again.'}
                      </p>
                    </div>
                  </Card>
                ) : isActiveLoading ? (
                  <div className="flex justify-center py-10"><Loader2 className="w-6 h-6 animate-spin text-primary-500" /></div>
                ) : activeChats.length === 0 ? (
                  <Card>
                    <div className="flex flex-col items-center justify-center py-10 text-center">
                      <Clock className="w-12 h-12 text-surface-300 mb-3" />
                      <h3 className="text-surface-800 font-medium">No active appointments available for chat at this time</h3>
                      <p className="text-sm text-surface-500 mt-1">Chat will appear here when you have a booked appointment that covers the current time.</p>
                    </div>
                  </Card>
                ) : (
                  <div className="grid gap-3 sm:grid-cols-2">
                    {activeChats.map(slot => (
                      <Card hover key={slot.slotId} className="flex flex-col h-full border-primary-200 bg-primary-50/20">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <span className="relative flex h-3 w-3">
                              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-success-400 opacity-75"></span>
                              <span className="relative inline-flex rounded-full h-3 w-3 bg-success-500"></span>
                            </span>
                            <Badge variant="success" size="sm">Available Now</Badge>
                          </div>
                          <h4 className="font-semibold text-surface-800">{slot.partnerName}</h4>
                          <p className="text-xs text-surface-500 flex items-center gap-1 mt-1.5"><Calendar className="w-3.5 h-3.5"/> {formatDate(slot.date)}</p>
                          <p className="text-xs text-surface-500 flex items-center gap-1 mt-1"><Clock className="w-3.5 h-3.5"/> {slot.time}</p>
                        </div>
                        <button onClick={() => setActiveChatSlot(slot)} className="mt-4 w-full py-2 bg-primary-600 hover:bg-primary-700 text-white text-sm font-medium rounded-xl transition-colors">
                          Start Chat
                        </button>
                      </Card>
                    ))}
                  </div>
                )}
              </div>
            ) : (
              <div>
                <button onClick={() => setActiveChatSlot(null)} className="text-sm text-primary-600 hover:text-primary-700 font-medium flex items-center gap-1 mb-2">
                  ← Back to Active Appointments
                </button>
                <ChatWindow slot={activeChatSlot} onClose={() => setActiveChatSlot(null)} />
              </div>
            )}
          </div>
        )}

        {tab === 'history' && (
          <div>
            {!viewHistorySlot ? (
              historyError ? (
                <Card>
                  <div className="flex flex-col items-center justify-center py-10 text-center">
                    <AlertCircle className="w-12 h-12 text-danger-400 mb-3" />
                    <h3 className="text-surface-800 font-medium">Error loading chat history</h3>
                    <p className="text-sm text-surface-500 mt-1">
                      {historyError?.response?.data?.message || historyError?.message || 'Could not fetch history.'}
                    </p>
                  </div>
                </Card>
              ) : isHistoryLoading ? (
                <div className="flex justify-center py-10"><Loader2 className="w-6 h-6 animate-spin text-primary-500" /></div>
              ) : history.length === 0 ? (
                <Card><p className="text-center text-surface-400 py-8">No chat history available.</p></Card>
              ) : (
                <div className="space-y-3">
                  {history.map((h, i) => (
                    <motion.div key={h.slotId} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}>
                      <Card hover className="cursor-pointer" onClick={() => setViewHistorySlot({ slotId: h.slotId, partnerName: h.partnerName, time: `${formatDate(h.date)} · ${h.time}` })}>
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-full bg-surface-100 flex items-center justify-center">
                              <MessageCircle className="w-5 h-5 text-surface-500" />
                            </div>
                            <div>
                              <p className="font-semibold text-surface-800 text-sm">{h.partnerName}</p>
                              <p className="text-xs text-surface-500 mt-0.5">{formatDate(h.date)} at {h.time}</p>
                            </div>
                          </div>
                          <Badge size="sm" variant={h.status === 'booked' ? 'success' : 'default'} dot>{h.status === 'booked' ? 'Completed' : h.status}</Badge>
                        </div>
                      </Card>
                    </motion.div>
                  ))}
                </div>
              )
            ) : (
              <div>
                <button onClick={() => setViewHistorySlot(null)} className="text-sm text-primary-600 hover:text-primary-700 font-medium flex items-center gap-1 mb-2">
                  ← Back to History
                </button>
                {/* Reusing ChatWindow but in read-only visual mode since slot won't be active time */}
                <ChatWindow slot={viewHistorySlot} onClose={() => setViewHistorySlot(null)} />
              </div>
            )}
          </div>
        )}
      </motion.div>
    </div>
  );
};

export default LiveChat;
