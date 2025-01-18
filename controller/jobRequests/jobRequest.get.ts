import { getMechanicsWithinRadius } from 'core/nearbyMechanics.ts';
import { desc, eq } from 'drizzle-orm';
import express from 'express';
import { db } from 'src/db.ts';
import { jobRequestSchema, usersTable } from 'src/schema.ts';

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
    const { userId } = req.params;

    const jobRequest = await db
      .select()
      .from(jobRequestSchema)
      .where(eq(jobRequestSchema.userId, Number(userId)))
      .orderBy(desc(jobRequestSchema.created_at))
      .innerJoin(usersTable, eq(usersTable.id, jobRequestSchema.userId));

    const formatJobRequest = jobRequest.map((req) => ({
      id: req.jobRequests.id,
      status: req.jobRequests.status,
      userId: req.users.id,
      address: req.users.addressOne,
      location: {
        latitude: req.users.latitude,
        longitude: req.users.longitude,
      },
      userPhone: req.users.phone,
      country: req.users.country,
    }));

    if (!jobRequest.length) {
      res.json({ message: 'No Job request found for this mechanic' });
      return;
    }

    return res.status(200).json(formatJobRequest.shift());
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
