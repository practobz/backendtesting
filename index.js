const express = require('express');
const cors = require('cors');
const nano = require('nano');

const app = express();
app.use(cors());
app.use(express.json());

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

// 🟢 Start the server if this is running in a container (e.g. Gen 2)
const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  console.log(`🚀 Server is running on port ${PORT}`);
});
