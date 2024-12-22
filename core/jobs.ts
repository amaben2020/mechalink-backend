import { jobsSchema } from 'controller/jobs/job.create.js';
import { eq } from 'drizzle-orm';
import { MechalinkError } from 'errors/mechalink-error.ts';
import { db } from 'src/db.js';
import { jobs } from 'src/schema/job.ts';
import { jobTimer } from 'src/schema/jobTimer.ts';
import { z } from 'zod';

export const createJob = async ({
  description,
  rate,
  latitude,
  locationDetails,
  longitude,
  isPendingReview,
  status,
  userId,
  createdBy = 'admin',
}: z.infer<typeof jobsSchema>) => {
  try {
    const [job = undefined] = await db
      .insert(jobs)
      .values({
        description,
        rate,
        latitude,
        locationDetails,
        longitude,
        isPendingReview,
        status,
        userId,
        created_by: createdBy,
      })
      .returning();

    return job;
  } catch (error) {
    if (error instanceof Error) throw new MechalinkError('Invalid fields', 500);
  }
};

export const getJobs = async () => {
  try {
    const jobsData = await db.select().from(jobs);

    return jobsData;
  } catch (error) {
    if (error instanceof Error) throw new MechalinkError('Invalid fields', 500);
  }
};

export const getJob = async (id: number) => {
  try {
    const [job = undefined] = await db
      .select()
      .from(jobs)
      .where(eq(jobs.id, id));

    return job;
  } catch (error) {
    if (error instanceof Error) throw new MechalinkError('Invalid fields', 500);
  }
};

export class JobTimerService {
  async startTimer({
    jobId,
    durationInMinutes,
  }: {
    jobId: number;
    durationInMinutes: number;
  }) {
    const endTime = new Date(Date.now() + durationInMinutes * 60 * 1000); // Calculate end time
    const res = await db
      .insert(jobTimer)
      .values({
        jobId,
        durationInMinutes: durationInMinutes,
        endTime,
        status: 'RUNNING',
      })
      .returning();

    return res;
  }

  async stopTimer(jobId: number) {
    await db.update({
      where: { jobId },
      data: { status: 'STOPPED' },
    });
  }

  async getTimeLeft(jobId: number) {
    const timer = await db.timer.findUnique({ where: { jobId } });
    if (!timer) throw new Error('Timer not found');
    const now = new Date();
    const timeLeft = Math.max(0, timer.endTime.getTime() - now.getTime());
    return {
      minutes: Math.floor(timeLeft / 60000),
      seconds: Math.floor((timeLeft % 60000) / 1000),
    };
  }

  async pauseTimer(jobId: number) {
    const timer = await db.timer.findUnique({ where: { jobId } });
    if (!timer || timer.status !== 'running') {
      throw new Error('Timer is not running or not found');
    }

    const now = new Date();
    const remainingTime = Math.max(0, timer.endTime.getTime() - now.getTime()); // Calculate remaining time in ms
    const remainingDurationInSeconds = Math.floor(remainingTime / 1000);

    await db.timer.update({
      where: { jobId },
      data: {
        status: 'PAUSED',
        remainingDuration: remainingDurationInSeconds,
      },
    });

    return {
      message: `Timer paused with ${remainingDurationInSeconds} seconds remaining`,
    };
  }
}
