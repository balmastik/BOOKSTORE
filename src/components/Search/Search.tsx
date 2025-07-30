import React, {useState} from 'react';
import styles from './Search.module.css';

interface SearchProps {
  onSearch: (query: string) => void;
  onClearSearch: () => void;
  onOpenFilter?: () => void;
}

const Search: React.FC<SearchProps> = ({onSearch, onClearSearch, onOpenFilter}) => {
  const [searchTerm, setSearchTerm] = useState('');

  const handleSearch = () => {
    const query = searchTerm;
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
      <div className={styles.searchContainer}>
        <input
        type="text"
        className={styles.searchInput}
        placeholder="Book title, author, genre"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        onKeyDown={handleKeyDown}
        />

        <button className={styles.searchButton} onClick={handleSearch}>Search</button>

        {onOpenFilter && (
        <img className={styles.openFilterImg} src={"/icon/filter_book_icon.svg"} alt={'Open filter'} onClick={onOpenFilter}/>
        )}
      </div>
  );
};

export default Search;
