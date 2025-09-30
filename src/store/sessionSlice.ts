import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import type { InterviewSession, ChatMessage } from '../types/index';

interface SessionState {
  currentSession?: InterviewSession;
}

const initialState: SessionState = {
  currentSession: undefined,
};

const sessionSlice = createSlice({
  name: 'session',
  initialState,
  reducers: {
    createSession: (state, action: PayloadAction<InterviewSession>) => {
      state.currentSession = action.payload;
    },
    updateSession: (state, action: PayloadAction<Partial<InterviewSession>>) => {
      if (state.currentSession) {
        state.currentSession = { ...state.currentSession, ...action.payload };
      }
    },
    addChatMessage: (state, action: PayloadAction<ChatMessage>) => {
      if (state.currentSession) {
        state.currentSession.chatHistory.push(action.payload);
      }
    },
    clearSession: (state) => {
      state.currentSession = undefined;
    },
    setWelcomeBack: (state, action: PayloadAction<boolean>) => {
      if (state.currentSession) {
        console.log("Setting welcome back to:", action.payload);
        state.currentSession.showWelcomeBack = action.payload;
      }
    },
  },
});

export const { createSession, updateSession, addChatMessage, clearSession, setWelcomeBack } = sessionSlice.actions;
export default sessionSlice.reducer;