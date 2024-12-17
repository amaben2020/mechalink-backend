import { mechanicSchemaType } from 'controller/mechanics/mechanic.create.ts';
import { db } from 'src/db.ts';
import { mechanics } from 'src/schema/mechanic.ts';
import { z } from 'zod';

export const createMechanic = ({
  arrivalRate,
  type,
  created_by = 'admin',
  status,
  userId,
}: z.infer<typeof mechanicSchemaType>) => {
  try {
    const mechanic = db
      .insert(mechanics)
      .values({
        arrivalRate,
        jobCount: 0,
        type,
        created_by,
        status,
        userId,
      })
      .returning();

    return mechanic;
  } catch (error) {
    console.log(error);
  }
};
