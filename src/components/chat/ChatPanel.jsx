import React, { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useSelector, useDispatch } from 'react-redux';
import { X, Send, MessageSquare } from 'lucide-react';
import { toggleChat, setActiveChannel, addMessage } from '../../store/slices/chatSlice';
import { useSocket } from '../../hooks/useSocket';
import { formatTime, getInitials } from '../../utils/formatters';

export default function ChatPanel() {
  const dispatch = useDispatch();
  const { channels, messages, activeChannelId } = useSelector((s) => s.chat);
  const { user } = useSelector((s) => s.auth);
  const { sendChatMessage } = useSocket();
  const [text, setText] = useState('');
  const bottomRef = useRef(null);

  const activeMessages = messages[activeChannelId] || [];

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [activeMessages.length]);

  const handleSend = () => {
    if (!text.trim() || !activeChannelId) return;
    const msg = { id: Date.now(), channelId: activeChannelId, content: text.trim(), senderId: user?.id, senderName: user?.name || 'You', createdAt: new Date().toISOString() };
    dispatch(addMessage({ channelId: activeChannelId, message: msg }));
    sendChatMessage(activeChannelId, text.trim());
    setText('');
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 20 }}
      className="fixed right-4 bottom-4 w-80 h-[480px] bg-vault-base border border-slate-700 rounded-xl shadow-2xl flex flex-col z-50 overflow-hidden"
    >
      <div className="flex items-center justify-between px-4 py-3 border-b border-slate-800 bg-vault-base">
        <div className="flex items-center gap-2 text-sm font-semibold text-vault-light">
          <MessageSquare className="w-4 h-4 text-vault-green" />
          Team Chat
        </div>
        <button onClick={() => dispatch(toggleChat())} className="text-slate-500 hover:text-vault-light">
          <X className="w-4 h-4" />
        </button>
      </div>

      {channels.length > 0 && (
        <div className="flex gap-1 px-3 py-2 border-b border-slate-800 overflow-x-auto">
          {channels.map((ch) => (
            <button
              key={ch.id}
              onClick={() => dispatch(setActiveChannel(ch.id))}
              className={`px-2 py-1 rounded text-xs shrink-0 transition-colors ${activeChannelId === ch.id ? 'bg-vault-green/20 text-vault-green' : 'text-vault-light/70 hover:text-vault-light'}`}
            >
              #{ch.name}
            </button>
          ))}
        </div>
      )}

      <div className="flex-1 overflow-y-auto px-3 py-2 space-y-3">
        {activeMessages.length === 0 ? (
          <p className="text-center text-slate-600 text-xs mt-8">No messages yet</p>
        ) : (
          activeMessages.map((msg) => {
            const isMe = msg.senderId === user?.id;
            return (
              <div key={msg.id} className={`flex gap-2 ${isMe ? 'flex-row-reverse' : ''}`}>
                <div className="w-7 h-7 rounded-full bg-vault-slate/80 flex items-center justify-center text-xs text-vault-light shrink-0">
                  {getInitials(msg.senderName || '?')}
                </div>
                <div className={`max-w-[75%] ${isMe ? 'items-end' : 'items-start'} flex flex-col gap-0.5`}>
                  {!isMe && <span className="text-xs text-slate-500">{msg.senderName}</span>}
                  <div className={`px-3 py-2 rounded-xl text-sm ${isMe ? 'bg-vault-green/80 text-vault-light' : 'bg-vault-slate text-vault-light'}`}>
                    {msg.content}
                  </div>
                  <span className="text-xs text-slate-600">{formatTime(msg.createdAt)}</span>
                </div>
              </div>
            );
          })
        )}
        <div ref={bottomRef} />
      </div>

      <div className="px-3 py-2 border-t border-slate-800 flex gap-2">
        <input
          value={text}
          onChange={(e) => setText(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && !e.shiftKey && handleSend()}
          placeholder="Message…"
          className="flex-1 bg-vault-slate border border-slate-700 rounded-lg px-3 py-1.5 text-sm text-vault-light placeholder-slate-600 focus:outline-none focus:border-vault-green"
        />
        <button
          onClick={handleSend}
          disabled={!text.trim()}
          className="p-2 bg-vault-green/80 hover:bg-vault-green disabled:opacity-40 rounded-lg text-vault-light transition-colors"
        >
          <Send className="w-4 h-4" />
        </button>
      </div>
    </motion.div>
  );
}
