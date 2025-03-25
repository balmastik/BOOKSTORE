import {Customer, StoreBook} from '../interfaces/entities';
import {CustomerPageApi, CustomerApiResponse, BookApiResponse} from '../interfaces/api';

class CustomerServices implements CustomerPageApi {

  public async displayCustomer(): Promise<Customer> {
    try {
      const res = await fetch('http://localhost:3000/api/customer');

      if (!res.ok) {
        const errorMessage = `HTTP Error: ${res.status} - ${res.statusText}`;
        console.error(errorMessage);
        throw new Error(errorMessage);
      }

      const data: CustomerApiResponse = await res.json();
      if (data.success) {
        return data.customer;
      } else {
        throw new Error(data.error || 'Unknown error');
      }
    } catch (error) {
      console.error('Error while customer display:', error);
      throw new Error('Server error occurred while loading customer. Please try again later');
    }
  }

  public async increase(amount: number): Promise<Customer> {
    try {
      const res = await fetch('http://localhost:3000/api/customer/balance/increase', {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({amount})
      });

      if (!res.ok) {
        const errorMessage = `HTTP Error: ${res.status} - ${res.statusText}`;
        console.error(errorMessage);
        throw new Error(errorMessage);
      }

      const data: CustomerApiResponse = await res.json();
      if (data.success) {
        return data.customer;
      } else {
        throw new Error(data.error || 'Unknown error');
      }
    } catch (error) {
      console.error('Error while balance increase:', error);
      throw new Error('Server error occurred while increasing balance. Please try again later');
    }
  }

  public async displayLibrary(): Promise<StoreBook[]> {
    try {
      const res = await fetch('http://localhost:3000/api/customer/books');

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
      console.error('Error while books display:', error);
      throw new Error('Server error occurred while loading books. Please try again later');
    }
  }

  public async remove(storeBook: StoreBook): Promise<StoreBook[]> {
    try {
      const res = await fetch('http://localhost:3000/api/customer/books', {
        method: 'DELETE',
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
      console.error('Error while book remove:', error);
      throw new Error('Server error occurred while removing book. Please try again later');
    }
  }

  public async search(query: string): Promise<StoreBook[]> {
    try {
      const res = await fetch('http://localhost:3000/api/customer/books/search', {
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

  public async add(title: string, author: string, image: File): Promise<StoreBook[]> {
    const formData = new FormData();
    formData.append('title', title);
    formData.append('author', author);
    formData.append('image', image);

    try {
      const res = await fetch('http://localhost:3000/api/customer/books/add', {
        method: 'POST',
        body: formData,
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
      console.error('Error while book add:', error);
      throw new Error('Server error occurred while ading book. Please try again later');
    }
  }
}

export const customerServices = new CustomerServices();
