const http = require('http');
const nanoPkg = require('nano');

const couch = nanoPkg(process.env.COUCH_URL || 'http://admin:admin@127.0.0.1:5984');

const server = http.createServer(async (req, res) => {
  // Basic CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,POST,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    res.writeHead(200);
    res.end();
    return;
  }

  if (req.url === '/' && req.method === 'GET') {
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ message: 'Hello from Cloud Function!' }));
    return;
  }

  if (req.url === '/databases' && req.method === 'GET') {
    try {
      const dbs = await couch.db.list();
      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ databases: dbs }));
    } catch (error) {
      console.error('Error connecting to CouchDB:', error.message);
      res.writeHead(500, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ error: 'Failed to connect to CouchDB' }));
    }
    return;
  }

  res.writeHead(404, { 'Content-Type': 'application/json' });
  res.end(JSON.stringify({ error: 'Not found' }));
});

module.exports = { myApi: server };