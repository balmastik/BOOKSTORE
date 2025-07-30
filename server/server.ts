import fs from 'fs';
import path from 'path';

import dotenv from 'dotenv';

import express, {Request, Response} from 'express';
import cors from 'cors';
import multer from 'multer';
import swaggerJSDoc from 'swagger-jsdoc';
import swaggerUi from 'swagger-ui-express';

import {StoreBook} from './storeBook/storeBook';
import {Store} from './store/store';
import {Newsletter} from './mail/emails';
import {books} from './storeBook/storeBooksData';
import {customer} from './customer/customerData';

dotenv.config();
const port = process.env.PORT || 3000;

const app = express();
const store = new Store();
const newsletter = new Newsletter();

const swaggerOptions = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'KNIGBOOM API',
      version: '1.0.0',
      description: 'API Documentation for KNIGBOOM Store',
    },
    components: {
      schemas: JSON.parse(fs.readFileSync('openapi.json', 'utf-8')).components.schemas
    }
  },
  apis: ['./server/server.ts'],
};
const swaggerDocs = swaggerJSDoc(swaggerOptions);

const corsOptions = {
  origin: 'http://localhost:3001',
  methods: ['GET', 'POST', 'DELETE'],
  allowedHeaders: ['Content-Type']
};
app.use(cors(corsOptions));
app.use(express.json());
app.use('/uploads', express.static('uploads'));

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocs));

const upload = multer({
  dest: 'uploads/',
  limits: {fileSize: 10 * 1024 * 1024}
});

function saveCatalogue() {
  const catalogue = Array.from(store.catalogue.values());
  fs.writeFileSync('catalogue.json', JSON.stringify(catalogue, null, 2), 'utf8');
}

function saveCustomerData() {
  const customerData = {
    name: customer.name,
    balance: customer.balance,
    image: customer.image,
    purchasedBooks: customer.purchasedBooks
  };
  fs.writeFileSync('customer.json', JSON.stringify(customerData, null, 2), 'utf8');
}

