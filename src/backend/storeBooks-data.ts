import { Book } from "./book";
import { StoreBook } from "./storeBook";

export const books = [
  new StoreBook(new Book({
    title: 'Atlas Shrugged',
    author: 'Ayn Rand',
    genre: 'Novel',
    year: 1957,
    image: '/img/atlas_shrugged.jpeg'
  }), 24.99),

  new StoreBook(new Book({
    title: 'The Forsyte Saga',
    author: 'John Galsworthy',
    genre: 'Novel',
    year: 1906,
    image: '/img/the_forsyte_saga.jpeg'
  }), 22.99),

  new StoreBook(new Book({
    title: 'Lost Horizon',
    author: 'James Hilton',
    genre: 'Adventure',
    year: 1933,
    image: '/img/lost_horizon.jpeg'
  }), 17.50),

  new StoreBook(new Book({
    title: 'The Razor\'s Edge',
    author: 'Somerset Maugham',
    genre: 'Novel',
    year: 1944,
    image: '/img/the_razors_edge.jpeg'
  }), 20.00),

  new StoreBook(new Book({
    title: 'Beware of Pity',
    author: 'Stefan Zweig',
    genre: 'Novel',
    year: 1939,
    image: '/img/beware_of_pity.jpeg'
  }), 14.99),

  new StoreBook(new Book({
    title: 'Goodbye, Mr. Chips',
    author: 'James Hilton',
    genre: 'Adventure',
    year: 1934,
    image: '/img/goodbye_mr_chips.jpeg'
  }), 12.99),

  new StoreBook(new Book({
    title: 'Casino Royale',
    author: 'Ian Fleming',
    genre: 'Novel',
    year: 1953,
    image: '/video/casino_royale.mp4'
  }), 28.00),
];
