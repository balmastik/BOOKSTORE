import { SubscribeApi, SubscribeApiResponse } from '../interfaces/api';

class FetchSubscribe implements SubscribeApi {
  async subscribe(email: string): Promise<string> {
    try {
      const res = await fetch('http://localhost:3000/api/subscriber', {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({ email }),
      });
      const data: SubscribeApiResponse = await res.json();

      if (data.success) {
        return data.message;
      } else {
        console.error('Error subscribing email:', data.error);
        return data.error || 'Unknown error occurred while subscribing';
      }
    } catch (error) {
      console.error('Error while email subscription:', error);
      return 'Server error occurred while subscribing email. Please try again later';
    }
  }
};

export const fetchSubscribe = new FetchSubscribe();
