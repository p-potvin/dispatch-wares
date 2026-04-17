import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Bell, MessageSquare, Calendar, ChevronDown } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { setSelectedDate } from '../../store/slices/uiSlice';
import { toggleNotifications } from '../../store/slices/notificationsSlice';
import { toggleChat } from '../../store/slices/chatSlice';
import { getInitials } from '../../utils/formatters';
import NotificationsPanel from '../notifications/NotificationsPanel';
import ChatPanel from '../chat/ChatPanel';

export default function TopBar() {
  const dispatch = useDispatch();
  const { user } = useSelector((s) => s.auth);
  const { selectedDate } = useSelector((s) => s.ui);
  const { unreadCount, isOpen: notifOpen } = useSelector((s) => s.notifications);
  const { isOpen: chatOpen, unreadCounts } = useSelector((s) => s.chat);
  const chatUnread = Object.values(unreadCounts || {}).reduce((a, b) => a + b, 0);

  return (
    <header className="h-14 bg-slate-900/80 backdrop-blur border-b border-slate-800 flex items-center px-6 gap-4 shrink-0 z-20">
      <div className="flex items-center gap-2 text-slate-400">
        <Calendar className="w-4 h-4" />
        <input
          type="date"
          value={selectedDate}
          onChange={(e) => dispatch(setSelectedDate(e.target.value))}
          className="bg-transparent text-slate-200 text-sm focus:outline-none cursor-pointer"
        />
      </div>

      <div className="ml-auto flex items-center gap-3">
        <button
          onClick={() => dispatch(toggleChat())}
          className="relative p-2 rounded-lg text-slate-400 hover:text-slate-200 hover:bg-slate-800 transition-all"
        >
          <MessageSquare className="w-5 h-5" />
          {chatUnread > 0 && (
            <span className="absolute -top-1 -right-1 w-4 h-4 bg-emerald-500 text-slate-900 text-xs rounded-full flex items-center justify-center font-bold">
              {chatUnread > 9 ? '9+' : chatUnread}
            </span>
          )}
        </button>

        <button
          onClick={() => dispatch(toggleNotifications())}
          className="relative p-2 rounded-lg text-slate-400 hover:text-slate-200 hover:bg-slate-800 transition-all"
        >
          <Bell className="w-5 h-5" />
          {unreadCount > 0 && (
            <motion.span
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 text-white text-xs rounded-full flex items-center justify-center font-bold"
            >
              {unreadCount > 9 ? '9+' : unreadCount}
            </motion.span>
          )}
        </button>

        <div className="flex items-center gap-2 pl-3 border-l border-slate-700">
          <div className="w-8 h-8 rounded-full bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center text-emerald-400 text-sm font-semibold">
            {getInitials(user?.name || user?.email || 'D')}
          </div>
          <span className="text-sm text-slate-300 hidden sm:block">{user?.name || user?.email || 'Dispatcher'}</span>
          <ChevronDown className="w-3 h-3 text-slate-500" />
        </div>
      </div>

      <AnimatePresence>{notifOpen && <NotificationsPanel />}</AnimatePresence>
      <AnimatePresence>{chatOpen && <ChatPanel />}</AnimatePresence>
    </header>
  );
}
