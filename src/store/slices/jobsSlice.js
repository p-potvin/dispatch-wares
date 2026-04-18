import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../api/client';

export const fetchJobs = createAsyncThunk('jobs/fetch', async (date) => {
  const { data } = await api.get('/jobs', { params: { date, unassigned: true } });
  return data;
});

const jobsSlice = createSlice({
  name: 'jobs',
  initialState: { pool: [], loading: false, error: null },
  reducers: {
    removeFromPool(state, action) {
      state.pool = state.pool.filter((j) => j.id !== action.payload);
    },
    addToPool(state, action) {
      state.pool.unshift(action.payload);
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchJobs.pending, (state) => { state.loading = true; })
      .addCase(fetchJobs.fulfilled, (state, action) => {
        state.loading = false;
        state.pool = action.payload;
      })
      .addCase(fetchJobs.rejected, (state) => { state.loading = false; });
  },
});

export const { removeFromPool, addToPool } = jobsSlice.actions;
export default jobsSlice.reducer;
