
/**
 * EXAMPLE SERVERLESS FUNCTION (Node.js)
 * 
 * This file represents what you would deploy to Vercel (as /api/sync-data.js) 
 * or Netlify Functions to handle the database connection.
 * 
 * Prerequisites:
 * 1. Create a project on Vercel/Netlify.
 * 2. Create a database (e.g., Firebase Firestore, MongoDB Atlas, or JSONBin).
 * 3. Add environment variables for DB credentials.
 */

// Example using a simple JSON storage service (Pseudo-code)
// import dbClient from 'some-db-client';

export default async function handler(req, res) {
  // 1. Handle CORS (Allow your frontend domain)
  res.setHeader('Access-Control-Allow-Credentials', true);
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,POST,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  // 2. GET Method: Fetch Data
  if (req.method === 'GET') {
    try {
      // const data = await dbClient.collection('global').doc('store_data').get();
      // For demo purposes, we return a mock if DB is empty
      const data = { /* ... data from DB ... */ };
      
      res.status(200).json(data);
    } catch (error) {
      res.status(500).json({ error: 'Failed to fetch data' });
    }
  }

  // 3. POST Method: Save Data
  else if (req.method === 'POST') {
    try {
      const newData = req.body;
      
      // Validation (Basic)
      if (!newData.products || !newData.users) {
        throw new Error("Invalid Data Structure");
      }

      // await dbClient.collection('global').doc('store_data').set(newData);
      
      console.log("Data saved to database successfully");
      res.status(200).json({ success: true });
    } catch (error) {
      res.status(500).json({ error: 'Failed to save data' });
    }
  } 
  
  else {
    res.status(405).json({ error: 'Method not allowed' });
  }
}
