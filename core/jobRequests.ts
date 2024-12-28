import { JobRequestStatuses, JobStatuses } from 'constants/constants.ts';
import { jobRequestSchemaType } from 'controller/jobRequests/jobRequest.create.ts';
import { eq } from 'drizzle-orm';
import { MechalinkRequired } from 'errors/400/required-error.ts';
import { MechalinkError } from 'errors/mechalink-error.ts';
import { db } from 'src/db.ts';
import { jobRequestSchema, mechanicSchema } from 'src/schema.ts';
import { calculateDistance } from 'utils/calculateDistance.ts';
import { Timer } from 'utils/timer.ts';
import { z } from 'zod';
import { getJob } from './jobs.ts';
import { getMechanicById } from './mechanics.ts';
import { jobs } from 'src/schema/job.ts';

export const createJobRequest = async (
  data: z.infer<typeof jobRequestSchemaType> & { userId: number }
) => {
  try {
    const result = await db
      .insert(jobRequestSchema)
      .values({
        jobId: data.jobId,
        userId: data.userId,
        created_by: String(data.userId),
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
  // in km: 1km is roughly a stadium's size for context 🏟️
  radius: number = 3
) {
  // TODO: Job request late,lng should be same as from the job
  const [jobRequest = undefined] = await db
    .select()
    .from(jobRequestSchema)
    .where(eq(jobRequestSchema.id, jobRequestId));

  if (!jobRequest) throw new Error('Job request not found');

  const mechanics = await db.select().from(mechanicSchema);

  const job = await getJob(jobRequest.jobId);

  // do not avail mechs without agreement signed

  return mechanics.filter((mechanic: any) => {
    const distance = calculateDistance(
      parseFloat(String(job?.latitude!)),
      parseFloat(String(job?.longitude!)),
      parseFloat(mechanic.lat),
      parseFloat(mechanic.lng)
    );

    return distance <= radius;
  });
}

export const updateJobRequestByMechanic = async (
  id: number,
  status: keyof typeof JobRequestStatuses,
  mechanicId: number
) => {
  try {
    // check for the request if its existent
    const [jobRequest = undefined] = await db
      .select()
      .from(jobRequestSchema)
      .where(eq(jobRequestSchema.id, id));

    if (!jobRequest) {
      throw new MechalinkRequired('Not found');
    }

    const job = await getJob(jobRequest.jobId);
    // ensure the mechanic is selected when update is made
    if (status === JobRequestStatuses.NOTIFYING) {
      const mech = await getMechanicById(mechanicId);

      console.log('MECH', mech);
      if (!mech?.hasAcceptedTerms) {
        throw new Error(
          'Mechanic must accept the Terms and Conditions to receive jobs.'
        );
      }

      const distance = calculateDistance(
        job?.latitude!,
        job?.longitude!,
        Number(mech?.lat!),
        Number(mech?.lng!)
      );

      const res = await db
        .update(jobRequestSchema)
        .set({
          mechanicId,
          status,
          distance: `${String(distance.toFixed(2))}km`,
        })
        .returning();

      return res;
    }

    // start the timer when the mechanic says hes on the way
    const timer = Timer.getInstance();

    // if Status is ON_THE_WAY, start the timer and also ensure the job cannot be reassigned at that point to avoid conflicts

    if (status === JobRequestStatuses.ON_THE_WAY) {
      timer.start(10);

      const update = await db
        .update(jobRequestSchema)
        .set({
          status: JobRequestStatuses.ON_THE_WAY,
        })
        .returning();

      await db
        .update(jobs)
        .set({
          status: JobStatuses.ON_THE_WAY,
        })
        .where(eq(jobs.id, Number(job?.id)));

      return update;

      // neon doesn't support transactions
      // const update = await db.transaction(async (tx) => {
      //   await tx
      //     .update(jobRequestSchema)
      //     .set({
      //       status: JobRequestStatuses.ON_THE_WAY,
      //     })
      //     .where(eq(jobRequestSchema.id, jobRequest.id))
      //     .returning();

      //   await tx
      //     .update(jobs)
      //     .set({
      //       status: JobStatuses.ON_THE_WAY,
      //     })
      //     .where(eq(jobs.id, Number(job?.id)))
      //     .returning();
      // });

      // console.log('UPDATE', update);

      // return update;
    }

    // if timer remains and status is ACCEPTED, update the job to inprogress...
    if (timer.getTimeLeft() && status === 'ACCEPTED') {
      // ensure this job cannot be assigned to other mechs

      timer.stop();
      const updateJobReq = await db
        .update(jobRequestSchema)
        .set({
          status: JobRequestStatuses.ACCEPTED,
        })
        .returning();

      await db
        .update(jobs)
        .set({
          status: JobStatuses.IN_PROGRESS,
        })
        .where(eq(jobs.id, Number(job?.id)));

      return updateJobReq;
    }

    if (timer.getTimeLeft() && status === JobRequestStatuses.DECLINED) {
      const res = await db
        .update(jobRequestSchema)
        .set({
          status: JobRequestStatuses.DECLINED,
        })
        .returning();

      await db
        .update(jobs)
        .set({
          status: JobStatuses.NOTIFYING,
        })
        .where(eq(jobs.id, Number(job?.id)));

      return res;
    }

    if (jobRequest.status === JobRequestStatuses.DECLINED) {
      await db.update(jobRequestSchema).set({
        status: JobRequestStatuses.NOTIFYING,
      });
    }

    // RESET TO NOTIFYING WHEN TIME ELAPSES
    await db.update(jobRequestSchema).set({
      status: JobRequestStatuses.NOTIFYING,
    });
    await db
      .update(jobs)
      .set({
        status: JobStatuses.NOTIFYING,
      })
      .where(eq(jobs.id, Number(job?.id)));
  } catch (error) {
    if (error instanceof Error) throw new MechalinkError(error?.message, 400);
  }
};

export const updateJobRequestByUser = async (
  id: number,
  status: keyof typeof JobRequestStatuses,
  mechanicId: number
) => {
  try {
    // check for the request if its existent
    const [jobRequest = undefined] = await db
      .select()
      .from(jobRequestSchema)
      .where(eq(jobRequestSchema.id, id));

    if (!jobRequest) {
      throw new MechalinkRequired('Not found');
    }

    // ensure the mechanic is selected
    if (status === JobRequestStatuses.NOTIFYING) {
      const mech = await getMechanicById(mechanicId);

      console.log('MECH', mech);
      if (!mech?.hasAcceptedTerms) {
        throw new Error(
          'Mechanic must accept the Terms and Conditions to receive jobs.'
        );
      }

      const job = await getJob(jobRequest.jobId);

      const distance = calculateDistance(
        job?.latitude!,
        job?.longitude!,
        Number(mech?.lat!),
        Number(mech?.lng!)
      );

      const res = await db
        .update(jobRequestSchema)
        .set({
          mechanicId,
          status,
          distance: `${String(distance.toFixed(2))}km`,
        })
        .returning();

      return res;
    }

    // start the timer when the mechanic says hes on the way
    const timer = Timer.getInstance();

    // if Status is ON_THE_WAY, start the timer and also ensure the job cannot be reassigned at that point to avoid conflicts

    if (status === 'ON_THE_WAY') {
      timer.start(10);
      console.log('STARTED....');
    }

    // if timer remains and status is ACCEPTED, update the job to inprogress
    if (timer.getTimeLeft() && status === JobRequestStatuses.ACCEPTED) {
      // perform the PUT here
      const updateJobReq = await db
        .update(jobRequestSchema)
        .set({
          status: JobRequestStatuses.ACCEPTED,
        })
        .where(eq(jobRequestSchema.id, jobRequest.id));

      // use trans if possible
      const updateJob = await db
        .update(jobs)
        .set({
          status: JobStatuses.IN_PROGRESS,
        })
        .returning();

      timer.stop();

      // await db.transaction(async ( ) => {});

      return { ...updateJobReq, job: updateJob };
    } else {
      await db
        .update(jobRequestSchema)
        .set({
          status: JobStatuses.IN_PROGRESS,
          mechanicId: undefined,
        })
        .where(eq(jobs.id, jobRequest.jobId));
    }

    // if the timer stops, return the jobReq status to NOTIFYING so that other mechs. can choose, also move the job to NOTIFYING

    // the client needs to confirm this too (🧠)
  } catch (error) {
    if (error instanceof Error) throw new MechalinkError(error?.message, 400);
  }
};
