import { configureStore } from '@reduxjs/toolkit';
import authReducer from './slices/authSlice';
import routesReducer from './slices/routesSlice';
import jobsReducer from './slices/jobsSlice';
import driversReducer from './slices/driversSlice';
import trucksReducer from './slices/trucksSlice';
import chatReducer from './slices/chatSlice';
import settingsReducer from './slices/settingsSlice';
import uiReducer from './slices/uiSlice';
import notificationsReducer from './slices/notificationsSlice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    routes: routesReducer,
    jobs: jobsReducer,
    drivers: driversReducer,
    trucks: trucksReducer,
    chat: chatReducer,
    settings: settingsReducer,
    ui: uiReducer,
    notifications: notificationsReducer,
  },
});
