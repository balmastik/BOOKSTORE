import {StoreBook, CatalogueApiResponse} from '../catalogue/catalogueInterface';
import {Customer, CustomerApi, CustomerApiResponse} from './customerInterface';

const API_URL = process.env.REACT_APP_API_URL;

class CustomerServiceImpl implements CustomerApi {

  private async parseCustomerResponse(res: Response): Promise<Customer> {
    const data: CustomerApiResponse = await res.json();
    if (!data.success) {
      throw new Error(data.error || 'Unknown error from server response.');
    }
    return data.customer;
  }

  private async parseCatalogueResponse(res: Response): Promise<StoreBook[]> {
    const data: CatalogueApiResponse = await res.json();
    if (!data.success) {
      throw new Error(data.error || 'Unknown error from server response.');
    }
    return data.books;
  }

  public async displayCustomer(): Promise<Customer> {
    try {
      const res = await fetch(`${API_URL}/api/customer`);
      return await this.parseCustomerResponse(res);
    } catch (error) {
      console.error('Error while customer display:', (error as Error).message);
      throw new Error((error as Error).message || 'Server error while loading customer. Please try again later');
    }
  }

  public async increase(amount: number): Promise<Customer> {
    try {
      const res = await fetch(`${API_URL}/api/customer/balance/increase`, {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({amount})
      });
      return await this.parseCustomerResponse(res);
    } catch (error) {
      console.error('Error while balance increase:', (error as Error).message);
      throw new Error((error as Error).message || 'Server error while increasing balance. Please try again later');
    }
  }

  public async displayLibrary(): Promise<StoreBook[]> {
    try {
      const res = await fetch(`${API_URL}/api/customer/books`);
      return await this.parseCatalogueResponse(res);
    } catch (error) {
      console.error('Error while books display:', (error as Error).message);
      throw new Error((error as Error).message || 'Server error while loading books. Please try again later');
    }
  }

  public async remove(storeBook: StoreBook): Promise<StoreBook[]> {
    try {
      const res = await fetch(`${API_URL}/api/customer/books`, {
        method: 'DELETE',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify(storeBook)
      });
      return await this.parseCatalogueResponse(res);
    } catch (error) {
      console.error('Error while book remove:', (error as Error).message);
      throw new Error((error as Error).message || 'Server error while removing book. Please try again later');
    }
  }

  public async search(query: string): Promise<StoreBook[]> {
    try {
      const res = await fetch(`${API_URL}/api/customer/books/search`, {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({query})
      });
      return await this.parseCatalogueResponse(res);
    } catch (error) {
      console.error('Error while books search:', (error as Error).message);
      throw new Error((error as Error).message || 'Server error while searching books. Please try again later');
    }
  }

  public async add(title: string, author: string, image: File): Promise<StoreBook[]> {
    const formData = new FormData();
    formData.append('title', title);
    formData.append('author', author);
    formData.append('image', image);

    try {
      const res = await fetch(`${API_URL}/api/customer/books/add`, {
        method: 'POST',
        body: formData,
      });
      return await this.parseCatalogueResponse(res);
    } catch (error) {
      console.error('Error while book add:', (error as Error).message);
      throw new Error((error as Error).message || 'Server error while adding book. Please try again later');
    }
  }
}

export const customerServiceImpl = new CustomerServiceImpl();
