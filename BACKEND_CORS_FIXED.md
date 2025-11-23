# ✅ CORS & Backend Connection Fixed!

## What Was Fixed

### 1. **CORS Issue Resolved**
Your backend now has CORS enabled for **ALL origins**:
```javascript
app.use(cors({
  origin: '*',
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));
```

### 2. **Backend Server Created** (`server.js`)
Express.js backend with:
- ✅ Full CORS support
- ✅ REST API endpoints
- ✅ In-memory data storage
- ✅ Ready for Render deployment

### 3. **Frontend Connected to Backend**
Updated `services/api.ts` to:
- Try backend first (`fetch` API)
- Fallback to Neon database
- Fallback to mock data
- Works in all environments

---

## Local Development Setup

### Terminal 1: Start Backend
```bash
npm run dev:server
# Server runs on http://localhost:5000
```

### Terminal 2: Start Frontend
```bash
npm run dev
# Frontend runs on http://localhost:5174
```

### Environment Configuration
`.env` file (local development):
```
VITE_API_URL=http://localhost:5000/api/sync-data
```

---

## Backend API Endpoints

All endpoints have **CORS enabled**:

| Endpoint | Method | Purpose |
|----------|--------|---------|
| `/health` | GET | Check if backend is running |
| `/` | GET | API documentation |
| `/api/sync-data` | GET | Fetch all data (products, users, orders, hero) |
| `/api/sync-data` | POST | Save all data |
| `/api/products` | GET | List all products |
| `/api/products` | POST | Create product |
| `/api/products/:id` | PUT | Update product |
| `/api/products/:id` | DELETE | Delete product |
| `/api/hero` | GET | Get hero/banner content |
| `/api/hero` | PUT | Update hero/banner content |

---

## Production Deployment

### Deploy Backend to Render
1. Go to https://render.com
2. Create new Web Service
3. Connect GitHub repository
4. Settings:
   - **Build Command**: `npm install`
   - **Start Command**: `node server.js`
   - **Port**: 5000 (auto-detected)
5. Deploy!

**Your backend URL**: `https://moroccan-apple-backend.onrender.com`

### Update Frontend (Netlify)
1. Settings → Build & deploy → Environment
2. Add variable:
   - **Key**: `VITE_API_URL`
   - **Value**: `https://moroccan-apple-backend.onrender.com/api/sync-data`
3. Redeploy frontend

---

## Architecture

```
┌─────────────────┐
│  Netlify Front  │
│  (React App)    │
└────────┬────────┘
         │
         │ fetch() with CORS
         ▼
┌─────────────────┐
│  Render Backend │
│  (Express API)  │
│  CORS: '*'      │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│  Data Storage   │
│  (Memory/DB)    │
└─────────────────┘
```

---

## Testing Locally

### Test Backend Health
Open browser: http://localhost:5000/health
Should return:
```json
{
  "status": "OK",
  "timestamp": "2025-11-23T...",
  "uptime": 123.45
}
```

### Test Frontend Connection
1. Open http://localhost:5174
2. Check browser console (F12)
3. Look for: `[API] ✅ Data fetched from backend`

### Add a Product
1. Go to admin dashboard
2. Create a new product
3. Check backend logs in terminal
4. Verify data persists on page reload

---

## CORS Explained

**Problem**: Netlify (different domain) → Render (different domain) = CORS error

**Solution**: Backend responds with CORS headers:
```
Access-Control-Allow-Origin: *
Access-Control-Allow-Methods: GET, POST, PUT, DELETE
Access-Control-Allow-Headers: Content-Type
```

This tells the browser: "Yes, Netlify is allowed to fetch data from me!"

---

## File Changes Summary

**New Files:**
- `server.js` - Express backend with CORS
- `.env` - Local environment variables
- `.env.example` - Template for env vars
- `RENDER_NETLIFY_DEPLOYMENT.md` - Detailed deployment guide

**Updated Files:**
- `services/api.ts` - Connect to backend
- `package.json` - Add backend dependencies & scripts

**Updated Dependencies:**
- `express` - Web server
- `cors` - CORS middleware
- `dotenv` - Environment variables

---

## Next Steps

1. ✅ Backend running locally (`npm run dev:server`)
2. ✅ Frontend connects to backend
3. ✅ CORS enabled on backend
4. Deploy backend to Render
5. Update VITE_API_URL in Netlify
6. Test production connection

---

## Troubleshooting

### Frontend shows "Mock Data"
```
[API] ⚠️ Backend fetch failed, trying Neon database...
```

**Solution**: 
1. Make sure backend is running: `npm run dev:server`
2. Check VITE_API_URL in `.env`
3. Verify CORS is enabled (it is!)
4. Check browser console for exact error

### Backend won't start
```
Error: Port 5000 already in use
```

**Solution**:
```bash
# Find process on port 5000
netstat -ano | findstr :5000
# Kill it
taskkill /PID [PID] /F
# Or use different port
PORT=3000 npm run dev:server
```

### CORS still failing
This shouldn't happen! Backend has `origin: '*'`.
- Clear browser cache (Ctrl+Shift+Del)
- Check browser console exact error message
- Verify backend is actually running on port 5000

---

## Commands Quick Reference

```bash
# Development
npm run dev:server      # Start backend (port 5000)
npm run dev             # Start frontend (port 5174)
npm run dev:all         # Both at once (requires concurrently)

# Production
npm start               # Start backend for production
npm run build           # Build frontend

# Testing
curl http://localhost:5000/health
```

---

## Success Indicators

✅ Backend returns 200 OK from `/health`
✅ Frontend console shows: `[API] ✅ Data fetched from backend`
✅ Products created in admin appear on public site
✅ No CORS errors in browser console
✅ No "Mock Data" fallback message

**If all ✅ - You're connected!** 🎉
