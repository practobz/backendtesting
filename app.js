import http from 'http';
import url from 'url';
import nanoPkg from 'nano';
import adminRoutes from './routes/adminRoutes.js';
import customerRoutes from './routes/customerRoutes.js';
import creatorRoutes from './routes/creatorRoutes.js';
import { sendJSON } from './utils/response.js';

// Setup DB
const username = 'admin';
const password = 'admin';
const nano = nanoPkg(`http://${username}:${password}@127.0.0.1:5984`);
const usersDb = nano.db.use('users');

// Only now use usersDb
// const authMiddleware = new AuthMiddleware(usersDb); // Uncomment only if you're using it later

const server = http.createServer(async (req, res) => {
  if (req.method === 'OPTIONS') {
    return sendJSON(res, 200, { ok: true });
  }

  req.databases = { users: usersDb };

  // Ensure customerRoutes is checked BEFORE any catch-all or fallback logic
  const handled =
    await customerRoutes(req, res) ||
    await adminRoutes(req, res) ||
    await creatorRoutes(req, res);

  if (!handled && !res.writableEnded) {
    sendJSON(res, 404, { error: 'Route not found' });
  }
});

nano.db.get('users').catch(() => nano.db.create('users')).then(() => {
  server.listen(3001, () => {
    console.log(`🚀 Server running at http://localhost:3001`);
  });
});
