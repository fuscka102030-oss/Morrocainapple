import { neon } from '@neondatabase/serverless';
import { Product, HeroContent } from '../types';

// Initialize Neon client only if DATABASE_URL is available (server-side only)
// In browser environment, these functions won't be called directly
const getDatabaseUrl = () => {
  // Check if we're in Node.js environment (Netlify functions)
  if (typeof process !== 'undefined' && process.env?.DATABASE_URL) {
    return process.env.DATABASE_URL;
  }
  return '';
};

const sql = getDatabaseUrl() ? neon(getDatabaseUrl()) : null;

/**
 * Check if database is available
 */
const isDatabaseAvailable = (): boolean => {
  return sql !== null;
};

/**
 * ========== PRODUCTS ==========
 */

/**
 * Get all products from database
 */
export const getAllProducts = async (): Promise<Product[]> => {
  if (!isDatabaseAvailable()) {
    console.warn('[DB] Database not available, returning empty array');
    return [];
  }
  try {
    const products = await sql!`SELECT * FROM products ORDER BY id DESC`;
    return products as Product[];
  } catch (error) {
    console.error('Error fetching products:', error);
    throw error;
  }
};

/**
 * Get a product by ID
 */
export const getProductById = async (productId: string): Promise<Product | null> => {
  if (!isDatabaseAvailable()) {
    console.warn('[DB] Database not available');
    return null;
  }
  try {
    const [product] = await sql!`SELECT * FROM products WHERE id = ${productId}`;
    return product as Product || null;
  } catch (error) {
    console.error(`Error fetching product with id ${productId}:`, error);
    throw error;
  }
};

/**
 * Create a new product
 */
export const createProduct = async (product: Omit<Product, 'id'>): Promise<Product> => {
  if (!isDatabaseAvailable()) throw new Error('Database not available');
  try {
    const [newProduct] = await sql!`
      INSERT INTO products (name, category, description, specs, price, purchasePrice, stock, image)
      VALUES (${product.name}, ${product.category}, ${product.description}, 
              ${JSON.stringify(product.specs)}, ${product.price}, 
              ${product.purchasePrice || 0}, ${product.stock}, ${product.image})
      RETURNING *
    `;
    return newProduct as Product;
  } catch (error) {
    console.error('Error creating product:', error);
    throw error;
  }
};

/**
 * Update an existing product
 */
export const updateProduct = async (productId: string, product: Partial<Product>): Promise<Product> => {
  if (!isDatabaseAvailable()) throw new Error('Database not available');
  try {
    const [updatedProduct] = await sql!`
      UPDATE products
      SET 
        name = COALESCE(${product.name}, name),
        category = COALESCE(${product.category}, category),
        description = COALESCE(${product.description}, description),
        specs = COALESCE(${product.specs ? JSON.stringify(product.specs) : null}, specs),
        price = COALESCE(${product.price}, price),
        purchasePrice = COALESCE(${product.purchasePrice}, purchasePrice),
        stock = COALESCE(${product.stock}, stock),
        image = COALESCE(${product.image}, image)
      WHERE id = ${productId}
      RETURNING *
    `;
    return updatedProduct as Product;
  } catch (error) {
    console.error(`Error updating product ${productId}:`, error);
    throw error;
  }
};

/**
 * Delete a product
 */
export const deleteProduct = async (productId: string): Promise<{ success: boolean; message: string }> => {
  if (!isDatabaseAvailable()) throw new Error('Database not available');
  try {
    await sql!`DELETE FROM products WHERE id = ${productId}`;
    return { success: true, message: `Product ${productId} deleted` };
  } catch (error) {
    console.error(`Error deleting product ${productId}:`, error);
    throw error;
  }
};

/**
 * Bulk update products (for syncing dashboard changes)
 */
export const syncProducts = async (products: Product[]): Promise<void> => {
  if (!isDatabaseAvailable()) {
    console.warn('[DB] Database not available, skipping sync');
    return;
  }
  try {
    for (const product of products) {
      await sql!`
        INSERT INTO products (id, name, category, description, specs, price, purchasePrice, stock, image)
        VALUES (${product.id}, ${product.name}, ${product.category}, ${product.description},
                ${JSON.stringify(product.specs)}, ${product.price}, ${product.purchasePrice || 0}, 
                ${product.stock}, ${product.image})
        ON CONFLICT (id) DO UPDATE SET
          name = ${product.name},
          category = ${product.category},
          description = ${product.description},
          specs = ${JSON.stringify(product.specs)},
          price = ${product.price},
          purchasePrice = ${product.purchasePrice || 0},
          stock = ${product.stock},
          image = ${product.image}
      `;
    }
    console.log(`[DB] Synced ${products.length} products`);
  } catch (error) {
    console.error('Error syncing products:', error);
    throw error;
  }
};

