export interface SubscriberApi {
  subscribe(email: string): Promise<string>;
}

export interface SubscriberApiResponse {
  success: boolean;
  message: string;
  error?: string;
}
