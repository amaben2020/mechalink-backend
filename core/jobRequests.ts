import { jobRequestSchemaType } from 'controller/jobRequests/jobRequest.create.ts';
import { eq } from 'drizzle-orm';
import { db } from 'src/db.ts';
import { jobRequestSchema, mechanicSchema } from 'src/schema.ts';
import { calculateDistance } from 'utils/calculateDistance.ts';
import { z } from 'zod';

export const createJobRequest = async (
  data: z.infer<typeof jobRequestSchemaType>
) => {
  try {
    const result = await db
      .insert(jobRequestSchema)
      .values({
        jobId: data.jobId,
        mechanicId: data.mechanicId,
        // later, the created by would be the user not admin, not super important for now
        created_by: 'admin',
        distance: data.distance,
        duration: data.duration,
      })
      .returning();

    return result;
  } catch (error) {
    console.log(error);
  }
};

// TODO: Extract to nearby-mechanics endpoint
export async function getMechanicsWithinRadius(
  jobRequestId: number,
  // in km: 1km is roughly a stadium's size for context
  radius: number = 3
) {
  // TODO: Job request late,lng should be same as from the job
  const [jobRequest = undefined] = await db
    .select()
    .from(jobRequestSchema)
    .where(eq(jobRequestSchema.id, jobRequestId));

  if (!jobRequest) throw new Error('Job request not found');

  const mechanics = await db.select().from(mechanicSchema);

  return mechanics.filter((mechanic: any) => {
    const distance = calculateDistance(
      parseFloat(jobRequest?.lat!),
      parseFloat(jobRequest?.lng!),
      parseFloat(mechanic.lat),
      parseFloat(mechanic.lng)
    );

    return distance <= radius;
  });
}
