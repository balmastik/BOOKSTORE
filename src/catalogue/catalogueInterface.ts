export interface Book {
  title: string;
  author: string;
  genre: string;
  year: number;
  image: string;
  price: number;
  quantity: number;
}

export interface StoreBook {
  book: Book;
}

export interface CatalogueApi {
  display(): Promise<StoreBook[]>;

  sale(storeBook: StoreBook): Promise<StoreBook[]>;

  search(query: string): Promise<StoreBook[]>;

  filter(priceMin: number, priceMax: number, yearMin: number, yearMax: number): Promise<StoreBook[]>;
}

export interface CatalogueApiResponse {
  success: boolean;
  books: StoreBook[];
  error?: string;
}
