import { JobRequestStatuses } from '../../constants/constants.ts';
import { relations } from 'drizzle-orm';
import {
  text,
  serial,
  pgTable,
  varchar,
  timestamp,
  bigint,
  integer,
} from 'drizzle-orm/pg-core';
import { jobs } from './job.ts';
import { mechanics } from './mechanic.ts';

export const jobRequests = pgTable('jobRequests', {
  id: serial('id').primaryKey(),
  created_by: varchar('created_by', { length: 256 }).notNull(),
  created_at: timestamp('created_at', { withTimezone: true })
    .defaultNow()
    .notNull(),
  updated_by: varchar('updated_by', { length: 256 }),
  updated_at: timestamp('updated_at', { withTimezone: true }),
  status: varchar('status', {
    enum: Object.values(JobRequestStatuses) as [string, ...string[]],
    length: 256,
  }).default(JobRequestStatuses.NOTIFYING),
  jobId: bigint('job_id', { mode: 'number' })
    .references(() => jobs.id)
    .notNull(),
  mechanicId: integer('mechanic_id').references(() => mechanics.id),
  distance: text('distance'),
  duration: text('duration'),
  lat: text('lat').notNull().default('8.9855'),
  lng: text('lng').notNull().default('7.8888'),
});

// a job can have many requests, only one mechanic can be added to a jobRequest
export const jobRequestRelations = relations(jobRequests, ({ one }) => ({
  job: one(jobs, {
    fields: [jobRequests.jobId],
    references: [jobs.id],
  }),

  mechanic: one(mechanics, {
    fields: [jobRequests.mechanicId],
    references: [mechanics.id],
  }),
}));
