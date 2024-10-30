import { eq } from 'drizzle-orm';
import { db } from 'src/db.js';
import { usersTable } from 'src/schema.ts';

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
  lastLogin,
  city,
  country,
  addressTwo,
  zip,
  phone,
  username,
  password,
}: any) => {
  try {
    const user = await db
      .insert(usersTable)
      .values({
        email,
        password,
        firstName: username,
        addressOne,
        role,
        lastName,
        lastLogin,
        city,
        country,
        addressTwo,
        zip,
        phone,
      })
      .returning();

    return user;
  } catch (error) {
    console.log(error);
  }
};
