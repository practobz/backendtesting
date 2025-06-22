import nanoPkg from 'nano';

const couchURL = process.env.COUCH_URL || 'http://admin:admin@127.0.0.1:5984';
const nano = nanoPkg(couchURL); // ✅ Initialize nano here

const DB_NAMES = {
  users: 'users',
  content: 'content',
  calendars: 'calendars',
};

const databases = {};

export async function initializeDatabases() {
  const dbList = await nano.db.list();

  for (const [key, dbName] of Object.entries(DB_NAMES)) {
    if (!dbList.includes(dbName)) {
      await nano.db.create(dbName);
    }
    databases[key] = nano.db.use(dbName);
  }

  return databases;
}
