import express, {Request, Response} from 'express';
import fs from 'fs';
import cors from 'cors';
import multer from 'multer';

import {StoreBook} from "./storeBook";
import {SearchBookDetails, Store} from "./store";
import {books} from "./storeBooks-data";
import {customer} from "./customer-data";

const app = express();
const upload = multer({
  dest: 'uploads/',
  limits: { fileSize: 10 * 1024 * 1024 }
});
const port = 3000;
const store = new Store();


app.use(cors());
app.use(express.json());
app.use('/uploads', express.static('uploads'));

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

app.get('/api/catalogue', (req: Request, res: Response) => {
  try {
    const data = fs.readFileSync('catalogue.json', 'utf8');
    const catalogue: [StoreBook][] = JSON.parse(data);
    res.json(catalogue);
  } catch (error) {
    console.error("Catalogue loading error:", error);
    res.status(500).json({ error: "Error loading catalogue" });
  }
});

app.post('/api/purchase', (req: Request, res: Response) => {

  const storeBook: StoreBook = req.body;
  const bookIsAvailable = store.bookIsAvailable(storeBook);

  if(bookIsAvailable) {
    const result = customer.buyBook(storeBook);
    if (result) {
      store.removeBook(storeBook);
      saveCatalogue();
      saveCustomerData();
      res.json({
        success: true,
        message: "Book has been successfully sold from the store",
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
});

app.post('/api/catalogue/searchStore', (req: Request, res: Response) => {

  try {
    const query = req.body.query;
    const book: SearchBookDetails = {
      title: query,
      author: query,
      genre: query
    }

    const foundBooks = store.searchBook(book);
    res.json(foundBooks);
  } catch (error) {
    console.error("Error loading found books:", error);
    res.status(500).json({ error: "Error loading found books" });
  }
})

app.post('/api/catalogue/filterStore', (req: Request, res: Response) => {

  try {
    const priceMin: number = req.body.priceMin;
    const priceMax: number = req.body.priceMax;
    const yearMin: number = req.body.yearMin;
    const yearMax: number = req.body.yearMax;

    const foundBooks = store.filterBooks(priceMin, priceMax, yearMin, yearMax);
    res.json(foundBooks);
  } catch (error) {
    console.error("Error loading found books:", error);
    res.status(500).json({ error: "Error loading found books" });
  }
})

app.get('/api/customer', (req: Request, res: Response) => {
  try {
    const customerData = fs.readFileSync('customer.json', 'utf8'); // читаем файл
    const customer = JSON.parse(customerData);
    res.json(customer);
  } catch (error) {
    console.error('Error loading customer data:', error);
    res.status(500).json({ error: 'Error loading customer data' });
  }
});

app.get('/api/customer/library', (req: Request, res: Response) => {

  try {
    const data = fs.readFileSync('customer.json', 'utf8');
    const customerData = JSON.parse(data);
    const library = customerData.purchasedBooks;

    res.json(library);
  } catch (error) {
    console.error("Error loading customer library:", error);
    res.status(500).json({ error: 'Failed to load customer library' });
  }
});

app.post('/api/customer/addFunds', (req: Request, res: Response) => {
  const amount: number = req.body.amount;
  const success = customer.addFunds(amount);

  if (success) {
    saveCustomerData();

    res.json({
      success: true,
      message: "Balance has been successfully increased"
    });
  } else {
    res.status(400).json({
      success: false,
      error: "Please enter a valid positive number"
    });
  }
});

app.delete('/api/customer/removeBook', (req: Request, res: Response) => {
  const storeBook: StoreBook = req.body;
  const success = customer.removeBook(storeBook);

  if (success) {
    saveCustomerData();

    res.json({
      success: true,
      message: "Book has been successfully removed from the library"
    });
  } else {
    res.status(400).json({
      success: false,
      error: "Book has not been found in the library"
    });
  }
});

app.post('/api/customer/searchLibrary', (req: Request, res: Response) => {

  try {
    const query = req.body.query;
    const book: SearchBookDetails = {
      title: query,
      author: query,
      genre: query
    }

    const foundBooks = customer.searchBook(book);
    res.json(foundBooks);
  } catch (error) {
    console.error("Error loading found books:", error);
    res.status(500).json({ error: "Error loading found books" });
  }
})

app.post('/api/customer/addBook', upload.single('image'), (req: Request, res: Response) => {

  try {
    const title: string = req.body.title;
    const author: string = req.body.author;
    const imageUrl = `/uploads/${req.file?.filename}`;

    let storeBook = new StoreBook({
        title: title,
        author: author,
        genre: 'not specified',
        year: 0,
        image: imageUrl
    }, 0, 1);

    customer.purchasedBooks.push(storeBook);
    saveCustomerData();
    res.json({
      success: true,
      message: 'Book has been added successfully'
    });
  } catch (error) {
    console.error('Error adding book:', error);
    res.status(500).json({ error: 'Failed to add the book' });
  }
})

app.listen(port, () => {
  books.forEach(storeBook => store.addBook(storeBook));
  saveCatalogue();
  saveCustomerData();
  console.log('The server is running on http://localhost:3000');
});
