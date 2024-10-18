// import { drizzle } from 'drizzle-orm/neon-http';
// import { migrate } from 'drizzle-orm/neon-http/migrator';
// import { neon } from '@neondatabase/serverless';

// const sql = neon(
//   'postgresql://mechalink_owner:gcY6DhXvK0Qx@ep-holy-meadow-a5vnosnq.us-east-2.aws.neon.tech/mechalink?sslmode=require'
// );

// const db = drizzle(sql);

// const main = async () => {
//   console.log('Starting Migration....');
//   try {
//     await migrate(db, {
//       migrationsFolder: '/migrations',
//     });

//     console.log('Migration successful');
//   } catch (error) {
//     console.error(error);
//     process.exit(1);
//   }
// };

// main();

// src/migrate.ts

import { drizzle } from 'drizzle-orm/neon-http';
import { neon } from '@neondatabase/serverless';
import { migrate } from 'drizzle-orm/neon-http/migrator';
import { config } from 'dotenv';

config({ path: '.env' });

const sql = neon(
  'postgresql://mechalink_owner:gcY6DhXvK0Qx@ep-holy-meadow-a5vnosnq.us-east-2.aws.neon.tech/mechalink?sslmode=require'
);
const db = drizzle(sql);

const main = async () => {
  try {
    await migrate(db, { migrationsFolder: 'drizzle' });
    console.log('Migration completed');
  } catch (error) {
    console.error('Error during migration:', error);
    process.exit(1);
  }
};

main();
