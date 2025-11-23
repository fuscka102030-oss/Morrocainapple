/**
 * Netlify Serverless Function for data syncing
 * Path: netlify/functions/sync-data.ts
 * 
 * This function handles GET and POST requests for data persistence
 * It communicates directly with the Neon database via the serverless client
 */

import { Handler } from '@netlify/functions';
import * as db from '../../services/database';

interface RequestBody {
  products?: any[];
  users?: any[];
  orders?: any[];
  heroContent?: any;
}

export const handler: Handler = async (event) => {
  // Enable CORS
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
    'Content-Type': 'application/json'
  };

  // Handle CORS preflight
  if (event.httpMethod === 'OPTIONS') {
    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({ message: 'OK' })
    };
  }

  try {
    // GET: Fetch all data
    if (event.httpMethod === 'GET') {
      console.log('[Netlify Function] GET /sync-data');

      const [products, users, orders, heroContent] = await Promise.all([
        db.getAllProducts().catch(err => {
          console.warn('Error fetching products:', err);
          return [];
        }),
        db.getAllUsers().catch(err => {
          console.warn('Error fetching users:', err);
          return [];
        }),
        db.getAllOrders().catch(err => {
          console.warn('Error fetching orders:', err);
          return [];
        }),
        db.getHeroContent().catch(err => {
          console.warn('Error fetching hero content:', err);
          return null;
        })
      ]);

      return {
        statusCode: 200,
        headers,
        body: JSON.stringify({
          products: products || [],
          users: users || [],
          orders: orders || [],
          heroContent: heroContent || { title: '', description: '', ctaText: '', imageUrl: '' },
          lastUpdated: new Date().toISOString()
        })
      };
    }

    // POST: Sync/save data
    if (event.httpMethod === 'POST') {
      console.log('[Netlify Function] POST /sync-data');

      const body: RequestBody = JSON.parse(event.body || '{}');

      // Save products
      if (body.products && Array.isArray(body.products)) {
        console.log(`Syncing ${body.products.length} products...`);
        await db.syncProducts(body.products);
      }

      // Save hero content
      if (body.heroContent) {
        console.log('Updating hero content...');
        await db.updateHeroContent(body.heroContent);
      }

      // Note: For users and orders, you might want to implement similar sync functions
      // This example focuses on products and hero content

      return {
        statusCode: 200,
        headers,
        body: JSON.stringify({
          success: true,
          message: 'Data synced successfully',
          timestamp: new Date().toISOString()
        })
      };
    }

    return {
      statusCode: 405,
      headers,
      body: JSON.stringify({ error: 'Method not allowed' })
    };
  } catch (error) {
    console.error('[Netlify Function] Error:', error);
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({
        error: 'Internal server error',
        message: error instanceof Error ? error.message : 'Unknown error'
      })
    };
  }
};
