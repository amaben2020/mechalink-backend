import { jobsSchema } from 'controller/jobs/job.create.js';
import { MechalinkError } from 'errors/mechalink-error.ts';
import { db } from 'src/db.js';
import { jobs } from 'src/schema/job.ts';
import { z } from 'zod';

export const createJob = async ({
  description,
  rate,
  latitude,
  locationDetails,
  longitude,
  isPendingReview,
  status,
  userId,
  createdBy = 'admin',
}: z.infer<typeof jobsSchema>) => {
  try {
    await db
      .insert(jobs)
      .values({
        description,
        rate,
        latitude,
        locationDetails,
        longitude,
        isPendingReview,
        status,
        userId,
        created_by: createdBy,
      })
      .returning();
  } catch (error) {
    if (error instanceof Error) throw new MechalinkError('Invalid fields', 500);
  }
};
