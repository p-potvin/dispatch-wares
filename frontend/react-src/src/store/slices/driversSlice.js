import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../api/client';

export const fetchDrivers = createAsyncThunk('drivers/fetch', async () => {
  const { data } = await api.get('/drivers');
  return data;
});

const driversSlice = createSlice({
  name: 'drivers',
  initialState: { items: [], loading: false, error: null },
  reducers: {
    updateDriverStatus(state, action) {
      const { driverId, status } = action.payload;
      const driver = state.items.find((d) => d.id === driverId);
      if (driver) driver.status = status;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchDrivers.pending, (state) => { state.loading = true; })
      .addCase(fetchDrivers.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload;
      })
      .addCase(fetchDrivers.rejected, (state) => { state.loading = false; });
  },
});

export const { updateDriverStatus } = driversSlice.actions;
export default driversSlice.reducer;
