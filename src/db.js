import { drizzle } from 'drizzle-orm/neon-http';
import { neon } from '@neondatabase/serverless';
import { config } from 'dotenv';

config({ path: '.env' }); // or .env.local

const sql = neon(
  process.env.NODE_ENV === 'development'
    ? process.env.DATABASE_URL_DEV
    : process.env.DATABASE_URL_PROD
);
export const db = drizzle(sql);
