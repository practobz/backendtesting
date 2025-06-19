import express from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';
import nanoPkg from 'nano';

const username = process.env.COUCHDB_USER || "admin";
const password = encodeURIComponent(process.env.COUCHDB_PASSWORD || "admin");
const nano = nanoPkg(`http://${username}:${password}@34.100.254.85:5984`);

const app = express();
app.use(cors());
app.use(bodyParser.json());

const dbName = 'users';
let db;
let dbReady = false;

(async () => {
  try {
    const dbList = await nano.db.list();
    if (!dbList.includes(dbName)) {
      await nano.db.create(dbName);
    }
    db = nano.db.use(dbName);
    await db.createIndex({ index: { fields: ['email'] } });
    dbReady = true;
  } catch (err) {
    console.error("DB init error:", err);
  }
})();

app.post('/users', async (req, res) => {
  if (!dbReady) return res.status(503).json({ error: 'DB not ready' });
  const { email, password } = req.body;
  try {
    const existing = await db.find({ selector: { email } });
    if (existing.docs.length > 0) return res.status(409).json({ error: 'Email exists' });
    const result = await db.insert({ email, password });
    res.status(201).json(result);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post('/login', async (req, res) => {
  if (!dbReady) return res.status(503).json({ error: 'DB not ready' });
  const { email, password } = req.body;
  try {
    const result = await db.find({ selector: { email } });
    const user = result.docs[0];
    if (!user || user.password !== password) return res.status(401).json({ error: 'Invalid credentials' });
    res.json({ message: 'Login successful' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.use((req, res) => {
  res.status(404).json({ error: 'Route not found' });
});

export default app;
