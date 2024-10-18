import { z } from 'zod';
import { signupUser } from '../../services/auth/index.js';
import { db } from '../../src/db.js';
import { usersTable } from '../../src/schema.js';
import bcrypt from 'bcrypt';
import { eq } from 'drizzle-orm';

const signupSchema = z.object({
  username: z.string().min(2),
  password: z.string().min(4),
  email: z.string().email(),
  addressOne: z.string(),
});

export const signup = async (req, res) => {
  try {
    const { email, password, username, addressOne } = signupSchema.parse(
      req.body
    );
    const userHasRegistered = await db
      .select()
      .from(usersTable)
      .where(eq(usersTable.email, email))
      .execute();

    // create several errors like tup
    if (userHasRegistered.length > 0) {
      res.status(401).send(`User with ${email} already exists`);
      return;
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    signupUser(username, password, email);

    const user = await db
      .insert(usersTable)
      .values({
        email,
        password: hashedPassword,
        firstName: username,
        addressOne,
        role: 'client',
      })
      .returning();

    res.json({ user });
  } catch (error) {
    console.log(error);
  }
};
