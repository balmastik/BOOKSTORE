import {StoreBook, CatalogueApi, CatalogueApiResponse} from './catalogueInterface';

class CatalogueServiceImpl implements CatalogueApi {

  public async display(): Promise<StoreBook[]> {
    try {
      const res = await fetch('http://localhost:3000/api/books');

      const data: CatalogueApiResponse = await res.json();
      if (data.success) {
        return data.books;
      } else {
        throw new Error(data.error || 'Unknown error');
      }

    } catch (error) {
      console.error('Error loading books:', error);
      throw new Error(error as string || 'Server error while loading books. Please try again later');
    }
  }

  public async search(query: string): Promise<StoreBook[]> {
    try {
      const res = await fetch('http://localhost:3000/api/books/search', {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({query})
      });

      const data: CatalogueApiResponse = await res.json();
      if (data.success) {
        return data.books;
      } else {
        throw new Error(data.error || 'Unknown error');
      }
    } catch (error) {
      console.error('Error while books search:', error);
      throw new Error(error as string || 'Server error while searching books. Please try again later');
    }
  }

  public async filter(priceMin: number, priceMax: number, yearMin: number, yearMax: number): Promise<StoreBook[]> {
    try {
      const res = await fetch('http://localhost:3000/api/books/filter', {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({priceMin, priceMax, yearMin, yearMax})
      });

      const data: CatalogueApiResponse = await res.json();
      if (data.success) {
        return data.books;
      } else {
        throw new Error(data.error || 'Unknown error');
      }
    } catch (error) {
      console.error('Error while books filter:', error);
      throw new Error(error as string || 'Server error while filtering books. Please try again later');
    }
  }

  public async sale(storeBook: StoreBook): Promise<StoreBook[]> {
    try {
      const res = await fetch('http://localhost:3000/api/purchase', {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify(storeBook)
      });

      const data: CatalogueApiResponse = await res.json();
      if (data.success) {
        return data.books;
      } else {
        throw new Error(data.error || 'Unknown error');
      }
    } catch (error) {
      console.error('Error selling book:', error);
      throw new Error(error as string || 'Server error while purchasing book. Please try again later');
    }
  }
}

export const catalogueServiceImpl = new CatalogueServiceImpl();
