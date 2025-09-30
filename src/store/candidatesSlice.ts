import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import type { Candidate } from '../types';

interface CandidatesState {
  candidates: Candidate[];
  searchTerm: string;
  sortBy: 'name' | 'score' | 'createdAt';
  sortOrder: 'asc' | 'desc';
}

const initialState: CandidatesState = {
  candidates: [],
  searchTerm: '',
  sortBy: 'createdAt',
  sortOrder: 'desc',
};

const candidatesSlice = createSlice({
  name: 'candidates',
  initialState,
  reducers: {
    addCandidate: (state, action: PayloadAction<Candidate>) => {
      state.candidates.push(action.payload);
    },
    updateCandidate: (state, action: PayloadAction<{ id: string; updates: Partial<Candidate> }>) => {
      const index = state.candidates.findIndex(c => c.id === action.payload.id);
      if (index !== -1) {
        state.candidates[index] = { ...state.candidates[index], ...action.payload.updates };
      }
    },
    setSearchTerm: (state, action: PayloadAction<string>) => {
      state.searchTerm = action.payload;
    },
    setSorting: (state, action: PayloadAction<{ sortBy: 'name' | 'score' | 'createdAt'; sortOrder: 'asc' | 'desc' }>) => {
      state.sortBy = action.payload.sortBy;
      state.sortOrder = action.payload.sortOrder;
    },
  },
});

export const { addCandidate, updateCandidate, setSearchTerm, setSorting } = candidatesSlice.actions;
export default candidatesSlice.reducer;