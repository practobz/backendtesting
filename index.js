import express from 'express';
import cors from 'cors';
import nanoPkg from 'nano';

const app = express();
app.use(cors());
app.use(express.json());

const couch = nanoPkg(process.env.COUCH_URL || 'http://admin:admin@127.0.0.1:5984');

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

export const myApi = app;