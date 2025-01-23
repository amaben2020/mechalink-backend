import { mechanicSchemaType } from 'controller/mechanics/mechanic.create.ts';
import { eq } from 'drizzle-orm';
import { MechalinkError } from 'errors/mechalink-error.ts';
import { db } from 'src/db.ts';
import { jobRequestSchema, mechanicSchema } from 'src/schema.ts';
import { jobs } from 'src/schema/job.ts';
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

    return mechanic!;
  } catch (error) {
    console.log(error);
    if (error instanceof Error) throw new MechalinkError(error?.message, 400);
  }
};
export const getMechanicById = async (mechanicId: number) => {
  try {
    const [mechanic = undefined] = await db
      .select()
      .from(mechanicSchema)
      .where(eq(mechanicSchema.id, mechanicId))
      .innerJoin(jobs, eq(jobs.mechanicId, mechanicId))
      .innerJoin(jobRequestSchema, eq(jobRequestSchema.mechanicId, mechanicId));

    return {
      ...mechanic?.mechanics,
      jobId: mechanic?.jobs.id,
      jobRequestId: mechanic?.jobRequests.id,
    };
  } catch (error) {
    console.log(error);
    throw new MechalinkError('Mechanic not found', 404);
  }
};

export const acceptTerms = async (mechanicId: number) => {
  try {
    const [mechanic = undefined] = await db
      .select()
      .from(mechanicSchema)
      .where(eq(mechanicSchema.id, mechanicId));

    if (!mechanic) throw new MechalinkError('Not found', 404);

    const response = await db
      .update(mechanicSchema)
      .set({
        hasAcceptedTerms: true,
        hasAcceptedTermsAt: new Date(),
      })
      .where(eq(mechanicSchema.id, mechanicId))
      .returning();

    return response;
  } catch (error) {
    console.log(error);

    throw new MechalinkError('Mechanic not found', 404);
  }
};
