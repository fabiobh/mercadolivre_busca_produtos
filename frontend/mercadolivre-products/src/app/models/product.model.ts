export interface Product {
  id?: number;
  title: string;
  price: number;
  permalink: string;
  thumbnail: string;
  query: string;
  created_at?: string;
  hide?: boolean;
  alert_submitted?: boolean;
}