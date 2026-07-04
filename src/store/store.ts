import { configureStore } from '@reduxjs/toolkit';
import authReducer from '@/features/auth/state/auth.slice';
import resumeReducer from '@/features/resume/state/resume.slice';

export const makeStore = () => {
  return configureStore({
    reducer: {
      auth : authReducer,
      resume: resumeReducer,
    }
  })
};

export type AppStore = ReturnType<typeof makeStore>;
export type RootState = ReturnType<AppStore['getState']>;
export type AppDispatch = AppStore['dispatch'];