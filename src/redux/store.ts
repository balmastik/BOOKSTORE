import { configureStore } from '@reduxjs/toolkit';
import catalogueReducer from './catalogueSlice';
import customerReducer from './customerSlice';

export const store = configureStore({
  reducer: {
    catalogue: catalogueReducer,
    customer: customerReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
