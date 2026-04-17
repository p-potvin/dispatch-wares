import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../api/client';

export const fetchRoutes = createAsyncThunk('routes/fetch', async (date) => {
  const { data } = await api.get('/routes', { params: { date } });
  return data;
});

const routesSlice = createSlice({
  name: 'routes',
  initialState: { items: [], loading: false, error: null },
  reducers: {
    reorderJobInRoute(state, action) {
      const { routeId, oldIndex, newIndex } = action.payload;
      const route = state.items.find((r) => r.id === routeId);
      if (route) {
        const [job] = route.jobs.splice(oldIndex, 1);
        route.jobs.splice(newIndex, 0, job);
      }
    },
    removeJobFromRoute(state, action) {
      const { jobId, routeId } = action.payload;
      const route = state.items.find((r) => r.id === routeId);
      if (route) {
        route.jobs = route.jobs.filter((j) => j.id !== jobId);
      }
    },
    addJobToRoute(state, action) {
      const { job, routeId, toIndex } = action.payload;
      const route = state.items.find((r) => r.id === routeId);
      if (route) {
        const idx = toIndex != null && toIndex >= 0 ? toIndex : route.jobs.length;
        route.jobs.splice(idx, 0, job);
      }
    },
    moveJobBetweenRoutes(state, action) {
      const { jobId, fromRouteId, toRouteId, toIndex } = action.payload;
      const from = state.items.find((r) => r.id === fromRouteId);
      if (!from) return;
      const jobIdx = from.jobs.findIndex((j) => j.id === jobId);
      if (jobIdx === -1) return;
      const [job] = from.jobs.splice(jobIdx, 1);
      const to = state.items.find((r) => r.id === toRouteId);
      if (to) {
        const idx = toIndex != null && toIndex >= 0 ? toIndex : to.jobs.length;
        to.jobs.splice(idx, 0, job);
      }
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchRoutes.pending, (state) => { state.loading = true; })
      .addCase(fetchRoutes.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload;
      })
      .addCase(fetchRoutes.rejected, (state) => { state.loading = false; });
  },
});

export const {
  reorderJobInRoute,
  removeJobFromRoute,
  addJobToRoute,
  moveJobBetweenRoutes,
} = routesSlice.actions;
export default routesSlice.reducer;
