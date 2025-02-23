import {BookDetails, Book} from "./book";

export interface StoreBookDetails extends BookDetails {
  price: number,
  quantity: number
}

export class StoreBook {
  readonly book: StoreBookDetails;

  constructor(book: Book, price: number, quantity: number = 0) {
    this.book = {
      ...book,
      price: price,
      quantity: quantity
    };
  }
}
