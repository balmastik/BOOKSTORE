import {BookApi} from '../interfaces/Api';
import {StoreBook} from '../interfaces/Entities';

class FetchFilter implements BookApi {
  public async filter(priceMin: number, priceMax: number, yearMin: number, yearMax: number): Promise<StoreBook[]> {
    try {
      const res = await fetch('http://localhost:3000/api/books/filter', {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({priceMin, priceMax, yearMin, yearMax})
      })
      const data = await res.json();

      if (data.success) {
        return data.books;
      } else {
        console.error('Error filtering books:', data.error);
        throw new Error(data.error);
      }
    } catch (error) {
      console.error('Error while books filter:', error);
      throw new Error('Server error occurred while filtering books. Please try again later.');
    }
  }
}

export const fetchFilter = new FetchFilter();
