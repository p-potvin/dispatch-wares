import { createSlice } from '@reduxjs/toolkit';

const notificationsSlice = createSlice({
  name: 'notifications',
  initialState: {
    isOpen: false,
    items: [],
    unreadCount: 0,
  },
  reducers: {
    toggleNotifications(state) {
      state.isOpen = !state.isOpen;
      if (state.isOpen) state.unreadCount = 0;
    },
    addNotification(state, action) {
      state.items.unshift(action.payload);
      if (!state.isOpen) state.unreadCount += 1;
    },
    dismissNotification(state, action) {
      state.items = state.items.filter((n) => n.id !== action.payload);
    },
    markAllRead(state) {
      state.items = state.items.map((n) => ({ ...n, read: true }));
      state.unreadCount = 0;
    },
  },
});

export const {
  toggleNotifications,
  addNotification,
  dismissNotification,
  markAllRead,
} = notificationsSlice.actions;
export default notificationsSlice.reducer;
