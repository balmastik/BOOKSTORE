import {StoreBook, CatalogueApi, CatalogueApiResponse} from './catalogueInterface';

const API_URL = process.env.REACT_APP_API_URL;

class CatalogueServiceImpl implements CatalogueApi {

  private async parseResponse(res: Response): Promise<StoreBook[]> {
    const data: CatalogueApiResponse = await res.json();
    if (!data.success) {
      throw new Error(data.error || 'Unknown error from server response.');
    }
    return data.books;
  }

  public async display(): Promise<StoreBook[]> {
    try {
      const res = await fetch(`${API_URL}/api/books`);
      return await this.parseResponse(res);
    } catch (error) {
      console.error('Error loading books:', (error as Error).message);
      throw new Error((error as Error).message || 'Server error while loading books. Please try again later');
    }
  }

  public async search(query: string): Promise<StoreBook[]> {
    try {
      const res = await fetch(`${API_URL}/api/books/search`, {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({query})
      });
      return await this.parseResponse(res);
    } catch (error) {
      console.error('Error while books search:', (error as Error).message);
      throw new Error((error as Error).message || 'Server error while searching books. Please try again later');
    }
  }

  public async filter(priceMin: number, priceMax: number, yearMin: number, yearMax: number): Promise<StoreBook[]> {
    try {
      const res = await fetch(`${API_URL}/api/books/filter`, {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({priceMin, priceMax, yearMin, yearMax})
      });
      return await this.parseResponse(res);
    } catch (error) {
      console.error('Error while books filter:', (error as Error).message);
      throw new Error((error as Error).message || 'Server error while filtering books. Please try again later');
    }
  }

  public async sale(storeBook: StoreBook): Promise<StoreBook[]> {
    try {
      const res = await fetch(`${API_URL}/api/purchase`, {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify(storeBook)
      });
      return await this.parseResponse(res);
    } catch (error) {
      console.error('Error selling book:', (error as Error).message);
      throw new Error((error as Error).message || 'Server error while purchasing book. Please try again later');
    }
  }
}

export const catalogueServiceImpl = new CatalogueServiceImpl();
