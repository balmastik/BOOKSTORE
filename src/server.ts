import express, {Request, Response} from 'express';
import cors from 'cors';
import * as path from 'path';
import {Book, StoreBook} from "./store";

const app = express();
const port = 3000;

app.use(cors());
app.use(express.static(path.join(__dirname, 'dist')));
app.use(express.static(path.join(__dirname, 'dist/img')));
app.use(express.static(path.join(__dirname, 'dist/video')));

const books = [
  new StoreBook(new Book({
    title: 'Атлант расправил плечи',
    author: 'Айн Ренд',
    genre: 'Роман',
    year: 1957,
    image: '/img/atlas_shrugged.jpeg'
  }), 24.99),
  new StoreBook(new Book({
    title: 'Сага о Форсайтах',
    author: 'Джон Голсуорси',
    genre: 'Роман',
    year: 1906,
    image: '/img/the_forsyte_saga.jpeg'
  }), 22.99),
  new StoreBook(new Book({
    title: 'Потерянный горизонт',
    author: 'Джеймс Хилтон',
    genre: 'Приключения',
    year: 1933,
    image: '/img/lost_horizon.jpeg'
  }), 17.50),
  new StoreBook(new Book({
    title: 'Острие бритвы',
    author: 'Сомерсет Моэм',
    genre: 'Роман',
    year: 1944,
    image: '/img/the_razors_edge.jpeg'
  }), 20.00),
  new StoreBook(new Book({
    title: 'Нетерпение сердца',
    author: 'Стефан Цвейг',
    genre: 'Роман',
    year: 1939,
    image: '/img/beware_of_pity.jpeg'
  }), 14.99),
  new StoreBook(new Book({
    title: 'Прощайте, мистер Чипс',
    author: 'Джеймс Хилтон',
    genre: 'Приключения',
    year: 1934,
    image: '/img/goodbye_mr_chips.jpeg'
  }), 12.99),
     new StoreBook(new Book({
    title: 'Грозовой перевал',
    author: 'Эмили Бронте',
    genre: 'Трагедия',
    year: 1847,
    image: '/img/wuthering_heights.jpeg'
  }), 17.50),
  new StoreBook(new Book({
    title: 'Казино Рояль',
    author: 'Ян Флеминг',
    genre: 'Роман',
    year: 1953,
    image: '/video/casino_royale.mp4'
  }), 28.00),
    new StoreBook(new Book({
    title: 'Уловка-22',
    author: 'Джозеф Хеллер',
    genre: 'Сатира',
    year: 1961,
    image: '/img/catch_22.jpeg'
  }), 24.00),
];

app.get('/api/books', (req: Request, res: Response) => {
  res.json(books);
});

app.listen(port, () => {
  console.log('Сервер запущен на http://localhost:3000');
});
