import {StoreBook} from '../catalogue/catalogueInterface';

export interface Customer {
  name: string;
  balance: number;
  image: string;
}

export interface CustomerApi {
  displayCustomer(): Promise<Customer>;

  increase(amount: number): Promise<Customer>;

  displayLibrary(): Promise<StoreBook[]>;

  remove(storeBook: StoreBook): Promise<StoreBook[]>;

  search(query: string): Promise<StoreBook[]>;

  add(title: string, author: string, image: File): Promise<StoreBook[]>;
}

export interface CustomerApiResponse {
  success: boolean;
  customer: Customer;
  error?: string;
}

