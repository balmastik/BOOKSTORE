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

export interface Customer {
  name: string;
  balance: number;
  image: string;
}
