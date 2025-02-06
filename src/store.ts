export interface BookDetails {
  title: string,
  author: string,
  genre: string,
  year: number,
  image: string,
}

export interface StoreBookDetails extends BookDetails {
  price: number,
  originalPrice: number,
  quantity: number
}

export interface SearchBookDetails {
  title: string,
  author: string,
  genre: string
}

export interface FilterBookDetails {
  title: string,
  author: string,
  genre: string,
  priceTill: number
}

export interface ClientDetails {
  name: string,
  balance: number,
  image: string
}

export class Book {
  readonly title: string;
  readonly author: string;
  readonly genre: string;
  readonly year: number;
  readonly image: string;

  constructor({title, author, genre, year, image}: BookDetails) {
    this.title = title.toLowerCase();
    this.author = author.toLowerCase();
    this.genre = genre.toLowerCase();
    this.year = year;
    this.image = image;
  }

  toString(): string {
    return `Книга: \"${this.title}\". Автор: ${this.author}.\n` +
      `Жанр: ${this.genre}. Дата публикации: ${this.year} год.`
  }
}

export class StoreBook {
  readonly book: StoreBookDetails;

  constructor(book: Book, price: number) {
    this.book = {
      ...book,
      price: price,
      originalPrice: price,
      quantity: 0
    };
  }
}

type Action = () => void;
type Json = string;

export class Store {
  catalogue: Map<number, StoreBook>;
  id: number;
  actions: Action[];

  constructor() {
    this.catalogue = new Map<number, StoreBook>();
    this.id = 0;
    this.actions = [];
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
      console.log(`Книга успешно списана.`);

      if (this.bookIsAvailable(storeBook) && storeBook.book.quantity === 0) {
        const foundBook = Array.from(this.catalogue.entries())
          .find(([_, item]) => item === storeBook);

        if (foundBook) {
          this.catalogue.delete(foundBook[0]);
          console.log(`Книга "${storeBook.book.title}" удалена из каталога.`);
        }
      }
    } else {
      console.log(`Внимание! Книга отсутствует на складе.`);
    }
    return this;
  }

  searchBook(book: SearchBookDetails): StoreBook[] {
    const foundBooks: StoreBook[] = Array.from(this.catalogue.values())
      .filter((item: StoreBook) => {
        return (
          item.book.title.includes(book.title) ||
          item.book.author.includes(book.author) ||
          item.book.genre.includes(book.genre)
        );
      });
    return foundBooks;
  }

  filterBooks(price: number, year: number) {
    const foundBooks: StoreBook[] = Array.from(this.catalogue.values())
      .filter((item: StoreBook) => {
        return (
          item.book.price <= +price &&
          item.book.year <= +year
        );
      });
    return foundBooks;
  }

  getUniqueGenres(callback: (genreMap: Map<string, StoreBook[]>) => string): string {
    let genreMap: Map<string, StoreBook[]> = new Map();

    Array.from(this.catalogue.values())
      .forEach((item: StoreBook) => {
        const genre: string = item.book.genre;
        if (genreMap.has(genre)) {
          genreMap.get(genre)?.push(item);
        } else {
          genreMap.set(genre, [item]);
        }
      });
    return callback(genreMap);
  }

  applyDiscount(discount: number) {
    if (isFinite(discount) && discount > 0 && discount <= 100) {
      Array.from(this.catalogue.values()).forEach((item: StoreBook) => {
        item.book.price -= item.book.price * discount / 100;
      });
      this.notify();
    }
  }

  notify() {
    this.actions.forEach(action => {
      setTimeout(action, 2000);
    });
  }

  notifyDiscount(action: Action) {
    this.actions.push(action);
  }

  removeDiscount(): this {
    this.catalogue.forEach((item: StoreBook) => {
      item.book.price = item.book.originalPrice;
    });
    return this;
  }

  exportCatalogue(): Json {
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
        return `Книга: "${item.book.title}". Автор: ${item.book.author}.\n` +
          `Жанр: ${item.book.genre}. Дата публикации: ${item.book.year} год.\n` +
          `Цена: ${item.book.price.toFixed(2)} евро. Артикул: ${id}. ` +
          `На складе: ${item.book.quantity}.`
      })
      .join('\n\n');
  }
}

export class Client {
  readonly name: string;
  balance: number;
  image: string;
  readonly purchasedBooks: StoreBook[];

  constructor({name, balance, image}: ClientDetails) {
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

  buyBooks(storeBook: StoreBook): string | this {
    if (storeBook.book.price <= this.balance) {
      this.purchasedBooks.push(storeBook);
      this.balance -= storeBook.book.price;
      console.log('Вы успешно купили книгу.');
      return this;
    }
    return 'У Вас недостаточно средств на счету.';
  }

  searchBook(book: SearchBookDetails): StoreBook[] {
    const foundBooks: StoreBook[] = this.purchasedBooks
      .filter((item: StoreBook) => {
        return (
          item.book.title.includes(book.title) ||
          item.book.author.includes(book.author) ||
          item.book.genre.includes(book.genre)
        );
      });
    return foundBooks;
  }

  exportClientData(): Json {
    const data = {
      name: this.name,
      balance: this.balance,
      image: this.image,
      purchasedBooks: this.purchasedBooks.map(storeBook => ({
        ...storeBook.book,
        price: storeBook.book.price,
        originalPrice: storeBook.book.originalPrice,
        quantity: storeBook.book.quantity,
      })),
    };
    return JSON.stringify(data);
  }

  importClientData(data: string): this {
    const client = JSON.parse(data);

    if (client.name !== this.name) {
      throw new Error('Имя клиента не совпадает.');
    }

    this.balance = client.balance;
    this.image = client.image;
    this.purchasedBooks.length = 0;
    this.purchasedBooks.push(
      ...client.purchasedBooks.map((storeBook: StoreBookDetails) => {
        const {price, originalPrice, quantity, ...bookDetails} = storeBook;
        const book = new Book(bookDetails);
        return new StoreBook(book, price);
      }),
    );
    return this;
  }
}

