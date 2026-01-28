
export interface Product {
  id: string;
  name: string;
  category: string;
  price: number;
  weight: string;
  image: string;
  grade: 'Premium' | 'Standard' | 'Reserve';
  origin: string;
  description: string;
}

export interface CartItem extends Product {
  quantity: number;
}

export enum Page {
  Home = 'home',
  Shop = 'shop',
  ProductDetail = 'product-detail',
  Cart = 'cart'
}
