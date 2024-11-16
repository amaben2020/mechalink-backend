import { signupSchema } from 'controller/auth/auth.register.ts';
import { eq } from 'drizzle-orm';
import { db } from 'src/db.js';
import { usersTable } from 'src/schema.ts';
import { z } from 'zod';

export const isUserExist = async (
  email: string
): Promise<boolean | undefined> => {
  try {
    const userHasRegistered = await db
      .select()
      .from(usersTable)
      .where(eq(usersTable.email, email))
      .execute();

    return !!userHasRegistered.length!;
  } catch (error) {
    console.log(error);
  }
};

export const createUser = async ({
  email,
  addressOne,
  role,
  lastName,
  city,
  country,
  addressTwo,
  zip,
  phone,
  username,
  password,
  firstName,
  firebaseId,
}: z.infer<typeof signupSchema> & { firebaseId: string }) => {
  try {
    const [user = undefined] = await db
      .insert(usersTable)
      .values({
        email,
        password,
        username,
        firstName,
        addressOne,
        role,
        lastName,
        city,
        country,
        addressTwo,
        zip,
        phone,
        firebaseId,
      })
      .returning();

    return user;
  } catch (error) {
    console.log(error);
  }
};
