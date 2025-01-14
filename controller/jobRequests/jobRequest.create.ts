import { z } from 'zod';
import express from 'express';
import { createJobRequest } from 'core/jobRequests.ts';
import { firebaseAdmin } from 'config/firebase.ts';
import { getUserByFId } from 'core/users.ts';
import { getMechanicsWithinRadius } from 'core/nearbyMechanics.ts';

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
    const user = await firebaseAdmin
      .auth()
      .verifyIdToken(String(req.headers.authorization!.split(' ')[1]));

    const [getUser = undefined] = await getUserByFId(user?.uid);

    const { created_by, jobId, mechanicId, distance, duration } =
      jobRequestSchemaType.parse(req.body);

    const jobRequest = await createJobRequest({
      created_by,
      jobId,
      userId: Number(getUser?.id),
      mechanicId: mechanicId,
      distance,
      duration,
    });

    console.log('jobRequest', jobRequest);

    // const nearbyMechanics = await getMechanicsWithinRadius(jobRequest![0].id);

    res.status(201).json({ jobRequest });
  } catch (error) {
    console.log(error);
    throw new Error('Something went wrong');
  }
};
