import React, { useState } from 'react';

interface SearchProps {
  onSearch: (query: string) => void;
  onClearSearch: () => void;
}

const Search: React.FC<SearchProps> = ({ onSearch, onClearSearch }) => {
  const [searchTerm, setSearchTerm] = useState('');

  const handleSearch = () => {
    const query = searchTerm.toLowerCase().trim();

    if (query === '') {
      onClearSearch();
    } else {
      onSearch(query);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  return (
    <div className="search-container">
      <input
        type="text"
        className="search-input"
        placeholder="Book title, author, genre"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        onKeyDown={handleKeyDown}
      />
      <button className="search-button" onClick={handleSearch}>Search</button>
    </div>
  );
};

export default Search;
