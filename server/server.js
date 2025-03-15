"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const swagger_jsdoc_1 = __importDefault(require("swagger-jsdoc"));
const swagger_ui_express_1 = __importDefault(require("swagger-ui-express"));
const fs_1 = __importDefault(require("fs"));
const cors_1 = __importDefault(require("cors"));
const multer_1 = __importDefault(require("multer"));
const storeBook_1 = require("../storeBook/storeBook");
const store_1 = require("../store/store");
const emails_1 = require("../mail/emails");
const storeBooksData_1 = require("../storeBook/storeBooksData");
const customerData_1 = require("../customer/customerData");
const swaggerOptions = {
    definition: {
        openapi: '3.0.0',
        info: {
            title: 'KNIGBOOM API',
            version: '1.0.0',
            description: 'API Documentation for KNIGBOOM Store',
        },
        components: {
            schemas: JSON.parse(fs_1.default.readFileSync('openapi.json', 'utf-8')).components.schemas
        }
    },
    apis: ['./src/backend/server.ts'],
};
const app = (0, express_1.default)();
const swaggerDocs = (0, swagger_jsdoc_1.default)(swaggerOptions);
const upload = (0, multer_1.default)({
    dest: 'uploads/',
    limits: { fileSize: 10 * 1024 * 1024 }
});
const port = 3000;
const store = new store_1.Store();
const newsletter = new emails_1.Newsletter();
app.use((0, cors_1.default)());
app.use(express_1.default.json());
app.use('/api-docs', swagger_ui_express_1.default.serve, swagger_ui_express_1.default.setup(swaggerDocs));
app.use('/uploads', express_1.default.static('uploads'));
function saveCatalogue() {
    const catalogue = Array.from(store.catalogue.values());
    fs_1.default.writeFileSync('catalogue.json', JSON.stringify(catalogue, null, 2), 'utf8');
}
function saveCustomerData() {
    const customerData = {
        name: customerData_1.customer.name,
        balance: customerData_1.customer.balance,
        image: customerData_1.customer.image,
        purchasedBooks: customerData_1.customer.purchasedBooks
    };
    fs_1.default.writeFileSync('customer.json', JSON.stringify(customerData, null, 2), 'utf8');
}
function saveSubscriberData() {
    const subscriberData = newsletter.subscribers;
    fs_1.default.writeFileSync('subscriber.json', JSON.stringify(subscriberData, null, 2), 'utf8');
}
/**
 * @swagger
 * tags:
 *   - name: Store
 *     description: Operations related to the store
 *   - name: Customer
 *     description: Operations related to the customer
 */
/**
 * @swagger
 * /api/books:
 *   get:
 *     tags:
 *       - Store
 *     summary: Get list of books from the store catalogue
 *     description: Returns a list of all books available in the store catalogue
 *     responses:
 *       200:
 *         description: A list of books
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/StoreBook'
 *       500:
 *         description: Internal server error during loading books
 */
app.get('/api/books', (req, res) => {
    try {
        const data = fs_1.default.readFileSync('catalogue.json', 'utf8');
        const books = JSON.parse(data);
        res.json(books);
    }
    catch (error) {
        console.error("Error loading books:", error);
        res.status(500).json({ error: "Error loading books" });
    }
});
/**
 * @swagger
 * /api/books/search:
 *   post:
 *     tags:
 *       - Store
 *     summary: Search a book in the store catalogue
 *     description: Searches a book in the store based on title, author, or genre
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               query:
 *                 type: string
 *                 description: A search string that will be used for searching the title, author, and genre
 *             example:
 *               query: "rand"
 *     responses:
 *       200:
 *         description: A list of books matching the search query
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/StoreBook'
 *       500:
 *         description: Internal server error during search process
 */
app.post('/api/books/search', (req, res) => {
    try {
        const query = req.body.query;
        const book = {
            title: query,
            author: query,
            genre: query
        };
        const foundBooks = store.searchBook(book);
        res.json(foundBooks);
    }
    catch (error) {
        console.error("Error searching books:", error);
        res.status(500).json({ error: "Error searching books" });
    }
});
/**
 * @swagger
 * /api/books/filter:
 *   post:
 *     tags:
 *       - Store
 *     summary: Filter books by price and publication date in the store catalogue
 *     description: Filters books by minimum and maximum price, as well as by minimum and maximum publication year
 *     requestBody:
 *       description: Parameters for filtering books
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               priceMin:
 *                 type: number
 *                 description: Minimum book price
 *               priceMax:
 *                 type: number
 *                 description: Maximum book price
 *               yearMin:
 *                 type: number
 *                 description: Minimum publication year
 *               yearMax:
 *                 type: number
 *                 description: Maximum publication year
 *             example:
 *               priceMin: 10
 *               priceMax: 100
 *               yearMin: 1900
 *               yearMax: 1950
 *     responses:
 *       200:
 *         description: List of found books that match the filter criteria
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/StoreBook'
 *       500:
 *         description: Internal server error during filtering books
 */
