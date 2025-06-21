const express = require('express');
const cors = require('cors');
const nano = require('nano');

const app = express();
app.use(cors());
app.use(express.json());

const couch = nano(process.env.COUCH_URL);

app.get('/', (req, res) => {
  res.send({ message: 'Hello from Cloud Function!' });
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

// ✅ Do not start server with app.listen
// ⬇️ This is the important line for Cloud Function
exports.myApi = app;