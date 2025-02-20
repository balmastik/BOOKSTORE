"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var express_1 = require("express");
var cors_1 = require("cors");
var path = require("path");
var store_1 = require("./store");
var app = (0, express_1.default)();
var port = 3000;
app.use((0, cors_1.default)());
app.use(express_1.default.static(path.join(__dirname, 'dist')));
app.use(express_1.default.static(path.join(__dirname, 'dist/img')));
app.use(express_1.default.static(path.join(__dirname, 'dist/video')));
var books = [
    new store_1.StoreBook(new store_1.Book({
        title: 'Atlas Shrugged',
        author: 'Ayn Rand',
        genre: 'Novel',
        year: 1957,
        image: '/img/atlas_shrugged.jpeg'
    }), 24.99),
    new store_1.StoreBook(new store_1.Book({
        title: 'The Forsyte Saga',
        author: 'John Galsworthy',
        genre: 'Novel',
        year: 1906,
        image: '/img/the_forsyte_saga.jpeg'
    }), 22.99),
    new store_1.StoreBook(new store_1.Book({
        title: 'Lost Horizon',
        author: 'James Hilton',
        genre: 'Adventure',
        year: 1933,
        image: '/img/lost_horizon.jpeg'
    }), 17.50),
    new store_1.StoreBook(new store_1.Book({
        title: 'The Razor\'s Edge',
        author: 'Somerset Maugham',
        genre: 'Novel',
        year: 1944,
        image: '/img/the_razors_edge.jpeg'
    }), 20.00),
    new store_1.StoreBook(new store_1.Book({
        title: 'Beware of Pity',
        author: 'Stefan Zweig',
        genre: 'Novel',
        year: 1939,
        image: '/img/beware_of_pity.jpeg'
    }), 14.99),
    new store_1.StoreBook(new store_1.Book({
        title: 'Goodbye, Mr. Chips',
        author: 'James Hilton',
        genre: 'Adventure',
        year: 1934,
        image: '/img/goodbye_mr_chips.jpeg'
    }), 12.99),
    new store_1.StoreBook(new store_1.Book({
        title: 'Wuthering Heights',
        author: 'Emily Brontë',
        genre: 'Tragedy',
        year: 1847,
        image: '/img/wuthering_heights.jpeg'
    }), 17.50),
    new store_1.StoreBook(new store_1.Book({
        title: 'Casino Royale',
        author: 'Ian Fleming',
        genre: 'Novel',
        year: 1953,
        image: '/video/casino_royale.mp4'
    }), 28.00),
    new store_1.StoreBook(new store_1.Book({
        title: 'Catch-22',
        author: 'Joseph Heller',
        genre: 'Satire',
        year: 1961,
        image: '/img/catch_22.jpeg'
    }), 24.00),
];
app.get('/api/books', function (req, res) {
    res.json(books);
});
app.listen(port, function () {
    console.log('The server is running on http://localhost:3000');
});
