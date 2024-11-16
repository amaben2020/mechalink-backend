import { jobsSchema } from 'controller/jobs/job.create.js';
import { eq } from 'drizzle-orm';
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
    const [job = undefined] = await db
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

    return job;
  } catch (error) {
    if (error instanceof Error) throw new MechalinkError('Invalid fields', 500);
  }
};

export const getJobs = async () => {
  try {
    const jobsData = await db.select().from(jobs);

    return jobsData;
  } catch (error) {
    if (error instanceof Error) throw new MechalinkError('Invalid fields', 500);
  }
};

export const getJob = async (id: number) => {
  try {
    const [job = undefined] = await db
      .select()
      .from(jobs)
      .where(eq(jobs.id, id));

    return job;
  } catch (error) {
    if (error instanceof Error) throw new MechalinkError('Invalid fields', 500);
  }
};
