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

// once a user creates a job request, he shouldn't do anything until declined
export const jobRequestUpdateController = async (
  req: express.Request,
  res: express.Response
) => {
  try {
    const { status, jobRequestId, mechanicId } = jobRequestSchemaType.parse(
      req.body
    );

    const mechanic = await getMechanicById(mechanicId);

    if (!mechanic) throw new MechalinkError('Not found', 404);

    // todo: move to correct file
    const [jobRequest = undefined] = await db
      .select()
      .from(jobRequestSchema)
      .where(eq(jobRequestSchema.id, Number(jobRequestId)));

    if (!mechanic?.id) {
      res.status(404).json({
        message: 'Mechanic not found',
      });
    }

    if (mechanic?.id && !mechanic?.hasAcceptedTerms) {
      // throw new MechalinkError(
      //   'Mechanic must accept the Terms and Conditions to receive jobs.',
      //   403
      // );
      res.status(403).json({
        message:
          'Mechanic must accept the Terms and Conditions to receive jobs.',
      });
    }

    if (!jobRequest) throw new MechalinkError('Not found', 404);

    // here we wanna run a transaction or something that would update both job and jobRequest

    const updateJobRequest = await updateJobRequestByMechanic(
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
