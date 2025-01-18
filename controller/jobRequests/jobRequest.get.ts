import { getMechanicsWithinRadius } from 'core/nearbyMechanics.ts';
import { desc, eq } from 'drizzle-orm';
import express from 'express';
import { db } from 'src/db.ts';
import { jobRequestSchema, mechanicSchema, usersTable } from 'src/schema.ts';

export const jobRequestGetController = async (
  _: express.Request,
  res: express.Response
) => {
  try {
    const jobRequest = await db.select().from(jobRequestSchema);

    res.json(jobRequest);
  } catch (error) {
    console.log(error);
  }
};

export const jobRequestForMechanicGetController = async (
  req: express.Request,
  res: express.Response
) => {
  try {
    const { mechanicId } = req.params;

    const jobRequest = await db
      .select()
      .from(jobRequestSchema)
      .where(eq(jobRequestSchema.mechanicId, Number(mechanicId)))
      .orderBy(desc(jobRequestSchema.created_at))
      .innerJoin(
        mechanicSchema,
        eq(mechanicSchema.id, jobRequestSchema.mechanicId)
      );

    console.log('jobRequest', jobRequest);

    if (!jobRequest.length) {
      res.json({ message: 'No Job request found for this mechanic' });
      return;
    }

    const [jobRequestLocation = undefined] = await db
      .select()
      .from(jobRequestSchema)
      .where(
        eq(jobRequestSchema.userId, Number(jobRequest[0].jobRequests.userId))
      )
      .innerJoin(usersTable, eq(usersTable.id, jobRequestSchema.userId));

    console.log('jobRequestLocation', jobRequestLocation);

    const formatJobRequest = jobRequest
      .map((req) => ({
        id: req.jobRequests.id,
        status: req.jobRequests.status,
        userId: req.mechanics.id,
        // location should be location of the job (user on the job request)
        // TODO: ALWAYS ENSURE JOB AND JOB REQUEST ARE THE USERS
        location: {
          latitude: jobRequestLocation?.users.latitude,
          longitude: jobRequestLocation?.users.longitude,
        },
      }))
      .shift();

    console.log('formatJobRequest', formatJobRequest);

    return res.status(200).json(formatJobRequest);
  } catch (error) {
    console.log(error);
  }
};

// the job request location is always same as the users
export const jobRequestForUserGetController = async (
  req: express.Request,
  res: express.Response
) => {
  try {
    const { userId } = req.params;

    console.log(userId);

    const jobRequest = await db
      .select()
      .from(jobRequestSchema)
      .where(eq(jobRequestSchema.userId, +userId))
      .orderBy(desc(jobRequestSchema.created_at))
      .innerJoin(usersTable, eq(usersTable.id, jobRequestSchema.userId));

    console.log('jobRequest', jobRequest);

    const formatJobRequest = jobRequest
      .map((req) => ({
        jobRequestId: req.jobRequests.id,
        status: req.jobRequests.status,
        userId: req.users.id,
        address: req.users.addressOne,
        location: {
          latitude: req.users.latitude,
          longitude: req.users.longitude,
        },
        userPhone: req.users.phone,
        country: req.users.country,
        mechanicId: req.jobRequests.mechanicId,
      }))
      .shift();

    if (!formatJobRequest) {
      res.json({ message: 'No Job request found for this user' });
      return;
    }

    return res.status(200).json(formatJobRequest);
  } catch (error) {
    console.log(error);
  }
};
