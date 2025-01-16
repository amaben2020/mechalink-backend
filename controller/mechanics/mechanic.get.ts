import { eq } from 'drizzle-orm';
import express from 'express';
import { db } from 'src/db.ts';
import { mechanicSchema, usersTable } from 'src/schema.ts';

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

export const mechanicsByUserIdGetController = async (
  req: express.Request,
  res: express.Response
) => {
  try {
    const { userId } = req.params;
    const mechanic = await db
      .select()
      .from(mechanicSchema)
      .where(eq(mechanicSchema.userId, Number(userId)))
      .leftJoin(usersTable, eq(usersTable.id, mechanicSchema.id));

    res.json(mechanic);
  } catch (error) {
    console.log(error);
  }
};
