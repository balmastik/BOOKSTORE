import {SubscribeApi, SubscribeApiResponse} from '../interfaces/api';

class FetchSubscribe implements SubscribeApi {

  public async subscribe(email: string): Promise<string> {
    try {
      const res = await fetch('http://localhost:3000/api/subscriber', {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({email})
      });

      const data: SubscribeApiResponse = await res.json();
      if (data.success) {
        return data.message;
      } else {
        return data.error || 'Unknown error while email subscribing';
      }
    } catch (error) {
      console.error('Error while email subscribing:', error);
      return 'Server error. Please try again later';
    }
  }
}

export const fetchSubscribe = new FetchSubscribe();
