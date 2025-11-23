# 🚀 Deployment Checklist

## ✅ What's Ready

### Backend (server.js)
- ✅ Express.js server created
- ✅ CORS enabled for all origins (`origin: '*'`)
- ✅ REST API endpoints ready
- ✅ In-memory data storage
- ✅ Health check endpoint (`/health`)
- ✅ Tested locally on port 5000

### Frontend (React/Vite)
- ✅ Connects to backend via fetch API
- ✅ Falls back to Neon database
- ✅ Falls back to mock data
- ✅ Environment variable support (`VITE_API_URL`)
- ✅ TypeScript configured for Vite
- ✅ Build passes successfully

### Documentation
- ✅ `BACKEND_CORS_FIXED.md` - This setup
- ✅ `RENDER_NETLIFY_DEPLOYMENT.md` - Deployment guide
- ✅ All other guides included

---

## 📋 Deployment Steps

### Step 1: Deploy Backend to Render

```
1. Go to https://render.com
2. Click "New +" → "Web Service"
3. Connect your GitHub repo
4. Fill in settings:
   - Name: moroccan-apple-backend
   - Environment: Node
   - Build Command: npm install
   - Start Command: node server.js
5. Click "Create Web Service"
6. Wait for deployment (2-3 minutes)
7. Note the URL: https://moroccan-apple-backend.onrender.com
```

### Step 2: Configure Frontend

```
1. Go to Netlify Dashboard
2. Settings → Build & deploy → Environment
3. Add new variable:
   - Key: VITE_API_URL
   - Value: https://moroccan-apple-backend.onrender.com/api/sync-data
4. Trigger redeploy
```

### Step 3: Verify Connection

```
1. Open your Netlify site
2. Open browser console (F12)
3. Look for: "[API] ✅ Data fetched from backend"
4. No CORS errors should appear
5. Add a product in admin dashboard
6. Refresh page - product should persist
```

---

## 🔍 Quick Verification

### Backend Health Check
```bash
curl https://moroccan-apple-backend.onrender.com/health
```

Should return:
```json
{
  "status": "OK",
  "timestamp": "2025-11-23T...",
  "uptime": 123.45
}
```

### API Test
```bash
curl https://moroccan-apple-backend.onrender.com/api/sync-data
```

Should return data structure with products, users, orders, heroContent.

### Frontend Test
Check browser console for:
```
[API] Using endpoint: https://moroccan-apple-backend.onrender.com/api/sync-data
[API] Fetching data from https://...
[API] ✅ Data fetched from backend
```

---

## 📦 CORS Configuration Deployed

Your backend has this CORS configuration:

```javascript
app.use(cors({
  origin: '*',                                    // ✅ ALL origins allowed
  methods: ['GET', 'POST', 'PUT', 'DELETE'],     // ✅ All HTTP methods
  allowedHeaders: ['Content-Type', 'Authorization'] // ✅ Standard headers
}));
```

This means:
- ✅ Netlify frontend can fetch data
- ✅ Local development works
- ✅ Any future integrations work
- ✅ No CORS blocking errors

---

## 📱 Local Development

To test locally before deploying:

```bash
# Terminal 1: Start backend
npm run dev:server
# Listens on http://localhost:5000

# Terminal 2: Start frontend
npm run dev
# Listens on http://localhost:5174

# Frontend will fetch from http://localhost:5000/api/sync-data
```

---

## 🌍 Production URLs

After deployment:

| Service | URL |
|---------|-----|
| Backend | `https://moroccan-apple-backend.onrender.com` |
| Frontend | `https://your-site.netlify.app` |
| API Endpoint | `https://moroccan-apple-backend.onrender.com/api/sync-data` |

---

## ⚡ Performance Notes

- Render free tier may have 15-minute inactivity timeout
  - First request after idle will take 10-15 seconds
  - Subsequent requests are instant
- To keep backend awake: use external uptime monitor or use paid tier

---

## 🔐 Security Considerations

For production, consider:

1. **Remove `origin: '*'`** - Restrict to specific domains
   ```javascript
   origin: [
     'https://your-site.netlify.app',
     'http://localhost:3000'
   ]
   ```

2. **Add rate limiting** - Prevent abuse
   ```bash
   npm install express-rate-limit
   ```

3. **Add authentication** - Protect API endpoints
   ```bash
   npm install jsonwebtoken
   ```

4. **Use environment variables** - Never hardcode secrets
   ```bash
   NODE_ENV=production
   API_KEY=your-secret-key
   ```

---

## 📝 Troubleshooting

### Problem: Frontend still shows "Mock Data"
**Check**:
1. Is backend running? `curl https://...render.com/health`
2. Is `VITE_API_URL` set in Netlify?
3. Is there a CORS error in browser console?

### Problem: "Port already in use" locally
**Solution**:
```bash
# Windows
netstat -ano | findstr :5000
taskkill /PID [PID] /F

# Mac/Linux
lsof -i :5000
kill -9 [PID]
```

### Problem: Render deploy fails
**Check**:
1. Is `package.json` in root directory?
2. Is `node_modules/.bin` in PATH?
3. Are all dependencies listed?

### Problem: Products not syncing
**Check**:
1. Admin dashboard shows data was sent
2. Check Render logs for errors
3. Verify CORS headers are present in response

---

## 📚 Reference Files

| File | Purpose |
|------|---------|
| `server.js` | Express backend with CORS |
| `.env` | Local environment variables |
| `.env.example` | Environment template |
| `services/api.ts` | Frontend API layer |
| `BACKEND_CORS_FIXED.md` | This file |
| `RENDER_NETLIFY_DEPLOYMENT.md` | Detailed deployment |

---

## ✨ Next Steps

1. ✅ Backend ready to deploy
2. ✅ Frontend configured to connect
3. ✅ CORS enabled
4. → **Deploy to Render** (follow Step 1 above)
5. → **Update Netlify** (follow Step 2 above)
6. → **Test in production** (follow Step 3 above)

**Estimated time**: 10-15 minutes total

---

## 🎉 Success!

When working:
- ✅ Backend deployed on Render
- ✅ Frontend deployed on Netlify
- ✅ No CORS errors
- ✅ Products persist across page reloads
- ✅ Admin changes visible immediately
- ✅ No "Mock Data" fallback

**Your production system is live!** 🚀
