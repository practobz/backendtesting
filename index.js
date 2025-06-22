import express from 'express';
import cors from 'cors';
import nanoPkg from 'nano';

const app = express();
app.use(cors());
app.use(express.json());

const couch = nanoPkg(process.env.COUCH_URL || 'http://admin:admin@127.0.0.1:5984');
const usersDb = couch.db.use('users');

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

// ✅ NEW LOGIN ROUTE
app.post('/login', async (req, res) => {
  const { email, password } = req.body;

  try {
    const result = await usersDb.find({ selector: { email, password } });

    if (result.docs.length === 0) {
      return res.status(400).send({ error: 'Invalid email or password' });
    }

    const user = result.docs[0];
    res.send({ user });
  } catch (err) {
    console.error('Login error:', err.message);
    res.status(500).send({ error: 'Login failed' });
  }
});

export const myApi = app;
