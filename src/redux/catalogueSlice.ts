import {createSlice, createAsyncThunk} from '@reduxjs/toolkit';
import {StoreBook} from '../catalogue/catalogueInterface';
import {catalogueServiceImpl} from '../catalogue/catalogueServiceImpl';

interface CatalogueState {
  books: StoreBook[];
  filteredBooks: StoreBook[];
  message: string;
  isLoading: boolean;
}

const initialState: CatalogueState = {
  books: [],
  filteredBooks: [],
  message: '',
  isLoading: false,
};

export const loadBooks = createAsyncThunk(
  'catalogue/loadBooks',
  async () => {
    return await catalogueServiceImpl.display();
  });

export const searchBooks = createAsyncThunk(
  'catalogue/searchBooks',
  async (query: string) => {
    return await catalogueServiceImpl.search(query);
  });

export const filterBooks = createAsyncThunk(
  'catalogue/filterBooks',
  async (filters: { priceMin: number; priceMax: number; yearMin: number; yearMax: number }) => {
    return await catalogueServiceImpl.filter(
      filters.priceMin,
      filters.priceMax,
      filters.yearMin,
      filters.yearMax
    );
  });

export const saleBook = createAsyncThunk(
  'catalogue/saleBook',
  async (storeBook: StoreBook) => {
    return await catalogueServiceImpl.sale(storeBook);
  });

const catalogueSlice = createSlice({
  name: 'catalogue',
  initialState,
  reducers: {
    setMessage: (state, action) => {
      state.message = action.payload;
    },
    clearSearch: (state) => {
      state.filteredBooks = state.books;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(loadBooks.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(loadBooks.fulfilled, (state, action) => {
        state.isLoading = false;
        state.books = action.payload;
        state.filteredBooks = action.payload;
      })
      .addCase(loadBooks.rejected, (state, action) => {
        state.isLoading = false;
        state.message = action.error?.message?.trim() || 'Error loading books';
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
        state.message = action.error?.message?.trim() || 'Error searching books';
      })
      .addCase(filterBooks.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(filterBooks.fulfilled, (state, action) => {
        state.isLoading = false;
        state.filteredBooks = action.payload;
      })
      .addCase(filterBooks.rejected, (state, action) => {
        state.isLoading = false;
        state.message = action.error?.message?.trim() || 'Error filtering books';
      })
      .addCase(saleBook.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(saleBook.fulfilled, (state, action) => {
        state.isLoading = false;
        state.books = action.payload;
        state.filteredBooks = action.payload;
      })
      .addCase(saleBook.rejected, (state, action) => {
        state.isLoading = false;
        state.message = action.error?.message?.trim() || 'Error selling book';
      });
  },
});

export const {setMessage, clearSearch} = catalogueSlice.actions;

export default catalogueSlice.reducer;
