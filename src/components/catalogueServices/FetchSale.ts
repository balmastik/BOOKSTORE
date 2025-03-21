import {BookApi} from '../../interfaces/Api';
import {StoreBook} from '../../interfaces/Entities';

class FetchSale implements BookApi {
  public async sale(storeBook: StoreBook): Promise<StoreBook[]> {
    try {
      const res = await fetch('http://localhost:3000/api/purchase', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(storeBook),
      })
      const data = await res.json();

      if (data.success) {
        return data.books;
      } else {
        console.error('Error purchasing book:', data.error);
        throw new Error(data.error);
      }
    } catch (error) {
      console.error('Error selling book:', error);
      throw new Error('Server error occurred while purchasing book. Please try again later.');
    }
  }
}

export const fetchSale = new FetchSale();
