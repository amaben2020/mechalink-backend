import { drizzle } from 'drizzle-orm/neon-http';
import { neon } from '@neondatabase/serverless';
import { config } from 'dotenv';

config({ path: '.env' }); // or .env.local

const sql = neon(
  // process.env.NODE_ENV === 'development'
  //   ? process.env.DATABASE_URL_DEV
  //   : process.env.DATABASE_URL_PROD

  'postgres://default:CK3LWXf4iyoY@ep-tight-mode-66645246-pooler.us-east-1.aws.neon.tech:5432/verceldb?sslmode=require'
);
export const db = drizzle(sql);
