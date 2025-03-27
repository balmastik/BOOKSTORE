import {createSlice, createAsyncThunk} from '@reduxjs/toolkit';
import {StoreBook} from '../interfaces/entities';
import {catalogueServices} from '../services/catalogueServices';

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

export const loadBooks = createAsyncThunk('catalogue/loadBooks', async () => {
  const books = await catalogueServices.display();
  return books;
});

export const searchBooks = createAsyncThunk('catalogue/searchBooks', async (query: string) => {
  const books = await catalogueServices.search(query);
  return books;
});

export const filterBooks = createAsyncThunk(
  'catalogue/filterBooks',
  async (filters: { priceMin: number; priceMax: number; yearMin: number; yearMax: number }) => {
    const books = await catalogueServices.filter(
      filters.priceMin,
      filters.priceMax,
      filters.yearMin,
      filters.yearMax
    );
    return books;
  }
);

export const saleBook = createAsyncThunk('catalogue/saleBook', async (storeBook: StoreBook) => {
  const books = await catalogueServices.sale(storeBook);
  return books;
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
        state.message = (action.error.message as string) || 'Error loading books';
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
        state.message = (action.error.message as string) || 'Error searching books';
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
        state.message = (action.error.message as string) || 'Error filtering books';
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
        state.message = (action.error.message as string) || 'Error selling book';
      });
  },
});

export const {setMessage, clearSearch} = catalogueSlice.actions;

export default catalogueSlice.reducer;

