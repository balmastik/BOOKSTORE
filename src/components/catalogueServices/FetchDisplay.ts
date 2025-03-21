import {BookApi} from '../../interfaces/Api';
import {StoreBook} from '../../interfaces/Entities';

class FetchDisplay implements BookApi {
  public async display(): Promise<StoreBook[]> {
    try {
      const res = await fetch('http://localhost:3000/api/books');
      const data = await res.json();

      if (data.success) {
        return data.books;
      } else {
        console.error('Error displaying books:', data.error);
        throw new Error(data.error);
      }
    } catch (error) {
      console.error('Error loading books:', error);
      throw new Error('Server error occurred while loading books. Please try again later.');
    }
  }
}

export const fetchDisplay = new FetchDisplay();


