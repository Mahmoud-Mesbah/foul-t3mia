import { createSlice } from '@reduxjs/toolkit';
import { defaultSettings } from '../../data/seedData';

const initialState = {
  ...defaultSettings,
  loaded: false,
};

const settingsSlice = createSlice({
  name: 'settings',
  initialState,
  reducers: {
    settingsLoaded(state, action) {
      return { ...state, ...action.payload, loaded: true };
    },
    settingsUpdated(state, action) {
      return { ...state, ...action.payload };
    },
    receiptSettingsUpdated(state, action) {
      state.receipt = { ...state.receipt, ...action.payload };
    },
    themeToggled(state) {
      state.theme = state.theme === 'dark' ? 'light' : 'dark';
    },
    themeSet(state, action) {
      state.theme = action.payload;
    },
    pinSet(state, action) {
      state.pin = action.payload;
    },
    settingsReplaced(state, action) {
      return { ...state, ...action.payload, loaded: true };
    },
    settingsReset() {
      return { ...defaultSettings, loaded: true };
    },
  },
});

export const {
  settingsLoaded,
  settingsUpdated,
  receiptSettingsUpdated,
  themeToggled,
  themeSet,
  pinSet,
  settingsReplaced,
  settingsReset,
} = settingsSlice.actions;

export default settingsSlice.reducer;

export const selectSettings = (state) => state.settings;
export const selectTheme = (state) => state.settings.theme;
