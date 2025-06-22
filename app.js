import dotenv from 'dotenv';
dotenv.config();
import http from 'http';
import url from 'url';
import nano from 'nano';
import adminRoutes from './routes/adminRoutes.js';
import customerRoutes from './routes/customerRoutes.js';
import creatorRoutes from './routes/creatorRoutes.js';
import { sendJSON } from './utils/response.js';

const username = process.env.COUCHDB_USER || "admin";
const password = encodeURIComponent(process.env.COUCHDB_PASSWORD || "admin");
const host = process.env.COUCHDB_HOST || "34.47.166.248:5984";
const nanoInstance = nano(`http://${username}:${password}@${host}`);
const usersDb = nanoInstance.db.use('users');

const server = http.createServer(async (req, res) => {
  // Set CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    res.writeHead(204);
    res.end();
    return;
  }

  req.databases = { users: usersDb };

  // Route handling
  const handled =
    await customerRoutes(req, res) ||
    await adminRoutes(req, res) ||
    await creatorRoutes(req, res);

  if (!handled && !res.writableEnded) {
    sendJSON(res, 404, { error: 'Route not found' });
  }
});

nanoInstance.db.get('users').catch(() => nanoInstance.db.create('users')).then(() => {
  server.listen(3001, () => {
    console.log(`🚀 Server running at http://localhost:3001`);
  });
});
