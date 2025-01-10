import { z } from 'zod';
import express from 'express';
import { createJobRequest } from 'core/jobRequests.ts';
import { firebaseAdmin } from 'config/firebase.ts';
import { getUserByFId } from 'core/users.ts';
import { getMechanicsWithinRadius } from 'core/nearbyMechanics.ts';

export const jobRequestSchemaType = z.object({
  created_by: z.string(),
  jobId: z.number(),
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

    const { created_by, distance, duration, jobId } =
      jobRequestSchemaType.parse(req.body);

    //@ts-ignore
    const jobRequest = await createJobRequest({
      created_by,
      distance,
      duration,
      jobId,
      userId: Number(getUser?.id),
    });

    const nearbyMechanics = await getMechanicsWithinRadius(jobRequest![0].id);

    //  calculate distance of jobRequest
    console.log(jobRequest);
    console.log('nearbyMechanics', nearbyMechanics);
    res.status(201).json({ jobRequest });
  } catch (error) {
    console.log(error);
    throw new Error('Something went wrong');
  }
};
