import { jobRequestSchemaType } from 'controller/jobRequests/jobRequest.create.ts';
import { db } from 'src/db.ts';
import { jobRequestSchema } from 'src/schema.ts';
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
