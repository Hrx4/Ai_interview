import { configureStore } from '@reduxjs/toolkit';
import { persistStore, persistReducer } from 'redux-persist';
import storage from 'redux-persist/lib/storage';
import { combineReducers } from '@reduxjs/toolkit';
import candidatesReducer from './candidatesSlice';
import interviewsReducer from './interviewsSlice';
import sessionReducer from './sessionSlice';

const persistConfig = {
  key: 'root',
  storage,
  whitelist: ['candidates', 'interviews', 'session']
};

const rootReducer = combineReducers({
  candidates: candidatesReducer,
  interviews: interviewsReducer,
  session: sessionReducer,
});

const persistedReducer = persistReducer(persistConfig, rootReducer);

export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: ['persist/PERSIST', 'persist/REHYDRATE'],
      },
    }),
});

export const persistor = persistStore(store);

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;