import {configureStore} from '@reduxjs/toolkit';
import catalogueReducer from './catalogueSlice';
import customerReducer from './customerSlice';
import appReducer from './appSlice';

export const store = configureStore({
  reducer: {
    catalogue: catalogueReducer,
    customer: customerReducer,
    app: appReducer
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
