import { pgTable, serial, timestamp } from 'drizzle-orm/pg-core';

export const availability = pgTable('mechanicAvailability', {
  id: serial('id').primaryKey(),
  startTime: timestamp('start_time').notNull(),
  endTime: timestamp('end_time').notNull(),
});
