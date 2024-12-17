import express from 'express';
import { db } from 'src/db.ts';
import { mechanicSchema } from 'src/schema.ts';

export const mechanicsGetController = async (
  _: express.Request,
  res: express.Response
) => {
  try {
    const mechanic = await db.select().from(mechanicSchema);

    res.json(mechanic);
  } catch (error) {
    console.log(error);
  }
};
