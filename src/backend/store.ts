import {StoreBook} from "./storeBook";

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
    if (this.bookIsAvailable(storeBook) && storeBook.book.quantity > 0) {
      --storeBook.book.quantity;
      console.log(`Book successfully removed from store.`);

      if (this.bookIsAvailable(storeBook) && storeBook.book.quantity === 0) {
        const foundBook = Array.from(this.catalogue.entries())
          .find(([_, item]) => item === storeBook);

        if (foundBook) {
          this.catalogue.delete(foundBook[0]);
          console.log(`Book "${storeBook.book.title}" removed from store.`);
        }
      }
    } else {
      console.log(`Book is not available in store.`);
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

  exportCatalogue(): string {
    const catalogue: [number, StoreBook][] = Array
      .from(this.catalogue, ([id, item]: [number, StoreBook]) => {
        return [id, item];
      });
    return JSON.stringify(catalogue);
  }

  importCatalogue(catalogue: string): this {
    const catalogueArray: [number, StoreBook][] = JSON.parse(catalogue);

    this.catalogue.clear();

    catalogueArray.forEach(([id, item]: [number, StoreBook]) => {
      if (item.book.quantity > 0) {
        this.catalogue.set(id, item);
      }
    });
    return this;
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


