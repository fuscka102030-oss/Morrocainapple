# Neon Database Setup Guide

## Overview
This guide helps you set up the Neon PostgreSQL database for automatic product and banner updates.

## 1. Create a Neon Database

1. Go to [console.neon.tech](https://console.neon.tech)
2. Create a new project
3. Copy your `DATABASE_URL` connection string

## 2. Set Environment Variables

### Local Development
Create a `.env.local` file:
```
DATABASE_URL=postgresql://user:password@ep-xxxxx.us-east-1.neon.tech/dbname?sslmode=require
```

### Netlify Deployment
1. Go to your Netlify site → Settings → Build & deploy → Environment
2. Add a new variable:
   - **Key**: `DATABASE_URL`
   - **Value**: Your Neon connection string

## 3. Create Database Tables

Run these SQL queries in your Neon console:

### Products Table
```sql
CREATE TABLE IF NOT EXISTS products (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  category TEXT NOT NULL,
  description TEXT,
  specs JSONB DEFAULT '[]',
  price DECIMAL(10, 2) NOT NULL,
  purchasePrice DECIMAL(10, 2),
  stock INTEGER DEFAULT 0,
  image TEXT,
  createdAt TIMESTAMP DEFAULT NOW(),
  updatedAt TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_products_category ON products(category);
CREATE INDEX idx_products_stock ON products(stock);
```

### Hero Content Table
```sql
CREATE TABLE IF NOT EXISTS hero_content (
  id SERIAL PRIMARY KEY,
  title TEXT,
  description TEXT,
  ctaText TEXT,
  imageUrl TEXT,
  updatedAt TIMESTAMP DEFAULT NOW()
);

-- Insert default row
INSERT INTO hero_content (title, description, ctaText, imageUrl) 
VALUES ('Welcome', 'Discover our products', 'Shop Now', 'https://example.com/banner.jpg')
ON CONFLICT (id) DO NOTHING;
```

### Users Table
```sql
CREATE TABLE IF NOT EXISTS users (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT UNIQUE NOT NULL,
  password TEXT,
  role TEXT DEFAULT 'customer',
  isActive BOOLEAN DEFAULT true,
  totalPurchases DECIMAL(10, 2) DEFAULT 0,
  createdAt TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_users_email ON users(email);
```

### Orders Table
```sql
CREATE TABLE IF NOT EXISTS orders (
  id TEXT PRIMARY KEY,
  userId TEXT NOT NULL,
  userName TEXT,
  items JSONB,
  totalAmount DECIMAL(10, 2) NOT NULL,
  status TEXT DEFAULT 'En Attente',
  date TIMESTAMP DEFAULT NOW(),
  FOREIGN KEY (userId) REFERENCES users(id) ON DELETE CASCADE
);

CREATE INDEX idx_orders_userId ON orders(userId);
CREATE INDEX idx_orders_date ON orders(date DESC);
```

## 4. How It Works

### Automatic Saving Flow:

1. **Admin Dashboard** → Product/Banner Update
2. **AppContext** → Triggers `syncData()`
3. **API Service** (`services/api.ts`) → Calls `updateGlobalData()`
4. **Database Service** (`services/database.ts`) → Executes SQL via Neon
5. **Neon Database** → Data persisted
6. **Website** → Fetches fresh data on reload (from database)

### Real-time Updates:

When you update a product in the admin dashboard:
- Change is **immediately reflected** in the UI
- Change is **automatically saved** to Neon database
- Change appears **online instantly** when visitors reload

## 5. Testing Locally

```bash
# Install dependencies (if not done)
npm install

# Run development server
npm run dev

# Make a product/banner update in admin dashboard
# Check browser console for: "[DB] Synced X products"
```

## 6. Deploy to Netlify

1. Push code to GitHub
2. Connect repo to Netlify
3. Add `DATABASE_URL` environment variable in Netlify settings
4. Deploy!

## Troubleshooting

### "Cannot find module '@neondatabase/serverless'"
```bash
npm install @neondatabase/serverless
npm install
```

### Database connection fails
- Verify `DATABASE_URL` is set in environment variables
- Check Neon console for active connections
- Ensure IP whitelist allows Netlify (or set to allow all)

### Products not syncing
- Check browser console for errors
- Verify database tables exist (run SQL scripts above)
- Check Netlify function logs: Site Settings → Functions

### Slow performance
- Add indexes on frequently queried columns (done in schema above)
- Use Neon's query analytics to identify slow queries
- Consider caching strategies in Netlify functions

## Environment Variables Required

```
DATABASE_URL=postgresql://...
```

That's it! Your products and banners will now be automatically saved to the database.
