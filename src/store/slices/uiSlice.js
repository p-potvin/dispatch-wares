import { createSlice } from '@reduxjs/toolkit';
import { format } from 'date-fns';

const uiSlice = createSlice({
  name: 'ui',
  initialState: {
    selectedDate: format(new Date(), 'yyyy-MM-dd'),
  },
  reducers: {
    setSelectedDate(state, action) {
      state.selectedDate = action.payload;
    },
  },
});

export const { setSelectedDate } = uiSlice.actions;
export default uiSlice.reducer;
