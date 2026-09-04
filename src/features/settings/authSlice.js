import { createSlice } from '@reduxjs/toolkit';

// Purely local session lock. No accounts, no network — only an optional PIN
// set from Settings to prevent casual access to Products/Settings pages.
const initialState = {
  unlocked: true, // becomes false only if a PIN is configured and app just loaded
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    lockRequired(state) {
      state.unlocked = false;
    },
    sessionUnlocked(state) {
      state.unlocked = true;
    },
    sessionLocked(state) {
      state.unlocked = false;
    },
  },
});

export const { lockRequired, sessionUnlocked, sessionLocked } = authSlice.actions;
export default authSlice.reducer;

export const selectUnlocked = (state) => state.auth.unlocked;
