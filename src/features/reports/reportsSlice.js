import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  preset: 'today', // 'today' | 'yesterday' | 'last7' | 'thisMonth' | 'custom'
  customFrom: null,
  customTo: null,
};

const reportsSlice = createSlice({
  name: 'reports',
  initialState,
  reducers: {
    presetChanged(state, action) {
      state.preset = action.payload;
    },
    customRangeChanged(state, action) {
      state.customFrom = action.payload.from;
      state.customTo = action.payload.to;
      state.preset = 'custom';
    },
  },
});

export const { presetChanged, customRangeChanged } = reportsSlice.actions;
export default reportsSlice.reducer;

export const selectReportsFilter = (state) => state.reports;
