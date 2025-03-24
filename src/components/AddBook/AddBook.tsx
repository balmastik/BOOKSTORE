import React, {useState} from 'react';
import styles from './AddBook.module.css';
import ErrorPopup from '../../components/ErrorPopup/ErrorPopup';

interface AddBookProps {
  onAddBook: (title: string, author: string, image: File) => void;
}

const AddBook: React.FC<AddBookProps> = ({onAddBook}) => {
  const [bookTitle, setBookTitle] = useState('');
  const [bookAuthor, setBookAuthor] = useState('');
  const [bookImage, setBookImage] = useState<File | null>(null);
  const [imageName, setImageName] = useState<string>('Cover');
  const [message, setMessage] = useState<string>('');


  const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setBookImage(file);
      setImageName(file.name); // Обновляем имя файла
    }
  };

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();

    if (!bookTitle || !bookAuthor || !bookImage) {
      setMessage('Please fill in all fields and upload an image');
      return;
    }

    onAddBook(bookTitle, bookAuthor, bookImage);
    setBookTitle('');
    setBookAuthor('');
    setBookImage(null);
    setImageName('Cover');
  };

  const handleClear = () => {
    setBookTitle('');
    setBookAuthor('');
    setBookImage(null);
    setImageName('Cover');
  };

  return (
    <section className={styles.addBook}>
      <h2 className={styles.addBookTitle}>Add a Book to the Library</h2>
      <form onSubmit={handleSubmit} className={styles.addBookForm}>
        <input
          type="text"
          className={styles.addBookInput}
          value={bookTitle}
          onChange={e => setBookTitle(e.target.value)}
          placeholder="Title"
        />

        <input
          type="text"
          className={styles.addBookInput}
          value={bookAuthor}
          onChange={e => setBookAuthor(e.target.value)}
          placeholder="Author"
        />

        <div className={styles.addContainer}>
          <label htmlFor="add-image" className={styles.button}>{imageName}</label>

          <input
            type="file"
            accept="image/*"
            id="add-image"
            onChange={handleImageChange}
            style={{display: 'none'}}
          />

          <button type="submit" className={styles.button}>Add</button>
          <button type="button" className={styles.button} onClick={handleClear}>Clear</button>
        </div>
      </form>
      <ErrorPopup message={message} onClose={() => setMessage('')}/>
    </section>
  );
};

export default AddBook;
