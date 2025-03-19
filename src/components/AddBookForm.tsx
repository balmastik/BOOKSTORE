import React, {useState} from 'react';

interface AddBookFormProps {
  onAddBook: (title: string, author: string, image: File) => void;
}

const AddBookForm: React.FC<AddBookFormProps> = ({onAddBook}) => {
  const [bookTitle, setBookTitle] = useState('');
  const [bookAuthor, setBookAuthor] = useState('');
  const [bookImage, setBookImage] = useState<File | null>(null);
  const [imageName, setImageName] = useState<string>('Cover');


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
      alert('Please fill in all fields and upload an image');
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
    <form onSubmit={handleSubmit} className="add-book-form">
      <input
        type="text"
        value={bookTitle}
        onChange={e => setBookTitle(e.target.value)}
        placeholder="Title"
      />

      <input
        type="text"
        value={bookAuthor}
        onChange={e => setBookAuthor(e.target.value)}
        placeholder="Author"
      />

      <div className="add-container">
        <label htmlFor="add-image" className="add-image">
          {imageName}
        </label>

        <input
          type="file"
          accept="image/*"
          id="add-image"
          onChange={handleImageChange}
          style={{display: 'none'}}
        />

        <button type="submit" className="add-button">
          Add
        </button>

        <button type="button" className="clear-form" onClick={handleClear}>
          Clear
        </button>

      </div>
    </form>
  );
};

export default AddBookForm;
