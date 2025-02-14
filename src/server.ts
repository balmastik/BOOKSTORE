import * as path from 'path';
import express, {Request, Response} from 'express';
const app = express();

app.use(express.static(path.join(__dirname, 'dist')));
app.use(express.static(path.join(__dirname, 'css')));
app.use(express.static(path.join(__dirname, 'img')));
app.use(express.static(path.join(__dirname, 'video')));
app.use(express.static(path.join(__dirname, 'icon')));


app.get('*', (req: Request, res: Response) => {
  res.sendFile(path.resolve(__dirname, 'index.html'));
});

app.listen(3000, () => {
  console.log('Сервер запущен на http://localhost:3000');
});
