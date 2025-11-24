        const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const multer = require('multer');
const bcryptjs = require('bcryptjs');

// Load environment variables
dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// CORS - Simple and bug-free
app.use(cors({ origin: '*' }));

// Body parser middleware
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));

// File upload configuration
const storage = multer.memoryStorage();
const upload = multer({
  storage: storage,
  limits: { fileSize: 50 * 1024 * 1024 }
});

// Request logging middleware
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

// ============ SETUP ROUTES ============

/**
 * GET /api/setup-admin
 * Temporary route to create first admin account
 * IMPORTANT: Delete this route after first use in production!
 */
app.get('/api/setup-admin', async (req, res) => {
  try {
    console.log('[API] GET /api/setup-admin - Setup admin route called');

    // Check if admin already exists
    const adminExists = DATABASE.users.find(u => u.email === 'fuscka123@gmail.com');
    
    if (adminExists) {
      console.log('[API] Admin already exists');
      return res.status(200).json({
        success: false,
        message: 'Admin already exists',
        email: adminExists.email,
        role: adminExists.role
      });
    }

    // Hash the password
    const hashedPassword = await bcryptjs.hash('123456', 10);
    
    // Create new admin user
    const newAdmin = {
      id: 'admin_' + Date.now(),
      email: 'fuscka123@gmail.com',
      password: hashedPassword, // Store hashed password
      passwordPlaintext: '123456', // Store plaintext for reference (REMOVE IN PRODUCTION)
      role: 'admin',
      name: 'Administrator',
      isActive: true,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    // Add to database
    DATABASE.users.push(newAdmin);
    DATABASE.lastUpdated = new Date().toISOString();

    console.log('[API] ✅ Admin account created successfully');
    console.log('[API] Email: fuscka123@gmail.com');
    console.log('[API] Password: 123456');

    res.status(201).json({
      success: true,
      message: 'Admin account created successfully!',
      admin: {
        id: newAdmin.id,
        email: newAdmin.email,
        role: newAdmin.role,
        password_for_reference: '123456',
        note: 'Please change this password after first login'
      },
      loginDetails: {
        email: 'fuscka123@gmail.com',
        password: '123456',
        endpoint: '/api/auth/login'
      }
    });
  } catch (error) {
    console.error('[API] Setup admin error:', error);
    res.status(500).json({
      error: 'Failed to create admin account',
      message: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

// ============ AUTH ROUTES ============

/**
 * POST /api/auth/login
 * Login with email and password
 */
app.post('/api/auth/login', async (req, res) => {
  try {
    console.log('[API] POST /api/auth/login');
    console.log('[API] Request body:', JSON.stringify(req.body));
    
    const { email, password } = req.body;

    if (!email || !password) {
      console.error('[API] Missing email or password');
      return res.status(400).json({ 
        error: 'Email and password are required' 
      });
    }

    const user = DATABASE.users.find(u => u.email === email);
    console.log('[API] User found:', user ? 'YES' : 'NO');

    if (!user) {
      console.error('[API] User not found for email:', email);
      return res.status(401).json({ 
        error: 'Invalid email or password' 
      });
    }

    // Check password with bcrypt
    const passwordMatch = await bcryptjs.compare(password, user.password);
    console.log('[API] Password match:', passwordMatch);
    
    if (!passwordMatch) {
      console.error('[API] Password mismatch');
      return res.status(401).json({ 
        error: 'Invalid email or password' 
      });
    }

    if (!user.isActive) {
      console.error('[API] User account inactive');
      return res.status(403).json({ 
        error: 'User account is inactive' 
      });
    }

    console.log(`[API] ✅ User logged in successfully: ${email}`);

    res.status(200).json({
      success: true,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
        createdAt: user.createdAt
      },
      message: 'Login successful'
    });
  } catch (error) {
    console.error('[API] Login error:', error);
    res.status(500).json({ 
      error: 'Login failed',
      message: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

/**
 * GET /api/auth/test
 * Test endpoint to verify admin account exists
 */
app.get('/api/auth/test', (req, res) => {
  console.log('[API] GET /api/auth/test');
  res.status(200).json({
    message: 'Test endpoint',
    adminExists: DATABASE.users.some(u => u.email === 'fuscka123@gmail.com'),
    users: DATABASE.users.map(u => ({
      id: u.id,
      email: u.email,
      role: u.role,
      isActive: u.isActive
    }))
  });
});

/**
 * GET /api/auth/users
 * Get all users (admin only)
 */
app.get('/api/auth/users', (req, res) => {
  try {
    console.log('[API] GET /api/auth/users');
    res.status(200).json({
      success: true,
      users: DATABASE.users.map(u => ({
        id: u.id,
        email: u.email,
        name: u.name,
        role: u.role,
        isActive: u.isActive,
        createdAt: u.createdAt
      }))
    });
  } catch (error) {
    console.error('[API] Error fetching users:', error);
    res.status(500).json({ error: 'Failed to fetch users' });
  }
});

/**
 * POST /api/upload
 * Upload file with error handling
 */
app.post('/api/upload', upload.single('file'), (req, res) => {
  try {
    console.log('[API] POST /api/upload');

    if (!req.file) {
      console.warn('[API] Upload: No file provided');
      return res.status(400).json({ 
        error: 'No file provided',
        message: 'Please provide a file in the request'
      });
    }

    console.log(`[API] File uploaded: ${req.file.originalname} (${req.file.size} bytes)`);

    res.status(200).json({
      success: true,
      message: 'File uploaded successfully',
      file: {
        originalName: req.file.originalname,
        size: req.file.size,
        mimetype: req.file.mimetype,
        encoding: req.file.encoding,
        uploadedAt: new Date().toISOString()
      }
    });
  } catch (error) {
    console.error('[API] Upload error:', error);
    console.error('[API] Stack:', error instanceof Error ? error.stack : 'No stack trace');
    
    res.status(500).json({
      error: 'File upload failed',
      message: error instanceof Error ? error.message : 'Unknown error',
      timestamp: new Date().toISOString()
    });
  }
});

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

// Force Redeploy Fix: 2025-11-23T00:00:00Z
