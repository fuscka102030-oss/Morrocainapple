
import { Product, User, UserRole, Order, OrderStatus, HeroContent } from './types';

export const RESELLER_DISCOUNT = 0.20; // 20%

export const INITIAL_HERO_CONTENT: HeroContent = {
  title: 'iPhone 15 Pro',
  description: 'L\'iPhone ultime. Forgé en titane. Doté de la puce A17 Pro.',
  ctaText: 'Acheter',
  imageUrl: 'https://images.unsplash.com/photo-1556656793-02715d8dd660?auto=format&fit=crop&q=80&w=2000'
};

export const INITIAL_PRODUCTS: Product[] = [
  {
    id: 'p1',
    name: 'iPhone 15 Pro Max',
    category: 'iPhone',
    description: 'Le titane forge une nouvelle ère. Puce A17 Pro.',
    specs: ['Titane', 'Puce A17 Pro', 'Action Button', 'USB-C'],
    price: 15990,
    purchasePrice: 13000,
    stock: 45,
    image: 'https://images.unsplash.com/photo-1695048133142-1a20484d2569?auto=format&fit=crop&q=80&w=800'
  },
  {
    id: 'p2',
    name: 'MacBook Air M2',
    category: 'MacBook',
    description: 'Incroyablement fin. D\'une rapidité décoiffante.',
    specs: ['Puce M2', '13.6" Liquid Retina', '18h autonomie', 'MagSafe'],
    price: 13490,
    purchasePrice: 11000,
    stock: 8, // Low stock for testing alerts
    image: 'https://images.unsplash.com/photo-1611186871348-b1ce696e52c9?auto=format&fit=crop&q=80&w=800'
  },
  {
    id: 'p3',
    name: 'Apple Watch Ultra 2',
    category: 'Watch',
    description: 'L\'aventure vous appelle. L\'écran le plus lumineux.',
    specs: ['Boîtier Titane 49mm', '100m étanche', 'GPS + Cellular', '36h autonomie'],
    price: 9990,
    purchasePrice: 8000,
    stock: 20,
    image: 'https://images.unsplash.com/photo-1665885925337-8f58ae027515?auto=format&fit=crop&q=80&w=800'
  },
  {
    id: 'p4',
    name: 'iPad Pro 12.9"',
    category: 'iPad',
    description: 'La tablette ultime. Puce M2. Écran XDR.',
    specs: ['Puce M2', 'Écran Mini-LED', 'Face ID', 'Compatible Pencil 2'],
    price: 12500,
    purchasePrice: 10000,
    stock: 15,
    image: 'https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?auto=format&fit=crop&q=80&w=800'
  },
  {
    id: 'p5',
    name: 'AirPods Max',
    category: 'AirPods',
    description: 'Un son haute-fidélité. Une isolation active du bruit.',
    specs: ['Audio Spatial', 'Réduction de bruit', '20h écoute', 'Digital Crown'],
    price: 6500,
    purchasePrice: 4500,
    stock: 30,
    image: 'https://images.unsplash.com/photo-1613040809024-b4ef7ba99bc3?auto=format&fit=crop&q=80&w=800'
  }
];

export const INITIAL_USERS: User[] = [
  {
    id: 'admin-main',
    name: 'Oussama Admin',
    email: 'fuscka123@gmail.com',
    password: 'Oussama1230',
    role: UserRole.ADMIN,
    isActive: true
  }
];

export const INITIAL_ORDERS: Order[] = [
  {
    id: 'ord-1001',
    userId: 'guest',
    userName: 'Client Invité',
    items: [
      { productId: 'p1', productName: 'iPhone 15 Pro Max', quantity: 1, unitPrice: 15990, total: 15990 }
    ],
    totalAmount: 15990,
    status: OrderStatus.DELIVERED,
    date: '2023-10-25T10:00:00Z'
  }
];
