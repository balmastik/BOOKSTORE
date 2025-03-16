import React, {useState} from 'react';

interface AddBookFormProps {
  onAddBook: (title: string, author: string, image: File) => void;
}

const AddBookForm: React.FC<AddBookFormProps> = ({onAddBook}) => {
  const [bookTitle, setBookTitle] = useState('');
  const [bookAuthor, setBookAuthor] = useState('');
  const [bookImage, setBookImage] = useState<File | null>(null);


  const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files?.[0]) {
      setBookImage(event.target.files[0]);
    }
  };

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();

    if (!bookTitle || !bookAuthor || !bookImage) {
      alert('Please fill in all fields and upload an image!');
      return;
    }

    onAddBook(bookTitle, bookAuthor, bookImage);
    setBookTitle('');
    setBookAuthor('');
    setBookImage(null);
  };

  const handleClear = () => {
    setBookTitle('');
    setBookAuthor('');
    setBookImage(null);
  };

  return (
    <form onSubmit={handleSubmit} className="add-book-form">
      <input
        type="text"
        value={bookTitle}
        onChange={e => setBookTitle(e.target.value)}
        placeholder="Title"
        required
      />
      <input
        type="text"
        value={bookAuthor}
        onChange={e => setBookAuthor(e.target.value)}
        placeholder="Author"
        required
      />
      <div className="add-container">
        <label htmlFor="add-image" className="add-image">
          Cover
        </label>
        <input
          type="file"
          accept="image/*"
          onChange={handleImageChange}
          required
          style={{display: 'none'}}
        />
        <button type="submit" className="add-button">
          Add
        </button>
        <button type="button" className="clear-button" onClick={handleClear}>
          Clear
        </button>
      </div>
    </form>
  );
};

export default AddBookForm;
