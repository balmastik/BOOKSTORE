import {SubscriberApi, SubscriberApiResponse} from './subscriberInterface';

const API_URL = process.env.REACT_APP_API_URL;

class SubscriberServiceImpl implements SubscriberApi {

  public async subscribe(email: string): Promise<string> {
    try {
      const res = await fetch(`${API_URL}/api/subscriber`, {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({email})
      });

      const data: SubscriberApiResponse = await res.json();
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

export const subscriberServiceImpl = new SubscriberServiceImpl();
