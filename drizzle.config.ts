import { config } from 'dotenv';
import { defineConfig } from 'drizzle-kit';

// config({ path: '.env' });
config();

export default defineConfig({
  schema: './src/schema.js',
  out: './migrations',
  dialect: 'postgresql',
  dbCredentials: {
    url:
      process.env.NODE_ENV === 'development'
        ? process.env.DATABASE_URL_DEV!
        : process.env.DATABASE_URL_PROD!,
  },
});
