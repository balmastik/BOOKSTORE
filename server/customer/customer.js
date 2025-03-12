"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Customer = void 0;
class Customer {
    name;
    balance;
    image;
    purchasedBooks;
    constructor({ name, balance, image }) {
        this.name = name;
        this.balance = balance;
        this.image = image;
        this.purchasedBooks = [];
    }
    addFunds(amount) {
        if (isFinite(amount) && amount > 0) {
            this.balance += amount;
            return true;
        }
        else {
            console.log(`Amount is not valid`);
            return false;
        }
    }
    buyBook(storeBook) {
        if (storeBook.book.price <= this.balance) {
            this.purchasedBooks.push(storeBook);
            this.balance -= storeBook.book.price;
            return true;
        }
        else {
            console.log(`Customer should increase the balance to purchase the book`);
            return false;
        }
    }
    removeBook(storeBook) {
        const bookInLibrary = this.purchasedBooks.find(item => item.book.title === storeBook.book.title && item.book.author === storeBook.book.author);
        if (bookInLibrary && bookInLibrary.book.quantity > 0) {
            console.log(`Attempting to remove book from the library: "${bookInLibrary.book.title}" by ${bookInLibrary.book.author}. Current quantity: ${bookInLibrary.book.quantity}`);
            bookInLibrary.book.quantity--;
            console.log(`Book quantity decreased. New quantity: ${bookInLibrary.book.quantity}`);
            if (bookInLibrary.book.quantity === 0) {
                this.purchasedBooks.splice(this.purchasedBooks.indexOf(bookInLibrary), 1);
            }
            console.log(`Book "${bookInLibrary.book.title}" removed from the library.`);
        }
        else {
            console.log(`Book "${storeBook.book.title}" by ${storeBook.book.author} is not available in the library.`);
        }
        return this;
    }
    searchBook(book) {
        const foundBooks = this.purchasedBooks
            .filter((item) => {
            return (item.book.title.toLowerCase().includes(book.title) ||
                item.book.author.toLowerCase().includes(book.author) ||
                item.book.genre.toLowerCase().includes(book.genre));
        });
        return foundBooks;
    }
}
exports.Customer = Customer;
