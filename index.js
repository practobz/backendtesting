const express = require('express');
const cors = require('cors');
const nano = require('nano');

const app = express();
app.use(cors());
app.use(express.json());

// Optional: use environment variable for CouchDB URL
const couch = nano(process.env.COUCH_URL || 'http://admin:admin@localhost:5984');

app.get('/', (req, res) => {
  res.send({ message: 'Hello from Cloud Function!' });
});

app.get('/test', (req, res) => {
  res.send({ message: 'This is /test route' });
});

app.get('/databases', async (req, res) => {
  try {
    const dbs = await couch.db.list();
    res.send({ databases: dbs });
  } catch (error) {
    console.error('Error connecting to CouchDB:', error.message);
    res.status(500).send({ error: 'Failed to connect to CouchDB' });
  }
});

// 👇 This is required to work with Cloud Functions Gen 2!
const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});

// 👇 This is needed for Cloud Function export
exports.myApi = app;
