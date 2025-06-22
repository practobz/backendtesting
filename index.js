import http from 'http';
import url from 'url';
import { parse } from 'querystring';
import nano from 'nano';

const COUCH_URL = process.env.COUCH_URL || 'http://admin:admin@127.0.0.1:5984';
const couch = nano(COUCH_URL);

const server = http.createServer(async (req, res) => {
  const parsedUrl = url.parse(req.url, true);
  const { pathname } = parsedUrl;

  // Set response headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  
  if (req.method === 'OPTIONS') {
    res.writeHead(204);
    res.end();
    return;
  }

  if (pathname === '/' && req.method === 'GET') {
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ message: 'Hello from pure Node.js backend!' }));
  
  } else if (pathname === '/databases' && req.method === 'GET') {
    try {
      const dbs = await couch.db.list();
      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ databases: dbs }));
    } catch (error) {
      console.error('Error connecting to CouchDB:', error.message);
      res.writeHead(500, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ error: 'Failed to connect to CouchDB' }));
    }

  } else {
    res.writeHead(404, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ error: 'Route not found' }));
  }
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`🚀 Pure Node.js server listening on port ${PORT}`);
});
