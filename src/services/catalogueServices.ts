import {StoreBook} from '../interfaces/entities';
import {CataloguePageApi, BookApiResponse} from '../interfaces/api';


class CatalogueServices implements CataloguePageApi {

  public async display(): Promise<StoreBook[]> {
    try {
      const res = await fetch('http://localhost:3000/api/books');

      if (!res.ok) {
        const errorMessage = `HTTP Error: ${res.status} - ${res.statusText}`;
        console.error(errorMessage);
        throw new Error(errorMessage);
      }

      const data: BookApiResponse = await res.json();
      if (data.success) {
        return data.books;
      } else {
        throw new Error(data.error || 'Unknown error');
      }

    } catch (error) {
      console.error('Error loading books:', error);
      throw new Error('Server error occurred while loading books. Please try again later');
    }
  }

  public async search(query: string): Promise<StoreBook[]> {
    try {
      const res = await fetch('http://localhost:3000/api/books/search', {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({query})
      });

      if (!res.ok) {
        const errorMessage = `HTTP Error: ${res.status} - ${res.statusText}`;
        console.error(errorMessage);
        throw new Error(errorMessage);
      }

      const data: BookApiResponse = await res.json();
      if (data.success) {
        return data.books;
      } else {
        throw new Error(data.error || 'Unknown error');
      }
    } catch (error) {
      console.error('Error while book search:', error);
      throw new Error('Server error occurred while searching book. Please try again later');
    }
  }

  public async filter(priceMin: number, priceMax: number, yearMin: number, yearMax: number): Promise<StoreBook[]> {
    try {
      const res = await fetch('http://localhost:3000/api/books/filter', {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({priceMin, priceMax, yearMin, yearMax})
      });

      if (!res.ok) {
        const errorMessage = `HTTP Error: ${res.status} - ${res.statusText}`;
        console.error(errorMessage);
        throw new Error(errorMessage);
      }

      const data: BookApiResponse = await res.json();
      if (data.success) {
        return data.books;
      } else {
        throw new Error(data.error || 'Unknown error');
      }
    } catch (error) {
      console.error('Error while books filter:', error);
      throw new Error('Server error occurred while filtering books. Please try again later');
    }
  }

  public async sale(storeBook: StoreBook): Promise<StoreBook[]> {
    try {
      const res = await fetch('http://localhost:3000/api/purchase', {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify(storeBook)
      });

      if (!res.ok) {
        const errorMessage = `HTTP Error: ${res.status} - ${res.statusText}`;
        console.error(errorMessage);
        throw new Error(errorMessage);
      }

      const data: BookApiResponse = await res.json();
      if (data.success) {
        return data.books;
      } else {
        throw new Error(data.error || 'Unknown error');
      }
    } catch (error) {
      console.error('Error selling book:', error);
      throw new Error('Server error occurred while purchasing book. Please try again later');
    }
  }
}

export const catalogueServices = new CatalogueServices();
