import { jobsSchema } from 'controller/jobs/job.create.js';
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
      //@ts-ignore
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
    console.log(error);
  }
};
