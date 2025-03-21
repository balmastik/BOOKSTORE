export interface BookData {
  title: string;
  author: string;
  genre: string;
  year: number;
  image: string;
  price: number;
  quantity: number;
}

export interface StoreBook {
  book: BookData;
}

export interface CustomerData {
  name: string;
  balance: number;
  image: string;
}
