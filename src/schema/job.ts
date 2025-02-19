import { relations } from 'drizzle-orm';
import {
  text,
  pgTable,
  varchar,
  timestamp,
  bigserial,
  integer,
  doublePrecision,
  boolean,
} from 'drizzle-orm/pg-core';
import { jobRequests } from './jobRequest.ts';
import { JobStatuses } from '../../constants/constants.ts';
import { mechanics } from './mechanic.ts';
import { usersTable } from './user.ts';

export const jobs = pgTable('jobs', {
  id: bigserial('id', { mode: 'number' }).primaryKey(),
  created_by: varchar('created_by', { length: 256 }).notNull(),
  created_at: timestamp('created_at', { withTimezone: true })
    .defaultNow()
    .notNull(),
  updated_by: varchar('updated_by', { length: 256 }),
  updated_at: timestamp('updated_at', { withTimezone: true }),
  description: text('description').notNull(),
  // the person the customer can call with their phone number or agent
  dispatcher: varchar('dispatcher', { length: 256 }),
  // we are setting the rate rather than allow things be, i.e rate for service is 15k, we remove 10% and send the rest to the mechanic
  rate: integer('rate'),
  status: varchar('status', {
    enum: Object.values(JobStatuses) as [string, ...string[]],
    length: 256,
  }).default(JobStatuses.NOTIFYING),
  longitude: doublePrecision('longitude'),
  latitude: doublePrecision('latitude'),
  locationDetails: text('location_details'),
  isPendingReview: boolean('is_pending_review').default(true),
  mechanicId: integer('mechanic_id').references(() => mechanics.id),
  userId: integer('user_id').references(() => usersTable.id),
  isApproved: boolean('is_approved').default(false),
});

export const jobRelations = relations(jobs, ({ many, one }) => ({
  jobRequests: many(jobRequests),
  mechanic: one(mechanics, {
    fields: [jobs.mechanicId],
    references: [mechanics.id],
  }),
  user: one(usersTable, {
    fields: [jobs.userId],
    references: [usersTable.id],
  }),

  //TODO: create dispatcher of agent models
}));
