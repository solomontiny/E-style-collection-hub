export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  category: string;
  image_url: string;
  images: string[];
  sizes: string[];
  colors: string[];
  in_stock: boolean;
  featured: boolean;
  created_at: string;
}

export interface CartItem {
  product: Product;
  quantity: number;
  size: string;
  color: string;
}

export interface Order {
  id: string;
  email: string;
  full_name: string;
  address: string;
  city: string;
  postal_code: string;
  country: string;
  phone?: string;
  total: number;
  status: string;
  created_at: string;
}

export interface Profile {
  id: string;
  email: string;
  full_name: string;
  role: 'admin' | 'customer';
  phone: string;
  created_at: string;
}

export interface OrderItem {
  id: string;
  order_id: string;
  product_id: string;
  product_name: string;
  quantity: number;
  price: number;
  size: string;
  color: string;
  created_at: string;
}
