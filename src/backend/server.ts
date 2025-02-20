import express, {Request, Response} from 'express';
import cors from 'cors';
import {books} from "./storeBooks-data";
import {Store} from "./store";

const app = express();
const port = 3000;
const store = new Store();

app.use(cors());
app.use(express.json());

app.get('/api/catalogue', (req: Request, res: Response) => {
  const catalogue = Array.from(store.catalogue.values());
  res.json(catalogue);
});

app.listen(port, () => {
  books.forEach(storeBook => store.addBook(storeBook));
  console.log('The server is running on http://localhost:3000');
});
