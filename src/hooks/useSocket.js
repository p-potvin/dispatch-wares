import { useEffect, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { io } from 'socket.io-client';
import { addMessage, setChannels } from '../store/slices/chatSlice';
import { updateDriverStatus } from '../store/slices/driversSlice';
import { addNotification } from '../store/slices/notificationsSlice';

let socketInstance = null;

export function useSocket() {
  const dispatch = useDispatch();
  const { token } = useSelector((s) => s.auth);
  const socketRef = useRef(null);

  useEffect(() => {
    if (!token) return;

    const socket = io(
      (process.env.REACT_APP_API_URL || 'http://localhost:8000/api').replace('/api', ''),
      { auth: { token }, transports: ['websocket'] }
    );
    socketRef.current = socket;
    socketInstance = socket;

    socket.on('chat:message', ({ channelId, message }) => {
      dispatch(addMessage({ channelId, message }));
    });

    socket.on('chat:channels', (channels) => {
      dispatch(setChannels(channels));
    });

    socket.on('driver:status', ({ driverId, status }) => {
      dispatch(updateDriverStatus({ driverId, status }));
    });

    socket.on('notification', (notification) => {
      dispatch(
        addNotification({ ...notification, read: false, createdAt: new Date().toISOString() })
      );
    });

    return () => {
      socket.disconnect();
      socketInstance = null;
    };
  }, [token, dispatch]);

  const sendChatMessage = (channelId, content) => {
    socketInstance?.emit('chat:send', { channelId, content });
  };

  return { sendChatMessage };
}
