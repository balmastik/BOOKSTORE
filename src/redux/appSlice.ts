import {createSlice, createAsyncThunk} from '@reduxjs/toolkit';
import {subscriberServiceImpl} from '../subscriber/subscriberServiceImpl';

interface AppState {
  message: string;
  isLoading: boolean;
}

const initialState: AppState = {
  message: '',
  isLoading: false,
};

export const subscribeEmail = createAsyncThunk<string, string>('app/subscribeEmail', async (email: string) => {
  const message = await subscriberServiceImpl.subscribe(email);
  return message;
});

const appSlice = createSlice({
  name: 'app',
  initialState,
  reducers: {
    setMessage: (state, action) => {
      state.message = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(subscribeEmail.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(subscribeEmail.fulfilled, (state, action) => {
        state.isLoading = false;
        state.message = action.payload;
      })
      .addCase(subscribeEmail.rejected, (state, action) => {
        state.isLoading = false;
        state.message = (action.error.message as string)  || 'Error subscribing Email';
      })
  },
});

export const {setMessage} = appSlice.actions;

export default appSlice.reducer;
