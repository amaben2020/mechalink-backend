import { z } from 'zod';
import express from 'express';
import { db } from 'src/db.ts';
import { jobRequestSchema, mechanicSchema } from 'src/schema.ts';
import { eq } from 'drizzle-orm';
import { MechalinkError } from 'errors/mechalink-error.ts';

import { updateJobRequestStatus } from 'core/jobRequests.ts';
import { JobRequestStatuses } from 'constants/constants.ts';

export const jobRequestSchemaType = z.object({
  status: z.string(),
  jobRequestId: z.string(),
});

export const jobRequestUpdateController = async (
  req: express.Request,
  res: express.Response
) => {
  try {
    const { status, jobRequestId } = jobRequestSchemaType.parse(req.body);

    const [jobRequest = undefined] = await db
      .select()
      .from(jobRequestSchema)
      .where(eq(jobRequestSchema.id, Number(jobRequestId)));

    if (!jobRequest) throw new MechalinkError('Not found', 404);

    // here we wanna run a transaction or something that would update both job and jobRequest

    const updateJobRequest = await updateJobRequestStatus(
      Number(jobRequestId),
      status as any
    );

    console.log(updateJobRequest);

    res.status(201).json({ jobRequest });
  } catch (error) {
    console.log(error);
    throw new Error('Something went wrong');
  }
};