app.post('/api/books/filter', (req, res) => {
    try {
        const priceMin = req.body.priceMin;
        const priceMax = req.body.priceMax;
        const yearMin = req.body.yearMin;
        const yearMax = req.body.yearMax;
        const foundBooks = store.filterBooks(priceMin, priceMax, yearMin, yearMax);
        res.json(foundBooks);
    }
    catch (error) {
        console.error("Error filtering books:", error);
        res.status(500).json({ error: "Error filtering books" });
    }
});
/**
 * @swagger
 * /api/customer:
 *   get:
 *     tags:
 *       - Customer
 *     summary: Get customer data
 *     description: Returns customer data like name, balance, and image
 *     responses:
 *       200:
 *         description: Customer data
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Customer'
 *       500:
 *         description: Internal server error during loading customer data
 */
app.get('/api/customer', (req, res) => {
    try {
        const customerData = fs_1.default.readFileSync('customer.json', 'utf8'); // читаем файл
        const customer = JSON.parse(customerData);
        res.json(customer);
    }
    catch (error) {
        console.error('Error loading customer data:', error);
        res.status(500).json({ error: 'Error loading customer data' });
    }
});
/**
 * @swagger
 * /api/customer/balance/increase:
 *   post:
 *     tags:
 *       - Customer
 *     summary: Increase customer balance
 *     description: Increases customer balance
 *     requestBody:
 *       description: Amount to be added
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               amount:
 *                 type: number
 *                 description: Amount to add to the balance
 *                 example: 100.50
 *     responses:
 *       200:
 *         description: Successfully increased balance
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   description: Success status
 *                 message:
 *                   type: string
 *       400:
 *         description: Invalid amount
 *       500:
 *         description: Internal server error during increasing balance
 */
app.post('/api/customer/balance/increase', (req, res) => {
    try {
        const amount = req.body.amount;
        const success = customerData_1.customer.addFunds(amount);
        if (success) {
            saveCustomerData();
            res.json({
                success: true,
                message: "Balance has been successfully increased"
            });
        }
        else {
            res.status(400).json({
                success: false,
                error: "Please enter a valid positive number"
            });
        }
    }
    catch (error) {
        console.error("Error increasing customer balance:", error);
        res.status(500).json({ error: 'Error increasing customer balance' });
    }
});
/**
 * @swagger
 * /api/customer/books:
 *   get:
 *     tags:
 *       - Customer
 *     summary: Get list of books from the customer library
 *     description: Returns the list of books purchased by the customer
 *     responses:
 *       200:
 *         description: List of books in customer library
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/StoreBook'
 *       500:
 *         description: Internal server error during loading customer books
 */
app.get('/api/customer/books', (req, res) => {
    try {
        const data = fs_1.default.readFileSync('customer.json', 'utf8');
        const customerData = JSON.parse(data);
        const books = customerData.purchasedBooks;
        res.json(books);
    }
    catch (error) {
        console.error("Error loading customer books:", error);
        res.status(500).json({ error: 'Error loading customer books' });
    }
});
/**
 * @swagger
 * /api/customer/books/search:
 *   post:
 *     tags:
 *       - Customer
 *     summary: Search a book in the customer library
 *     description: Searches a book in the customer library based on title, author, or genre
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               query:
 *                 type: string
 *                 description: A search string that will be used for searching the title, author, and genre
 *             example:
 *               query: "horizon"
 *     responses:
 *       200:
 *         description: A list of books matching the search query
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/StoreBook'
 *       500:
 *         description: Internal server error during search process
 */
app.post('/api/customer/books/search', (req, res) => {
    try {
        const query = req.body.query;
        const book = {
            title: query,
            author: query,
            genre: query
        };
        const foundBooks = customerData_1.customer.searchBook(book);
        res.json(foundBooks);
    }
    catch (error) {
        console.error("Searching book error:", error);
        res.status(500).json({ error: "Searching book error" });
    }
});
/**
 * @swagger
 * /api/customer/books/add:
 *   post:
 *     tags:
 *       - Customer
 *     summary: Add a book to the customer library
 *     description: Adds a book to the customer's library with the option to upload a book image
 *     requestBody:
 *       description: Book information
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *                 description: Title of the book
 *               author:
 *                 type: string
 *                 description: Author of the book
 *               image:
 *                 type: string
 *                 format: binary
 *                 description: Book image
 *     responses:
 *       200:
 *         description: Successfully added the book
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   description: Indicates if the book was successfully added
 *                 message:
 *                   type: string
 *                   description: Message confirming the book was added
 *       500:
 *         description: Internal server error during adding the book
 */