function saveSubscriberData() {
  const subscriberData = newsletter.subscribers;
  fs.writeFileSync('subscriber.json', JSON.stringify(subscriberData, null, 2), 'utf8');
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
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   description: Indicates whether the request was successful
 *                 books:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/StoreBook'
 *       500:
 *         description: Internal server error during loading books
 */
app.get('/api/books', (req: Request, res: Response) => {
  try {
    const data = fs.readFileSync('catalogue.json', 'utf8');
    const books: StoreBook[] = JSON.parse(data);
    res.json({
      success: true,
      books: books,
    });
  } catch (error) {
    console.error("Error loading books:", error);
    res.status(500).json({error: "Error loading books"});
  }
})

/**
 * @swagger
 * /api/books/search:
 *   post:
 *     tags:
 *       - Store
 *     summary: Search a book in the store catalogue
 *     description: Searches a book in the store based on title, author, or genre.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               query:
 *                 type: string
 *                 description: A search string that will be used for searching the title, author, and genre.
 *             example:
 *               query: "rand"
 *     responses:
 *       200:
 *         description: A list of books matching the search query.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   description: Indicates if the search was successful.
 *                 books:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/StoreBook'
 *       400:
 *         description:  Invalid request data, search failed
 *       500:
 *         description: Internal server error during the search process.
 */
app.post('/api/books/search', (req: Request, res: Response) => {
  try {
    const query: string = req.body.query.toLowerCase().trim();

    if (query == null) {
      return res.status(400).json({
        success: false,
        error: "Missing required search parameters"
      });
    }

    const book = {
      title: query,
      author: query,
      genre: query
    }

    const foundBooks = store.searchBook(book);
    res.status(200).json({
      success: true,
      books: foundBooks
    });
  } catch (error) {
    console.error("Searching book error:", error);
    res.status(500).json({error: "Searching book error"});
  }
})

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
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   description: Indicates the success of the filtering operation
 *                 books:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/StoreBook'
 *       400:
 *         description: Invalid request data, filtering failed
 *       500:
 *         description: Internal server error during filtering books
 */
app.post('/api/books/filter', (req: Request, res: Response) => {
  try {
    const {priceMin, priceMax, yearMin, yearMax} = req.body;

    if (priceMin == null || priceMax == null || yearMin == null || yearMax == null) {
      return res.status(400).json({
        success: false,
        error: "Missing required filter parameters"
      });
    }

    const foundBooks = store.filterBooks(priceMin, priceMax, yearMin, yearMax);
    res.status(200).json({
      success: true,
      books: foundBooks
    });
  } catch (error) {
    console.error("Error filtering books:", error);
    res.status(500).json({error: "Error filtering books"});
  }
})

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
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   description: Indicates if the request was successful
 *                 customer:
 *                   $ref: '#/components/schemas/Customer'
 *       500:
 *         description: Internal server error during loading customer data
 */
app.get('/api/customer', (req: Request, res: Response) => {
  try {
    const customerData = fs.readFileSync('customer.json', 'utf8');
    const customer = JSON.parse(customerData);
    res.json({
      success: true,
      customer: customer
    });
  } catch (error) {
    console.error('Error loading customer data:', error);
    res.status(500).json({error: 'Error loading customer data'});
  }
})

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
 *                 customer:
 *                   description: Customer data
 *                   content:
 *                     application/json:
 *                       schema:
 *                         $ref: '#/components/schemas/Customer'
 *       400:
 *         description: Invalid request data
 *       500:
 *         description: Internal server error during increasing balance
 */
app.post('/api/customer/balance/increase', (req: Request, res: Response) => {
  try {
    const amount: number = req.body.amount;

    if (amount == null) {
      return res.status(400).json({
        success: false,
        error: "Please enter a valid positive number"
      });
    }

    const success = customer.addFunds(amount);

    if (success) {
      saveCustomerData();

      const customerData = fs.readFileSync('customer.json', 'utf8');
      const updatedCustomer = JSON.parse(customerData);

      res.json({
        success: true,
        customer: updatedCustomer
      });
    }
  } catch (error) {
    console.error("Error increasing customer balance:", error);
    res.status(500).json({error: 'Error increasing customer balance'});
  }
})

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
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   description: Indicates whether the request was successful
 *                 books:
 *                   type: array
 *                   description: List of books in the customer's library
 *                   items:
 *                     $ref: '#/components/schemas/StoreBook'
 *       500:
 *         description: Internal server error during loading customer books
 */
app.get('/api/customer/books', (req: Request, res: Response) => {
  try {
    const data = fs.readFileSync('customer.json', 'utf8');
    const customerData = JSON.parse(data);
    const books = customerData.purchasedBooks;

    res.json({
      success: true,
      books: books
    });
  } catch (error) {
    console.error("Error loading customer books:", error);
    res.status(500).json({error: 'Error loading customer books'});
  }
})

/**
 * @swagger
 * /api/customer/books/search:
 *   post:
 *     tags:
 *       - Customer
 *     summary: Search a book in the customer library
 *     description: Searches a book in the customer library based on title, author, or genre.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               query:
 *                 type: string
 *                 description: A search string that will be used for searching the title, author, and genre.
 *             example:
 *               query: "horizon"
 *     responses:
 *       200:
 *         description: A list of books matching the search query.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   description: Indicates if the search was successful.
 *                 books:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/StoreBook'
 *       400:
 *         description:  Invalid request data, search failed
 *       500:
 *         description: Internal server error during the search process.
 */

app.post('/api/customer/books/search', (req: Request, res: Response) => {
  try {
    const query: string = req.body.query;

    if (query == null) {
      return res.status(400).json({
        success: false,
        error: "Missing required search parameters"
      });
    }

    const book = {
      title: query,
      author: query,
      genre: query
    }

    const foundBooks = customer.searchBook(book);
    res.status(200).json({
      success: true,
      books: foundBooks
    });
  } catch (error) {
    console.error("Searching book error:", error);
    res.status(500).json({error: "Searching book error"});
  }
})

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
 *                 books:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/StoreBook'
 *       400:
 *         description: Invalid request data
 *       500:
 *         description: Internal server error during adding the book
 */
app.post('/api/customer/books/add', upload.single('image'), (req: Request, res: Response) => {
  try {
    const title: string = req.body.title;
    const author: string = req.body.author;
    const imageUrl = `/uploads/${req.file?.filename}`;

    if (title == null || author == null || imageUrl == null) {
      return res.status(400).json({
        success: false,
        error: "Missing required book parameters"
      });
    }

    let storeBook = new StoreBook({
      title: title,
      author: author,
      genre: 'not specified',
      year: 0,
      image: imageUrl
    }, 0, 1);

    const success = customer.purchasedBooks.push(storeBook);
    if (success) {
      saveCustomerData();

      const libraryData = fs.readFileSync('customer.json', 'utf8');
      const customerData = JSON.parse(libraryData);
      const updatedBooks = customerData.purchasedBooks;

      res.json({
        success: true,
        books: updatedBooks,
      });
    }
  } catch (error) {
    console.error('Error adding book:', error);
    res.status(500).json({error: 'Error adding book'});
  }
})

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
 *                 books:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/StoreBook'
 *       400:
 *         description: Error removing book (e.g., book not found in the library)
 *       500:
 *         description: Internal server error during removing the book
 */
app.delete('/api/customer/books', (req: Request, res: Response) => {
  try {
    const storeBook: StoreBook = req.body;
    const success = customer.removeBook(storeBook);

    if (success) {
      saveCustomerData();

      const libraryData = fs.readFileSync('customer.json', 'utf8');
      const customerData = JSON.parse(libraryData);
      const updatedBooks = customerData.purchasedBooks;

      res.json({
        success: true,
        books: updatedBooks,
      });
    } else {
      res.status(400).json({
        success: false,
        error: "Book has not been found in the library"
      });
    }
  } catch (error) {
    console.error('Error removing book:', error);
    res.status(500).json({error: 'Error removing book'});
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
 *     description: Allows a customer to purchase a book from the store and removes the sold book from the store catalogue. The response includes the updated list of available books in the store.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/StoreBook'
 *     responses:
 *       200:
 *         description: Successfully sold the book from the store catalogue and returned updated list of books
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   description: Indicates if the sale/purchase was successful
 *                 books:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/StoreBook'
 *                   description: Updated list of books in the store catalogue after the purchase
 *       400:
 *         description: Purchase error (customer balance issues or unavailable book)
 *       500:
 *         description: Internal server error during the purchase process
 */
app.post('/api/purchase', (req: Request, res: Response) => {
  try {
    const storeBook: StoreBook = req.body;
    const bookIsAvailable = store.bookIsAvailable(storeBook);

    if (bookIsAvailable) {
      const result = customer.buyBook(storeBook);
      if (result) {
        store.removeBook(storeBook);
        saveCatalogue();
        saveCustomerData();

        const data = fs.readFileSync('catalogue.json', 'utf8');
        const updatedBooks: StoreBook[] = JSON.parse(data);

        res.json({
          success: true,
          books: updatedBooks,
        });
      } else {
        return res.status(400).json({
          success: false,
          error: "Please increase the balance to purchase the book",
        });
      }
    } else {
      return res.status(400).json({
        success: false,
        error: "Book is not available in the store",
      });
    }
  } catch (error) {
    console.error("Error loading purchase:", error);
    res.status(500).json({error: "Error loading purchase"});
  }
})

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
 *                 message:
 *                   type: string
 *                   description: Success message for the subscription
 *       400:
 *         description: Subscription error (already subscribed)
 *       500:
 *         description: Internal server error during processing subscription
 */
app.post('/api/subscriber', (req: Request, res: Response) => {
  try {
    const email: string = req.body.email;

    if (newsletter.subscribers.includes(email)) {
      return res.status(400).json({
        success: false,
        error: 'You have already been subscribed to our newsletter'
      });
    }

    newsletter.subscribers.push(email);
    saveSubscriberData();
    return res.json({
      success: true,
      message: 'You have successfully subscribed to our newsletter'
    });
  } catch (error) {
    console.error('Subscribing email error:', error);
    res.status(500).json({error: "Subscribing email error"});
  }
})

app.use(express.static(path.join(__dirname, '../dist')));

app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../dist', 'index.html'));
});

app.listen(port, () => {
  books.forEach(storeBook => store.addBook(storeBook));
  saveCatalogue();
  saveCustomerData();
  console.log(`Server is running on http://localhost:${port}`);
})
