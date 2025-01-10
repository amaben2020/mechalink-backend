import { UserRoles } from 'constants/constants.ts';
import { eq } from 'drizzle-orm';
import { MechalinkError } from 'errors/mechalink-error.ts';
import { db } from 'src/db.ts';
import { usersTable } from 'src/schema.ts';

export const getUsersByRole = async (role: keyof typeof UserRoles) => {
  try {
    const user = await db
      .select()
      .from(usersTable)
      .where(eq(usersTable.role, String(role)));

    return user;
  } catch (error) {
    throw new MechalinkError('Something went wrong', 500);
  }
};

export const getUserByFId = async (id: string) => {
  try {
    const user = await db
      .select()
      .from(usersTable)
      .where(eq(usersTable.firebaseId, String(id)));

    return user;
  } catch (error) {
    throw new MechalinkError('Something went wrong', 500);
  }
};

export const updateUserLocation = async (
  userId: number,
  location: {
    longitude: number;
    latitude: number;
  }
) => {
  try {
    const user = await db
      .update(usersTable)
      .set({
        latitude: location.latitude,
        longitude: location.longitude,
      })
      .where(eq(usersTable.id, userId))
      .returning();

    return user;
  } catch (error) {
    throw new MechalinkError('Something went wrong', 500);
  }
};
