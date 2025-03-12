"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Book = void 0;
class Book {
    title;
    author;
    genre;
    year;
    image;
    constructor({ title, author, genre, year, image }) {
        this.title = title;
        this.author = author;
        this.genre = genre;
        this.year = year;
        this.image = image;
    }
}
exports.Book = Book;
