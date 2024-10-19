import { relations } from 'drizzle-orm';
import {
  pgTable,
  varchar,
  timestamp,
  serial,
  integer,
  pgEnum,
} from 'drizzle-orm/pg-core';

import { jobRequests } from './jobRequest.js';
import { MechanicStatuses } from '../../constants/constants.js';
import { usersTable } from './user.js';

export const mobileOsEnum = pgEnum('mobile_app_os', ['ios', 'android']);

export const mechanics = pgTable('mechanics', {
  id: serial('id').primaryKey(),
  created_by: varchar('created_by', { length: 256 }).notNull(),
  created_at: timestamp('created_at', { withTimezone: true })
    .defaultNow()
    .notNull(),
  updated_by: varchar('updated_by', { length: 256 }),
  updated_at: timestamp('updated_at', { withTimezone: true }),
  userId: integer('user_id').references(() => usersTable.id),
  arrivalRate: integer('arrival_rate'),
  jobCount: integer('jobCount'),
  status: varchar('status', {
    enum: Object.values(MechanicStatuses),
    length: 256,
  }),
  lastKnownLocationTimestamp: timestamp('last_known_location_timestamp', {}),
  mobileAppOs: mobileOsEnum('mobile_app_os'),
});

// one job can have one mechanic but one mechanic can have many jobs
export const mechanicRelations = relations(mechanics, ({ one, many }) => ({
  user: one(usersTable, {
    fields: [mechanics.userId],
    references: [usersTable.id],
  }),
  jobs: many(jobsSchema),
  jobRequests: many(jobRequests),
}));
