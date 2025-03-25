import {SubscribeApi, SubscribeApiResponse} from '../interfaces/api';

class FetchSubscribe implements SubscribeApi {

  public async subscribe(email: string): Promise<string> {
    try {
      const res = await fetch('http://localhost:3000/api/subscriber', {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({email})
      });

      if (!res.ok) {
        const errorMessage = `HTTP Error: ${res.status} - ${res.statusText}`;
        console.error(errorMessage);
        throw new Error(errorMessage);
      }

      const data: SubscribeApiResponse = await res.json();
      if (data.success) {
        return data.message;
      } else {
        return data.error || 'Unknown error occurred while email subscribing';
      }
    } catch (error) {
      console.error('Server error occurred while email subscribing:', error);
      return 'Server error occurred. Please try again later';
    }
  }
}

export const fetchSubscribe = new FetchSubscribe();
