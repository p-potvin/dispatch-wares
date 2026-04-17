import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../api/client';

export const fetchSettings = createAsyncThunk('settings/fetch', async () => {
  const { data } = await api.get('/settings');
  return data;
});

export const saveSettings = createAsyncThunk(
  'settings/save',
  async (payload, { rejectWithValue }) => {
    try {
      const { data } = await api.put('/settings', payload);
      return data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || 'Failed to save');
    }
  }
);

const settingsSlice = createSlice({
  name: 'settings',
  initialState: { data: null, loading: false, error: null },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchSettings.pending, (state) => { state.loading = true; })
      .addCase(fetchSettings.fulfilled, (state, action) => {
        state.loading = false;
        state.data = action.payload;
      })
      .addCase(fetchSettings.rejected, (state) => { state.loading = false; })
      .addCase(saveSettings.pending, (state) => { state.loading = true; })
      .addCase(saveSettings.fulfilled, (state, action) => {
        state.loading = false;
        state.data = action.payload;
      })
      .addCase(saveSettings.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export default settingsSlice.reducer;
