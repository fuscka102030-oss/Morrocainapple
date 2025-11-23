
import React, { createContext, useContext, useState, useEffect } from 'react';
import { Product, User, Order, UserRole, CartItem, OrderStatus, HeroContent, DatabaseSchema } from '../types';
import { RESELLER_DISCOUNT } from '../constants';
import { fetchGlobalData, updateGlobalData } from '../services/api';

interface AppContextType {
  products: Product[];
  users: User[];
  orders: Order[];
  heroContent: HeroContent;
  currentUser: User | null;
  cart: CartItem[];
  theme: 'light' | 'dark';
  isLoading: boolean; // New global loading state
  
  // Auth
  login: (email: string, password: string) => User | null;
  logout: () => void;
  
  // Product Actions (Admin)
  addProduct: (product: Omit<Product, 'id'>) => void;
  updateProduct: (product: Product) => void;
  deleteProduct: (id: string) => void;
  
  // Order Actions
  placeOrder: (userId: string, userName: string, items: {productId: string, qty: number}[]) => void;
  updateOrderStatus: (orderId: string, status: OrderStatus) => void;
  
  // User Actions (Admin)
  addUser: (user: Omit<User, 'id' | 'isActive'>) => void;
  deleteUser: (id: string) => void;
  toggleUserStatus: (id: string) => void;
  
  // Site Actions (Admin)
  updateHeroContent: (content: HeroContent) => void;
  
  // Cart Actions (Public)
  addToCart: (productId: string, qty: number) => void;
  removeFromCart: (productId: string) => void;
  clearCart: () => void;
  
