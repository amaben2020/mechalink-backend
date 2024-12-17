import { z } from 'zod';
import express from 'express';
import { db } from 'src/db.ts';
import { mechanicSchema } from 'src/schema.ts';
import { eq } from 'drizzle-orm';
import { MechalinkError } from 'errors/mechalink-error.ts';

import {
  createJobRequest,
  getMechanicsWithinRadius,
} from 'core/jobRequests.ts';

export const jobRequestSchemaType = z.object({
  created_by: z.string(),
  jobId: z.number(),
  mechanicId: z.number(),
  distance: z.string(),
  duration: z.string(),
});

export const jobRequestCreateController = async (
  req: express.Request,
  res: express.Response
) => {
  try {
    const { created_by, mechanicId, distance, duration, jobId } =
      jobRequestSchemaType.parse(req.body);

    const [mechanic = undefined] = await db
      .select()
      .from(mechanicSchema)
      .where(eq(mechanicSchema.id, mechanicId));

    if (!mechanic) throw new MechalinkError('Not found', 404);

    //@ts-ignore
    const [jobRequest = undefined] = await createJobRequest({
      created_by,
      mechanicId,
      distance,
      duration,
      jobId,
    });
    const nearbyMechanics = await getMechanicsWithinRadius(jobRequest[0].id);
    console.log(jobRequest);
    console.log('nearbyMechanics', nearbyMechanics);
    res.status(201).json({ jobRequest });
  } catch (error) {
    console.log(error);
    throw new Error('Something went wrong');
  }
};
