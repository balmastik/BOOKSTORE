import * as path from 'path';
import express, {Request, Response} from 'express';
const app = express();

app.use(express.static(path.join(__dirname, 'dist')));
app.use(express.static(path.join(__dirname, 'css')));
app.use(express.static(path.join(__dirname, 'img')));
app.use(express.static(path.join(__dirname, 'video')));
app.use(express.static(path.join(__dirname, 'icon')));


app.get('/', (req: Request, res: Response) => {
  res.sendFile(path.resolve(__dirname, 'index.html')); // Главная страница
});

app.get('/client.html', (req: Request, res: Response) => {
  res.sendFile(path.resolve(__dirname, 'client.html')); // Страница клиента
});

app.get('/index.js', (req: Request, res: Response) => {
  res.sendFile(path.resolve(__dirname, 'index.js')); // Скрипт
});

app.get('*', (req: Request, res: Response) => {
  res.sendFile(path.resolve(__dirname, 'index.html')); // На случай несуществующих страниц
});

app.listen(3000, () => {
  console.log('Сервер запущен на http://localhost:3000');
});
