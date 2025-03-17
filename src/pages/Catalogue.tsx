import React, {useState, useEffect, useRef} from 'react';
import Header from '../components/Header';
import BookCard from '../components/BookCard';
import Search from '../components/Search';
import Filter from '../components/Filter';

interface BookData {
  title: string;
  author: string;
  genre: string;
  year: number;
  image: string;
  price: number;
  quantity: number;
}

interface StoreBook {
  book: BookData;
}

interface CatalogueProps {
  onSaleSuccess: () => void;
}

const Catalogue: React.FC<CatalogueProps> = ({onSaleSuccess}) => {
  const [popupShown, setPopupShown] = useState<boolean>(false);
  const [books, setBooks] = useState<StoreBook[]>([]);
  const [filteredBooks, setFilteredBooks] = useState<StoreBook[]>([]);
  const linkRef = useRef<HTMLAnchorElement | null>(null);

  useEffect(() => {
    const popupStatus = localStorage.getItem('popupShown');
    if (!popupStatus) {
      setPopupShown(true);
    }
  }, []);

  const hidePopup = () => {
    setPopupShown(false);
    localStorage.setItem('popupShown', 'true');
  };

  useEffect(() => {
    fetch('http://localhost:3000/api/books')
      .then((res) => res.json())
      .then((data) => {
        setBooks(data);
        setFilteredBooks(data);
      })
      .catch((error) => console.error('Error loading books:', error));
  }, [])

  const handleSale = (storeBook: StoreBook) => {
    fetch('http://localhost:3000/api/purchase', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(storeBook),
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          setBooks(data.books);
          setFilteredBooks(data.books);
          onSaleSuccess();
        } else {
          alert(data.error);
        }
      })
      .catch((error) => console.error('Error selling book:', error));
  }

  const handleSearch = (query: string) => {
    fetch('http://localhost:3000/api/books/search', {
      method: 'POST',
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify({query}),
    })
      .then((res) => res.json())
      .then(data => {
        if (data.success) {
          setFilteredBooks(data.books);
        } else {
          alert(data.error);
        }
      })
      .catch((error) => console.error('Error searching books:', error));
  }

  const handleClearSearch = () => {
    setFilteredBooks(books);
  };

  const handleApplyFilter = (priceMin: number, priceMax: number, yearMin: number, yearMax: number) => {
    fetch('http://localhost:3000/api/books/filter', {
      method: 'POST',
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify({priceMin, priceMax, yearMin, yearMax})
    })
      .then((res) => res.json())
      .then((foundBooks) => setFilteredBooks(foundBooks))
      .catch((error) => console.error("Error applying filters:", error));
  }

  const handleClearFilter = () => {
    setFilteredBooks(books);
  }

  const downloadCatalogue = () => {
    if (window.jspdf) {
      const {jsPDF} = window.jspdf;
      const doc = new jsPDF();

      doc.setFont('Helvetica');
      doc.setFontSize(16);
      doc.setTextColor(0, 0, 0);
      doc.text("KNIGBOOM Catalogue", 80, 20);

      doc.setFontSize(12);

      const catalogueText = books
        .map((item: StoreBook) => {
          return `Book: "${item.book.title}". Author: ${item.book.author}.\n` +
            `Genre: ${item.book.genre}. Publication year: ${item.book.year}.\n` +
            `Price: ${item.book.price.toFixed(2)} EUR. In stock: ${item.book.quantity}.`
        })
        .join('\n\n');

      doc.text(catalogueText, 20, 40);

      const pdfBlob = doc.output("blob");
      const url = URL.createObjectURL(pdfBlob);

      if (linkRef.current) {
        linkRef.current.href = url;
        linkRef.current.download = "KNIGBOOM Catalogue.pdf";
        linkRef.current.click();

        URL.revokeObjectURL(url);
      }
    } else {
      console.log('jsPDF is not loaded');
    }
  }

  return (
    <div>
      {popupShown && (
        <div className="popup" style={{ display: 'flex' }}>
          <div className="popup-content">
            <h1 className="header-title">KNIGBOOM</h1>
            <p className="header-tagline">THE CORNER STORE</p>
            <p className="popup-text">Book and cup of coffee is always a great combo, right?</p>

            <div className="popup-container">
              <button className="deny-popup" onClick={hidePopup}>A cup of tea, please</button>
              <button className="confirm-popup" onClick={hidePopup}>I agree</button>
            </div>
          </div>
        </div>
      )}
      <Header onClearSearch={handleClearSearch}/>
      <section className="page-header">
        <h2 className="page-header-title">Catalogue</h2>
        <Search onSearch={handleSearch} onClearSearch={handleClearSearch}/>
        <img src="./dist/icon/filter_book_icon.svg" alt="Open filter" className="open-filter-img"/>
      </section>

      <section className="filter-section">
        <Filter onApplyFilter={handleApplyFilter} onClearFilter={handleClearFilter}/>
      </section>

      <section className="book-list">
        {filteredBooks.length > 0 ? (
          filteredBooks.map((storeBook) => (
            <BookCard
              key={storeBook.book.title}
              storeBook={storeBook}
              onSale={() => handleSale(storeBook)}
            />
          ))
        ) : (
          <p>No books found</p>
        )}
      </section>

      <section className="download-catalogue">
        <a ref={linkRef} style={{display: 'none'}}/>
        <button onClick={downloadCatalogue} className="catalogueButton">
          Download Catalogue
        </button>
      </section>
    </div>
  );
};

export default Catalogue;



