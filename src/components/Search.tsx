import React, { useState } from 'react';

const Search: React.FC<{ onSearch: (query: string) => void }> = ({ onSearch }) => {
  const [searchTerm, setSearchTerm] = useState('');

  const handleSearch = () => {

    const query = searchTerm.toLowerCase().trim();
    onSearch(query);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  return (
    <div className="store-search-container">
      <input
        type="text"
        className="store-search-input"
        placeholder="Book title, author, genre"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        onKeyDown={handleKeyDown}
      />
      <button className="store-search-button" onClick={handleSearch}>Search</button>
      <img src="./dist/icon/filter_book_icon.svg" alt="Open filter" className="open-filter-img" />
    </div>
  );
};

export default Search;
