import { config } from 'dotenv';
import { defineConfig } from 'drizzle-kit';

config({ path: '.env' });

export default defineConfig({
  schema: './src/schema.js',
  out: './migrations',
  dialect: 'postgresql',
  dbCredentials: {
    url:
      // process.env.NODE_ENV === 'development'
      //   ? process.env.DATABASE_URL_DEV
      //   : process.env.DATABASE_URL_PROD,
      'postgres://default:CK3LWXf4iyoY@ep-tight-mode-66645246-pooler.us-east-1.aws.neon.tech:5432/verceldb?sslmode=require',
  },
});
