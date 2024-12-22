import { relations } from 'drizzle-orm';
import {
  pgTable,
  varchar,
  timestamp,
  serial,
  integer,
} from 'drizzle-orm/pg-core';
import { JobTimerStatuses } from '../../constants/constants.ts';

import { z } from 'zod';
import { jobs } from './job.ts';

function extractValuesAsTuple<T extends Record<string, unknown>>(
  obj: T
): [T[keyof T], ...T[keyof T][]] {
  const values = Object.values(obj) as T[keyof T][];
  if (values.length === 0)
    throw new Error('Object must have at least one value.');

  // Explicitly extract the first value
  const result: [T[keyof T], ...T[keyof T][]] = [values[0], ...values.slice(1)];

  return result;
}
export function enumFromConst<T extends Record<string, string>>(obj: T) {
  const values = extractValuesAsTuple(obj);
  return z.enum(values);
}

export const jobTimer = pgTable('jobTimer', {
  id: serial('id').primaryKey(),
  durationInMinutes: integer('duration_in_minutes').notNull(),
  endTime: timestamp('end_time', { withTimezone: true }),
  status: varchar('status', {
    enum: Object.values(JobTimerStatuses) as [string],
    length: 256,
  }),
  jobId: integer('job_id')
    .references(() => jobs.id)
    .unique(),
});

export const jobTimerRelations = relations(jobTimer, ({ one }) => ({
  job: one(jobs, {
    fields: [jobTimer.jobId],
    references: [jobs.id],
  }),
}));
