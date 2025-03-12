"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.StoreBook = void 0;
class StoreBook {
    book;
    constructor(book, price, quantity = 0) {
        this.book = {
            ...book,
            price: price,
            quantity: quantity
        };
    }
}
exports.StoreBook = StoreBook;
