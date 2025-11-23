
export enum UserRole {
  ADMIN = 'admin',
  RESELLER = 'reseller',
  CUSTOMER = 'customer'
}

export interface User {
  id: string;
  name: string;
  email: string;
  password?: string; 
  role: UserRole;
  discountRate?: number; 
  totalPurchases?: number;
  isActive: boolean;
}

export interface Product {
  id: string;
  name: string;
  category: 'iPhone' | 'MacBook' | 'iPad' | 'Watch' | 'AirPods';
  description: string;
  specs: string[];
  price: number; 
  purchasePrice?: number; 
  stock: number;
  image: string;
}

export interface HeroContent {
  title: string;
  description: string;
  ctaText: string;
  imageUrl: string;
}

export enum OrderStatus {
  PENDING = 'En Attente',
  PROCESSING = 'En Cours',
  DELIVERED = 'Livrée',
  CANCELLED = 'Annulée'
}

export interface CartItem {
  productId: string;
  quantity: number;
}

export interface Order {
  id: string;
  userId: string; 
  userName: string;
  items: {
    productId: string;
    productName: string;
    quantity: number;
    unitPrice: number; 
    total: number;
  }[];
  totalAmount: number;
  status: OrderStatus;
  date: string;
}

// New Interface for Global Data Persistence
export interface DatabaseSchema {
  products: Product[];
  users: User[];
  orders: Order[];
  heroContent: HeroContent;
  lastUpdated: string;
}
