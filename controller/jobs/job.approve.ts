import { JobStatuses } from 'constants/constants.ts';
import { and, eq } from 'drizzle-orm';
import { MechalinkRequired } from 'errors/400/required-error.ts';
import { MechalinkError } from 'errors/mechalink-error.ts';
import { NextFunction, Request, Response } from 'express';
import { db } from 'src/db.ts';
import { jobs } from 'src/schema/job.ts';
import { tryCatchFn } from 'utils/tryCatch.ts';

// by client
export const approveJob = tryCatchFn(
  async (req: Request, res: Response, next: NextFunction) => {
    const { jobId } = req.params;
    console.log('called');

    // check if job status is in progress

    const job = await db
      .select()
      .from(jobs)
      .where(
        and(
          eq(jobs.id, Number(jobId))
          // eq(jobs.status, JobStatuses.IN_PROGRESS)
        )
      );

    console.log(job);

    if (!job) {
      return next(new MechalinkError('Something went wrong', 500));
    }

    // approve by user
    const response = await db
      .update(jobs)
      .set({
        isApproved: true,
        // the user should be the one to approve (still thinking)
        // status: JobStatuses.COMPLETED,
      })
      .where(
        and(
          eq(jobs.id, Number(jobId))
          // eq(jobs.status, JobStatuses.IN_PROGRESS)
        )
      )
      .returning();

    res.status(201).json(response);
  }
);
