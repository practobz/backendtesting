const http = require('http');
const url = require('url');
const nanoPkg = require('nano');
const adminRoutes = require('./routes/adminRoutes.js');
const customerRoutes = require('./routes/customerRoutes.js');
const creatorRoutes = require('./routes/creatorRoutes.js');
const { sendJSON } = require('./utils/response.js');

// Setup DB
const username = process.env.COUCHDB_USER || "admin";
const password = encodeURIComponent(process.env.COUCHDB_PASSWORD || "admin");
const host = process.env.COUCHDB_HOST || "34.47.166.248:5984";

const nano = nanoPkg(`http://${username}:${password}@${host}`);

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
