import { StoreBook, Customer} from './entities';

export interface CataloguePageApi {
  display(): Promise<StoreBook[]>;
  sale(storeBook: StoreBook): Promise<StoreBook[]>;
  search(query: string): Promise<StoreBook[]>;
  filter(priceMin: number, priceMax: number, yearMin: number, yearMax: number): Promise<StoreBook[]>;
}

export interface CustomerPageApi {
  displayCustomer(): Promise<Customer>;
  increase(amount: number): Promise<Customer>;
  displayLibrary(): Promise<StoreBook[]>;
  remove(storeBook: StoreBook): Promise<StoreBook[]>;
  search(query: string): Promise<StoreBook[]>;
  add(title: string, author: string, image: File): Promise<StoreBook[]>;
}

export interface BookApiResponse {
  success: boolean;
  books: StoreBook[];
  error?: string;
}

export interface CustomerApiResponse {
  success: boolean;
  customer: Customer;
  error?: string;
}

export interface SubscribeApi {
  subscribe(email: string): Promise<string>;
}

export interface SubscribeApiResponse {
  success: boolean;
  message: string;
  error?: string;
}


