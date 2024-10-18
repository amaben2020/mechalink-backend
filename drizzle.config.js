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
      'postgresql://mechalink_owner:gcY6DhXvK0Qx@ep-holy-meadow-a5vnosnq.us-east-2.aws.neon.tech/mechalink?sslmode=require',
  },
});