  // UI Helpers
  toggleTheme: () => void;
  getProductById: (id: string) => Product | undefined;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // State initialization - Starts empty, filled by API
  const [products, setProducts] = useState<Product[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [heroContent, setHeroContent] = useState<HeroContent>({
    title: '', description: '', ctaText: '', imageUrl: ''
  });
  
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [theme, setTheme] = useState<'light' | 'dark'>('light');
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [cart, setCart] = useState<CartItem[]>([]);

  // 1. Initial Data Fetch (GET) from Serverless Function
  useEffect(() => {
    const loadData = async () => {
      setIsLoading(true);
      try {
        const data = await fetchGlobalData();
        setProducts(data.products);
        setUsers(data.users);
        setOrders(data.orders);
        setHeroContent(data.heroContent);
      } catch (error) {
        console.error("Failed to load global data", error);
      } finally {
        setIsLoading(false);
      }
    };
    loadData();
  }, []);

  // 2. Data Sync Helper (POST) to Serverless Function
  // We call this whenever we change state that needs persistence
  const syncData = async (newProducts: Product[], newUsers: User[], newOrders: Order[], newHero: HeroContent) => {
    const payload: DatabaseSchema = {
      products: newProducts,
      users: newUsers,
      orders: newOrders,
      heroContent: newHero,
      lastUpdated: new Date().toISOString()
    };
    
    // Optimistic update: we don't await this for UI, but we trigger it
    updateGlobalData(payload).catch(err => console.error("Sync failed", err));
  };

  // Theme Effect (Local preference is okay to keep in localStorage, but for strictness we can mock it)
  useEffect(() => {
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [theme]);

  const toggleTheme = () => {
    setTheme(prev => prev === 'light' ? 'dark' : 'light');
  };

  // --- Auth ---
  const login = (email: string, password: string) => {
    const user = users.find(u => 
      u.email.toLowerCase() === email.toLowerCase().trim() && 
      u.password === password && 
      u.isActive
    );
    if (user) {
      setCurrentUser(user);
      return user;
    }
    return null;
  };

  const logout = () => {
    setCurrentUser(null);
    setCart([]);
  };

  // --- Products ---
  const addProduct = (newProduct: Omit<Product, 'id'>) => {
    const id = `p${Date.now()}`;
    const updatedProducts = [...products, { ...newProduct, id }];
    setProducts(updatedProducts);
    syncData(updatedProducts, users, orders, heroContent);
  };

  const updateProduct = (updatedProduct: Product) => {
    const updatedProducts = products.map(p => p.id === updatedProduct.id ? updatedProduct : p);
    setProducts(updatedProducts);
    syncData(updatedProducts, users, orders, heroContent);
  };

  const deleteProduct = (id: string) => {
    const updatedProducts = products.filter(p => p.id !== id);
    setProducts(updatedProducts);
    syncData(updatedProducts, users, orders, heroContent);
  };

  const getProductById = (id: string) => products.find(p => p.id === id);

  // --- Orders ---
  const placeOrder = (userId: string, userName: string, orderItems: {productId: string, qty: number}[]) => {
    const isReseller = currentUser?.role === UserRole.RESELLER;
    
    let totalAmount = 0;
    // Clone products to update stock
    let currentProducts = [...products];

    const finalItems = orderItems.map(item => {
      const productIndex = currentProducts.findIndex(p => p.id === item.productId);
      if (productIndex === -1) throw new Error("Product not found");
      
      const product = currentProducts[productIndex];
      const price = isReseller ? product.price * (1 - RESELLER_DISCOUNT) : product.price;
      const lineTotal = price * item.qty;
      totalAmount += lineTotal;
      
      // Update Stock locally in the clone
      const newStock = product.stock - item.qty;
      currentProducts[productIndex] = { ...product, stock: newStock >= 0 ? newStock : 0 };

      return {
        productId: product.id,
        productName: product.name,
        quantity: item.qty,
        unitPrice: price,
        total: lineTotal
      };
    });

    const newOrder: Order = {
      id: `ord-${Date.now()}`,
      userId,
      userName,
      items: finalItems,
      totalAmount,
      status: OrderStatus.PENDING,
      date: new Date().toISOString()
    };

    const updatedOrders = [newOrder, ...orders];
    
    // Update reseller stats
    let updatedUsers = [...users];
    if (isReseller && currentUser) {
        const updatedUser = { ...currentUser, totalPurchases: (currentUser.totalPurchases || 0) + totalAmount };
        updatedUsers = users.map(u => u.id === updatedUser.id ? updatedUser : u);
        setCurrentUser(updatedUser);
    }

    setOrders(updatedOrders);
    setProducts(currentProducts);
    setUsers(updatedUsers);

    syncData(currentProducts, updatedUsers, updatedOrders, heroContent);
  };

  const updateOrderStatus = (orderId: string, status: OrderStatus) => {
    const updatedOrders = orders.map(o => o.id === orderId ? { ...o, status } : o);
    setOrders(updatedOrders);
    syncData(products, users, updatedOrders, heroContent);
  };

  // --- Users ---
  const addUser = (userData: Omit<User, 'id' | 'isActive'>) => {
    const newUser: User = {
      ...userData,
      id: `u-${Date.now()}`,
      totalPurchases: 0,
      isActive: true,
      discountRate: userData.role === UserRole.RESELLER ? RESELLER_DISCOUNT : undefined
    };
    const updatedUsers = [...users, newUser];
    setUsers(updatedUsers);
    syncData(products, updatedUsers, orders, heroContent);
  };

  const deleteUser = (id: string) => {
    const updatedUsers = users.filter(u => u.id !== id);
    setUsers(updatedUsers);
    syncData(products, updatedUsers, orders, heroContent);
  };

  const toggleUserStatus = (id: string) => {
    const updatedUsers = users.map(u => u.id === id ? { ...u, isActive: !u.isActive } : u);
    setUsers(updatedUsers);
    syncData(products, updatedUsers, orders, heroContent);
  };

  // --- Site Management ---
  const updateHeroContent = (content: HeroContent) => {
    setHeroContent(content);
    syncData(products, users, orders, content);
  };

  // --- Cart ---
  const addToCart = (productId: string, qty: number) => {
    setCart(prev => {
      const existing = prev.find(item => item.productId === productId);
      if (existing) {
        return prev.map(item => item.productId === productId ? { ...item, quantity: item.quantity + qty } : item);
      }
      return [...prev, { productId, quantity: qty }];
    });
  };

  const removeFromCart = (productId: string) => {
    setCart(prev => prev.filter(item => item.productId !== productId));
  };

  const clearCart = () => setCart([]);

  return (
    <AppContext.Provider value={{
      products, users, orders, currentUser, cart, heroContent, theme, isLoading,
      login, logout,
      addProduct, updateProduct, deleteProduct,
      placeOrder, updateOrderStatus,
      addUser, deleteUser, toggleUserStatus,
      updateHeroContent,
      addToCart, removeFromCart, clearCart, getProductById,
      toggleTheme
    }}>
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) throw new Error("useApp must be used within AppProvider");
  return context;
};
