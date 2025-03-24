import {SubscribeApi, SubscribeApiResponse} from '../interfaces/api';

class FetchSubscribe implements SubscribeApi {
  async subscribe(email: string): Promise<string> {
    try {
      const res = await fetch('http://localhost:3000/api/subscriber', {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({email}),
      });
      const data: SubscribeApiResponse = await res.json();

      if (data.success) {
        return data.message;
      } else {
        console.error('Subscription error:', data.error);
        return data.error || 'Unknown error occurred while email subscribing';
      }
    } catch (error) {
      console.error('Server error occurred while email subscribing:', error);
      return 'Server error occurred. Please try again later';
    }
  }
};

export const fetchSubscribe = new FetchSubscribe();
