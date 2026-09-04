import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  sidebarOpen: false,
  toasts: [], // { id, message, type }
  appReady: false,
  appError: null,
};

let toastCounter = 0;

const uiSlice = createSlice({
  name: 'ui',
  initialState,
  reducers: {
    sidebarOpened(state) {
      state.sidebarOpen = true;
    },
    sidebarClosed(state) {
      state.sidebarOpen = false;
    },
    sidebarToggled(state) {
      state.sidebarOpen = !state.sidebarOpen;
    },
    toastShown: {
      reducer(state, action) {
        state.toasts.push(action.payload);
      },
      prepare({ message, type = 'success' }) {
        toastCounter += 1;
        return { payload: { id: toastCounter, message, type } };
      },
    },
    toastDismissed(state, action) {
      state.toasts = state.toasts.filter((t) => t.id !== action.payload);
    },
    appMarkedReady(state) {
      state.appReady = true;
    },
    appErrorSet(state, action) {
      state.appError = action.payload;
    },
  },
});

export const {
  sidebarOpened,
  sidebarClosed,
  sidebarToggled,
  toastShown,
  toastDismissed,
  appMarkedReady,
  appErrorSet,
} = uiSlice.actions;

export default uiSlice.reducer;

export const selectToasts = (state) => state.ui.toasts;
export const selectSidebarOpen = (state) => state.ui.sidebarOpen;
export const selectAppReady = (state) => state.ui.appReady;
