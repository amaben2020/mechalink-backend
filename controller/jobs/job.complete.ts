import { tryCatchFn } from 'utils/tryCatch.ts';
import { JobStatuses } from 'constants/constants.ts';
import { and, eq } from 'drizzle-orm';
import { MechalinkRequired } from 'errors/400/required-error.ts';
import { NextFunction, Request, Response } from 'express';
import { db } from 'src/db.ts';
import { jobs } from 'src/schema/job.ts';
import { getMechanicById } from 'core/mechanics.ts';
import { MechalinkError } from 'errors/mechalink-error.ts';

// by mech
export const completeJob = tryCatchFn(
  async (req: Request, res: Response, next: NextFunction) => {
    const { mechanicId, jobId } = req.params;

    const mechanic = await getMechanicById(+mechanicId);
    console.log(mechanic);

    const job = await db
      .select()
      .from(jobs)
      .where(
        and(
          eq(jobs.id, Number(jobId)),
          // eq(jobs.status, JobStatuses.IN_PROGRESS),
          eq(jobs.isApproved, true),
          eq(jobs.mechanicId, +mechanicId)
        )
      );

    if (!job) {
      return next(new MechalinkError('Job Not found', 404));
    }

    const [response = undefined] = await db
      .update(jobs)
      .set({
        status: JobStatuses.COMPLETED,
      })
      .where(
        and(
          eq(jobs.id, Number(jobId)),
          // eq(jobs.status, JobStatuses.IN_PROGRESS),
          eq(jobs.isApproved, true)
        )
      )
      .returning();

    if (!response) {
      return next(new MechalinkError('Job Not found', 404));
    }

    return res.status(201).json(response);
  }
);
