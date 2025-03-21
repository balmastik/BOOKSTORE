import {StoreBook} from './Entities';

export interface BookApi {
  display(): Promise<StoreBook[]>;
  sale(storeBook: StoreBook): Promise<StoreBook[]>;
  search(query: string): Promise<StoreBook[]>;
  filter(priceMin: number, priceMax: number, yearMin: number, yearMax: number): Promise<StoreBook[]>;
}

export interface SubscribeApi {
  subscribe(email: string): Promise<string>;
}



