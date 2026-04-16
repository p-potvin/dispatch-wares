import React from 'react';
import { motion } from 'framer-motion';
import { useSelector, useDispatch } from 'react-redux';
import { X, Bell, CheckCheck } from 'lucide-react';
import { toggleNotifications, dismissNotification, markAllRead } from '../../store/slices/notificationsSlice';
import { formatRelative } from '../../utils/formatters';

export default function NotificationsPanel() {
  const dispatch = useDispatch();
  const { items } = useSelector((s) => s.notifications);

  return (
    <motion.div
      initial={{ opacity: 0, y: -8, scale: 0.97 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: -8, scale: 0.97 }}
      className="absolute top-14 right-4 w-80 bg-slate-900 border border-slate-700 rounded-xl shadow-2xl z-50 overflow-hidden"
    >
      <div className="flex items-center justify-between px-4 py-3 border-b border-slate-800">
        <div className="flex items-center gap-2 text-sm font-semibold text-slate-200">
          <Bell className="w-4 h-4 text-amber-400" />
          Notifications
        </div>
        <div className="flex items-center gap-2">
          <button onClick={() => dispatch(markAllRead())} className="text-xs text-slate-400 hover:text-emerald-400 flex items-center gap-1">
            <CheckCheck className="w-3 h-3" /> All read
          </button>
          <button onClick={() => dispatch(toggleNotifications())} className="text-slate-500 hover:text-slate-200">
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>
      <div className="max-h-96 overflow-y-auto">
        {items.length === 0 ? (
          <p className="text-center text-slate-500 py-8 text-sm">No notifications</p>
        ) : (
          items.slice(0, 20).map((n) => (
            <div
              key={n.id}
              className={`px-4 py-3 border-b border-slate-800/50 flex items-start gap-3 hover:bg-slate-800/40 transition-colors ${!n.read ? 'bg-slate-800/20' : ''}`}
            >
              <div className={`w-2 h-2 rounded-full mt-1.5 shrink-0 ${!n.read ? 'bg-emerald-400' : 'bg-slate-600'}`} />
              <div className="flex-1 min-w-0">
                <p className="text-sm text-slate-200">{n.message}</p>
                <p className="text-xs text-slate-500 mt-0.5">{formatRelative(n.createdAt)}</p>
              </div>
              <button onClick={() => dispatch(dismissNotification(n.id))} className="text-slate-600 hover:text-slate-300">
                <X className="w-3 h-3" />
              </button>
            </div>
          ))
        )}
      </div>
    </motion.div>
  );
}