/**
 * ========== BANNERS / HERO CONTENT ==========
 */

/**
 * Get hero/banner content
 */
export const getHeroContent = async (): Promise<HeroContent | null> => {
  if (!isDatabaseAvailable()) {
    console.warn('[DB] Database not available');
    return null;
  }
  try {
    const [hero] = await sql!`SELECT * FROM hero_content LIMIT 1`;
    return hero as HeroContent || null;
  } catch (error) {
    console.error('Error fetching hero content:', error);
    throw error;
  }
};

/**
 * Update hero/banner content
 */
export const updateHeroContent = async (content: HeroContent): Promise<HeroContent> => {
  if (!isDatabaseAvailable()) throw new Error('Database not available');
  try {
    const [updated] = await sql!`
      INSERT INTO hero_content (title, description, ctaText, imageUrl)
      VALUES (${content.title}, ${content.description}, ${content.ctaText}, ${content.imageUrl})
      ON CONFLICT (id) DO UPDATE SET
        title = ${content.title},
        description = ${content.description},
        ctaText = ${content.ctaText},
        imageUrl = ${content.imageUrl}
      RETURNING *
    `;
    console.log('[DB] Hero content updated');
    return updated as HeroContent;
  } catch (error) {
    console.error('Error updating hero content:', error);
    throw error;
  }
};

/**
 * ========== USERS ==========
 */

/**
 * Get all users
 */
export const getAllUsers = async () => {
  if (!isDatabaseAvailable()) {
    console.warn('[DB] Database not available');
    return [];
  }
  try {
    const users = await sql!`SELECT * FROM users ORDER BY id DESC`;
    return users;
  } catch (error) {
    console.error('Error fetching users:', error);
    throw error;
  }
};

/**
 * Get a user by ID
 */
export const getUserById = async (userId: string) => {
  if (!isDatabaseAvailable()) return null;
  try {
    const [user] = await sql!`SELECT * FROM users WHERE id = ${userId}`;
    return user || null;
  } catch (error) {
    console.error(`Error fetching user ${userId}:`, error);
    throw error;
  }
};

/**
 * Create a new user
 */
export const createUser = async (name: string, email: string, password: string, role: string) => {
  if (!isDatabaseAvailable()) throw new Error('Database not available');
  try {
    const [newUser] = await sql!`
      INSERT INTO users (name, email, password, role, isActive, totalPurchases)
      VALUES (${name}, ${email}, ${password}, ${role}, true, 0)
      RETURNING *
    `;
    return newUser;
  } catch (error) {
    console.error('Error creating user:', error);
    throw error;
  }
};

/**
 * Delete a user
 */
export const deleteUser = async (userId: string) => {
  if (!isDatabaseAvailable()) throw new Error('Database not available');
  try {
    await sql!`DELETE FROM users WHERE id = ${userId}`;
    return { success: true, message: `User ${userId} deleted` };
  } catch (error) {
    console.error(`Error deleting user ${userId}:`, error);
    throw error;
  }
};

/**
 * ========== ORDERS ==========
 */

/**
 * Get all orders
 */
export const getAllOrders = async () => {
  if (!isDatabaseAvailable()) {
    console.warn('[DB] Database not available');
    return [];
  }
  try {
    const orders = await sql!`SELECT * FROM orders ORDER BY date DESC`;
    return orders;
  } catch (error) {
    console.error('Error fetching orders:', error);
    throw error;
  }
};

/**
 * Get orders for a user
 */
export const getOrdersByUserId = async (userId: string) => {
  if (!isDatabaseAvailable()) return [];
  try {
    const orders = await sql!`SELECT * FROM orders WHERE userId = ${userId} ORDER BY date DESC`;
    return orders;
  } catch (error) {
    console.error(`Error fetching orders for user ${userId}:`, error);
    throw error;
  }
};

/**
 * Create a new order
 */
export const createOrder = async (userId: string, userName: string, items: any[], totalAmount: number, status: string) => {
  if (!isDatabaseAvailable()) throw new Error('Database not available');
  try {
    const [newOrder] = await sql!`
      INSERT INTO orders (userId, userName, items, totalAmount, status, date)
      VALUES (${userId}, ${userName}, ${JSON.stringify(items)}, ${totalAmount}, ${status}, NOW())
      RETURNING *
    `;
    return newOrder;
  } catch (error) {
    console.error('Error creating order:', error);
    throw error;
  }
};

/**
 * Update order status
 */
export const updateOrderStatus = async (orderId: string, status: string) => {
  if (!isDatabaseAvailable()) throw new Error('Database not available');
  try {
    const [updated] = await sql!`
      UPDATE orders
      SET status = ${status}
      WHERE id = ${orderId}
      RETURNING *
    `;
    return updated;
  } catch (error) {
    console.error(`Error updating order ${orderId}:`, error);
    throw error;
  }
};