app.post('/api/customer/books/add', upload.single('image'), (req, res) => {
    try {
        const title = req.body.title;
        const author = req.body.author;
        const imageUrl = `/uploads/${req.file?.filename}`;
        let storeBook = new storeBook_1.StoreBook({
            title: title,
            author: author,
            genre: 'not specified',
            year: 0,
            image: imageUrl
        }, 0, 1);
        customerData_1.customer.purchasedBooks.push(storeBook);
        saveCustomerData();
        res.json({
            success: true,
            message: 'Book has been added successfully'
        });
    }
    catch (error) {
        console.error('Error adding book:', error);
        res.status(500).json({ error: 'Error adding book' });
    }
});
/**
 * @swagger
 * /api/customer/books:
 *   delete:
 *     tags:
 *       - Customer
 *     summary: Remove book from the customer library
 *     description: Removes a book from the customer library
 *     requestBody:
 *       description: Data of the book to be removed
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/StoreBook'
 *     responses:
 *       200:
 *         description: Successfully removed book
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   description: Indicates if the book was successfully removed
 *                 message:
 *                   type: string
 *                   description: Message confirming the book was removed
 *       400:
 *         description: Error removing book (book not found)
 *       500:
 *         description: Internal server error during removing the book
 */
app.delete('/api/customer/books', (req, res) => {
    try {
        const storeBook = req.body;
        const success = customerData_1.customer.removeBook(storeBook);
        if (success) {
            saveCustomerData();
            const libraryData = fs_1.default.readFileSync('customer.json', 'utf8');
            const customerData = JSON.parse(libraryData);
            const updatedBooks = customerData.purchasedBooks;
            res.json({
                success: true,
                message: "Book has been successfully removed from the library",
                books: updatedBooks,
            });
        }
        else {
            res.status(400).json({
                success: false,
                error: "Book has not been found in the library"
            });
        }
    }
    catch (error) {
        console.error('Error removing book:', error);
        res.status(500).json({ error: 'Error removing book' });
    }
});
/**
 * @swagger
 * /api/purchase:
 *   post:
 *     tags:
 *       - Store
 *       - Customer
 *     summary: Sell a book from the store and purchase a book by the customer
 *     description: Allows a customer to purchase book from the store and to remove sold book from the store catalogue
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/StoreBook'
 *     responses:
 *       200:
 *         description: Successfully sold the book from the store catalogue
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: "Book has been successfully sold from the store"
 *       400:
 *         description: Purchase error (customer balance issues or unavailable book)
 *       500:
 *         description: Internal server error during the purchase process
 */
app.post('/api/purchase', (req, res) => {
    try {
        const storeBook = req.body;
        const bookIsAvailable = store.bookIsAvailable(storeBook);
        if (bookIsAvailable) {
            const result = customerData_1.customer.buyBook(storeBook);
            if (result) {
                store.removeBook(storeBook);
                saveCatalogue();
                saveCustomerData();
                res.json({
                    success: true,
                    message: "Book has been successfully sold from the store",
                });
            }
            else {
                return res.status(400).json({
                    success: false,
                    error: "Please increase the balance to purchase the book",
                });
            }
        }
        else {
            return res.status(400).json({
                success: false,
                error: "Book is not available in the store",
            });
        }
    }
    catch (error) {
        console.error("Error loading purchase:", error);
        res.status(500).json({
            success: false,
            error: "Error loading purchase",
        });
    }
});
/**
 * @swagger
 * tags:
 *   - name: Subscriber
 *     description: Operations related to newsletter subscription
 */
/**
 * @swagger
 * /api/subscriber:
 *   post:
 *     tags:
 *       - Subscriber
 *     summary: Subscribe to newsletter
 *     description: Adds an email to the subscriber list for the newsletter
 *     requestBody:
 *       description: Email address
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *                 description: Email address
 *     responses:
 *       200:
 *         description: Successfully subscribed
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   description: Indicates if the subscription was successful
 *       400:
 *         description: Subscription error (invalid email format or already subscribed)
 *       500:
 *         description: Internal server error during processing subscription
 */
app.post('/api/subscriber', (req, res) => {
    try {
        const email = req.body.email;
        const emailRegexp = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!email || !emailRegexp.test(email)) {
            return res.status(400).json({
                success: false,
                error: 'Invalid email format'
            });
        }
        if (newsletter.subscribers.includes(email)) {
            return res.status(400).json({
                success: false,
                error: 'You have already been subscribed to our newsletter'
            });
        }
        newsletter.subscribers.push(email);
        saveSubscriberData();
        return res.json({ success: true });
    }
    catch (error) {
        console.error('Subscribing email error:', error);
        res.status(500).json({ error: "Subscribing email error" });
    }
});
app.listen(port, () => {
    storeBooksData_1.books.forEach(storeBook => store.addBook(storeBook));
    saveCatalogue();
    saveCustomerData();
    console.log('The server is running on http://localhost:3000');
});
