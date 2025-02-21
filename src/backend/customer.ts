import {Book} from "./book";
import {StoreBookDetails, StoreBook} from "./storeBook";
import {SearchBookDetails} from "./store";

export interface CustomerDetails {
  name: string,
  balance: number,
  image: string
}

export class Customer {
  readonly name: string;
  balance: number;
  image: string;
  readonly purchasedBooks: StoreBook[];

  constructor({name, balance, image}: CustomerDetails) {
    this.name = name;
    this.balance = balance;
    this.image = image;
    this.purchasedBooks = [];
  }

  addFunds(amount: number): this {
    if (isFinite(amount) && amount > 0) {
      this.balance += amount;
    }
    return this;
  }

  buyBook(storeBook: StoreBook): boolean {
    if (storeBook.book.price <= this.balance) {
      this.purchasedBooks.push(storeBook);
      this.balance -= storeBook.book.price;
      return true;  // Успешная покупка
    } else {
      console.log(`Customer should increase the balance to purchase the book.`);
      return false;
    }
  }

  removeBook(storeBook: StoreBook): this {
    const bookInLibrary = this.purchasedBooks.find(item =>
      item.book.title === storeBook.book.title && item.book.author === storeBook.book.author
    );

    if (bookInLibrary && bookInLibrary.book.quantity > 0) {
      console.log(`Attempting to remove book from the library: "${bookInLibrary.book.title}" by ${bookInLibrary.book.author}. Current quantity: ${bookInLibrary.book.quantity}`);
      bookInLibrary.book.quantity--;
      console.log(`Book quantity decreased. New quantity: ${bookInLibrary.book.quantity}`);

      if (bookInLibrary.book.quantity === 0) {
        this.purchasedBooks.splice(this.purchasedBooks.indexOf(bookInLibrary), 1);
      }
      console.log(`Book "${bookInLibrary.book.title}" removed from the library.`);
    } else {
      console.log(`Book "${storeBook.book.title}" by ${storeBook.book.author} is not available in the library.`);
    }
    return this;
  }

  searchBook(book: SearchBookDetails): StoreBook[] {
    const foundBooks: StoreBook[] = this.purchasedBooks
      .filter((item: StoreBook) => {
        return (
          item.book.title.toLowerCase().includes(book.title) ||
          item.book.author.toLowerCase().includes(book.author) ||
          item.book.genre.toLowerCase().includes(book.genre)
        );
      });
    return foundBooks;
  }
}
