const express = require('express');
const cors = require('cors');
const nano = require('nano');

const app = express();
app.use(cors());
app.use(express.json());

const couch = nano('http://admin:admin@34.100.238.8:5984');

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

exports.myApi = app;
