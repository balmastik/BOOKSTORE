"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Store = void 0;
class Store {
    catalogue;
    id;
    constructor() {
        this.catalogue = new Map();
        this.id = 0;
    }
    bookIsAvailable(storeBook) {
        return [...this.catalogue.values()].some((item) => item.book.title === storeBook.book.title &&
            item.book.author === storeBook.book.author);
    }
    addBook(storeBook) {
        if (!this.bookIsAvailable(storeBook)) {
            ++storeBook.book.quantity;
            this.catalogue.set(++this.id, storeBook);
        }
        else {
            ++storeBook.book.quantity;
        }
        return this;
    }
    removeBook(storeBook) {
        const bookInCatalogue = [...this.catalogue.values()].find(item => item.book.title === storeBook.book.title && item.book.author === storeBook.book.author);
        if (bookInCatalogue && bookInCatalogue.book.quantity > 0) {
            bookInCatalogue.book.quantity--;
            if (bookInCatalogue.book.quantity === 0) {
                const bookId = [...this.catalogue.entries()].find(([_, item]) => item === bookInCatalogue)?.[0];
                if (bookId !== undefined) {
                    this.catalogue.delete(bookId);
                    console.log(`Book "${bookInCatalogue.book.title}" removed from the store.`);
                }
            }
        }
        else {
            console.log(`Book "${storeBook.book.title}" by ${storeBook.book.author} is not available in the store.`);
        }
        return this;
    }
    searchBook(book) {
        const foundBooks = Array.from(this.catalogue.values())
            .filter((item) => {
            return (item.book.title.toLowerCase().includes(book.title) ||
                item.book.author.toLowerCase().includes(book.author) ||
                item.book.genre.toLowerCase().includes(book.genre));
        });
        return foundBooks;
    }
    filterBooks(priceMin, priceMax, yearMin, yearMax) {
        const foundBooks = Array.from(this.catalogue.values())
            .filter((item) => {
            return (item.book.price >= +priceMin &&
                item.book.price <= +priceMax &&
                item.book.year >= +yearMin &&
                item.book.year <= +yearMax);
        });
        return foundBooks;
    }
    toString() {
        return Array.from(this.catalogue.entries())
            .map(([id, item]) => {
            return `Book: "${item.book.title}". Author: ${item.book.author}.\n` +
                `Genre: ${item.book.genre}. Publication year: ${item.book.year}.\n` +
                `Price: ${item.book.price.toFixed(2)} EUR. Article number: ${id}. ` +
                `In stock: ${item.book.quantity}.`;
        })
            .join('\n\n');
    }
}
exports.Store = Store;
