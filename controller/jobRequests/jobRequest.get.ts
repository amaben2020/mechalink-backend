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
    // this would be removed and PUT / assigned manually not upon creation

    const { mechanicId } = req.params;

    const jobRequest = await db
      .select()
      .from(jobRequestSchema)
      .where(eq(jobRequestSchema.mechanicId, Number(mechanicId)))
      .orderBy(desc(jobRequestSchema.created_at));

    const [nearbyMechanics = undefined] = (
      await getMechanicsWithinRadius(jobRequest[0].id)
    ).filter((elem) => elem.id === Number(mechanicId));

    if (!jobRequest.length) {
      res.json({ message: 'No Job request found for this mechanic' });
      return;
    }

    return res.status(200).json(nearbyMechanics);
  } catch (error) {
    console.log(error);
  }
};
