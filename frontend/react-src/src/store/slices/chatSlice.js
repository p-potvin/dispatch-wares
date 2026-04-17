import { createSlice } from '@reduxjs/toolkit';

const chatSlice = createSlice({
  name: 'chat',
  initialState: {
    isOpen: false,
    channels: [],
    messages: {},
    activeChannelId: null,
    unreadCounts: {},
  },
  reducers: {
    toggleChat(state) {
      state.isOpen = !state.isOpen;
    },
    setChannels(state, action) {
      state.channels = action.payload;
      if (!state.activeChannelId && action.payload.length > 0) {
        state.activeChannelId = action.payload[0].id;
      }
    },
    setActiveChannel(state, action) {
      state.activeChannelId = action.payload;
      if (state.unreadCounts[action.payload]) {
        state.unreadCounts[action.payload] = 0;
      }
    },
    addMessage(state, action) {
      const { channelId, message } = action.payload;
      if (!state.messages[channelId]) state.messages[channelId] = [];
      state.messages[channelId].push(message);
      if (state.activeChannelId !== channelId) {
        state.unreadCounts[channelId] = (state.unreadCounts[channelId] || 0) + 1;
      }
    },
  },
});

export const { toggleChat, setChannels, setActiveChannel, addMessage } = chatSlice.actions;
export default chatSlice.reducer;
