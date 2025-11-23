
import { DatabaseSchema, Product, User, Order, HeroContent } from '../types';
import { INITIAL_PRODUCTS, INITIAL_USERS, INITIAL_ORDERS, INITIAL_HERO_CONTENT } from '../constants';
import * as db from './database';

// Configuration for the API Endpoint
// In production, set to your Render backend URL via Vite environment variables
const API_ENDPOINT = (import.meta.env.VITE_API_URL as string) || 'http://localhost:5000/api/sync-data';

console.log('[API] Debug: Using endpoint:', API_ENDPOINT);

/**
 * Fetches data from Backend (Render) - NO MOCK DATA FALLBACK
 * Either returns real data or throws error
 */
export const fetchGlobalData = async (): Promise<DatabaseSchema> => {
  console.log(`[API] Fetching data from ${API_ENDPOINT}...`);

  try {
    const response = await fetch(API_ENDPOINT, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
      mode: 'cors',
      credentials: 'omit'
    });

    if (!response.ok) {
      throw new Error(`Backend returned ${response.status}: ${response.statusText}`);
    }

    const data = await response.json();
    console.log('[API] ✅ Data fetched from backend successfully');
    
    return data;
  } catch (error) {
    const errorMsg = error instanceof Error ? error.message : String(error);
    console.error('[API] ❌ FAILED to fetch from backend:', errorMsg);
    throw new Error(`Cannot connect to backend: ${errorMsg}`);
  }
};

/**
 * Sends data to Backend (Render) - NO SILENT FAILURES
 * Either saves successfully or throws error
 */
export const updateGlobalData = async (data: DatabaseSchema): Promise<void> => {
  const payload = {
    ...data,
    lastUpdated: new Date().toISOString()
  };

  console.log(`[API] Syncing data to ${API_ENDPOINT}...`, { 
    productCount: payload.products.length, 
    userCount: payload.users.length,
    orderCount: payload.orders.length
  });

  try {
    const response = await fetch(API_ENDPOINT, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
      mode: 'cors',
      credentials: 'omit'
    });

    if (!response.ok) {
      throw new Error(`Backend returned ${response.status}: ${response.statusText}`);
    }

    const result = await response.json();
    console.log('[API] ✅ Data synced to backend successfully:', result);
  } catch (error) {
    const errorMsg = error instanceof Error ? error.message : String(error);
    console.error('[API] ❌ FAILED to sync to backend:', errorMsg);
    throw new Error(`Cannot sync to backend: ${errorMsg}`);
  }
};
