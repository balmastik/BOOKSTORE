import express, {Request, Response} from 'express';
import fs from 'fs';
import cors from 'cors';
import {books} from "./storeBooks-data";
import {Store} from "./store";
import {customer} from "./customer-data";


function saveCatalogue() {
  const catalogueData = Array.from(store.catalogue.values());
  fs.writeFileSync('catalogue.json', JSON.stringify(catalogueData, null, 2), 'utf8');
}

function loadCatalogue() {
  try {
    const data = fs.readFileSync('catalogue.json', 'utf8');
    const catalogueData = JSON.parse(data);
    catalogueData.forEach((bookData: any) => {
      store.addBook(bookData);
    });
  } catch (error) {
    console.error("Error loading catalogue:", error);
  }
}

const app = express();
const port = 3000;
const store = new Store();

app.use(cors());
app.use(express.json());

app.get('/api/catalogue', (req: Request, res: Response) => {
  const catalogue = Array.from(store.catalogue.values());
  res.json(catalogue);
});

app.post('/api/purchase', (req: Request, res: Response) => {

  const storeBook: StoreBook = req.body;
  const bookIsAvailable = store.bookIsAvailable(storeBook);

  if(bookIsAvailable) {
    const result = customer.buyBook(storeBook);
    if (result) {
      store.removeBook(storeBook);
      saveCatalogue();
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

app.get('/api/customer', (req: Request, res: Response) => {
  res.json(customer);
});

app.get('/api/customer/library', (req: Request, res: Response) => {
  const library= customer.purchasedBooks;
    res.json(library);
});

app.delete('/api/customer/removeBook', (req: Request, res: Response) => {
  const storeBook: StoreBook = req.body;
  const success = customer.removeBook(storeBook);

  if (success) {
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

app.listen(port, () => {
  books.forEach(storeBook => store.addBook(storeBook));
  loadCatalogue();
  console.log('The server is running on http://localhost:3000');
});
