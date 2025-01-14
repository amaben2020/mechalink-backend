import { z } from 'zod';
import { Request, Response } from 'express';
import { createJobRequest } from 'core/jobRequests.ts';
import { firebaseAdmin } from 'config/firebase.ts';
import { getUserByFId } from 'core/users.ts';
import { getMechanicById } from 'core/mechanics.ts';

export const jobRequestSchemaType = z.object({
  created_by: z.string(),
  jobId: z.number(),
  mechanicId: z.number(),
  distance: z.string(),
  duration: z.string(),
});

export const jobRequestCreateController = async (
  req: Request,
  res: Response
) => {
  try {
    const user = await firebaseAdmin
      .auth()
      .verifyIdToken(String(req.headers.authorization!.split(' ')[1]));

    const [getUser = undefined] = await getUserByFId(user?.uid);

    const { created_by, jobId, mechanicId, distance, duration } =
      jobRequestSchemaType.parse(req.body);

    const mechanic = await getMechanicById(mechanicId);

    if (!mechanic) {
      throw new Error(`Mechanic with id ${mechanicId} does not exist`);
    }

    const jobRequest = await createJobRequest({
      created_by,
      jobId,
      userId: Number(getUser?.id),
      mechanicId: mechanicId,
      distance,
      duration,
    });

    res.status(201).json({ jobRequest });
  } catch (error) {
    console.log(error);
    throw new Error('Something went terribly wrong');
  }
};
