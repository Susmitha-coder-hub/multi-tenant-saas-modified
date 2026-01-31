import pkg from 'pg';
import dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.resolve('src/.env') }); // <-- point to your .env

const { Client } = pkg;

const client = new Client({
  connectionString: process.env.DATABASE_URL
});

client.connect()
  .then(() => console.log('----Connected to DB!----'))
  .catch(err => console.error('DB Connection Error:', err))
  .finally(() => client.end());
