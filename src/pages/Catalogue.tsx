import React, {useState, useEffect, useRef} from 'react';

import {StoreBook} from '../interfaces/types/BookData';
import BookCard from '../components/BookCard';
import Search from '../components/Search';
import Filter from '../components/Filter';

import { useReloadLibrary } from '../context/ReloadLibraryContext';

const Catalogue: React.FC<CatalogueProps> = () => {
  const [popupShown, setPopupShown] = useState<boolean>(false);
  const [books, setBooks] = useState<StoreBook[]>([]);
  const [filteredBooks, setFilteredBooks] = useState<StoreBook[]>([]);
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const linkRef = useRef<HTMLAnchorElement | null>(null);
  const {setReloadLibrary} = useReloadLibrary();

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
          setReloadLibrary(prev => !prev);
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

  const handleOpenFilter = () => {
    setIsFilterOpen(true);
  };

  const handleCloseFilter = () => {
    setIsFilterOpen(false);
  };

  const downloadCatalogue = () => {
    if ((window as any).jspdf) {
      const {jsPDF} = (window as any).jspdf;
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
    <>
      <section className="page-header">
        <h2 className="page-header-title">Catalogue</h2>
        <Search
          onSearch={handleSearch}
          onClearSearch={handleClearSearch}
          onOpenFilter={handleOpenFilter}
        />
      </section>

      <section className="filter-section">
        <Filter
          isOpen={isFilterOpen}
          onCloseFilter={handleCloseFilter}
          onApplyFilter={handleApplyFilter}
          onClearFilter={handleClearFilter}
        />
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
          <p className="inform-message">No books found</p>
        )}
      </section>

      <section className="download-catalogue">
        <a ref={linkRef} style={{display: 'none'}} />
        <button onClick={downloadCatalogue} className="catalogueButton">
          Download Catalogue
        </button>
      </section>

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
    </>
  );
};

export default Catalogue;



