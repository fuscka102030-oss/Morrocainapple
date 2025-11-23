# Deploying to Render (Backend) + Netlify (Frontend)

## Backend Deployment (Render)

### Step 1: Create Render Account
1. Go to https://render.com
2. Sign up with GitHub account
3. Create new Web Service

### Step 2: Connect GitHub
1. Click "New +" → "Web Service"
2. Connect your GitHub repository
3. Select this repository

### Step 3: Configure Render
Fill in the deployment settings:

**Name**: moroccan-apple-backend
**Root Directory**: (leave empty - it's in repo root)
**Environment**: Node
**Build Command**: `npm install`
**Start Command**: `npm start` or `node server.js`
**Plan**: Free (or paid if needed)

### Step 4: Set Environment Variables
In Render dashboard:
- Go to Environment → Add Variable
- Add any variables from `.env.example`

### Step 5: Deploy
Click "Deploy" and wait for the service to start.
Your backend URL will be something like: `https://moroccan-apple-backend.onrender.com`

---

## Frontend Configuration (Netlify)

### Update Environment Variable
1. Go to your Netlify site
2. Settings → Build & deploy → Environment
3. Add/Update variable:
   - **Key**: `VITE_API_URL`
   - **Value**: `https://moroccan-apple-backend.onrender.com/api/sync-data`

### Redeploy Frontend
1. Push code to GitHub or manually trigger deploy
2. Frontend will now connect to your Render backend

---

## Testing the Connection

### Local Development
```bash
# Terminal 1: Start backend
npm run dev:server
# Backend runs on http://localhost:5000

# Terminal 2: Start frontend
npm run dev
# Frontend runs on http://localhost:5174

# The frontend will now fetch from http://localhost:5000/api/sync-data
```

### Production
Frontend (Netlify) → fetches from → Backend (Render)

---

## CORS Configuration

The backend (`server.js`) has CORS enabled for all origins:
```javascript
app.use(cors({
  origin: '*', // Allow ALL origins
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));
```

This allows your Netlify frontend to communicate with Render backend.

---

## API Endpoints

**Backend URL**: `https://moroccan-apple-backend.onrender.com`

| Endpoint | Method | Purpose |
|----------|--------|---------|
| `/api/sync-data` | GET | Fetch all data |
| `/api/sync-data` | POST | Save all data |
| `/api/products` | GET | List products |
| `/api/products` | POST | Create product |
| `/api/products/:id` | PUT | Update product |
| `/api/products/:id` | DELETE | Delete product |
| `/api/hero` | GET | Get hero content |
| `/api/hero` | PUT | Update hero content |
| `/health` | GET | Health check |

---

## Troubleshooting

### Frontend Still Shows Mock Data
1. Check browser console (F12) for fetch errors
2. Verify `VITE_API_URL` is set correctly in Netlify
3. Check Render backend is running
4. Verify CORS is enabled on backend

### 503 Service Unavailable
Render free tier might be sleeping. Click "Open" to wake it up.

### Connection Refused (localhost:5000)
Make sure backend is running: `npm run dev:server`

### CORS Errors
The backend already has `origin: '*'` configured. If issues persist:
1. Check browser console for exact error
2. Verify request headers are correct
3. Test with curl: `curl -X GET http://localhost:5000/health`

---

## Monitoring

### Render Logs
https://dashboard.render.com → Select service → Logs

### Netlify Logs
https://app.netlify.com → Site → Deploy logs

### Check Backend Health
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

---

## Next Steps

1. Deploy backend to Render
2. Get backend URL from Render
3. Update `VITE_API_URL` in Netlify
4. Redeploy frontend
5. Test that products sync correctly

Backend: ✅ Render
Frontend: ✅ Netlify
Connection: ✅ CORS enabled
