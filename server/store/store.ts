import {StoreBook} from "../storeBook/storeBook";

export interface SearchBookDetails {
  title: string,
  author: string,
  genre: string
}

export class Store {
  catalogue: Map<number, StoreBook>;
  id: number;

  constructor() {
    this.catalogue = new Map<number, StoreBook>();
    this.id = 0;
  }

  bookIsAvailable(storeBook: StoreBook): boolean {
    return [...this.catalogue.values()].some((item: StoreBook): boolean =>
      item.book.title === storeBook.book.title &&
      item.book.author === storeBook.book.author
    );
  }

  addBook(storeBook: StoreBook): this {
    if (!this.bookIsAvailable(storeBook)) {
      ++storeBook.book.quantity;
      this.catalogue.set(++this.id, storeBook);
    } else {
      ++storeBook.book.quantity;
    }
    return this;
  }

  removeBook(storeBook: StoreBook): this {
    const bookInCatalogue = [...this.catalogue.values()].find(item =>
      item.book.title === storeBook.book.title && item.book.author === storeBook.book.author
    );

    if (bookInCatalogue && bookInCatalogue.book.quantity > 0) {
      bookInCatalogue.book.quantity--;

      if (bookInCatalogue.book.quantity === 0) {
        const bookId = [...this.catalogue.entries()].find(([_, item]) => item === bookInCatalogue)?.[0];
        if (bookId !== undefined) {
          this.catalogue.delete(bookId);
          console.log(`Book "${bookInCatalogue.book.title}" removed from the store.`);
        }
      }
    } else {
      console.log(`Book "${storeBook.book.title}" by ${storeBook.book.author} is not available in the store.`);
    }
    return this;
  }

  searchBook(book: SearchBookDetails): StoreBook[] {
    const foundBooks: StoreBook[] = Array.from(this.catalogue.values())
      .filter((item: StoreBook) => {
        return (
          item.book.title.toLowerCase().includes(book.title) ||
          item.book.author.toLowerCase().includes(book.author) ||
          item.book.genre.toLowerCase().includes(book.genre)
        );
      });
    return foundBooks;
  }

  filterBooks(priceMin: number, priceMax: number, yearMin: number, yearMax: number): StoreBook[] {
    const foundBooks: StoreBook[] = Array.from(this.catalogue.values())
      .filter((item: StoreBook) => {
        return (
          item.book.price >= +priceMin &&
          item.book.price <= +priceMax &&
          item.book.year >= +yearMin &&
          item.book.year <= +yearMax
        );
      });
    return foundBooks;
  }

  toString(): string {
    return Array.from(this.catalogue.entries())
      .map(([id, item]: [number, StoreBook]): string => {
        return `Book: "${item.book.title}". Author: ${item.book.author}.\n` +
          `Genre: ${item.book.genre}. Publication year: ${item.book.year}.\n` +
          `Price: ${item.book.price.toFixed(2)} EUR. Article number: ${id}. ` +
          `In stock: ${item.book.quantity}.`
      })
      .join('\n\n');
  }
}
