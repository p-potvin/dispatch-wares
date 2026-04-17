import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../api/client';

export const fetchTrucks = createAsyncThunk('trucks/fetch', async () => {
  const { data } = await api.get('/trucks');
  return data;
});

const trucksSlice = createSlice({
  name: 'trucks',
  initialState: { items: [], loading: false, error: null },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchTrucks.pending, (state) => { state.loading = true; })
      .addCase(fetchTrucks.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload;
      })
      .addCase(fetchTrucks.rejected, (state) => { state.loading = false; });
  },
});

export default trucksSlice.reducer;
