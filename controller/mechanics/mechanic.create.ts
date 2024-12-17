import { z } from 'zod';
import express from 'express';
import { MechanicStatuses, UserRoles } from 'constants/constants.ts';
import { db } from 'src/db.ts';
import { usersTable } from 'src/schema.ts';
import { eq } from 'drizzle-orm';
import { MechalinkError } from 'errors/mechalink-error.ts';
import { AccountType } from 'src/schema/mechanic.ts';
import { createMechanic } from 'core/mechanics.ts';

export const mechanicSchemaType = z.object({
  arrivalRate: z.number().optional(),
  status: z.literal(MechanicStatuses.UNAPPROVED),
  type: z.literal(AccountType.PROVIDER),
  created_by: z.string(),
  userId: z.number(),
});

export const mechanicCreateController = async (
  req: express.Request,
  res: express.Response
) => {
  try {
    const { arrivalRate, type, created_by, status, userId } =
      mechanicSchemaType.parse(req.body);

    const [user = undefined] = await db
      .select()
      .from(usersTable)
      .where(eq(usersTable.id, userId));

    if (!user) throw new MechalinkError('Not found', 404);
    if (!user.role?.includes(UserRoles.mechanic))
      throw new MechalinkError('Unauthorized', 403);

    //@ts-ignore
    const [mechanic = undefined] = await createMechanic({
      arrivalRate,
      type,
      created_by,
      status,
      userId,
    });
    console.log(mechanic);
    res.status(201).json({ ...mechanic });
  } catch (error) {
    console.log(error);
    throw new Error('Something went wrong');
  }
};
