import express from 'express';
import { z } from 'zod';
import { MechanicStatuses, UserRoles } from 'constants/constants.ts';
import { db } from 'src/db.ts';
import { usersTable } from 'src/schema.ts';
import { eq } from 'drizzle-orm';
import { MechalinkError } from 'errors/mechalink-error.ts';
import { createMechanic } from 'core/mechanics.ts';
import { sendSuccess, sendError } from 'utils/responseHandler.ts';
import { AccountType } from 'src/schema/mechanic.ts';

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

    const [user] = await db
      .select()
      .from(usersTable)
      .where(eq(usersTable.id, userId));

    if (!user) throw new MechalinkError('User not found', 404);
    if (!user.role?.includes(UserRoles.mechanic))
      throw new MechalinkError('Unauthorized access', 401);

    //@ts-ignore
    const [mechanic] = await createMechanic({
      arrivalRate,
      type,
      created_by,
      status,
      userId,
    });

    sendSuccess(res, mechanic, 201);
  } catch (error: any) {
    if (error instanceof z.ZodError) {
      return sendError(
        res,
        new MechalinkError('Validation failed', 422, error.errors)
      );
    }

    console.error(error);
    sendError(res, error);
  }
};
