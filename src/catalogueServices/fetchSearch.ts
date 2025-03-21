import {BookApi} from '../interfaces/Api';
import {StoreBook} from '../interfaces/Entities';

class FetchSearch implements BookApi {
  public async seacrh(query: string): Promise<StoreBook[]> {
    try {
      const res = await fetch('http://localhost:3000/api/books/search', {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({query}),
      })
      const data = await res.json();

      if (data.success) {
        return data.books;
      } else {
        console.error('Error searching book:', data.error);
        throw new Error(data.error);
      }
    } catch (error) {
      console.error('Error while book search:', error);
      throw new Error('Server error occurred while searching book. Please try again later.');
    }
  }
}

export const fetchSearch = new FetchSearch();
