# Quick Reference: Database Syncing Setup

## 🎯 What You Get
Products and Banners from your admin dashboard are **automatically saved** to a real database.

## ⚡ 3-Step Setup

### Step 1: Create Neon Database
- Go to https://console.neon.tech
- Create project (free tier available)
- Copy `DATABASE_URL`

### Step 2: Add Environment Variable
```
.env.local (local dev):
DATABASE_URL=postgresql://...

Netlify (production):
Settings → Build & deploy → Environment → Add DATABASE_URL
```

### Step 3: Create Database Tables
Copy-paste this SQL into Neon Console:
```sql
CREATE TABLE IF NOT EXISTS products (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  category TEXT NOT NULL,
  description TEXT,
  specs JSONB,
  price DECIMAL(10,2),
  purchasePrice DECIMAL(10,2),
  stock INTEGER,
  image TEXT,
  createdAt TIMESTAMP DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS hero_content (
  id SERIAL PRIMARY KEY,
  title TEXT,
  description TEXT,
  ctaText TEXT,
  imageUrl TEXT,
  updatedAt TIMESTAMP DEFAULT NOW()
);

INSERT INTO hero_content VALUES (1, 'Welcome', 'Description', 'Button', 'https://example.com/image.jpg');
```

## 📋 How It Works

```
Admin Dashboard Update
         ↓
   Auto Save (No Button!)
         ↓
   Neon Database
         ↓
Website Reloads = Shows Latest
```

## 🧪 Test It

1. **Local**: `npm run dev` → Edit product → Check console for `[DB] Synced`
2. **Live**: Deploy → Edit product → Refresh public site → See changes

## 📁 Files Changed

**New:**
- `services/database.ts` - Database operations
- `netlify/functions/sync-data.ts` - API endpoint
- `NEON_SETUP.md` - Full setup guide
- `AUTOMATIC_SAVING.md` - Implementation details

**Updated:**
- `services/api.ts` - Database integration
- `netlify.toml` - Function configuration
- `package.json` - Dependencies

## 🔧 Troubleshooting

| Problem | Solution |
|---------|----------|
| "Cannot find @neondatabase/serverless" | `npm install && npm install` |
| Products don't sync | Check DATABASE_URL is set |
| Build fails | Run `npm run build` to see exact error |
| Changes not live | Ensure tables exist in Neon |

## 🚀 Deploy

```bash
git add .
git commit -m "Add auto database saving"
git push
# Netlify auto-deploys!
```

## ✅ Verify Working

In **Neon Console**:
```sql
SELECT COUNT(*) FROM products; -- Should see your products
SELECT * FROM hero_content; -- Should see your banners
```

---
**All done!** Your dashboard now auto-saves to database. 🎉
