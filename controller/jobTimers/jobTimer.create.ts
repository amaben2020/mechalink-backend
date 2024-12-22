import { JobStatuses } from 'constants/constants.ts';
import { JobTimerService } from 'core/jobs.ts';
import { eq } from 'drizzle-orm';
import express from 'express';
import { db } from 'src/db.ts';
import { jobs } from 'src/schema/job.ts';
import { z } from 'zod';

const createJobTimerSchema = z.object({
  jobId: z.number(),
  durationInMinutes: z.number(),
});

export const createJobTimerController = async (
  req: express.Request,
  res: express.Response
) => {
  try {
    // a job in progress can only be assigned
    // create a timer if there is a job and mech exist

    const { jobId, durationInMinutes } = createJobTimerSchema.parse(req.body);

    const [job = undefined] = await db
      .select()
      .from(jobs)
      .where(eq(jobs.id, Number(jobId)));

    console.log('JOB', job);

    if (job?.status === JobStatuses.ON_THE_WAY) {
      const timer = await new JobTimerService().startTimer({
        jobId,
        durationInMinutes,
      });

      console.log('TIMER', timer);

      await db
        .update(jobs)
        .set({
          status: JobStatuses.IN_PROGRESS,
        })
        .where(eq(jobs.id, Number(jobId)));

      return res.json(timer);
    }

    res.status(500).json({ message: 'Job is not in progress' });
  } catch (error) {
    console.log(error);
  }
};
