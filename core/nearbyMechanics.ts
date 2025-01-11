import { eq } from 'drizzle-orm';
import { db } from 'src/db.js';
import { jobRequestSchema, mechanicSchema, usersTable } from 'src/schema.ts';
import { getJob } from './jobs.ts';
import { calculateDistance } from 'utils/calculateDistance.ts';

// TODO: Extract to nearby-mechanics endpoint
export async function getMechanicsWithinRadius(
  jobRequestId: number,
  // in km: 1km is roughly a stadium's size for context 🏟️
  radius: number = 2000
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

export async function getNearbyMechanics(
  radius: number = 2000,
  userId: number
) {
  const nearbyMechanics = await db
    .select()
    .from(mechanicSchema)
    .leftJoin(usersTable, eq(mechanicSchema.userId, usersTable.id));

  const mechanics = nearbyMechanics.map((elem) => ({
    ...elem.mechanics,
    ...elem.users,
  }));

  const [user = undefined] = await db
    .select()
    .from(usersTable)
    .where(eq(usersTable.id, userId));

  console.log('mechanics', mechanics);
  if (!mechanics) throw new Error('Nearby mechanics not found');

  // TODO: do not avail mechs without agreement signed

  return mechanics.filter((mechanic: any) => {
    const distance = calculateDistance(
      parseFloat(String(user?.latitude!)),
      parseFloat(String(user?.longitude!)),
      parseFloat(mechanic.lat),
      parseFloat(mechanic.lng)
    );

    return distance <= radius;
  });
}
