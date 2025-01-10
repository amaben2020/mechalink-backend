import { eq } from 'drizzle-orm';
import { db } from 'src/db.js';
import { jobRequestSchema, mechanicSchema, usersTable } from 'src/schema.ts';
import { getJob } from './jobs.ts';
import { calculateDistance } from 'utils/calculateDistance.ts';

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

export async function getNearbyMechanics(radius: number = 3) {
  const nearbyMechanics = await db.select().from(mechanicSchema);

  if (!nearbyMechanics) throw new Error('Nearby mechanics not found');

  // TODO: do not avail mechs without agreement signed

  return nearbyMechanics.filter((mechanic: any) => {
    const distance = calculateDistance(
      parseFloat(String(usersTable?.latitude!)),
      parseFloat(String(usersTable?.longitude!)),
      parseFloat(mechanic.lat),
      parseFloat(mechanic.lng)
    );

    return distance <= radius;
  });
}
