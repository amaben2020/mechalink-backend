import { z } from 'zod';
import express from 'express';
import { db } from 'src/db.ts';
import { jobRequestSchema, mechanicSchema } from 'src/schema.ts';
import { eq } from 'drizzle-orm';
import { MechalinkError } from 'errors/mechalink-error.ts';

import {
  updateJobRequestByMechanic,
  updateJobRequestByUser,
} from 'core/jobRequests.ts';
import { JobRequestStatuses } from 'constants/constants.ts';
import { getMechanicById } from 'core/mechanics.ts';

export const jobRequestSchemaType = z.object({
  status: z.string(),
  jobRequestId: z.string(),
  mechanicId: z.number(),
});

export const jobRequestUpdateController = async (
  req: express.Request,
  res: express.Response
) => {
  try {
    const { status, jobRequestId, mechanicId } = jobRequestSchemaType.parse(
      req.body
    );

    // todo: move to correct file
    const [mechanic = undefined] = await db
      .select()
      .from(mechanicSchema)
      .where(eq(mechanicSchema.id, mechanicId));

    if (!mechanic) throw new MechalinkError('Not found', 404);

    // todo: move to correct file
    const [jobRequest = undefined] = await db
      .select()
      .from(jobRequestSchema)
      .where(eq(jobRequestSchema.id, Number(jobRequestId)));

    if (!jobRequest) throw new MechalinkError('Not found', 404);

    // here we wanna run a transaction or something that would update both job and jobRequest

    const updateJobRequest = await updateJobRequestByMechanic(
      Number(jobRequestId),
      status as any,
      mechanicId
    );

    console.log(updateJobRequest);

    res.status(201).json({ jobRequest: updateJobRequest });
  } catch (error) {
    console.log(error);
    throw new Error('Something went wrong');
  }
};

// refactor and move to core
export const jobRequestSelectMechanicController = async (
  req: express.Request,
  res: express.Response
) => {
  try {
    const { status, jobRequestId, mechanicId } = jobRequestSchemaType.parse(
      req.body
    );

    const mechanic = await getMechanicById(mechanicId);

    if (!mechanic) throw new MechalinkError('Not found', 404);

    const [jobRequest = undefined] = await db
      .select()
      .from(jobRequestSchema)
      .where(eq(jobRequestSchema.id, Number(jobRequestId)));

    if (!jobRequest) throw new MechalinkError('Not found', 404);

    const updateJobRequest = await updateJobRequestByUser(
      Number(jobRequestId),
      status as any,
      mechanicId
    );

    res.status(201).json({ jobRequest: updateJobRequest });
  } catch (error) {
    console.log(error);
    throw new Error('Something went wrong');
  }
};
