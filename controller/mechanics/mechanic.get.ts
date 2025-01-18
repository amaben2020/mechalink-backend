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
    const [mechanic = undefined] = await db
      .select()
      .from(mechanicSchema)
      .where(eq(mechanicSchema.userId, Number(userId)))
      .leftJoin(usersTable, eq(usersTable.id, mechanicSchema.userId));

    console.log('mechanic', mechanic);

    if (mechanic) {
      res.status(200).json({
        arrivalRate: mechanic.mechanics.arrivalRate,
        fullName: mechanic.users?.firstName + ' ' + mechanic.users?.lastName,
        email: mechanic.users?.email,
        mechanicId: mechanic.mechanics.id,
        country: mechanic.users?.country,
        city: mechanic.users?.city,
        userId: mechanic.users?.id,
      });
    } else {
      res.status(200).json({ message: 'No mechanic found' });
    }
  } catch (error) {
    console.log(error);
  }
};
