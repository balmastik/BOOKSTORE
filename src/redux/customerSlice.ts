import {createSlice, createAsyncThunk} from '@reduxjs/toolkit';
import {StoreBook} from '../catalogue/catalogueInterface';
import {Customer} from '../customer/customerInterface';
import {customerServiceImpl} from '../customer/customerServiceImpl';

interface CustomerState {
  customer: Customer | null;
  books: StoreBook[];
  filteredBooks: StoreBook[];
  message: string;
  isLoading: boolean;
}

const initialState: CustomerState = {
  customer: null,
  books: [],
  filteredBooks: [],
  message: '',
  isLoading: false,
};

export const loadCustomer = createAsyncThunk('customer/loadCustomer', async () => {
  const customer = await customerServiceImpl.displayCustomer();
  return customer;
});

export const increaseBalance = createAsyncThunk('customer/increaseBalance', async (amount: number) => {
  const customer = await customerServiceImpl.increase(amount);
  return customer;
});

export const loadLibrary = createAsyncThunk('customer/loadLibrary', async () => {
  const books = await customerServiceImpl.displayLibrary();
  return books;
});

export const removeBook = createAsyncThunk('customer/removeBook', async (storeBook: StoreBook) => {
  const books = await customerServiceImpl.remove(storeBook);
  return books;
});

export const searchBooks = createAsyncThunk('customer/searchBooks', async (query: string) => {
  const books = await customerServiceImpl.search(query);
  return books;
});

export const addBook = createAsyncThunk('customer/addBook', async (bookData: {
  title: string,
  author: string,
  image: File
}) => {
  const books = await customerServiceImpl.add(bookData.title, bookData.author, bookData.image);
  return books;
});

const customerSlice = createSlice({
  name: 'customer',
  initialState,
  reducers: {
    setMessage: (state, action) => {
      state.message = action.payload;
    },
    clearSearch: (state) => {
      state.filteredBooks = state.books;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(loadCustomer.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(loadCustomer.fulfilled, (state, action) => {
        state.isLoading = false;
        state.customer = action.payload;
      })
      .addCase(loadCustomer.rejected, (state, action) => {
        state.isLoading = false;
        state.message = (action.error.message as string)  || 'Error loading customer data';
      })
      .addCase(increaseBalance.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(increaseBalance.fulfilled, (state, action) => {
        state.isLoading = false;
        state.customer = action.payload;
        state.message = 'Balance has been successfully increased';
      })
      .addCase(increaseBalance.rejected, (state, action) => {
        state.isLoading = false;
        state.message = (action.error.message as string) || 'Error increasing balance';
      })
      .addCase(loadLibrary.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(loadLibrary.fulfilled, (state, action) => {
        state.isLoading = false;
        state.books = action.payload;
        state.filteredBooks = action.payload;
      })
      .addCase(loadLibrary.rejected, (state, action) => {
        state.isLoading = false;
        state.message = (action.error.message as string)  || 'Error loading library';
      })
      .addCase(removeBook.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(removeBook.fulfilled, (state, action) => {
        state.filteredBooks = action.payload;
        state.message = 'Book has been successfully removed from the library';
      })
      .addCase(removeBook.rejected, (state, action) => {
        state.isLoading = false;
        state.message = (action.error.message as string) || 'Error removing book';
      })
      .addCase(searchBooks.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(searchBooks.fulfilled, (state, action) => {
        state.isLoading = false;
        state.filteredBooks = action.payload;
      })
      .addCase(searchBooks.rejected, (state, action) => {
        state.isLoading = false;
        state.message = (action.error.message as string)  || 'Error searching books';
      })
      .addCase(addBook.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(addBook.fulfilled, (state, action) => {
        state.isLoading = false;
        state.filteredBooks = action.payload;
        state.message = 'Book has been added to the library';
      })
      .addCase(addBook.rejected, (state, action) => {
        state.isLoading = false;
        state.message = (action.error.message as string)  || 'Error adding book';
      })
  },
});

export const {setMessage, clearSearch} = customerSlice.actions;

export default customerSlice.reducer;
