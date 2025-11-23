const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');

// Load environment variables
dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// ============ CORS CONFIGURATION ============
// Allow Netlify frontend to communicate with this backend
app.use(cors({
  origin: '*', // Allow ALL origins (Netlify + everything else)
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true
}));

// Preflight requests
app.options('*', cors());

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Logging middleware
app.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.path}`);
  next();
});

// ============ IN-MEMORY DATABASE ============
// This stores your data. Replace with real DB later.
let DATABASE = {
  products: [],
  users: [],
  orders: [],
  heroContent: {
    title: 'Welcome to Moroccan Apple',
    description: 'Discover premium Apple products',
    ctaText: 'Shop Now',
    imageUrl: 'https://via.placeholder.com/1200x600'
  },
  lastUpdated: new Date().toISOString()
};

// ============ API ROUTES ============

/**
 * GET /api/sync-data
 * Fetch all data
 */
app.get('/api/sync-data', (req, res) => {
  console.log('[API] GET /api/sync-data');
  res.status(200).json({
    ...DATABASE,
    lastUpdated: new Date().toISOString()
  });
});

/**
 * POST /api/sync-data
 * Save all data
 */
app.post('/api/sync-data', (req, res) => {
  console.log('[API] POST /api/sync-data');
  
  try {
    const { products, users, orders, heroContent } = req.body;

    // Validate data structure
    if (!products || !Array.isArray(products)) {
      return res.status(400).json({ error: 'Invalid data structure: products must be an array' });
    }

    // Update database
    DATABASE = {
      products: products || [],
      users: users || [],
      orders: orders || [],
      heroContent: heroContent || DATABASE.heroContent,
      lastUpdated: new Date().toISOString()
    };

    console.log(`[API] Saved ${products.length} products, ${users.length} users, ${orders.length} orders`);

    res.status(200).json({
      success: true,
      message: 'Data saved successfully',
      timestamp: DATABASE.lastUpdated
    });
  } catch (error) {
    console.error('[API] Error saving data:', error);
    res.status(500).json({ 
      error: 'Failed to save data',
      message: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

/**
 * GET /api/products
 * Fetch all products
 */
app.get('/api/products', (req, res) => {
  console.log('[API] GET /api/products');
  res.status(200).json(DATABASE.products || []);
});

/**
 * POST /api/products
 * Create new product
 */
app.post('/api/products', (req, res) => {
  console.log('[API] POST /api/products');
  
  try {
    const newProduct = {
      id: `p${Date.now()}`,
      ...req.body,
      createdAt: new Date().toISOString()
    };

    DATABASE.products.push(newProduct);
    DATABASE.lastUpdated = new Date().toISOString();

    res.status(201).json(newProduct);
  } catch (error) {
    console.error('[API] Error creating product:', error);
    res.status(500).json({ error: 'Failed to create product' });
  }
});

/**
 * PUT /api/products/:id
 * Update product
 */
app.put('/api/products/:id', (req, res) => {
  console.log(`[API] PUT /api/products/${req.params.id}`);
  
  try {
    const productIndex = DATABASE.products.findIndex(p => p.id === req.params.id);
    
    if (productIndex === -1) {
      return res.status(404).json({ error: 'Product not found' });
    }

    DATABASE.products[productIndex] = {
      ...DATABASE.products[productIndex],
      ...req.body,
      id: req.params.id, // Don't allow changing ID
      updatedAt: new Date().toISOString()
    };

    DATABASE.lastUpdated = new Date().toISOString();

    res.status(200).json(DATABASE.products[productIndex]);
  } catch (error) {
    console.error('[API] Error updating product:', error);
    res.status(500).json({ error: 'Failed to update product' });
  }
});

/**
 * DELETE /api/products/:id
 * Delete product
 */
app.delete('/api/products/:id', (req, res) => {
  console.log(`[API] DELETE /api/products/${req.params.id}`);
  
  try {
    const productIndex = DATABASE.products.findIndex(p => p.id === req.params.id);
    
    if (productIndex === -1) {
      return res.status(404).json({ error: 'Product not found' });
    }

    const deleted = DATABASE.products.splice(productIndex, 1);
    DATABASE.lastUpdated = new Date().toISOString();

    res.status(200).json({ 
      success: true, 
      message: 'Product deleted',
      deleted: deleted[0]
    });
  } catch (error) {
    console.error('[API] Error deleting product:', error);
    res.status(500).json({ error: 'Failed to delete product' });
  }
});

/**
 * GET /api/hero
 * Fetch hero content
 */
app.get('/api/hero', (req, res) => {
  console.log('[API] GET /api/hero');
  res.status(200).json(DATABASE.heroContent);
});

/**
 * PUT /api/hero
 * Update hero content
 */
app.put('/api/hero', (req, res) => {
  console.log('[API] PUT /api/hero');
  
  try {
    DATABASE.heroContent = {
      ...DATABASE.heroContent,
      ...req.body
    };

    DATABASE.lastUpdated = new Date().toISOString();

    res.status(200).json(DATABASE.heroContent);
  } catch (error) {
    console.error('[API] Error updating hero:', error);
    res.status(500).json({ error: 'Failed to update hero content' });
  }
});

/**
 * Health check
 */
app.get('/health', (req, res) => {
  res.status(200).json({ 
    status: 'OK', 
    timestamp: new Date().toISOString(),
    uptime: process.uptime()
  });
});

/**
 * Root endpoint
 */
app.get('/', (req, res) => {
  res.status(200).json({
    message: 'Moroccan Apple Backend API',
    version: '1.0.0',
    endpoints: {
      data: '/api/sync-data (GET/POST)',
      products: '/api/products (GET/POST/PUT/DELETE)',
      hero: '/api/hero (GET/PUT)',
      health: '/health'
    }
  });
});

// ============ ERROR HANDLING ============

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    error: 'Not Found',
    path: req.path
  });
});

// Error handler
app.use((err, req, res, next) => {
  console.error('[ERROR]', err);
  res.status(500).json({
    error: 'Internal Server Error',
    message: err.message
  });
});

// ============ START SERVER ============

const server = app.listen(PORT, '0.0.0.0', () => {
  console.log(`
╔════════════════════════════════════════╗
║  Moroccan Apple Backend API            ║
║  Server running on port ${PORT}              ║
║  CORS enabled for all origins          ║
╚════════════════════════════════════════╝
  `);
  console.log(`Health check: http://localhost:${PORT}/health`);
  console.log(`API Docs: http://localhost:${PORT}/`);
});

// Graceful shutdown
process.on('SIGTERM', () => {
  console.log('SIGTERM signal received: closing HTTP server');
  server.close(() => {
    console.log('HTTP server closed');
  });
});

module.exports = app;
