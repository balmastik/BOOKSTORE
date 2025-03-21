import SubscribeApi from '../interfaces/Api';

class FetchSubscribe implements SubscribeApi {
  public async subscribe(email: string): Promise<string> {
    try {
      const res = await fetch('http://localhost:3000/api/subscriber', {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({ email }),
      });
      const data = await res.json();

      if (data.success) {
        return data.message;
      } else {
        console.error('Error subscribing email:', data.error);
        throw new Error(data.error);
      }
    } catch (error) {
      console.error('Error while email subscription:', error);
      throw new Error('Server error occurred while subscribing email. Please try again later.');
    }
  }
}

export const fetchSubscribe = new FetchSubscribe();

