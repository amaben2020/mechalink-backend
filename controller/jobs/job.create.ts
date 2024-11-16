import { z } from 'zod';
import { fromError } from 'zod-validation-error';
import express from 'express';
import { JobStatuses, UserRoles } from 'constants/constants.ts';
import { createJob } from 'core/jobs.js';
import { db } from 'src/db.ts';
import { usersTable } from 'src/schema.ts';
import { eq } from 'drizzle-orm';
import { MechalinkError } from 'errors/mechalink-error.ts';

export const jobsSchema = z.object({
  description: z.string(),
  rate: z.number(),
  userId: z.number(),
  longitude: z.number(),
  latitude: z.number(),
  locationDetails: z.string(),
  createdBy: z.string().optional(),
  isPendingReview: z.boolean(),
  mechanicId: z.number().optional(),
  status: z.literal(JobStatuses.NOTIFYING),
});

export const create = async (req: express.Request, res: express.Response) => {
  try {
    const {
      description,
      rate,
      latitude,
      locationDetails,
      longitude,
      isPendingReview,
      status,
      userId,
    } = jobsSchema.parse(req.body);

    // destructuring user from array
    const [user = undefined] = await db
      .select()
      .from(usersTable)
      .where(eq(usersTable.id, userId));

    if (!user) throw new MechalinkError('Not found', 404);
    if (user.role?.includes(UserRoles.mechanic))
      throw new MechalinkError('Unauthorized', 403);

    const job = await createJob({
      description,
      rate,
      latitude,
      locationDetails,
      longitude,
      isPendingReview,
      status,
      userId,
      createdBy: String(user.role) ?? 'admin',
    });

    res.status(201).json({ message: `Job id:${job?.id} created successfully` });
  } catch (error) {
    const validationError = fromError(error);
    res.status(500).send(validationError.toString());
  }
};
