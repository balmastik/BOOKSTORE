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

  buyBook(storeBook: StoreBook): string | this {
    if (storeBook.book.price <= this.balance) {
      this.purchasedBooks.push(storeBook);
      this.balance -= storeBook.book.price;
      console.log('Book has been purchased.');
      return this;
    }
    return 'Please increase Your balance.';
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

  exportCustomerData(): string {
    const data = {
      name: this.name,
      balance: this.balance,
      image: this.image,
      purchasedBooks: this.purchasedBooks.map(storeBook => ({
        ...storeBook.book,
        price: storeBook.book.price,
        quantity: storeBook.book.quantity,
      })),
    };
    return JSON.stringify(data);
  }

  importCustomerData(data: string): this {
    const customer = JSON.parse(data);

    if (customer.name !== this.name) {
      throw new Error('customer name does not match.');
    }

    this.balance = customer.balance;
    this.image = customer.image;
    this.purchasedBooks.length = 0;
    this.purchasedBooks.push(
      ...customer.purchasedBooks.map((storeBook: StoreBookDetails) => {
        const {price, quantity, ...bookDetails} = storeBook;
        const book = new Book(bookDetails);
        return new StoreBook(book, price);
      }),
    );
    return this;
  }
}
