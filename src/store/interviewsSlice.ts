import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import type { Interview, Question } from '../types';

interface InterviewsState {
  interviews: Interview[];
}

const initialState: InterviewsState = {
  interviews: [],
};

const interviewsSlice = createSlice({
  name: 'interviews',
  initialState,
  reducers: {
    createInterview: (state, action: PayloadAction<Interview>) => {
      state.interviews.push(action.payload);
    },
    updateInterview: (state, action: PayloadAction<{ id: string; updates: Partial<Interview> }>) => {
      const index = state.interviews.findIndex(i => i.id === action.payload.id);
      if (index !== -1) {
        state.interviews[index].questions.push(...(action.payload.updates.questions || []));
      }
    },
    updateQuestion: (state, action: PayloadAction<{ interviewId: string; questionId: string; updates: Partial<Question> }>) => {
       const { interviewId, questionId, updates } = action.payload;
  const interviewIndex = state.interviews.findIndex(i => i.id === interviewId);
  if (interviewIndex !== -1) {
    const interview = state.interviews[interviewIndex];
    const updatedQuestions = interview.questions.map(q =>
      q.id === questionId ? { ...q, ...updates } : q
    );
    console.log('Updated Questions:', updatedQuestions);
    state.interviews[interviewIndex] = { ...interview, questions: updatedQuestions };
    }},

    addQuestion: (state, action: PayloadAction<{ interviewId: string; question: Question }>) => {
  const interview = state.interviews.find(i => i.id === action.payload.interviewId);
  if (interview) {
    interview.questions.push(action.payload.question);
  }
},


    nextQuestion: (state, action: PayloadAction<string>) => {
      const interview = state.interviews.find(i => i.id === action.payload);
      if (interview) {
        interview.currentQuestionIndex += 1;
      }
    },
  },
});

export const { createInterview, updateInterview, updateQuestion, nextQuestion, addQuestion } = interviewsSlice.actions;
export default interviewsSlice.reducer;